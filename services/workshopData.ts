
import { Workshop, TopicModule, Section, QuizQuestion } from '../types';

// --- V2 CONTENT GENERATOR HELPERS ---

// 1. Generate unique Workshop ID
const generateId = (category: string, seq: number) => `imi_ws_${category}_${seq.toString().padStart(3, '0')}`;

// 2. Generate a strict 15-question quiz
const generateQuiz = (topicTitle: string, sectionContext: string): QuizQuestion[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    question: `Assessment Question ${i + 1} regarding ${topicTitle} (${sectionContext})`,
    options: [
      "The correct strategic approach aligning with IMI standards.",
      "An outdated method that ignores modern efficiency.",
      "A theoretically possible but practically flawed option.",
      "Irrelevant information distinct from the core concept."
    ],
    correctAnswer: 0,
    hint: `Recall the key principles discussed in the ${sectionContext} video lecture.`,
    explanation: `Option A is correct because it directly addresses the core requirements of ${topicTitle} within the IMI framework.`
  }));
};

// 3. Generate exactly 15 key points
const generateKeyPoints = (topicTitle: string, sectionContext: string): string[] => {
  return Array.from({ length: 15 }, (_, i) => 
    `Critical Insight ${i + 1}: Understanding the nuance of ${topicTitle} is essential for ${sectionContext} mastery.`
  );
};

// 4. Generate a Topic Section (Video + 15 Points + 15 Qs)
const generateSection = (topicTitle: string, sectionIndex: number): Section => {
  const contexts = ["Fundamentals", "Advanced Application", "Case Studies & Analysis"];
  const context = contexts[sectionIndex] || `Part ${sectionIndex + 1}`;
  
  return {
    video: {
      title: `${topicTitle}: ${context}`,
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder educational embed
      duration: "15:00",
      source_credit: "IMI Global Academic Archive"
    },
    key_points: generateKeyPoints(topicTitle, context),
    quiz: {
      pass_mark: 80,
      questions: generateQuiz(topicTitle, context)
    }
  };
};

// 5. Generate a full Topic Module (3 Sections + Notes)
const generateTopic = (workshopId: string, topicIndex: number, topicTitle: string): TopicModule => {
  return {
    id: `${workshopId}_t${(topicIndex + 1).toString().padStart(2, '0')}`,
    title: topicTitle,
    type: 'mandatory',
    order: topicIndex + 1,
    introductory_notes: `Welcome to Module ${topicIndex + 1}: ${topicTitle}. \n\nIn this comprehensive module, learners will explore the foundational and advanced elements necessary for mastery. This section is designed to bridge the gap between theoretical knowledge and practical application. (Placeholder text: The IMI curriculum emphasizes a robust understanding of core principles. Expect to cover approximately 300-500 words of detailed academic context here, setting the stage for the three intensive sections that follow. We will examine historical context, current industry standards, and future trends relevant to this specific topic.)\n\nKey themes include innovation, sustainability, and digital transformation. Prepare to engage with multimedia content and rigorous assessments.`,
    section_1: generateSection(topicTitle, 0),
    section_2: generateSection(topicTitle, 1),
    section_3: generateSection(topicTitle, 2),
    revision_notes: `Module Summary: ${topicTitle}. \n\nTo consolidate your learning, review the three key pillars discussed: Fundamentals, Application, and Analysis. (Placeholder text: This 200-300 word summary encapsulates the critical takeaways. Remember to revisit the key points lists from each section. Mastery of these concepts is required before proceeding to the next topic. Ensure you have passed all section quizzes with at least 80% proficiency.)`
  };
};

// 6. Master Workshop Factory
const createV2Workshop = (
  seq: number, 
  catCode: string, 
  title: string, 
  category: string, 
  imageUrl: string, 
  description: string,
  topicTitles: string[]
): Workshop => {
  const id = generateId(catCode, seq);
  
  // Ensure exactly 5 topics
  if (topicTitles.length !== 5) throw new Error(`Workshop ${title} must have exactly 5 topic titles.`);

  const topics = topicTitles.map((t, i) => generateTopic(id, i, t));

  return {
    id,
    workshop_id: id,
    course_id: id,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description,
    category,
    search_tags: [category, "IMI Certificate", "Professional Skills", "Global Education", "Future of Work"],
    level: "Intermediate",
    image_url: imageUrl,
    status: "live",
    content_ready: true,
    presenter: "IMI Faculty & Industry Partners",
    date_created: new Date().toISOString(),
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
      type: "attendance + exam",
      issued: true
    },
    progression_rules: {
      mandatory_topics: 5,
      elective_topics: 0,
      pass_mark_percentage: 80,
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
    topics_required: {
      mandatory: 5,
      electives: 0
    },
    workshop_structure: {
      orientation: {
        welcome_message: `Welcome to the ${title} certification program. We are thrilled to have you join the IMI global community.`,
        how_it_works: "This workshop consists of 5 sequential topics. Each topic has 3 sections. You must pass all quizzes to unlock the Final Exam.",
        learning_outcomes: [
          "Demonstrate comprehensive understanding of core principles.",
          "Apply theoretical knowledge to real-world scenarios.",
          "Analyze complex problems using IMI frameworks.",
          "Innovate solutions within the specific industry context."
        ]
      },
      topics: topics,
      final_exam: {
        question_count: 60,
        pass_mark: 85,
        max_attempts: 2,
        questions: Array.from({ length: 60 }, (_, i) => ({
          question: `Final Exam Question ${i + 1}: Comprehensive Scenario Analysis`,
          options: ["Strategic Alignment", "Operational Efficiency", "Risk Mitigation", "Innovation Catalyst"],
          correctAnswer: 0,
          hint: "Consider the holistic view of the workshop material.",
          explanation: "This answer integrates concepts from all 5 topics."
        }))
      },
      certificate_data: {
        enabled: true,
        generation_trigger: "final_exam_pass",
        verification_id: "UUID-PLACEHOLDER",
        qr_code: "QR-PLACEHOLDER",
        delivery: ["download", "email"]
      }
    }
  };
};

// --- AI PLACEHOLDER GENERATOR ---
export const generatePlaceholderWorkshops = (category: string): Workshop[] => {
  const topics: Record<string, string[]> = {
    'Technology': ['Quantum Computing Basics', 'IoT Infrastructure', '5G Network Deployment', 'Ethical Hacking 101'],
    'Business': ['Global Supply Chain Mgmt', 'Startup Valuation', 'Corporate Governance', 'Digital Marketing Trends'],
    'Agriculture': ['Vertical Farming Systems', 'Drought Resistant Crops', 'Agri-Tech Robotics', 'Sustainable Soil Mgmt'],
    'Health': ['Telemedicine Protocols', 'Public Health Data', 'Epidemiology Basics', 'Nutrition & Wellness'],
    'Education': ['Gamification in Learning', 'EdTech Integration', 'Special Needs Support', 'Curriculum Design AI'],
    'Cybersecurity': ['Zero Trust Architecture', 'Ransomware Defense', 'Cloud Security Ops', 'Forensic Analysis'],
    'Data Science': ['Predictive Analytics', 'Big Data Visualization', 'Machine Learning Ops', 'Python for Finance'],
    'Engineering': ['Renewable Energy Grids', 'Civil Infrastructure', 'Robotics Engineering', '3D Printing Cad'],
    'Social Sciences': ['Urban Sociology', 'Psychology of Work', 'Global Politics', 'Community Development'],
    'Innovation': ['Design Thinking', 'Lean Startup', 'Patent Law', 'Venture Capital']
  };

  const categoryTopics = topics[category] || [`Future of ${category}`, `Advanced ${category}`, `${category} Fundamentals`, `Global ${category} Trends`];

  return categoryTopics.map((title, i) => ({
    id: `ai-gen-${category}-${i}`,
    workshop_id: `ai-gen-${category}-${i}`,
    course_id: `ai-gen-${category}-${i}`,
    title: title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `AI-Synthesized Curriculum: This course content is being actively generated based on real-time analysis of 2025 industry trends in ${category}. Full modules will be available shortly.`,
    category: category,
    level: i % 2 === 0 ? 'Intermediate' : 'Beginner',
    durationMinutes: 60 + (i * 30),
    image_url: `https://source.unsplash.com/800x600/?${category.toLowerCase()},${title.split(' ')[0].toLowerCase()}&sig=${i}`,
    status: 'published',
    visible: true,
    content_ready: false,
    presenter: 'AI Instructor',
    date_created: new Date().toISOString(),
    search_tags: [category, 'AI Generated', 'Coming Soon'],
    pricing: {
      application_fee: 0,
      workshop_fee: 0,
      examination_fee: 0,
      scholarship_percentage: 0,
      payment_options: []
    },
    certification: {
      attendance_certificate: false,
      exam_required: false,
      certificate_cost: 0,
      type: "none",
      issued: false
    },
    progression_rules: {
      mandatory_topics: 0,
      elective_topics: 0,
      pass_mark_percentage: 0,
      cycle_repetitions_required: 0
    },
    ai_features: {
      personalized_learning: false,
      auto_content_population: true,
      performance_analysis: false
    },
    visibility: {
      landing_page: true,
      catalogue: true,
      search_results: true,
      student_dashboard: true
    },
    topics_required: {
      mandatory: 0,
      electives: 0
    },
    workshop_structure: {
        orientation: { welcome_message: 'Content generating...', how_it_works: 'AI is building this course.', learning_outcomes: [] },
        topics: [],
        final_exam: { question_count: 0, pass_mark: 0, max_attempts: 0, questions: [] },
        certificate_data: { enabled: false, generation_trigger: '', verification_id: '', qr_code: '', delivery: [] }
    }
  } as Workshop));
};

// --- RECONSTRUCTION UTILITY ---
export const reconstructWorkshopFromId = (id: string): Workshop | null => {
  // Expected format: ai-gen-CATEGORY-INDEX
  const parts = id.split('-');
  if (parts.length < 4 || parts[0] !== 'ai' || parts[1] !== 'gen') return null;

  // Re-assemble category (it might contain dashes, but our simple logic assumed no dashes in category keys)
  // Let's assume standard single-word categories or specific ones handled in the generator
  const category = parts[2];
  const index = parseInt(parts[parts.length - 1], 10);

  if (!category || isNaN(index)) return null;

  const items = generatePlaceholderWorkshops(category);
  // Find the exact match by ID to ensure consistency
  const match = items.find(w => w.id === id);
  
  if (match) {
      // Enhance it slightly to be more "Real" for persistence
      return {
          ...match,
          status: 'published',
          visible: true,
          content_ready: true, // Allow interaction
          workshop_structure: {
              ...match.workshop_structure,
              orientation: {
                  welcome_message: `Welcome to ${match.title}`,
                  how_it_works: "This AI-generated course adapts to your learning pace.",
                  learning_outcomes: ["Concept Mastery", "Applied Skills", "Strategic Insight"]
              },
              // Inject a dummy topic so the Player doesn't crash
              topics: [
                  generateTopic(match.id, 0, "Introduction (AI Generated)")
              ]
          }
      };
  }
  
  return null;
};
