/**
 * Hooks Index
 * Centralized exports for all custom hooks
 */

// Core hooks
export { useDebounce } from './use-debounce';
export { useMobile } from './use-mobile';
export { useToast } from './use-toast';

// Admin hooks
export { useAdminAuth } from './useAdminAuth';
export { useAdminActions } from './useAdminActions';
export { useAdminNavigation } from './useAdminNavigation';
export { useAdminActivityLogging } from './useAdminActivityLogging';

// Data hooks
export { useProjects } from './useProjects';
export { useSkills } from './useSkills';

// Utility hooks
export { useAccessibility } from './useAccessibility';
export { useAutoSave } from './useAutoSave';
export { usePerformanceMonitoring } from './usePerformanceMonitoring';
export { useUserTracking } from './useUserTracking';

// Types
export type { ToastProps } from './use-toast';
export type { AdminAuthState } from './useAdminAuth';
export type { ProjectsState } from './useProjects';
export type { SkillsState } from './useSkills';

// Default exports for lazy loading
export default {
  useAdminAuth: () => import('./useAdminAuth'),
  useProjects: () => import('./useProjects'),
  useSkills: () => import('./useSkills'),
  usePerformanceMonitoring: () => import('./usePerformanceMonitoring'),
};