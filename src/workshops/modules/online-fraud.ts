
import { Workshop } from '../../types';
import { coreWorkshops } from './core-collection';

// Re-export from core to maintain compatibility if imported elsewhere
export const onlineFraudWorkshop: Workshop = coreWorkshops[0];
