/**
 * Admin Layout Components
 */

export { AdminLayout } from './AdminLayout';
export { AdminHeader } from './AdminHeader';
export { AdminSidebar } from './AdminSidebar';
export { AdminBreadcrumb } from './AdminBreadcrumb';

export type {
  AdminLayoutProps,
  AdminHeaderProps,
  AdminSidebarProps,
  AdminBreadcrumbProps,
} from './types';

export default {
  AdminLayout: () => import('./AdminLayout'),
  AdminHeader: () => import('./AdminHeader'),
  AdminSidebar: () => import('./AdminSidebar'),
  AdminBreadcrumb: () => import('./AdminBreadcrumb'),
};