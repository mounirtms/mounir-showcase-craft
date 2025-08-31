/**
 * Admin Components Index
 * Centralized exports for all admin components
 */

// Core admin components
export { AdminDashboard } from './AdminDashboard';
export { AdminDataTable } from './AdminDataTable';
export { AdminNavigation } from './AdminNavigation';
export { AdminStats } from './AdminStats';

// Action components
export { ActionColumn, createActionColumnDef, commonActionConfigs } from './ActionColumn';

// Data management components
export { ProjectsManager } from './ProjectsManager';
export { SkillsManager } from './SkillsManager';
export { DataExportManager } from './DataExportManager';

// Analytics components
export { AnalyticsDashboard } from './AnalyticsDashboard';
export { PerformanceDashboard } from './PerformanceDashboard';
export { GoogleAnalyticsInfo } from './GoogleAnalyticsInfo';
export { default as GoogleAnalyticsVerification } from './GoogleAnalyticsVerification';

// Utility components
export { ImageUpload } from './ImageUpload';
export { AccessibilitySettings } from './AccessibilitySettings';

// Modular components
export * from './auth';
export * from './layout';
export * from './dashboard';
export * from './projects';
export * from './skills';
export * from './performance';

// Types
export type {
  ActionItem,
  ActionGroup,
  ActionColumnProps,
} from './ActionColumn';

// Default exports for lazy loading
export default {
  AdminDashboard: () => import('./AdminDashboard'),
  ProjectsManager: () => import('./ProjectsManager'),
  SkillsManager: () => import('./SkillsManager'),
  AnalyticsDashboard: () => import('./AnalyticsDashboard'),
  PerformanceDashboard: () => import('./PerformanceDashboard'),
};