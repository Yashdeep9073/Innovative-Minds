
import { Workshop, TopicModule, Section, QuizQuestion } from '../types';
import { generateId } from '../utils/ids';

// --- VIDEO MAPPING HELPERS ---
const getVideoForCategory = (category: string, topicIndex: number): { url: string, credit: string } => {
  // Curated list of educational channels/playlists by category
  const videos: Record<string, {url: string, credit: string}[]> = {
    'Technology': [
      { url: "https://www.youtube.com/embed/nKIu9yen5nc", credit: "CrashCourse Computer Science" },
      { url: "https://www.youtube.com/embed/AkFzm-kgkQE", credit: "Simplilearn" },
      { url: "https://www.youtube.com/embed/z5Ta30EUEpw", credit: "Techquickie" }
    ],
    'Business': [
      { url: "https://www.youtube.com/embed/M7WfunuQ75Q", credit: "Harvard Business Review" },
      { url: "https://www.youtube.com/embed/HAnw168huqA", credit: "TED-Ed" },
      { url: "https://www.youtube.com/embed/w7g5E6bd-qA", credit: "Startup School" }
    ],
    'Agriculture': [
      { url: "https://www.youtube.com/embed/Q9Z7X5g9g9g", credit: "FAO Video" },
      { url: "https://www.youtube.com/embed/1B6sP3jR8x8", credit: "AgriTech India" },
      { url: "https://www.youtube.com/embed/D36Yp2y_1j0", credit: "Smart Farming" }
    ],
    'Health': [
      { url: "https://www.youtube.com/embed/wO29k6m0p9E", credit: "WHO" },
      { url: "https://www.youtube.com/embed/1i9UPbB7iQI", credit: "CDC" },
      { url: "https://www.youtube.com/embed/0fL-pn80s-c", credit: "Osmosis" }
    ]
  };

  const catVideos = videos[category] || videos['Technology']; // Fallback
  // Rotate through videos based on topic index to avoid repetition
  return catVideos[topicIndex % catVideos.length];
};

// --- CONTENT GENERATORS ---

const generateQuiz = (topicTitle: string, sectionContext: string): QuizQuestion[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    question: `Review Question ${i + 1}: ${sectionContext} concepts in ${topicTitle}?`,
    options: [
      "The strategic implementation of best practices.",
      "An outdated method no longer in use.",
      "A theoretical concept with no application.",
      "Unrelated data points."
    ],
    correctAnswer: 0,
    hint: `Recall the core principles of ${sectionContext}.`,
    explanation: `Option A correctly identifies the standard procedure for ${topicTitle} in this context.`
  }));
};

const generateSection = (topicTitle: string, cycleNum: number, category: string, topicIndex: number): Section => {
  const contexts = ["Fundamentals & Core Concepts", "Practical Application & Strategy", "Advanced Analysis & Case Studies"];
  const context = contexts[cycleNum - 1] || `Cycle ${cycleNum}`;
  const videoData = getVideoForCategory(category, topicIndex + cycleNum); // Offset video per section

  return {
    cycle_number: cycleNum,
    title: `Cycle ${cycleNum}: ${context}`,
    video: {
      title: `${topicTitle}: ${context}`,
      url: videoData.url,
      duration: "15:00",
      source_credit: videoData.credit
    },
    introductory_notes: `<h3>${context}</h3><p>Welcome to Cycle ${cycleNum} of <strong>${topicTitle}</strong>. In this section, we delve deep into the ${context.toLowerCase()}. Understanding this is crucial for mastering the broader subject of ${category}.</p><p>We will examine key methodologies, industry standards, and real-world examples. Please watch the accompanying video lecture and review the 15 key points below before attempting the assessment.</p>`,
    key_points: Array.from({ length: 15 }, (_, i) => `Key Insight ${i + 1}: Critical understanding of ${context} element ${i + 1}.`),
    quiz: {
      pass_mark: 76,
      questions: generateQuiz(topicTitle, context),
      randomized: true
    },
    revision_points: Array.from({ length: 15 }, (_, i) => `Review Point ${i + 1}: Summary of ${context} concept ${i + 1}.`)
  };
};

const generateTopic = (id: string, index: number, title: string, category: string, type: 'mandatory' | 'elective'): TopicModule => {
  return {
    id: `${id}_t${(index + 1).toString().padStart(2, '0')}`,
    title,
    type,
    order: index + 1,
    introductory_notes: `Module Overview: ${title}. This module is designed to provide a comprehensive understanding of ${title} within the context of ${category}. It consists of 3 progressive learning cycles.`,
    section_1: generateSection(title, 1, category, index),
    section_2: generateSection(title, 2, category, index),
    section_3: generateSection(title, 3, category, index),
    revision_notes: `Module Summary: ${title}. You have completed all 3 cycles. Ensure you have mastered the key concepts before proceeding.`,
    cycles: { cycle_1: { completed: false }, cycle_2: { completed: false }, cycle_3: { completed: false } },
    completion_rule: { cycles_required: 3, minimum_pass_percentage: 76 },
    content_ready: true
  };
};

export const createV2Workshop = (
  seq: number, 
  catCode: string, 
  title: string, 
  category: string, 
  imageUrl: string, 
  description: string,
  topicTitles: string[]
): Workshop => {
  const id = generateId(catCode, seq);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Generate 6 Topics (3 Mandatory, 3 Elective)
  // Use provided titles first, then generate generics if list is short
  const topics: TopicModule[] = [];
  for (let i = 0; i < 6; i++) {
    const isMandatory = i < 3;
    const tTitle = topicTitles[i] || `${title} - Module ${i + 1}`;
    topics.push(generateTopic(id, i, tTitle, category, isMandatory ? 'mandatory' : 'elective'));
  }

  return {
    id,
    workshop_id: id,
    course_id: id,
    title,
    slug,
    description,
    category,
    level: "Beginner",
    status: "published",
    image_url: imageUrl,
    promo_video_url: getVideoForCategory(category, 0).url,
    search_tags: [category, "IMI", "Certification", "Skills", title.toLowerCase()],
    
    pricing: {
        application_fee: 350,
        workshop_fee: 2790,
        examination_fee: 275,
        scholarship_percentage: 100,
        payment_options: ["pay_now", "pay_later", "partial", "pay_own_amount"]
    },
    certification: {
        attendance_certificate: true,
        exam_required: true,
        certificate_cost: 0,
        type: "IMI Workshop Certificate",
        issued: true
    },
    progression_rules: {
        mandatory_topics: 3,
        elective_topics: 3,
        pass_mark_percentage: 76,
        cycle_repetitions_required: 3
    },
    ai_features: {
        personalized_learning: true,
        auto_content_population: true,
        performance_analysis: true
    },
    visibility: {
        landing_page: true,
        catalogue: true,
        search_results: true,
        student_dashboard: true
    },
    content_ready: true,
    presenter: "IMI Faculty",
    date_created: new Date().toISOString(),
    durationMinutes: 180,
    
    workshop_structure: {
        orientation: {
            welcome_message: `Welcome to the ${title} certification program.`,
            how_it_works: "Complete 3 Mandatory and 3 Elective topics. Pass all quizzes with 76% or higher.",
            learning_outcomes: ["Core Competency", "Practical Skills", "Strategic Understanding", "Industry Readiness"]
        },
        topics: topics,
        final_exam: {
            question_count: 50,
            pass_mark: 76,
            max_attempts: 2,
            questions: generateQuiz("Final Exam", "Comprehensive"),
            locked_until_payment: true
        },
        certificate_data: {
            enabled: true,
            generation_trigger: "final_exam_pass",
            verification_id: `VER-${id}`,
            qr_code: `QR-${id}`,
            delivery: ["download"]
        }
    },
    marketing: {
        hero_headline: title,
        hero_subheadline: "Master professional skills with IMI.",
        why_this_course: "Industry relevant and accredited.",
        what_you_will_gain: ["Certificate", "Skills", "Network"],
        target_audience: ["Everyone"],
        career_teaser: "Boost your CV.",
        urgency_msg: "Enrollment Open"
    }
  };
};

export const createSmartCourse = (seq: number, category: string, title: string): Workshop => {
    return createV2Workshop(seq, 'GEN', title, 'Workshop', 'https://via.placeholder.com/800', 'Generated Course', []);
};
