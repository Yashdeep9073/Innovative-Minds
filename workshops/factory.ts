
import { Workshop, TopicModule, Section, QuizQuestion } from '../types';

export const generateId = (category: string, seq: number) => `imi_ws_${category}_${seq.toString().padStart(3, '0')}`;

// Strict: 20 Questions per Cycle
const generateQuiz = (topicTitle: string, sectionContext: string, count: number = 20): QuizQuestion[] => {
  return Array.from({ length: count }, (_, i) => ({
    question: `Assessment Question ${i + 1} for ${sectionContext} of ${topicTitle}`,
    options: [
      "The scientifically proven IMI methodology option.",
      "An outdated or incorrect approach.",
      "A plausible but flawed distractor.",
      "Completely irrelevant information."
    ],
    correctAnswer: 0,
    hint: `Recall the key points discussed in the ${sectionContext} video.`,
    explanation: `Option A aligns with the core learning objectives of ${topicTitle}.`
  }));
};

const generateKeyPoints = (topicTitle: string, sectionContext: string): string[] => {
  return Array.from({ length: 15 }, (_, i) => 
    `Key Insight ${i + 1}: Mastery of ${topicTitle} requires understanding ${sectionContext}.`
  );
};

// New Strict Professional Certificate Factory
export const createProfessionalCertificate = (
  seq: number,
  catCode: string,
  title: string,
  category: string, // Should be "Certificate"
  imageUrl: string,
  description: string
): Workshop => {
  const id = `imi_cert_prof_${seq.toString().padStart(3, '0')}`;
  const topics: TopicModule[] = [];

  // Generate 5 Sequential Topics
  for (let i = 0; i < 5; i++) {
    const topicNum = i + 1;
    const topicTitle = `${title} - Module ${topicNum}`;
    
    topics.push({
      id: `${id}_t${topicNum}`,
      title: topicTitle,
      type: 'mandatory',
      order: topicNum,
      // Item 1: Introductory Notes (Items 2 is embedded as key_points in Section 1 or visualized in UI)
      introductory_notes: `<h3>Module ${topicNum}: Foundation & Advanced Concepts</h3><p>This module provides a rigorous academic examination of ${topicTitle}. Learners will engage with theoretical frameworks, practical applications, and industry-standard case studies.</p><p><strong>Learning Objectives:</strong> By the end of this module, candidates will demonstrate proficiency in critical analysis and strategic implementation.</p>`,
      
      // Item 3, 4, 5 -> Section 1 (Video Lecture)
      section_1: {
        cycle_number: 1,
        title: "Core Lecture Series",
        video: {
          title: `${topicTitle} - Lecture`,
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
          duration: "45:00",
          source_credit: "IMI Academic Archive"
        },
        introductory_notes: "Fundamentals of the discipline.",
        key_points: generateKeyPoints(topicTitle, "Lecture Series"),
        quiz: {
          pass_mark: 76,
          questions: generateQuiz(topicTitle, "Lecture Series", 20),
          randomized: true
        }
      },

      // Item 6, 7, 8 -> Section 2 (Video Seminar)
      section_2: {
        cycle_number: 2,
        title: "Professional Seminar",
        video: {
          title: `${topicTitle} - Seminar`,
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "60:00",
          source_credit: "IMI Industry Panel"
        },
        introductory_notes: "Applied professional practice and case studies.",
        key_points: generateKeyPoints(topicTitle, "Professional Seminar"),
        quiz: {
          pass_mark: 76,
          questions: generateQuiz(topicTitle, "Professional Seminar", 20),
          randomized: true
        }
      },

      // Item 9, 10 -> Section 3 (Revision Video + Final Topic Quiz)
      section_3: {
        cycle_number: 3,
        title: "Revision & Final Assessment",
        video: {
          title: `${topicTitle} - Revision`,
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "20:00",
          source_credit: "IMI Faculty"
        },
        introductory_notes: "Summary of key concepts before final topic assessment.",
        key_points: [], // Revision
        quiz: {
          pass_mark: 76,
          questions: generateQuiz(topicTitle, "Final Topic Assessment", 20),
          randomized: true
        }
      },
      
      revision_notes: "Module complete. Ensure all learning outcomes are met before proceeding.",
      cycles: { cycle_1: {completed:false}, cycle_2: {completed:false}, cycle_3: {completed:false} },
      content_ready: true,
      completion_rule: { cycles_required: 3, minimum_pass_percentage: 76 }
    });
  }

  return {
    id,
    workshop_id: id,
    course_id: id,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    category: "Certificate",
    course_type: "Certificate",
    level: "Professional",
    status: "published",
    image_url: imageUrl,
    search_tags: ["Certificate", "Professional", "Accredited", category],
    content_ready: true,
    presenter: "IMI Senior Faculty",
    date_created: new Date().toISOString(),
    pricing: {
      application_fee: 500,
      workshop_fee: 4500,
      examination_fee: 750,
      scholarship_percentage: 0,
      payment_options: ["pay_now", "pay_later", "partial"]
    },
    certification: {
      attendance_certificate: true,
      exam_required: true,
      certificate_cost: 0,
      type: "IM Certified Professional",
      issued: true
    },
    progression_rules: {
      mandatory_topics: 5,
      elective_topics: 0,
      pass_mark_percentage: 76,
      cycle_repetitions_required: 1
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
    topics_required: { mandatory: 5, electives: 0 },
    workshop_structure: {
      orientation: {
        welcome_message: `Welcome to the ${title} qualification.`,
        how_it_works: "Complete all 5 sequential modules and the final exam.",
        learning_outcomes: ["Professional Competency", "Strategic Leadership", "Applied Technical Skills", "Global Standards Compliance"]
      },
      topics: topics,
      final_exam: {
        question_count: 100,
        pass_mark: 76,
        max_attempts: 3,
        questions: generateQuiz("Final Certification Exam", "Holistic", 100),
        locked_until_payment: true
      },
      certificate_data: {
        enabled: true,
        generation_trigger: "final_exam_pass",
        verification_id: `CERT-${id}-${Date.now()}`,
        qr_code: `QR-${id}`,
        delivery: ["download", "email"]
      }
    }
  };
};

export const createV2Workshop = (
  seq: number, 
  catCode: string, 
  title: string, 
  category: string, 
  imageUrl: string, 
  description: string,
  topicTitlesInput: string[] 
): Workshop => {
  // Legacy factory kept for compatibility, rerouted to simple generator if needed
  // For now, implementing standard V2 as per previous spec
  const id = generateId(catCode, seq);
  const topics: TopicModule[] = [];
  for(let i=0; i<3; i++) {
      // Simple 3 topic generation for legacy workshops
      const tTitle = topicTitlesInput[i] || `${title} Module ${i+1}`;
      topics.push({
          id: `${id}_t${i+1}`,
          title: tTitle,
          type: 'mandatory',
          order: i+1,
          introductory_notes: `Welcome to ${tTitle}.`,
          section_1: { cycle_number: 1, title: "Cycle 1", video: { title: tTitle, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:00", source_credit: "IMI" }, key_points: ["Point 1"], quiz: { pass_mark: 76, questions: [] } },
          section_2: { cycle_number: 2, title: "Cycle 2", video: { title: tTitle, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:00", source_credit: "IMI" }, key_points: ["Point 1"], quiz: { pass_mark: 76, questions: [] } },
          section_3: { cycle_number: 3, title: "Cycle 3", video: { title: tTitle, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:00", source_credit: "IMI" }, key_points: ["Point 1"], quiz: { pass_mark: 76, questions: [] } },
          revision_notes: "Review notes.",
          cycles: { cycle_1: {completed:false}, cycle_2: {completed:false}, cycle_3: {completed:false} },
          content_ready: true
      });
  }

  return {
    id,
    workshop_id: id,
    course_id: id,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    category,
    level: "Intermediate",
    status: "published",
    image_url: imageUrl,
    date_created: new Date().toISOString(),
    content_ready: true,
    search_tags: [category, "Legacy Workshop", title],
    pricing: { application_fee: 350, workshop_fee: 2790, examination_fee: 275, scholarship_percentage: 100, payment_options: [] },
    certification: { attendance_certificate: true, exam_required: true, certificate_cost: 0, type: "Workshop Cert", issued: true },
    progression_rules: { mandatory_topics: 3, elective_topics: 0, pass_mark_percentage: 76, cycle_repetitions_required: 1 },
    ai_features: { personalized_learning: true, auto_content_population: true, performance_analysis: true },
    visibility: { landing_page: true, catalogue: true, search_results: true, student_dashboard: true },
    topics_required: { mandatory: 3, electives: 0 },
    workshop_structure: {
        orientation: { welcome_message: "Welcome", how_it_works: "Complete topics", learning_outcomes: ["Outcome 1"] },
        topics: topics,
        final_exam: { question_count: 50, pass_mark: 76, max_attempts: 2, questions: [] },
        certificate_data: { enabled: true, generation_trigger: "pass", verification_id: "123", qr_code: "123", delivery: [] }
    }
  };
};
