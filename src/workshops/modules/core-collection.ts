
import { createV2Workshop } from '../factory';
import { Workshop } from '../../types';

export const coreWorkshops: Workshop[] = [
  createV2Workshop(
    2, 'DIGI', 'Digital Parenting in the Modern World', 'Parenting', 
    'https://picsum.photos/seed/parenting/800/600', 
    'A guide for parents to navigate the digital landscape with their children.',
    ['Screen Time Management', 'Online Safety for Kids', 'Digital Literacy for Parents']
  ),
  createV2Workshop(
    3, 'COMP', 'Computer Basics for Beginners', 'Technology', 
    'https://picsum.photos/seed/computer/800/600', 
    'Master the fundamentals of using a computer and common software.',
    ['Hardware Overview', 'Operating Systems', 'Internet Basics']
  ),
  createV2Workshop(
    4, 'MARK', 'Digital Marketing Basics', 'Business', 
    'https://picsum.photos/seed/marketing/800/600', 
    'Learn how to sell products and services online effectively.',
    ['Social Media Marketing', 'SEO Fundamentals', 'Email Campaigns']
  )
];
