/**
 * Components Index
 * Centralized exports for all components
 */

// Admin components
export * from './admin';

// Portfolio components  
export * from './portfolio';

// Base components
export * from './base';

// Shared components
export * from './shared';

// UI components
export * from './ui';

// Theme components
export * from './theme';

// Section components
export * from './sections';

// Utility components
export { FirebaseConfigChecker } from './FirebaseConfigChecker';
export { RUMProvider } from './RUMProvider';

// Default exports for lazy loading
export default {
  // Admin
  AdminDashboard: () => import('./admin/AdminDashboard'),
  ProjectsManager: () => import('./admin/ProjectsManager'),
  SkillsManager: () => import('./admin/SkillsManager'),
  
  // Portfolio
  HeroSection: () => import('./portfolio/HeroSection'),
  ProjectShowcase: () => import('./portfolio/ProjectShowcase'),
  SkillVisualization: () => import('./portfolio/SkillVisualization'),
  
  // Shared
  ErrorBoundary: () => import('./shared/ErrorBoundary'),
  LoadingState: () => import('./shared/BaseComponents').then(m => ({ default: m.LoadingState })),
  
  // UI
  DataTable: () => import('./ui/data-table'),
  Button: () => import('./ui/button'),
  Card: () => import('./ui/card'),
};