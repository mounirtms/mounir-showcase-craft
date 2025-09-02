/**
 * Shared components index
 * Centralized exports for all shared components
 */

// Base components
export * from './BaseComponents';

// Enhanced components (consolidated)
export { LoadingState } from './BaseComponents';
export { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';
export { EmptyStates } from './EmptyStates';

// Specialized components
export * from './ConfirmDialog';
export * from './FormBuilder';
export * from './FormFields';
export * from './AdvancedTable';
export * from './VirtualScroll';
export * from './LazyLoading';
export * from './ResponsiveDesign';
export * from './MobileOptimized';
export * from './AccessibleComponents';
export * from './AnalyticsCharts';

// Performance components
export * from './PerformanceMonitor';
export * from './PerformanceOptimizations';

// Default export with commonly used components
export default {
  // Base components
  BaseCard: () => import('./BaseComponents').then(m => m.BaseCard),
  EnhancedCard: () => import('./BaseComponents').then(m => m.EnhancedCard),
  BaseButton: () => import('./BaseComponents').then(m => m.BaseButton),
  StatusBadge: () => import('./BaseComponents').then(m => m.StatusBadge),
  EmptyState: () => import('./BaseComponents').then(m => m.EmptyState),
  LoadingState: () => import('./BaseComponents').then(m => m.LoadingState),
  ErrorState: () => import('./BaseComponents').then(m => m.ErrorState),
  AsyncContent: () => import('./BaseComponents').then(m => m.AsyncContent),
  Section: () => import('./BaseComponents').then(m => m.Section),
  
  // Other components
  ErrorBoundary: () => import('./ErrorBoundary').then(m => m.ErrorBoundary),
  ConfirmDialog: () => import('./ConfirmDialog'),
  FormBuilder: () => import('./FormBuilder'),
  AdvancedTable: () => import('./AdvancedTable'),
};