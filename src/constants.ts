import { Course, AnalyticsData, LiveWorkshop } from './types';

export const COLORS = {
  primary: '#D62828',
  secondary: '#FFFFFF',
  accent: '#000000',
  gray: '#F3F4F6',
};

// Mapped images matching user's uploaded concepts
const IMAGES = {
  farming: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?q=80&w=1000', // Tractor
  robotics: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000', // Robot Arm
  accountant: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000', // ACCA/Accounting
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000', // Cyber Security
  carpentry: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1000', // Carpenter
  gov: 'https://images.unsplash.com/photo-1541872703-74c5e12be979?q=80&w=1000', // Gov Services
  graduate: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000', // Hero Graduate
  path: 'https://images.unsplash.com/photo-1476900966801-4830140be090?q=80&w=1000', // Life Path
  family: 'https://images.unsplash.com/photo-1509062522246-37559cc79276?q=80&w=1000', // Family Learning
  logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' // Placeholder for IMI Logo Concept
};

export const MOCK_ANALYTICS: AnalyticsData = {
  studentsEnrolled: 15420,
  activeLearners: 8900,
  completionRate: 82.5,
  revenue: 2800000,
  monthlyGrowth: [400, 650, 900, 1400, 1800, 2400]
};

export const LIVE_WORKSHOPS: LiveWorkshop[] = [
  { id: 'w1', title: 'Life After School: Career Guidance', date: '2023-11-20', presenter: 'Dr. Mwale', image: IMAGES.path },
  { id: 'w2', title: 'Digital Family Learning', date: '2023-11-25', presenter: 'Sarah Johnson', image: IMAGES.family },
  { id: 'w3', title: 'Government Online Services', date: '2023-12-01', presenter: 'Hon. Minister', image: IMAGES.gov },
];

export const PARTNERS = [
  'CT University (India)',
  'African Union – EU GreenTech',
  'UNESCO Digital Learning Network',
  'Zambian Higher Education Authority',
  'ACCA Global'
];

export const ASSETS = IMAGES;