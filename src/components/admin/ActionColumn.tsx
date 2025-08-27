import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  ExternalLink,
  Star,
  EyeOff,
  Trash2,
  Download,
  Share,
  Archive,
  RotateCcw,
  Settings,
  Flag,
  Heart,
  Bookmark,
  Send,
  Lock,
  Unlock,
  Pin,
  PinOff,
  Move,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";

// Enhanced action types
export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'secondary';
  disabled?: boolean;
  hidden?: boolean;
  shortcut?: string;
  description?: string;
}

export interface ActionGroup {
  label: string;
  actions: ActionItem[];
}

export interface ActionColumnProps {
  row: any;
  // Standard actions
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onDuplicate?: (item: any) => void;
  onArchive?: (item: any) => void;
  onRestore?: (item: any) => void;
  
  // Toggle actions
  onToggleFeatured?: (item: any) => void;
  onToggleVisibility?: (item: any) => void;
  onToggleStatus?: (item: any) => void;
  onTogglePinned?: (item: any) => void;
  onToggleLocked?: (item: any) => void;
  
  // External actions
  onOpenExternal?: (item: any) => void;
  onShare?: (item: any) => void;
  onDownload?: (item: any) => void;
  onExport?: (item: any) => void;
  
  // Custom actions and groups
  customActions?: ActionItem[];
  actionGroups?: ActionGroup[];
  
  // Configuration
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  maxWidth?: number;
}

// Predefined action configurations
export const createStandardActions = (props: ActionColumnProps): ActionItem[] => {
  const { row } = props;
  const item = row.original;
  const actions: ActionItem[] = [];

  if (props.onView) {
    actions.push({
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: props.onView,
      shortcut: '⌘V',
    });
  }

  if (props.onEdit) {
    actions.push({
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: props.onEdit,
      shortcut: '⌘E',
    });
  }

  if (props.onDuplicate) {
    actions.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      onClick: props.onDuplicate,
      shortcut: '⌘D',
    });
  }

  return actions;
};

export const createToggleActions = (props: ActionColumnProps): ActionItem[] => {
  const { row } = props;
  const item = row.original;
  const actions: ActionItem[] = [];

  if (props.onToggleFeatured) {
    actions.push({
      id: 'toggle-featured',
      label: item.featured ? 'Remove from Featured' : 'Add to Featured',
      icon: Star,
      onClick: props.onToggleFeatured,
      variant: item.featured ? 'secondary' : 'default',
    });
  }

  if (props.onToggleVisibility) {
    actions.push({
      id: 'toggle-visibility',
      label: item.disabled ? 'Show' : 'Hide',
      icon: item.disabled ? Eye : EyeOff,
      onClick: props.onToggleVisibility,
    });
  }

  if (props.onToggleStatus) {
    actions.push({
      id: 'toggle-status',
      label: item.status === 'active' ? 'Deactivate' : 'Activate',
      icon: item.status === 'active' ? XCircle : CheckCircle,
      onClick: props.onToggleStatus,
    });
  }

  if (props.onTogglePinned) {
    actions.push({
      id: 'toggle-pinned',
      label: item.pinned ? 'Unpin' : 'Pin',
      icon: item.pinned ? PinOff : Pin,
      onClick: props.onTogglePinned,
    });
  }

  if (props.onToggleLocked) {
    actions.push({
      id: 'toggle-locked',
      label: item.locked ? 'Unlock' : 'Lock',
      icon: item.locked ? Unlock : Lock,
      onClick: props.onToggleLocked,
    });
  }

  return actions;
};

export const createExternalActions = (props: ActionColumnProps): ActionItem[] => {
  const { row } = props;
  const item = row.original;
  const actions: ActionItem[] = [];

  if (item.liveUrl || props.onOpenExternal) {
    actions.push({
      id: 'open-external',
      label: 'Open Live Site',
      icon: ExternalLink,
      onClick: props.onOpenExternal || (() => window.open(item.liveUrl, '_blank')),
      disabled: !item.liveUrl && !props.onOpenExternal,
    });
  }

  if (props.onShare) {
    actions.push({
      id: 'share',
      label: 'Share',
      icon: Share,
      onClick: props.onShare,
    });
  }

  if (props.onDownload) {
    actions.push({
      id: 'download',
      label: 'Download',
      icon: Download,
      onClick: props.onDownload,
    });
  }

  if (props.onExport) {
    actions.push({
      id: 'export',
      label: 'Export',
      icon: Send,
      onClick: props.onExport,
    });
  }

  return actions;
};

export const createManagementActions = (props: ActionColumnProps): ActionItem[] => {
  const { row } = props;
  const item = row.original;
  const actions: ActionItem[] = [];

  if (props.onArchive && !item.archived) {
    actions.push({
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      onClick: props.onArchive,
      variant: 'secondary',
    });
  }

  if (props.onRestore && item.archived) {
    actions.push({
      id: 'restore',
      label: 'Restore',
      icon: RotateCcw,
      onClick: props.onRestore,
    });
  }

  if (props.onDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: props.onDelete,
      variant: 'destructive' as const,
    });
  }

  return actions;
};

export const ActionColumn: React.FC<ActionColumnProps> = ({
  row,
  showLabels = false,
  size = 'md',
  align = 'end',
  maxWidth = 200,
  customActions = [],
  actionGroups = [],
  ...props
}) => {
  const item = row.original;

  // Build action groups
  const standardActions = createStandardActions({ row, ...props });
  const toggleActions = createToggleActions({ row, ...props });
  const externalActions = createExternalActions({ row, ...props });
  const managementActions = createManagementActions({ row, ...props });

  // Filter out hidden actions
  const filterActions = (actions: ActionItem[]) => 
    actions.filter(action => !action.hidden);

  const allActionGroups: ActionGroup[] = [
    ...(standardActions.length > 0 ? [{ label: 'Actions', actions: filterActions(standardActions) }] : []),
    ...(toggleActions.length > 0 ? [{ label: 'Toggle', actions: filterActions(toggleActions) }] : []),
    ...(externalActions.length > 0 ? [{ label: 'External', actions: filterActions(externalActions) }] : []),
    ...(customActions.length > 0 ? [{ label: 'Custom', actions: filterActions(customActions) }] : []),
    ...actionGroups,
    ...(managementActions.length > 0 ? [{ label: 'Management', actions: filterActions(managementActions) }] : []),
  ];

  // If no actions available, don't render anything
  const hasActions = allActionGroups.some(group => group.actions.length > 0);
  if (!hasActions) {
    return null;
  }

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'sm';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`h-8 w-8 p-0 ${size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-6 w-6' : ''}`}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className={`h-4 w-4 ${size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3 w-3' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={align} 
        className="w-[160px]"
        style={{ maxWidth: maxWidth }}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <span>Actions</span>
          {item.id && (
            <span className="text-xs text-muted-foreground">#{item.id.slice(-6)}</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {allActionGroups.map((group, groupIndex) => (
          group.actions.length > 0 && (
            <React.Fragment key={group.label}>
              {groupIndex > 0 && <DropdownMenuSeparator />}
              
              {group.actions.length > 3 ? (
                // Use submenu for groups with many actions
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Settings className="mr-2 h-4 w-4" />
                    {group.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {group.actions.map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => action.onClick(item)}
                        disabled={action.disabled}
                        className={action.variant === 'destructive' ? 'text-destructive' : ''}
                      >
                        {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                        <span className="flex-1">{action.label}</span>
                        {action.shortcut && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {action.shortcut}
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                // Direct menu items for smaller groups
                group.actions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => action.onClick(item)}
                    disabled={action.disabled}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                    <span className="flex-1">{action.label}</span>
                    {action.shortcut && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {action.shortcut}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </React.Fragment>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Utility function to create action column definition
export const createActionColumnDef = <T,>(props: Omit<ActionColumnProps, 'row'>) => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }: { row: any }) => <ActionColumn row={row} {...props} />,
  enableSorting: false,
  enableHiding: false,
  size: 80,
});

// Export commonly used action configurations
export const commonActionConfigs = {
  // Basic CRUD actions
  crud: (handlers: {
    onView?: (item: any) => void;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
  }) => ({
    onView: handlers.onView,
    onEdit: handlers.onEdit,
    onDelete: handlers.onDelete,
  }),

  // Content management actions
  content: (handlers: {
    onEdit?: (item: any) => void;
    onToggleFeatured?: (item: any) => void;
    onToggleVisibility?: (item: any) => void;
    onDuplicate?: (item: any) => void;
    onDelete?: (item: any) => void;
  }) => ({
    onEdit: handlers.onEdit,
    onToggleFeatured: handlers.onToggleFeatured,
    onToggleVisibility: handlers.onToggleVisibility,
    onDuplicate: handlers.onDuplicate,
    onDelete: handlers.onDelete,
  }),

  // Project-specific actions
  project: (handlers: {
    onView?: (item: any) => void;
    onEdit?: (item: any) => void;
    onToggleFeatured?: (item: any) => void;
    onToggleVisibility?: (item: any) => void;
    onDuplicate?: (item: any) => void;
    onDelete?: (item: any) => void;
  }) => ({
    onView: handlers.onView,
    onEdit: handlers.onEdit,
    onToggleFeatured: handlers.onToggleFeatured,
    onToggleVisibility: handlers.onToggleVisibility,
    onDuplicate: handlers.onDuplicate,
    onDelete: handlers.onDelete,
  }),
};

export default ActionColumn;