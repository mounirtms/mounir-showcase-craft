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

// Schema and validation
export * from './schema';

// Performance optimizations
export * from './performance';

// UI utilities
export * from './ui';

// Specialized services
export { default as FirebaseDataService } from './firebase-data-service';
export { default as DataPopulationService } from './data-population-service';
export { default as ImageUploadService } from './image-upload';
export { default as SeedDataService } from './seed-data';

// Error handling
export * from './error-handling';
export * from './error-handling-enhanced';

// Loading and feedback
export { LoadingFeedbackSystem } from './loading-feedback-system';

// Icons
export * from './skill-icons';

// Default exports for lazy loading
export default {
  FirebaseDataService: () => import('./firebase-data-service'),
  DataPopulationService: () => import('./data-population-service'),
  ImageUploadService: () => import('./image-upload'),
  SeedDataService: () => import('./seed-data'),
  LoadingFeedbackSystem: () => import('./loading-feedback-system'),
};