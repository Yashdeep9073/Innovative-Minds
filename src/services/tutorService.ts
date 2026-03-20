
import { ZAMBIAN_UNIVERSITIES } from '../data/universities';
import { TutorRequest, University } from '../types';

export const getUniversities = async (): Promise<University[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ZAMBIAN_UNIVERSITIES);
    }, 500);
  });
};

export const submitTutorRequest = async (data: Omit<TutorRequest, 'id' | 'status' | 'matchedTutorId' | 'matchedTutorName' | 'timestamp'>): Promise<TutorRequest> => {
  // Simulate processing time
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: TutorRequest = {
        id: `req-${Date.now()}`,
        ...data,
        status: 'matched',
        matchedTutorId: 'imi_virtual_tutor',
        matchedTutorName: 'IMI Virtual Academic Tutor',
        timestamp: new Date()
      };
      
      // Save to localStorage for demo persistence
      localStorage.setItem('lastTutorRequest', JSON.stringify(result));
      
      resolve(result);
    }, 3000);
  });
};
