
import { AcademicProgram, Workshop } from '../types';

export const mapProgramToWorkshop = (program: AcademicProgram): Workshop => {
  // Normalize category to match LandingPage/WorkshopsPage filters
  const levelMap: Record<string, string> = {
    'workshop': 'Workshop',
    'diploma': 'Certificate', // Mapping diploma to Certificate for UI consistency
    'degree': 'Degree',
    'masters': 'Masters'
  };

  return {
    id: program.id,
    workshop_id: program.id,
    course_id: program.id,
    title: program.title,
    slug: program.slug,
    description: program.marketing_description || program.ai_suggested_description || "No description available.",
    category: levelMap[program.level_id] || 'Workshop',
    level: "Advanced",
    status: program.status,
    visible: program.status === 'published',
    search_tags: program.keywords || [],
    image_url: "https://images.unsplash.com/photo-1523050335392-9ae867749297?q=80&w=2070",
    date_created: program.created_at,
    content_ready: true,
    marketing: {
      hero_headline: program.title,
      hero_subheadline: program.marketing_description || program.ai_suggested_description || "Master this subject with IMI's expert-led curriculum.",
      what_you_will_gain: program.career_pathways || program.ai_suggested_career_paths || [],
      urgency_msg: "Institutional intake in progress. Apply now."
    },
    pricing: {
      application_fee: 0,
      workshop_fee: 0,
      examination_fee: 0,
      scholarship_percentage: 0,
      payment_options: []
    },
    certification: {
      attendance_certificate: true,
      exam_required: true,
      certificate_cost: 0
    },
    progression_rules: {
      mandatory_topics: 0,
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
    }
  };
};
