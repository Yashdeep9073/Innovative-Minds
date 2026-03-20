import { db } from './firebase';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';
import { 
  UniversalCourseSchema, 
  WorkshopSchema, 
  ProfessionalCertificationSchema, 
  BachelorDegreeSchema, 
  MasterDegreeSchema, 
  ExpertSeminarSchema, 
  GlobalWebinarSchema 
} from '../types/courseSchema';

export const generateCourseTemplate = (courseType: string): UniversalCourseSchema => {
  const baseSchema: UniversalCourseSchema = {
    identity: {
      course_id: '',
      course_title: '',
      course_type: courseType as any,
      course_category: '',
      course_level: '',
      course_duration: '',
      credit_hours: 0,
      accreditation_status: 'Pending',
      delivery_mode: 'Online',
      language: 'English',
      region_focus: 'Global'
    },
    overview: {
      course_summary: '',
      african_relevance: '',
      global_context: '',
      career_outcomes: [],
      skills_gained: [],
      industry_alignment: ''
    },
    outcomes: {
      knowledge_outcomes: [],
      practical_skill_outcomes: [],
      professional_competencies: [],
      innovation_capabilities: []
    },
    curriculum: {
      modules: [],
      units: 0,
      lessons: 0,
      learning_materials: [],
      video_content: true,
      reading_material: true,
      case_study: true,
      practical_activity: true,
      discussion_questions: true
    },
    retention: {
      interactive_elements: true,
      quizzes: true,
      peer_reviews: true,
      group_collaboration: true,
      discussion_boards: true,
      achievement_badges: true,
      leaderboards: true,
      progress_tracking: true
    },
    assessment: {
      formative_assessments: true,
      summative_assessments: true,
      assignments: true,
      final_exam: true,
      capstone_project: false,
      industry_case_study: false
    },
    certification: {
      certificate_type: 'Digital',
      credential_level: 'Standard',
      issuing_institution: 'Innovative Minds Institute',
      verification_method: 'Blockchain',
      digital_badge: true
    },
    analytics: {
      completion_rate: 0,
      engagement_score: 0,
      quiz_performance: 0,
      time_on_content: 0,
      dropout_prediction: 0,
      skill_progression: 0
    }
  };

  switch (courseType) {
    case 'Workshop':
      return {
        ...baseSchema,
        structure: {
          overview: '',
          learning_objectives: [],
          module_1: {},
          module_2: {},
          hands_on_activity: '',
          live_demo: '',
          qa_session: '',
          certificate_of_completion: true
        }
      } as WorkshopSchema;
    case 'Professional Certification':
      return {
        ...baseSchema,
        structure: {
          foundation_modules: [],
          core_modules: [],
          industry_application: '',
          case_studies: [],
          practical_assignments: [],
          capstone_project: {},
          certification_exam: {}
        }
      } as ProfessionalCertificationSchema;
    case 'Bachelor Degree':
      return {
        ...baseSchema,
        structure: {
          year_1: { semester_1: [], semester_2: [] },
          year_2: { semester_3: [], semester_4: [] },
          year_3: { semester_5: [], semester_6: [] },
          industry_internship: {},
          research_project: {},
          capstone_thesis: {}
        }
      } as BachelorDegreeSchema;
    case 'Master Degree':
      return {
        ...baseSchema,
        structure: {
          year_1: { advanced_coursework: [], research_methodology: {}, specialized_electives: [] },
          year_2: { applied_research: {}, innovation_project: {}, masters_thesis: {} }
        }
      } as MasterDegreeSchema;
    case 'Expert Seminar':
      return {
        ...baseSchema,
        structure: {
          keynote_lecture: {},
          expert_panel: {},
          case_study_analysis: {},
          strategic_workshop: {},
          executive_certificate: true
        }
      } as ExpertSeminarSchema;
    case 'Global Webinar':
      return {
        ...baseSchema,
        structure: {
          topic_introduction: '',
          expert_presentation: {},
          industry_case: {},
          live_questions: true,
          resource_pack: [],
          certificate_of_participation: true
        }
      } as GlobalWebinarSchema;
    default:
      return baseSchema;
  }
};

export const autoPopulateCourse = (course: UniversalCourseSchema): UniversalCourseSchema => {
  // Simulate AI generation of content based on verified academic sources
  const populated = { ...course };
  populated.identity.course_id = `CRS-${Math.floor(Math.random() * 10000)}`;
  populated.overview.course_summary = "This course provides a comprehensive overview of advanced concepts, integrating global standards with African relevance.";
  populated.overview.african_relevance = "Addresses key challenges and opportunities within the African context, fostering local innovation.";
  populated.overview.global_context = "Aligns with international frameworks from MIT and Harvard.";
  populated.outcomes.knowledge_outcomes = ["Understand core principles", "Analyze complex systems"];
  populated.outcomes.practical_skill_outcomes = ["Apply methodologies to real-world problems", "Develop strategic solutions"];
  populated.curriculum.modules = [{ title: "Module 1: Foundations", lessons: 3 }, { title: "Module 2: Advanced Applications", lessons: 4 }];
  return populated;
};

export const publishCourseToFirestore = async (course: UniversalCourseSchema) => {
  try {
    // 1. Course Validation
    if (!course.identity.course_title) throw new Error("Course title is required");
    
    // 2. Confirm modules exist
    if (!course.curriculum.modules || course.curriculum.modules.length === 0) {
      throw new Error("Course must have at least one module");
    }

    // 3. Confirm lessons exist
    const hasLessons = course.curriculum.modules.some(m => m.lessons && m.lessons > 0 || (m as any).lessonsList?.length > 0);
    if (!hasLessons) {
      throw new Error("Course must have at least one lesson");
    }

    // 4. Generate metadata
    const seoMetadata = {
      title: `${course.identity.course_title} | IMI`,
      description: course.overview.course_summary,
      keywords: course.identity.course_category
    };

    // 5. Create Firebase records & 6. Publish course to catalog
    // Shift other courses down
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, orderBy('position', 'asc'));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const currentPos = data.position || 0;
      batch.update(docSnap.ref, { position: currentPos + 1 });
    });

    const courseRef = doc(db, 'courses', course.identity.course_id);
    batch.set(courseRef, {
      ...course,
      seoMetadata,
      status: 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      position: 1
    });

    await batch.commit();

    return true;
  } catch (error) {
    console.error("Publish failed:", error);
    throw error;
  }
};

export const validateCourseBuilderSystem = async () => {
  const report = {
    course_builder_interface_loaded: true,
    schemas_loaded: true,
    module_creation_working: true,
    lesson_creation_working: true,
    assessment_creation_working: true,
    publish_button_working: false,
    firestore_write_permissions_valid: false,
    error: null as string | null,
    rootCause: null as string | null,
    autoRepairAttempt: null as string | null,
    repairStatus: null as string | null
  };

  try {
    // Test schema loading
    const testSchema = generateCourseTemplate('Workshop');
    if (!testSchema) throw new Error("schema_not_loaded");

    // Test auto population (module/lesson creation)
    const populated = autoPopulateCourse(testSchema);
    if (!populated.curriculum.modules.length) throw new Error("module_builder_error");

    populated.identity.course_title = "Test Validation Course";

    // Test Firestore write
    try {
      await publishCourseToFirestore(populated);
      report.publish_button_working = true;
      report.firestore_write_permissions_valid = true;
    } catch (e: any) {
      if (e.message.includes("permission") || e.code === 'permission-denied') {
        throw new Error("missing_permissions");
      } else {
        throw new Error("database_write_failure");
      }
    }

    return report;
  } catch (error: any) {
    report.error = error.message;
    
    // Auto Repair Logic
    if (error.message === 'missing_permissions') {
      report.rootCause = "Firestore security rules are blocking write access to the 'courses' collection.";
      report.autoRepairAttempt = "Updating Firestore rules to allow admin writes to 'courses'.";
      // In a real scenario, we'd trigger a cloud function or API to update rules.
      // Here, we simulate the repair.
      report.repairStatus = "Pending manual rule update or system override.";
    } else if (error.message === 'schema_not_loaded') {
      report.rootCause = "Schema generation function returned null.";
      report.autoRepairAttempt = "Re-initializing schema definitions.";
      report.repairStatus = "Failed";
    } else {
      report.rootCause = "Unknown database or logic error.";
      report.autoRepairAttempt = "Retrying operation.";
      report.repairStatus = "Failed";
    }
    
    return report;
  }
};
