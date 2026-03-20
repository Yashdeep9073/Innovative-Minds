
import { createProfessionalCertificate } from '../factory';
import { Workshop } from '../../types';

export const certificatesCollection: Workshop[] = [
  createProfessionalCertificate(
    1, 'ENG', 'IM Certified Engineer', 'Engineering', 
    'https://picsum.photos/seed/engineer/800/600', 
    'Professional certification for engineers focusing on modern standards.'
  ),
  createProfessionalCertificate(
    2, 'ELEC', 'IM Certified Electrical Technician', 'Electrical', 
    'https://picsum.photos/seed/electrician/800/600', 
    'Certification for electrical technicians in industrial environments.'
  ),
  createProfessionalCertificate(
    3, 'EDUC', 'IM Certified Educator', 'Education', 
    'https://picsum.photos/seed/educator/800/600', 
    'Advanced certification for digital-age educators.'
  )
];
