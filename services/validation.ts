
import { Workshop, TopicModule, Section, QuizQuestion } from '../types';

export const validateWorkshop = (data: any): Workshop | null => {
  if (!data) {
    console.warn("Validation Failed: Data is null or undefined");
    return null;
  }

  // 1. Required Top-Level Fields for V2 Schema
  const hasRequiredFields =
    typeof data.id === "string" &&
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    data.workshop_structure !== undefined;

  if (!hasRequiredFields) {
    console.warn(`Validation Failed: Missing required V2 fields for workshop ${data.id || 'unknown'}`);
    return null;
  }

  // 2. Validate Workshop Structure
  const structure = data.workshop_structure;
  if (!structure.topics || !Array.isArray(structure.topics) || structure.topics.length !== 5) {
      console.warn(`Validation Failed: Workshop must have exactly 5 topics. Found: ${structure.topics?.length}`);
      // return null; // strict mode
  }

  // 3. Validate Topics Deeply
  const validTopics = structure.topics.every((topic: TopicModule, index: number) => {
    const hasSections = topic.section_1 && topic.section_2 && topic.section_3;
    if (!hasSections) {
        console.warn(`Validation Failed: Topic ${index} missing required sections.`);
        return false;
    }
    
    // Validate Section 1 Content (Sample check)
    const validSec1 = validateSection(topic.section_1);
    if (!validSec1) console.warn(`Validation Failed: Topic ${index} Section 1 invalid.`);
    
    return hasSections && validSec1;
  });

  if (!validTopics) return null;

  return data as Workshop;
};

const validateSection = (section: Section): boolean => {
    return (
        !!section.video && 
        typeof section.video.url === 'string' &&
        Array.isArray(section.key_points) &&
        !!section.quiz &&
        Array.isArray(section.quiz.questions)
    );
};
