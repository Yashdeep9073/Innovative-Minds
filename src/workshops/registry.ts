
import { Workshop } from '../types';
import { onlineFraudWorkshop } from './modules/online-fraud';
import { coreWorkshops } from './modules/core-collection';
import { certificatesCollection } from './modules/certificates';

// Combine standalone modules, collections, and the 20 Professional Certificates
export const WORKSHOPS: Workshop[] = [
  onlineFraudWorkshop,
  ...coreWorkshops,
  ...certificatesCollection
];

// Helper to get all workshops
export const getAllWorkshops = (): Workshop[] => {
  return WORKSHOPS;
};

// Helper to get a specific workshop by ID
export const getWorkshopById = (id: string): Workshop | undefined => {
  return WORKSHOPS.find(w => w.id === id || w.course_id === id);
};
