
import { WorkshopStructure } from '../../types';
import { AGRICULTURE_CONTENT } from './categories/agriculture';
import { TECHNOLOGY_CONTENT } from './categories/technology';

/**
 * CONTENT INJECTOR REPOSITORY
 * Aggregates specific content from category files.
 */

// Basic Business Content (Inline for brevity, would be in categories/business.ts)
const BUSINESS_CONTENT: Record<string, Partial<WorkshopStructure>> = {
  "Entrepreneurship Mindset Bootcamp": {
    orientation: {
        welcome_message: "Build Your Business in Zambia.",
        how_it_works: "From idea to IPO: A guide for African entrepreneurs.",
        learning_outcomes: ["Registering with PACRA", "Tax compliance with ZRA", "Pitching to investors"]
    },
    topics: [] // Will fallback to smart factory
  }
};

export const CONTENT_INJECTOR: Record<string, Partial<WorkshopStructure>> = {
  ...AGRICULTURE_CONTENT,
  ...TECHNOLOGY_CONTENT,
  ...BUSINESS_CONTENT
};
