// State Management Index
// This file provides centralized exports for all state management components

// Contexts
export {
  AdminStatsProvider,
  useAdminStats,
  useProjectStats,
  useSkillStats,
  useSystemStats,
  type AdminStats,
  type ProjectStats,
  type SkillStats,
  type SystemStats
} from "@/contexts/AdminStatsContext";

export {
  GlobalStateProvider,
  useGlobalState,
  useErrors,
  useLoading,
  useAsyncAction,
  useConnectionStatus,
  useUserActivity,
  type AppError,
  type LoadingState,
  type GlobalState,
  type AsyncActionOptions
} from "@/contexts/GlobalStateContext";

// Hooks
export {
  useAdminNavigation,
  useDefaultAdminNavigation,
  defaultAdminNavItems,
  type NavItem,
  type BreadcrumbItem,
  type NavigationState,
  type UseAdminNavigationConfig
} from "@/hooks/useAdminNavigation";

export {
  useAdminActions,
  type Project,
  type Skill,
  type BulkActionResult,
  type ActionOptions,
  type UseAdminActionsReturn
} from "@/hooks/useAdminActions";

// Re-export shared utilities that work with state management
export {
  LoadingStates,
  type LoadingStateProps
} from "@/components/shared/LoadingStates";

export {
  EmptyStates,
  NoDataState,
  NoSearchResultsState,
  ErrorState,
  NoFilterResultsState,
  type EmptyStateProps,
  type EmptyStateVariant
} from "@/components/shared/EmptyStates";

export {
  ErrorBoundary,
  type ErrorBoundaryProps
} from "@/components/shared/ErrorBoundary";

export {
  ConfirmDialog,
  DeleteConfirmDialog,
  SaveConfirmDialog,
  LogoutConfirmDialog,
  type ConfirmDialogProps,
  type ConfirmDialogVariant
} from "@/components/shared/ConfirmDialog";