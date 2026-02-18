
import { Workshop } from '../types';
import { coreWorkshops } from './modules/core-collection';

// SINGLE SOURCE OF TRUTH
// We export the 10 core workshops.
// Any AI-generated placeholders can be appended here if needed, but for now we enforce the Core 10.

export const WORKSHOPS: Workshop[] = [
  ...coreWorkshops
];

// Helper to get all workshops
export const getAllWorkshops = (): Workshop[] => {
  return WORKSHOPS;
};

// Helper to get a specific workshop by ID
export const getWorkshopById = (id: string): Workshop | undefined => {
  return WORKSHOPS.find(w => w.id === id || w.course_id === id);
};
