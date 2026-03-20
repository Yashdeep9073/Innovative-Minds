// IMI COURSE BUILDER SCHEMA DEPLOYMENT

export interface CourseIdentityLayer {
  course_id: string;
  course_title: string;
  course_type: 'Workshop' | 'Professional Certification' | 'Bachelor Degree' | 'Master Degree' | 'Expert Seminar' | 'Global Webinar';
  course_category: string;
  course_level: string;
  course_duration: string;
  credit_hours: number;
  accreditation_status: string;
  delivery_mode: string;
  language: string;
  region_focus: string;
}

export interface CourseOverviewLayer {
  course_summary: string;
  african_relevance: string;
  global_context: string;
  career_outcomes: string[];
  skills_gained: string[];
  industry_alignment: string;
}

export interface LearningOutcomesFramework {
  knowledge_outcomes: string[];
  practical_skill_outcomes: string[];
  professional_competencies: string[];
  innovation_capabilities: string[];
}

export interface CurriculumStructure {
  modules: any[]; // Will be defined more specifically per type
  units: number;
  lessons: number;
  learning_materials: string[];
  video_content: boolean;
  reading_material: boolean;
  case_study: boolean;
  practical_activity: boolean;
  discussion_questions: boolean;
}

export interface RetentionEngine {
  interactive_elements: boolean;
  quizzes: boolean;
  peer_reviews: boolean;
  group_collaboration: boolean;
  discussion_boards: boolean;
  achievement_badges: boolean;
  leaderboards: boolean;
  progress_tracking: boolean;
}

export interface AssessmentFramework {
  formative_assessments: boolean;
  summative_assessments: boolean;
  assignments: boolean;
  final_exam: boolean;
  capstone_project: boolean;
  industry_case_study: boolean;
}

export interface CertificationLayer {
  certificate_type: string;
  credential_level: string;
  issuing_institution: string;
  verification_method: string;
  digital_badge: boolean;
}

export interface AnalyticsLayer {
  completion_rate: number;
  engagement_score: number;
  quiz_performance: number;
  time_on_content: number;
  dropout_prediction: number;
  skill_progression: number;
}

export interface UniversalCourseSchema {
  identity: CourseIdentityLayer;
  overview: CourseOverviewLayer;
  outcomes: LearningOutcomesFramework;
  curriculum: CurriculumStructure;
  retention: RetentionEngine;
  assessment: AssessmentFramework;
  certification: CertificationLayer;
  analytics: AnalyticsLayer;
}

// Specific Course Types

export interface WorkshopSchema extends UniversalCourseSchema {
  structure: {
    overview: string;
    learning_objectives: string[];
    module_1: any;
    module_2: any;
    hands_on_activity: string;
    live_demo: string;
    qa_session: string;
    certificate_of_completion: boolean;
  }
}

export interface ProfessionalCertificationSchema extends UniversalCourseSchema {
  structure: {
    foundation_modules: any[];
    core_modules: any[];
    industry_application: string;
    case_studies: string[];
    practical_assignments: any[];
    capstone_project: any;
    certification_exam: any;
  }
}

export interface BachelorDegreeSchema extends UniversalCourseSchema {
  structure: {
    year_1: {
      semester_1: any[];
      semester_2: any[];
    };
    year_2: {
      semester_3: any[];
      semester_4: any[];
    };
    year_3: {
      semester_5: any[];
      semester_6: any[];
    };
    industry_internship: any;
    research_project: any;
    capstone_thesis: any;
  }
}

export interface MasterDegreeSchema extends UniversalCourseSchema {
  structure: {
    year_1: {
      advanced_coursework: any[];
      research_methodology: any;
      specialized_electives: any[];
    };
    year_2: {
      applied_research: any;
      innovation_project: any;
      masters_thesis: any;
    };
  }
}

export interface ExpertSeminarSchema extends UniversalCourseSchema {
  structure: {
    keynote_lecture: any;
    expert_panel: any;
    case_study_analysis: any;
    strategic_workshop: any;
    executive_certificate: boolean;
  }
}

export interface GlobalWebinarSchema extends UniversalCourseSchema {
  structure: {
    topic_introduction: string;
    expert_presentation: any;
    industry_case: any;
    live_questions: boolean;
    resource_pack: string[];
    certificate_of_participation: boolean;
  }
}
