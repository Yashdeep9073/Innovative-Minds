
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc, 
  setDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Workshop, AcademicProgram } from '../types';
import { generateFullCourseContent } from './geminiService';

const COLLECTIONS_TO_CLEAN = [
  'workshops',
  'programs',
  'academic_courses',
  'academic_levels',
  'program_versions',
  'modules',
  'topics'
];

export const resetCatalog = async () => {
  console.log("Starting Nuclear Catalog Reset...");
  for (const colName of COLLECTIONS_TO_CLEAN) {
    try {
      const snap = await getDocs(collection(db, colName));
      if (snap.empty) continue;

      const chunks = [];
      const docs = snap.docs;
      for (let i = 0; i < docs.length; i += 500) {
        chunks.push(docs.slice(i, i + 500));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
      console.log(`Cleaned collection: ${colName}`);
    } catch (e) {
      console.warn(`Failed to clean collection ${colName}:`, e);
    }
  }
  console.log("Catalog Reset Complete.");
};

export const WORKSHOPS_LIST = [
  "Introduction to Artificial Intelligence", "Prompt Engineering Fundamentals", "Programming for Beginners",
  "Modern Farming trends", "Digital Marketing Essentials", "Cybersecurity Basics",
  "Web Development Fundamentals", "Event Managment and Planning", "Business Startup Fundamentals",
  "Financial Literacy for Entrepreneurs", "Online GRZ (Goverment of Zambia online) services",
  "Social Media Marketing Strategy", "Project Management Essentials", "Introduction to Data Science",
  "Cloud Computing Basics", "Mobile App Development Introduction", "Ethical Hacking Fundamentals",
  "Job Hunting Basics", "Public Speaking and Presentation Skills", "Personal Productivity Systems",
  "Digital Entrepreneurship Bootcamp", "Selling Online Business Fundamentals", "Remote Work Skills for Professionals",
  "AI Tools for Business Productivity", "ChatGPT and AI Content Creation", "Modern Sales Techniques",
  "Online Teaching and Course Creation", "Personal Branding in the Digital Age", "Startup Fundraising Fundamentals",
  "Introduction to Business Analytics"
];

export const CERTIFICATES_LIST = [
  "Certificate in Digital Marketing", "Certificate in Artificial Intelligence Applications", "Certificate in Business Management",
  "Certificate in Financial Accounting", "Certificate in Entrepreneurship", "Certificate in Project Management",
  "Certificate in Data Analytics", "Certificate in Cybersecurity", "Certificate in Web Development",
  "Certificate in Mobile App Development", "Certificate in Cloud Computing", "Certificate in E-Commerce Management",
  "Certificate in Human Resource Management", "Certificate in Supply Chain Management", "Certificate in Strategic Marketing",
  "Certificate in Business Analytics", "Certificate in Public Administration", "Certificate in Digital Transformation",
  "Certificate in Leadership and Management", "Certificate in Educational Technology", "Certificate in Innovation and Entrepreneurship",
  "Certificate in Social Media Strategy", "Certificate in Financial Technology (FinTech)", "Certificate in Information Systems",
  "Certificate in Artificial Intelligence for Business", "Certificate in Emergency Medical response",
  "Certificate in International Business", "Certificate in Communication and Media",
  "Certificate in International Nursing practises", "Certificate in Online Teaching and Learning"
];

export const DIPLOMAS_LIST = [
  "Diploma in Information Technology", "Diploma in Business Administration", "Diploma in Digital Marketing",
  "Diploma in Financial Management", "Diploma in Entrepreneurship", "Diploma in Computer Science",
  "Diploma in Data Science", "Diploma in Software Development", "Diploma in Cybersecurity",
  "Diploma in Artificial Intelligence", "Diploma in Business Analytics", "Diploma in Project Management",
  "Diploma in Supply Chain Management", "Diploma in Human Resource Management", "Diploma in Marketing Management",
  "Diploma in Accounting and Finance", "Diploma in Public Administration", "Diploma in Education Technology",
  "Diploma in International Business", "Diploma in Innovation and Technology Management", "Diploma in Mobile Application Development",
  "Diploma in Web Development", "Diploma in Cloud Computing", "Diploma in Digital Transformation",
  "Diploma in Leadership Studies", "Diploma in Financial Technology", "Diploma in E-Commerce Management",
  "Diploma in Strategic Communication", "Diploma in Sustainable Development", "Diploma in Global Business Management"
];

export const DEGREES_LIST = [
  "Bachelor of Science in Computer Science", "Bachelor of Science in Data Science", "Bachelor of Science in Artificial Intelligence",
  "Bachelor of Science in Cybersecurity", "Bachelor of Science in Software Engineering", "Bachelor of Science in Information Technology",
  "Bachelor of Business Administration", "Bachelor of Science in Digital Marketing", "Bachelor of Science in Financial Management",
  "Bachelor of Science in Accounting", "Bachelor of Science in Business Analytics", "Bachelor of Science in Project Management",
  "Bachelor of Science in Supply Chain Management", "Bachelor of Science in Human Resource Management", "Bachelor of Science in Entrepreneurship",
  "Bachelor of Science in International Business", "Bachelor of Science in Public Administration", "Bachelor of Science in Economics",
  "Bachelor of Science in Innovation Management", "Bachelor of Science in Technology Management", "Bachelor of Science in Educational Technology",
  "Bachelor of Science in Communication and Media Studies", "Bachelor of Science in Artificial Intelligence and Robotics",
  "Bachelor of Science in FinTech", "Bachelor of Science in Digital Transformation", "Bachelor of Science in Strategic Management",
  "Bachelor of Science in Sustainable Business", "Bachelor of Science in Cloud Computing", "Bachelor of Science in Software Systems Engineering",
  "Bachelor of Science in Global Business"
];

export const MASTERS_LIST = [
  "Master of Science in Artificial Intelligence", "Master of Science in Data Science", "Master of Science in Cybersecurity",
  "Master of Science in Software Engineering", "Master of Science in Information Technology", "Master of Business Administration",
  "Master of Science in Digital Marketing", "Master of Science in Financial Management", "Master of Science in Accounting and Finance",
  "Master of Science in Business Analytics", "Master of Science in Project Management", "Master of Science in Supply Chain Management",
  "Master of Science in Human Resource Management", "Master of Science in Entrepreneurship", "Master of Science in International Business",
  "Master of Science in Public Administration", "Master of Science in Economics", "Master of Science in Innovation and Technology Management",
  "Master of Science in Artificial Intelligence Strategy", "Master of Science in Technology Leadership", "Master of Science in Education Technology",
  "Master of Science in Communication and Media Studies", "Master of Science in Robotics and Automation", "Master of Science in Financial Technology",
  "Master of Science in Digital Transformation", "Master of Science in Strategic Management", "Master of Science in Sustainable Development",
  "Master of Science in Cloud Computing", "Master of Science in Software Systems Architecture", "Master of Science in Global Business Strategy"
];

const CATEGORIES = [
  "Technology", "Business", "Agriculture", "Health", "Education", "Innovation", "Cybersecurity", "Data Science", "Engineering", "Social Sciences"
];

export const initializeOfficialCatalog = async (userId: string) => {
  console.log("Initializing Official Catalog...");
  
  const createBatch = async (list: string[], level: string, categoryPrefix: string) => {
    for (let i = 0; i < list.length; i++) {
      const title = list[i];
      const category = CATEGORIES[i % CATEGORIES.length];
      const id = `imi_${level}_${i.toString().padStart(3, '0')}`;
      
      const program: Partial<AcademicProgram> = {
        id,
        title,
        level_id: level,
        category,
        status: 'published',
        visibility: 'public',
        provider: 'Innovative Minds Institute',
        version: 1,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        official_outline: `Official ${level} program in ${title}.`,
        image_url: `https://picsum.photos/seed/${id}/800/600`,
        data_governance: {
          source_verified: true,
          last_reviewed_by: userId,
          review_cycle_months: 12,
          plagiarism_checked: true
        }
      };

      await setDoc(doc(db, 'programs', id), program);
      console.log(`Created ${level}: ${title}`);
    }
  };

  await createBatch(WORKSHOPS_LIST, 'workshop', 'WS');
  await createBatch(CERTIFICATES_LIST, 'certificate', 'CERT');
  await createBatch(DIPLOMAS_LIST, 'diploma', 'DIP');
  await createBatch(DEGREES_LIST, 'degree', 'DEG');
  await createBatch(MASTERS_LIST, 'masters', 'MST');

  console.log("Catalog Initialization Complete.");
};

export const populateCatalogContent = async () => {
  console.log("Starting Content Population Engine...");
  const snap = await getDocs(collection(db, 'programs'));
  const programs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AcademicProgram));

  for (const p of programs) {
    if (p.workshop_structure) continue; // Skip if already populated

    console.log(`Populating content for: ${p.title}`);
    try {
      const content = await generateFullCourseContent(p.title, p.category || 'General', p.level_id || 'degree');
      if (content) {
        await setDoc(doc(db, 'programs', p.id), {
          ...p,
          description: content.description || p.description,
          workshop_structure: content.workshop_structure,
          updated_at: serverTimestamp()
        });
        console.log(`Successfully populated: ${p.title}`);
      }
    } catch (e) {
      console.warn(`Failed to populate ${p.title}:`, e);
    }
    // Small delay to avoid rate limiting if needed, but Gemini 2.5 Flash is fast
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log("Content Population Complete.");
};
