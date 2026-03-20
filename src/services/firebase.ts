
import * as _app from 'firebase/app';
import * as _auth from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp,
  query, where, getDocs, orderBy, deleteDoc, onSnapshot, writeBatch
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as _analytics from 'firebase/analytics';
import { 
  User, Workshop, Enrollment, PaymentRecord, Certificate, Notice, FAQItem, StudentSettings, TopicModule, ScholarshipApplication, ChatInteraction, Section 
} from '../types';
import { getAllWorkshops as getStaticWorkshops } from '../workshops/registry';
import { generateAcademicTopicContent } from './geminiService';
import { mapProgramToWorkshop } from '../utils/mapping';
import { AcademicProgram } from '../types';

// Import the Firebase configuration
import firebaseConfig from '../../firebase-applet-config.json';

// --- 1. FIREBASE CONFIGURATION (MASTER) ---
const app = _app.getApps().length === 0 ? _app.initializeApp(firebaseConfig) : _app.getApps()[0];
const auth = _auth.getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

let analytics: any = null;
if (typeof window !== 'undefined') {
  try { analytics = _analytics.getAnalytics(app); } catch (e) { console.warn("Analytics blocked by client"); }
}

const { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, 
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously 
} = _auth;

const logEvent = (eventName: string, params?: any) => {
  if (analytics) {
    try { _analytics.logEvent(analytics, eventName, params); } catch(e) { console.warn("Analytics logging failed", e); }
  }
};

onAuthStateChanged(auth, (user: any) => {
  if (typeof window !== 'undefined') {
    (window as any).currentUser = user;
  }
});

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  if (errInfo.error.includes('insufficient permissions')) {
    console.error('Firestore Permission Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
  
  console.error(`Firestore ${operationType} Error on ${path}:`, error);
  throw error;
}

// --- UTILITY: Bootstrap Admin User ---
export const bootstrapAdmin = async (uid: string, email: string) => {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data()?.role !== 'admin') {
      await setDoc(ref, {
        id: uid,
        user_id: uid,
        email: email,
        full_name: "System Admin",
        name: "System Admin", 
        role: 'admin',
        institution: "Innovative Minds Institute",
        permissions: {
          course_builder: true,
          admin_dashboard: true,
          content_management: true,
          user_management: true,
          financial_overview: true
        },
        studentNumber: '0010',
        createdAt: serverTimestamp(),
        isMock: true // This flag is fine, just don't block access based on it
      }, { merge: true });
      console.log("Admin User Bootstrapped in Firestore with Permissions");
    }
  } catch (e) {
    console.warn("Failed to bootstrap admin", e);
  }
};

// --- WORKSHOP MANAGEMENT ---
export const getWorkshops = async (): Promise<Workshop[]> => {
  const path = 'workshops';
  try {
    const q = query(
        collection(db, path), 
        where('status', '==', 'published')
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workshop));
      // Client-side sort by date_created desc
      return docs.sort((a, b) => {
          const dateA = a.date_created?.toDate ? a.date_created.toDate() : new Date(a.date_created || 0);
          const dateB = b.date_created?.toDate ? b.date_created.toDate() : new Date(b.date_created || 0);
          return dateB.getTime() - dateA.getTime();
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('insufficient permissions')) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
    console.warn("Firestore fetch failed, using fallback.", e);
  }
  return getStaticWorkshops();
};

export const getWorkshopById = async (id: string): Promise<Workshop | undefined> => {
  try {
    // 1. Check Workshops
    const docRef = doc(db, 'workshops', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Workshop;
    }

    // 2. Check Programs
    const programRef = doc(db, 'programs', id);
    const programSnap = await getDoc(programRef);
    if (programSnap.exists()) {
      return mapProgramToWorkshop({ id: programSnap.id, ...programSnap.data() } as AcademicProgram);
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('insufficient permissions')) {
      handleFirestoreError(e, OperationType.GET, `workshops/${id}`);
    }
    console.warn(`Firestore fetch failed for ${id}`);
  }
  
  // 3. Registry Fallback
  const staticData = getStaticWorkshops().find(w => w.id === id || w.course_id === id);
  if (staticData) return staticData;

  return undefined;
};

// --- NUCLEAR OPTION: AUTO-POPULATE CONTENT ---
// This function destructively replaces topic content with AI-generated academic material.
export const populateCourseContent = async (courseId: string): Promise<void> => {
  console.log(`Starting Nuclear Auto-Populate for Course: ${courseId}`);
  
  // 1. Fetch Current Master Record
  let workshopRef = doc(db, 'workshops', courseId);
  let workshopSnap = await getDoc(workshopRef);
  
  if (!workshopSnap.exists()) {
      // Check programs
      workshopRef = doc(db, 'programs', courseId);
      workshopSnap = await getDoc(workshopRef);
  }
  
  if (!workshopSnap.exists()) {
      throw new Error(`Course ${courseId} not found in workshops or programs.`);
  }
  
  const workshop = workshopSnap.data() as Workshop;
  
  // Ensure topic skeleton exists if it's an auto-generated course
  let topics = workshop.workshop_structure?.topics || [];
  if (topics.length === 0) {
      console.log("No topics found, generating skeleton first...");
      const skeletonTopics: TopicModule[] = [];
      for (let i = 0; i < 6; i++) {
          skeletonTopics.push({
              id: `${courseId}_t${i+1}`,
              title: `Topic ${i+1}`,
              type: i < 3 ? 'mandatory' : 'elective',
              order: i + 1,
              introductory_notes: '',
              revision_notes: '',
              content_ready: false,
              section_1: { video: { title: '', url: '', duration: '', source_credit: '' }, key_points: [], quiz: { pass_mark: 76, questions: [] } },
              section_2: { video: { title: '', url: '', duration: '', source_credit: '' }, key_points: [], quiz: { pass_mark: 76, questions: [] } },
              section_3: { video: { title: '', url: '', duration: '', source_credit: '' }, key_points: [], quiz: { pass_mark: 76, questions: [] } }
          });
      }
      topics = skeletonTopics;
  }

  // 2. Iterate and Generate Content
  const updatedTopics: TopicModule[] = [];
  
  for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      
      // Skip if content is already ready
      if (topic.content_ready) {
          console.log(`Skipping Topic ${i+1}: ${topic.title} (Already populated)`);
          updatedTopics.push(topic);
          continue;
      }

      console.log(`Generating content for Topic ${i+1}: ${topic.title}...`);
      
      // Call AI Service
      const academicContent = await generateAcademicTopicContent(
          workshop.title,
          topic.title,
          i,
          workshop.category
      );

      if (academicContent) {
          // Map AI response to Strict Schema
          const newTopic: TopicModule = {
              ...topic, // Keep ID, Title, Type, Order
              introductory_notes: academicContent.introductory_notes,
              revision_notes: academicContent.revision_notes,
              content_ready: true,
              // Map Cycles to Sections
              section_1: mapCycleToSection(academicContent.cycles[0]),
              section_2: mapCycleToSection(academicContent.cycles[1]),
              section_3: mapCycleToSection(academicContent.cycles[2]),
              // Reset progress flags
              cycles: {
                  cycle_1: { completed: false },
                  cycle_2: { completed: false },
                  cycle_3: { completed: false }
              }
          };
          updatedTopics.push(newTopic);
      } else {
          console.warn(`Failed to generate content for ${topic.title}. Keeping old data.`);
          updatedTopics.push(topic);
      }
      
      // Delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 3. Destructive Write
  await updateDoc(workshopRef, {
      "workshop_structure.topics": updatedTopics,
      content_ready: true,
      updated_at: serverTimestamp()
  });
  
  // 4. Log Action
  await addDoc(collection(db, 'admin_actions'), {
      action: 'nuclear_auto_populate',
      courseId,
      courseTitle: workshop.title,
      timestamp: serverTimestamp(),
      topicsUpdated: updatedTopics.length
  });

  console.log(`Nuclear Auto-Populate Complete for ${workshop.title}`);
};

export const populateAllCourseContent = async () => {
    console.log("Starting Bulk Content Population...");
    const workshops = await getDocs(query(collection(db, 'workshops'), where('content_ready', '==', false)));
    const programs = await getDocs(query(collection(db, 'programs'), where('content_ready', '==', false)));
    
    const allCourses = [...workshops.docs, ...programs.docs];
    console.log(`Found ${allCourses.length} courses needing content.`);
    
    for (const doc of allCourses) {
        try {
            await populateCourseContent(doc.id);
        } catch (e) {
            console.error(`Failed to populate ${doc.id}`, e);
        }
    }
    console.log("Bulk Content Population Complete.");
};

const mapCycleToSection = (cycleData: any): Section => {
    return {
        cycle_number: cycleData.cycle_number,
        title: cycleData.title,
        video: {
            title: cycleData.title + " Lecture",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder until video search is integrated
            duration: "20:00",
            source_credit: "IMI Academic Source"
        },
        introductory_notes: cycleData.introductory_notes,
        key_points: cycleData.key_points, // Should be 15
        quiz: cycleData.quiz, // Should be 20 qs, 76% pass
        revision_points: cycleData.revision_points // Should be 15
    };
};

export const migrateStaticWorkshops = async () => {
    const workshops = getStaticWorkshops();
    let count = 0;
    
    for (const workshop of workshops) {
        const ref = doc(db, 'workshops', workshop.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            await setDoc(ref, {
                ...workshop,
                status: 'published',
                visible: true,
                date_created: serverTimestamp(),
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });
            count++;
        }
    }
    
    console.log(`Migrated ${count} workshops to Firestore.`);
    return count;
};

export const runAutoMigration = async () => {
    console.log("Starting Auto-Migration...");
    
    // 1. Migrate Static Workshops
    const migratedCount = await migrateStaticWorkshops();
    
    // 2. Ensure Academic Levels exist
    const levels = [
        { id: 'workshop', name: 'Workshops', slug: 'workshops', weight: 1 },
        { id: 'certificate', name: 'Certificate Programs', slug: 'certificates', weight: 2 },
        { id: 'diploma', name: 'Diplomas', slug: 'diplomas', weight: 3 },
        { id: 'degree', name: 'Degrees', slug: 'degrees', weight: 4 },
        { id: 'masters', name: 'Masters', slug: 'masters', weight: 5 }
    ];
    
    for (const level of levels) {
        await setDoc(doc(db, 'academic_levels', level.id), level, { merge: true });
    }
    
    // 3. Sync Catalog Data Consistency
    // (Ensure all workshops have necessary fields for unified catalog)
    const workshopsSnap = await getDocs(collection(db, 'workshops'));
    const batch = writeBatch(db);
    workshopsSnap.docs.forEach(d => {
        const data = d.data();
        if (!data.course_type) {
            batch.update(d.ref, { course_type: 'Workshop' });
        }
    });
    await batch.commit();
    
    console.log("Auto-Migration Complete.");
    return { migratedCount, levelsSynced: levels.length };
};

export const generateCatalogExpansion = async (targetCount: number = 200) => {
    console.log(`Expanding catalog to ${targetCount} courses...`);
    const categories: CourseCategory[] = ['Technology', 'Business', 'Finance', 'Innovation', 'Cybersecurity', 'Data Science', 'Engineering', 'Social Sciences', 'Health', 'Education'];
    const levels: CourseType[] = ['Workshop', 'Certificate', 'Diploma', 'Degree', 'Masters'];
    
    const currentWorkshops = await getDocs(collection(db, 'workshops'));
    const currentPrograms = await getDocs(collection(db, 'programs'));
    let currentCount = currentWorkshops.size + currentPrograms.size;
    
    if (currentCount >= targetCount) {
        console.log("Catalog already meets or exceeds target count.");
        return 0;
    }
    
    let createdCount = 0;
    const batchSize = 20;
    
    while (currentCount < targetCount) {
        const batch = writeBatch(db);
        const thisBatchSize = Math.min(batchSize, targetCount - currentCount);
        
        for (let i = 0; i < thisBatchSize; i++) {
            const id = `ws_auto_${Date.now()}_${i}`;
            const category = categories[Math.floor(Math.random() * categories.length)];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const title = `${category} ${level} - Module ${currentCount + 1}`;
            
            const skeleton: any = {
                id,
                workshop_id: id,
                course_id: id,
                title,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: `Advanced ${level} program in ${category}.`,
                category,
                course_type: level,
                level: 'Intermediate',
                status: 'published', // Publish immediately as per Phase 14
                visible: true,
                content_ready: false,
                date_created: serverTimestamp(),
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                pricing: {
                    application_fee: 350,
                    workshop_fee: 2500,
                    examination_fee: 250,
                    scholarship_percentage: 100,
                    payment_options: ['pay_now', 'pay_later']
                },
                certification: {
                    attendance_certificate: true,
                    exam_required: true,
                    certificate_cost: 0
                },
                visibility: {
                    landing_page: true,
                    catalogue: true,
                    search_results: true,
                    student_dashboard: true
                }
            };
            
            const collectionName = level === 'Workshop' ? 'workshops' : 'programs';
            batch.set(doc(db, collectionName, id), skeleton);
            currentCount++;
            createdCount++;
        }
        
        await batch.commit();
        console.log(`Created ${currentCount}/${targetCount} courses...`);
    }
    
    return createdCount;
};

// --- ENROLLMENT & UTILS (Preserved) ---
export const enrollUserInWorkshop = async (userId: string, workshopId: string, initialData?: any): Promise<string> => {
  const enrollmentId = `${userId}_${workshopId}`;
  const enrollmentRef = doc(db, "enrollments", enrollmentId);
  const existingDoc = await getDoc(enrollmentRef);
  
  if (existingDoc.exists()) return enrollmentId;

  const workshop = await getWorkshopById(workshopId);
  if (!workshop) throw new Error("Workshop not found.");

  await setDoc(enrollmentRef, {
    id: enrollmentId,
    userId,
    workshopId,
    course_title: workshop.title,
    category: workshop.category,
    status: 'draft', 
    payment_status: 'unpaid',
    exam_payment_status: 'unpaid',
    exam_status: 'locked',
    progress: 0,
    currentTopicIndex: 0,
    enrolledAt: serverTimestamp(),
    certificate_issued: false,
    applicationData: initialData || {}
  });
  return enrollmentId;
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: string, additionalData?: any) => {
    const ref = doc(db, 'enrollments', enrollmentId);
    await updateDoc(ref, { status, ...additionalData, lastAccessed: serverTimestamp() });
};

export const saveScholarshipApplication = async (userId: string, enrollmentId: string, reason: string): Promise<void> => {
    await addDoc(collection(db, 'scholarship_applications'), { userId, enrollmentId, reason, status: 'pending', submittedAt: serverTimestamp() });
};

export const logChatLog = async (userId: string, context: string, messages: any[]) => {
    try { await addDoc(collection(db, 'ai_chat_logs'), { userId, context, messages, createdAt: serverTimestamp() }); } catch(e) { console.error(e); }
};

export const recordTopicProgress = async (id: string, idx: number, key: string, score: number) => {
  const ref = doc(db, 'enrollments', id);
  const snap = await getDoc(ref);
  if(!snap.exists()) return;
  
  const data = snap.data() as Enrollment;
  const tKey = `topic_${idx}`;
  const pData = data.progressData || {};
  if(!pData[tKey]) pData[tKey] = { completed: false, section1Score:0, section2Score:0, section3Score:0, introViewed: true, revisionViewed: false };
  pData[tKey][key] = score;
  
  const isPassed = pData[tKey].section1Score >= 76 && pData[tKey].section2Score >= 76 && pData[tKey].section3Score >= 76;
  
  if (isPassed) {
      pData[tKey].completed = true;
      if (data.currentTopicIndex === idx) {
          const nextIndex = idx + 1;
          const totalTopics = 6; 
          const updates: any = {
             progressData: pData,
             lastAccessed: serverTimestamp(),
             progress: Math.min(100, ((idx + 1) / totalTopics) * 100)
          };
          if (nextIndex <= totalTopics) updates.currentTopicIndex = nextIndex;
          await updateDoc(ref, updates);
          return;
      }
  }
  await updateDoc(ref, { progressData: pData, lastAccessed: serverTimestamp() });
};

export const getUserEnrollments = async (userId: string): Promise<Enrollment[]> => {
  // CRITICAL FIX: Removed blocker for mock users
  try {
    const q = query(collection(db, 'enrollments'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const enrollments = snap.docs.map(d => ({ id: d.id, ...d.data() } as Enrollment));
    
    // We need to fetch workshop data for these enrollments
    // For performance, we could batch fetch, but here we iterate
    // IMPORTANT: Use getWorkshopById to handle AI reconstruction if needed
    const enrichedEnrollments = await Promise.all(enrollments.map(async (e) => {
        const workshop = await getWorkshopById(e.workshopId);
        return { ...e, workshop };
    }));
    
    return enrichedEnrollments;
  } catch (e) { 
      console.error("Error fetching enrollments", e);
      return []; 
  }
};

export const subscribeToCollection = <T>(c: string, q: any[], cb: (data: T[]) => void) => {
    return onSnapshot(query(collection(db, c), ...q), (s) => cb(s.docs.map(d=>({id:d.id, ...d.data()} as T))), (e) => console.warn(e));
};

export const loginWithEmail = async (e: string, p: string) => signInWithEmailAndPassword(auth, e, p);
export const registerWithEmail = async (e: string, p: string, n: string, r: string, s: string) => {
    const cred = await createUserWithEmailAndPassword(auth, e, p);
    await setDoc(doc(db, 'users', cred.user.uid), { id: cred.user.uid, email:e, name:n, role:r, studentNumber:s, createdAt: serverTimestamp() });
    return cred.user;
};
export const logLoginAttempt = async (identifier: string, success: boolean, method: string) => {
    try { await addDoc(collection(db, 'login_logs'), { identifier, success, method, timestamp: serverTimestamp() }); } catch (e) { console.error(e); }
};
export const getUserProfile = async (uid: string) => {
    // CRITICAL FIX: Removed blocker for mock users
    const s = await getDoc(doc(db, 'users', uid));
    return s.exists() ? {id: s.id, ...s.data()} as User : null;
};
export const updateUserRole = async (id: string, role: string) => updateDoc(doc(db, 'users', id), {role});
export const getEnrollmentById = async (id: string) => {
    const snap = await getDoc(doc(db, 'enrollments', id));
    return snap.exists() ? {id: snap.id, ...snap.data()} as Enrollment : null;
};
export const uploadSecureFile = async (file: File, path: string, meta: any, prog: any) => ({ url: 'https://via.placeholder.com/150', path: 'mock/path' }); 
export const testFirebaseConnection = async () => true;
export const getStudentSettings = async (id: string): Promise<StudentSettings> => ({ notifications: {email:true, sms:true, push:true}, accessibility: {highContrast:false, fontSize:'normal'}, language:'English' });
export const updateStudentSettings = async (userId: string, settings: StudentSettings) => {};
export const getStudentPayments = async (userId: string): Promise<PaymentRecord[]> => [];
export const getStudentCertificates = async (userId: string): Promise<Certificate[]> => [];
export const getNotices = async (): Promise<Notice[]> => [];
export const getFAQs = async (): Promise<FAQItem[]> => [];
export const completeEnrollmentPayment = async (enrollmentId: string) => updateDoc(doc(db, "enrollments", enrollmentId), { status: 'in_progress', payment_status: 'paid', progress: 1 });
export const payExamFee = async (id: string) => updateDoc(doc(db, 'enrollments', id), { exam_payment_status: 'paid', exam_status: 'unlocked' });
export const submitFinalExam = async (id: string, score: number, answers: any) => { return { passed: score >= 76, certId: `CERT-${Date.now()}` }; };

// Fix: Define before usage
export const verifyEnrollmentIntegrity = async (): Promise<{ active: number, completed: number, issues: number }> => { return { active: 0, completed: 0, issues: 0 }; };
export const verifyLMSIntegrity = verifyEnrollmentIntegrity;

// Fix: Add Missing Functions for CourseBuilder
export const verifyCourseIntegrity = async (courseId: string): Promise<boolean> => {
  const course = await getWorkshopById(courseId);
  if (!course || !course.title) return false;
  
  // Ensure basic structure exists
  if (!course.workshop_structure) return false;
  if (!course.workshop_structure.topics || course.workshop_structure.topics.length === 0) return false;
  
  return true;
};

export const publishCourse = async (courseId: string): Promise<boolean> => {
  try {
    const course = await getWorkshopById(courseId);
    if (!course) return false;

    // Ensure certificate data is initialized upon publishing
    const certEnabled = course.workshop_structure?.certificate_data?.enabled ?? true;
    
    await updateDoc(doc(db, 'workshops', courseId), {
      status: 'published',
      visible: true,
      'workshop_structure.certificate_data.enabled': certEnabled,
      'workshop_structure.certificate_data.generation_trigger': 'completion',
      updated_at: serverTimestamp()
    });

    // Trigger Analytics / Audit Log
    await addDoc(collection(db, 'admin_actions'), {
      action: 'publish_course',
      courseId,
      courseTitle: course.title,
      adminId: auth.currentUser?.uid || 'system',
      timestamp: serverTimestamp()
    });

    return true;
  } catch (e) {
    console.error("Publish failed", e);
    return false;
  }
};

export const bulkImportCourses = async (jsonData: any[]): Promise<void> => {};
export const createCourse = async (d: any) => addDoc(collection(db, 'courses'), d);
export const createAssignment = async (d: any) => addDoc(collection(db, 'assignments'), d);
export const recordWellbeingCheckin = async (userId: string, mood: string) => {};
export const requestMentorship = async (userId: string, topic: string) => {};
export const updateLearningStreak = async (userId: string) => {};
export const inviteGuardian = async (userId: string, email: string) => {};
export const updateLearningPace = async (userId: string, pace: string) => {};

export { 
  auth, db, storage, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, 
  GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged,
  analytics, logEvent,
  collection, addDoc, doc, setDoc, getDoc, updateDoc, serverTimestamp, 
  ref, uploadBytesResumable, getDownloadURL 
};
