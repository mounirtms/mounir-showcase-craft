/**
 * Pages Index
 * Centralized exports for all page components
 */

// Main pages
export { default as HomePage } from './HomePage';
export { default as AdminPage } from './Admin';
export { default as NotFoundPage } from './NotFound';

// Types
export interface PageProps {
  className?: string;
}

// Default exports for lazy loading
export default {
  Home: () => import('./HomePage'),
  Admin: () => import('./Admin'),
  NotFound: () => import('./NotFound'),
};
