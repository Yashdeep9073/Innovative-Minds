
import { createV2Workshop } from '../factory';
import { Workshop } from '../../types';

export const onlineFraudWorkshop: Workshop = createV2Workshop(
  1,
  'FRAUD',
  'Online Fraud & Scam Prevention',
  'Cybersecurity',
  'https://picsum.photos/seed/fraud/800/600',
  'Learn how to identify and protect yourself from common online scams and fraudulent activities.',
  ['Understanding Phishing', 'Social Engineering Tactics', 'Safe Online Banking']
);
