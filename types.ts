
export type UserRole = 'guest' | 'student' | 'admin' | 'university' | 'partner' | 'government';

export interface User {
  id: string; // Firebase UID
  name: string;
  email?: string;
  role: UserRole;
  institution?: string;
  permissions?: {
    course_builder: boolean;
    admin_dashboard: boolean;
    content_management: boolean;
    user_management: boolean;
    financial_overview: boolean;
  };
  passkey?: string;
  selectedPortal?: string;
  studentNumber?: string;
  points?: number;
  badges?: string[];
  enrolledCourses?: string[];
  progress?: Record<string, number>;
  createdAt?: any;
  phoneNumber?: string;
  organization?: string;
  settings?: StudentSettings;
  academicStanding?: 'Good Standing' | 'At Risk' | 'Honors Track';
  gpa?: number;
  programName?: string;
}

export interface StudentSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'normal' | 'large';
  };
  language: string;
}

export type PaymentProvider = 'stripe' | 'flutterwave' | 'dpo' | 'manual';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  date: string;
  status: PaymentStatus;
  description: string;
  invoiceId: string;
  receiptUrl?: string;
  provider?: PaymentProvider;
  transactionId?: string;
  workshopId?: string;
  type?: 'course_fee' | 'exam_fee';
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  workshopId: string;
  workshopName: string;
  issuedDate: string;
  verificationCode: string;
  url: string;
  grade?: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'high' | 'normal' | 'low';
  author: string;
  read?: boolean;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

// --- IMI V2 SCHEME INTERFACES ---

export type VideoProvider = 'youtube' | 'vimeo' | 'cloudflare';

export interface VideoObject {
  title: string;
  url: string;
  duration: string;
  source_credit: string;
  provider?: VideoProvider;
  videoId?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
}

export interface TopicQuiz {
  pass_mark: number; // Strict 76%
  questions: QuizQuestion[]; // 20 questions
  randomized?: boolean;
}

export interface Section {
  // Acts as "Cycle"
  title?: string;
  cycle_number?: number;
  video: VideoObject;
  introductory_notes?: string; // Specific notes for this cycle
  key_points: string[]; // 15 points
  quiz: TopicQuiz;
  revision_points?: string[]; // 15 revision points
}

export interface TopicModule {
  id: string;
  title: string;
  type: 'mandatory' | 'elective';
  order: number;
  
  introductory_notes: string; // Global topic intro
  
  // The 3 Learning Cycles
  section_1: Section; // Cycle 1
  section_2: Section; // Cycle 2
  section_3: Section; // Cycle 3
  
  revision_notes: string; // Global topic summary
  
  cycles?: {
    cycle_1: { completed: boolean };
    cycle_2: { completed: boolean };
    cycle_3: { completed: boolean };
  };
  
  completion_rule?: {
    cycles_required: number; // 3
    minimum_pass_percentage: number; // 76
  };
  
  content_ready?: boolean;
}

export interface FinalExam {
  question_count: number; // 50
  pass_mark: number; // 76
  max_attempts: number; // 2
  questions: QuizQuestion[];
  locked_until_payment?: boolean;
}

export interface CertificateData {
  enabled: boolean;
  generation_trigger: string;
  verification_id: string;
  qr_code: string;
  delivery: string[];
}

export interface WorkshopStructure {
  orientation: {
    welcome_message: string;
    how_it_works: string;
    learning_outcomes: string[];
  };
  topics: TopicModule[];
  final_exam: FinalExam;
  certificate_data: CertificateData;
  promo_video_url?: string;
  key_benefits?: string[];
  certificate_advantages?: string[];
  next_recommendations?: string[];
}

export interface MarketingData {
  hero_headline: string;
  hero_subheadline: string;
  why_this_course: string;
  what_you_will_gain: string[];
  target_audience: string[];
  career_teaser: string;
  urgency_msg: string;
}

export interface LMSConfig {
  enable_learning_path: boolean;
  enable_ai_guidance: boolean;
  enable_skills_map: boolean;
  enable_peer_learning: boolean;
  skills_taught: string[];
}

// --- STRICT ENUMS ---
export type CourseType = 'Workshop' | 'Seminar' | 'Webinar' | 'Certificate' | 'Degree' | 'Masters';
export type CourseCategory = 'Technology' | 'Business' | 'Agriculture' | 'Health' | 'Education' | 'Innovation' | 'Cybersecurity' | 'Data Science' | 'Engineering' | 'Social Sciences' | 'Workshop';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
export type CourseStatus = 'draft' | 'published' | 'archived' | 'pending_review';

export interface Instructor {
  id?: string;
  name: string;
  bio: string;
  image_url?: string;
  credentials?: string[];
}

export interface Workshop {
  id: string;
  workshop_id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  course_type?: CourseType;
  level: string;
  status: string;
  visible?: boolean;

  search_tags: string[];
  image_url: string;
  promo_video_url?: string;

  workshop_structure?: WorkshopStructure;
  date_created: any;
  created_at?: any;
  updated_at?: any;
  created_by?: string;

  content_ready: boolean;
  presenter?: string;
  instructor?: Instructor;
  durationMinutes?: number;

  price?: number;
  currency?: string;
  isPremium?: boolean;

  pricing: {
    application_fee: number;
    workshop_fee: number;
    examination_fee: number;
    scholarship_percentage: number;
    payment_options: string[];
  };
  certification: {
    attendance_certificate: boolean;
    exam_required: boolean;
    certificate_cost: number;
    type?: string;
    issued?: boolean;
  };
  progression_rules: {
    mandatory_topics: number;
    elective_topics: number;
    pass_mark_percentage: number;
    cycle_repetitions_required: number;
  };
  ai_features: {
    personalized_learning: boolean;
    auto_content_population: boolean;
    performance_analysis: boolean;
  };
  visibility: {
    landing_page: boolean;
    catalogue: boolean;
    search_results: boolean;
    student_dashboard: boolean;
  };

  version?: number;
  marketing?: MarketingData;
  marketing_cta?: string;
  lms_config?: LMSConfig;
  
  topics_required?: { mandatory: number; electives: number }; 
}

// PROGRESSION TRACKING
export interface TopicProgress {
  introViewed: boolean;
  section1Score: number;
  section2Score: number;
  section3Score: number;
  revisionViewed: boolean;
  completed: boolean;
}

export interface Enrollment {
  id: string;
  enrollment_id?: string;
  userId: string;
  user_id?: string;
  workshopId: string;
  workshop_id?: string;
  course_title?: string;
  category?: string;
  status: 'draft' | 'pending_payment' | 'pending_review' | 'in_progress' | 'completed' | 'dropped' | 'rejected' | 'enrolled';
  payment_status: 'unpaid' | 'paid';
  exam_payment_status: 'unpaid' | 'paid';
  exam_status?: 'locked' | 'unlocked' | 'passed' | 'failed';
  progressData: Record<string, TopicProgress>;
  currentTopicIndex: number;
  enrolledAt: any;
  enrolled_at?: any;
  progress: number;
  lastAccessed?: any;
  workshop?: Workshop;
  certificate_issued?: boolean;
  certificateId?: string;
  certificate_url?: string;
  applicationData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dob?: string;
    qualification?: string;
    employment?: string;
    scholarshipRequested?: boolean;
    scholarshipReason?: string;
  }
}

export interface ScholarshipApplication {
  id?: string;
  userId: string;
  enrollmentId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
}

export interface ChatInteraction {
  id?: string;
  userId: string;
  context: string;
  messages: { role: 'user' | 'ai'; text: string; timestamp: any }[];
  createdAt: any;
}

export interface ExamAttempt {
  id: string;
  exam_id?: string;
  userId: string;
  user_id?: string;
  enrollmentId: string;
  workshopId: string;
  workshop_id?: string;
  score: number;
  passed: boolean;
  completedAt: string;
  answers: Record<number, number>;
  status?: 'locked' | 'unlocked' | 'completed';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Workshop' | 'Certificate' | 'Diploma' | 'Degree' | 'Masters' | 'PhD';
  category: string;
  thumbnail: string;
  modules: CourseModule[];
  outcomes: string[];
  source?: string;
  ownerId?: string;
  published?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  videoUrl: string;
  content: string;
  quizzes: SimpleQuizQuestion[];
}

export interface SimpleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  ownerId: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileUrl?: string;
  content?: string;
  grade?: number;
  feedback?: string;
  submittedAt: any;
}

export interface AnalyticsData {
  studentsEnrolled: number;
  activeLearners: number;
  completionRate: number;
  revenue: number;
  monthlyGrowth: number[];
}

export interface LiveWorkshop {
  id: string;
  title: string;
  date: string;
  presenter: string;
  image: string;
}
