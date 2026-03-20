import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  addDoc,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  AcademicProgram, 
  AcademicCourse, 
  AcademicLevel, 
  ProgramVersion, 
  ProgramStatus,
  Workshop
} from '../types';
import { enrichAcademicProgram } from './geminiService';
import { mapProgramToWorkshop } from '../utils/mapping';

// --- COLLECTIONS ---
const PROGRAMS_COLLECTION = 'programs';
const COURSES_COLLECTION = 'academic_courses'; // Distinct from existing 'courses'
const LEVELS_COLLECTION = 'academic_levels';
const VERSIONS_COLLECTION = 'program_versions';

// --- LEVELS ---
export const initializeAcademicLevels = async () => {
  const levels: AcademicLevel[] = [
    { id: 'workshop', name: 'Professional Workshop', slug: 'workshop', schemaType: 'Course', weight: 1 },
    { id: 'diploma', name: 'Diploma', slug: 'diploma', schemaType: 'EducationalOccupationalProgram', weight: 2 },
    { id: 'degree', name: 'Bachelor\'s Degree', slug: 'degree', schemaType: 'EducationalOccupationalProgram', weight: 3 },
    { id: 'masters', name: 'Master\'s Degree', slug: 'masters', schemaType: 'EducationalOccupationalProgram', weight: 4 },
  ];

  for (const level of levels) {
    const ref = doc(db, LEVELS_COLLECTION, level.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, level);
    }
  }
};

export const getAcademicLevels = async (): Promise<AcademicLevel[]> => {
  const path = LEVELS_COLLECTION;
  try {
    const q = query(collection(db, path), orderBy('weight', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AcademicLevel);
  } catch (e) {
    if (e instanceof Error && e.message.includes('insufficient permissions')) {
      // We need to import OperationType and handleFirestoreError from firebase service
      // But they are not exported. I'll use a local check or just log.
      console.error("Permission error fetching academic levels", e);
    }
    throw e;
  }
};

// --- PROGRAMS ---

export const createProgram = async (program: Partial<AcademicProgram>, userId: string): Promise<string> => {
  const newProgram: Partial<AcademicProgram> = {
    ...program,
    status: 'draft',
    version: 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    data_governance: {
      source_verified: false,
      last_reviewed_by: userId,
      review_cycle_months: 12,
      plagiarism_checked: false
    }
  };

  // Auto-enrichment trigger
  if (program.title && program.official_outline) {
    try {
      const enrichment = await enrichAcademicProgram(
        program.title, 
        program.level_id || 'degree', 
        program.official_outline
      );
      
      if (enrichment) {
        newProgram.ai_suggested_description = enrichment.ai_suggested_description;
        newProgram.ai_suggested_keywords = enrichment.ai_suggested_keywords;
        newProgram.ai_suggested_career_paths = enrichment.ai_suggested_career_paths;
      }
    } catch (e) {
      console.warn("Auto-enrichment failed silently", e);
    }
  }

  const docRef = await addDoc(collection(db, PROGRAMS_COLLECTION), newProgram);
  return docRef.id;
};

export const updateProgram = async (id: string, updates: Partial<AcademicProgram>, userId: string) => {
  const ref = doc(db, PROGRAMS_COLLECTION, id);
  await updateDoc(ref, {
    ...updates,
    updated_at: serverTimestamp(),
    'data_governance.last_reviewed_by': userId
  });
};

export const getProgramById = async (id: string): Promise<AcademicProgram | null> => {
  const ref = doc(db, PROGRAMS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as AcademicProgram;
  }
  return null;
};

export const getAllPrograms = async (): Promise<AcademicProgram[]> => {
  const path = PROGRAMS_COLLECTION;
  try {
    const q = query(collection(db, path), orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AcademicProgram));
  } catch (e) {
    console.error("Error fetching all programs", e);
    throw e;
  }
};

export const publishProgram = async (programId: string, userId: string) => {
  const program = await getProgramById(programId);
  if (!program) throw new Error("Program not found");

  // 1. Create Version Snapshot
  const versionData: ProgramVersion = {
    program_id: programId,
    version_number: program.version,
    change_log: `Published version ${program.version}`,
    approved_by: userId,
    archived_snapshot: program,
    approved_at: new Date().toISOString() // Store as string for simplicity in snapshot
  };

  await addDoc(collection(db, VERSIONS_COLLECTION), versionData);

  // 2. Update Program to Published & Increment Version
  await updateDoc(doc(db, PROGRAMS_COLLECTION, programId), {
    status: 'published',
    version: program.version + 1,
    updated_at: serverTimestamp(),
    'data_governance.last_reviewed_by': userId,
    'data_governance.source_verified': true
  });
};

// --- ARCHIVAL & PUBLISHING ---

export const archiveAIContent = async (programId: string, userId: string) => {
  const program = await getProgramById(programId);
  if (!program) throw new Error("Program not found");

  const archivedItems = [];
  const updates: any = {};

  // Check and archive description
  if (program.ai_suggested_description) {
    archivedItems.push({
      original_field: 'ai_suggested_description',
      content: program.ai_suggested_description,
      generated_at: program.updated_at,
      archived_at: new Date().toISOString()
    });
    updates.ai_suggested_description = null; // Clear from active field
  }

  // Check and archive keywords
  if (program.ai_suggested_keywords && program.ai_suggested_keywords.length > 0) {
    archivedItems.push({
      original_field: 'ai_suggested_keywords',
      content: program.ai_suggested_keywords,
      generated_at: program.updated_at,
      archived_at: new Date().toISOString()
    });
    updates.ai_suggested_keywords = null;
  }

  // Check and archive career paths
  if (program.ai_suggested_career_paths && program.ai_suggested_career_paths.length > 0) {
    archivedItems.push({
      original_field: 'ai_suggested_career_paths',
      content: program.ai_suggested_career_paths,
      generated_at: program.updated_at,
      archived_at: new Date().toISOString()
    });
    updates.ai_suggested_career_paths = null;
  }

  if (archivedItems.length > 0) {
    const currentArchive = program.archived_ai_content || [];
    updates.archived_ai_content = [...currentArchive, ...archivedItems];
    
    await updateDoc(doc(db, PROGRAMS_COLLECTION, programId), {
      ...updates,
      updated_at: serverTimestamp(),
      'data_governance.last_reviewed_by': userId
    });
  }
};

export const publishAllPrograms = async (userId: string) => {
  const programs = await getAllPrograms();
  let count = 0;
  
  for (const p of programs) {
    // Only publish if it has minimum required fields
    if (p.title && p.official_outline && p.level_id) {
       // Archive AI content first if exists
       await archiveAIContent(p.id, userId);
       
       // Then publish
       if (p.status !== 'published') {
         await publishProgram(p.id, userId);
         count++;
       }
    }
  }
  return count;
};

// --- COURSES (ACADEMIC) ---

export const createAcademicCourse = async (course: Partial<AcademicCourse>): Promise<string> => {
  const newCourse = {
    ...course,
    status: 'draft',
    created_at: serverTimestamp()
  };
  const docRef = await addDoc(collection(db, COURSES_COLLECTION), newCourse);
  return docRef.id;
};

export const getCoursesByProgram = async (programId: string): Promise<AcademicCourse[]> => {
  const q = query(collection(db, COURSES_COLLECTION), where('program_ids', 'array-contains', programId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AcademicCourse));
};

// --- UNIFIED CATALOG ---

export const getUnifiedCatalog = async (): Promise<Workshop[]> => {
  try {
    // 1. Fetch Legacy Workshops
    const workshopsQ = query(collection(db, 'workshops'), where('status', '==', 'published'));
    const workshopsSnap = await getDocs(workshopsQ);
    const legacyWorkshops = workshopsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Workshop));

    // 2. Fetch New Programs
    const programsQ = query(collection(db, 'programs'), where('status', '==', 'published'));
    const programsSnap = await getDocs(programsQ);
    const newPrograms = programsSnap.docs.map(d => mapProgramToWorkshop({ id: d.id, ...d.data() } as AcademicProgram));

    // 3. Merge and Sort
    const combined = [...legacyWorkshops, ...newPrograms];
    return combined.sort((a, b) => {
      const da = a.date_created?.toDate ? a.date_created.toDate() : new Date(a.date_created || 0);
      const db = b.date_created?.toDate ? b.date_created.toDate() : new Date(b.date_created || 0);
      return db.getTime() - da.getTime();
    });
  } catch (e) {
    console.error("Unified catalog fetch failed", e);
    return [];
  }
};

export const getAdminUnifiedCatalog = async (): Promise<Workshop[]> => {
  try {
    // 1. Fetch All Workshops
    const workshopsSnap = await getDocs(collection(db, 'workshops'));
    const legacyWorkshops = workshopsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Workshop));

    // 2. Fetch All Programs
    const programsSnap = await getDocs(collection(db, 'programs'));
    const newPrograms = programsSnap.docs.map(d => mapProgramToWorkshop({ id: d.id, ...d.data() } as AcademicProgram));

    // 3. Merge and Sort
    const combined = [...legacyWorkshops, ...newPrograms];
    return combined.sort((a, b) => {
      const da = a.date_created?.toDate ? a.date_created.toDate() : new Date(a.date_created || 0);
      const db = b.date_created?.toDate ? b.date_created.toDate() : new Date(b.date_created || 0);
      return db.getTime() - da.getTime();
    });
  } catch (e) {
    console.error("Admin unified catalog fetch failed", e);
    return [];
  }
};
