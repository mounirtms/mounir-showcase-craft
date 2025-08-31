/**
 * Contexts Index
 * Centralized exports for all context providers
 */

// Core contexts
export { AccessibilityContext, AccessibilityProvider, useAccessibility } from './AccessibilityContext';
export { AdminStatsContext, AdminStatsProvider, useAdminStats } from './AdminStatsContext';
export { GlobalStateContext, GlobalStateProvider, useGlobalState } from './GlobalStateContext';

// Types
export type { AccessibilityContextType } from './AccessibilityContext';
export type { AdminStatsContextType } from './AdminStatsContext';
export type { GlobalStateContextType } from './GlobalStateContext';

// Default exports for lazy loading
export default {
  AccessibilityProvider: () => import('./AccessibilityContext').then(m => ({ default: m.AccessibilityProvider })),
  AdminStatsProvider: () => import('./AdminStatsContext').then(m => ({ default: m.AdminStatsProvider })),
  GlobalStateProvider: () => import('./GlobalStateContext').then(m => ({ default: m.GlobalStateProvider })),
};