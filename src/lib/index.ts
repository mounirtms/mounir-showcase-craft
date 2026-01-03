/**
 * Library Index
 * Centralized exports for all library modules
 */

// Core utilities
export * from './utils';
export * from './firebase';
export * from './performance';

// Shared utilities
export * from './shared';

// UI utilities
export * from './ui';

// Specialized services
export { default as FirebaseDataService } from './firebase-data-service';
export { default as DataPopulationService } from './data-population-service';

// Error handling
export { AppError, parseError } from './error-handling';

// Icons
export * from './skill-icons';

// Default exports for lazy loading
export default {
  FirebaseDataService: () => import('./firebase-data-service'),
  DataPopulationService: () => import('./data-population-service'),
};
