# Enhanced Admin Data Table Components

This directory contains optimized data table components for the admin dashboard, implementing the requirements from task 4 of the admin dashboard optimization spec.

## Components

### AdminDataTable

An enhanced data table component with advanced features:

**Features:**
- ✅ Virtual scrolling for large datasets (>50 rows)
- ✅ Bulk operations with confirmation dialogs
- ✅ Export functionality (CSV, JSON)
- ✅ Sticky headers
- ✅ Column resizing with visual feedback
- ✅ Advanced filtering and search
- ✅ Column visibility controls
- ✅ Responsive design
- ✅ Loading and empty states

**Props:**
- `title`: Table title
- `description`: Optional description
- `columns`: Column definitions (TanStack Table format)
- `data`: Array of data items
- `virtualScrolling`: Enable virtual scrolling for large datasets
- `stickyHeader`: Enable sticky header
- `enableColumnResizing`: Enable column resizing
- `bulkActions`: Array of bulk action configurations
- `exportOptions`: Array of export format options
- `filterFields`: Array of filter field configurations

### ActionColumn

A reusable action column component with dropdown menu:

**Features:**
- ✅ Standard CRUD actions (View, Edit, Delete)
- ✅ Toggle actions (Featured, Visibility, Status)
- ✅ External actions (Open URL, Share, Download)
- ✅ Custom actions support
- ✅ Action grouping with submenus
- ✅ Keyboard shortcuts display
- ✅ Confirmation dialogs for destructive actions

**Usage:**
```tsx
import { createActionColumnDef, commonActionConfigs } from '@/components/admin';

const actionColumn = createActionColumnDef({
  ...commonActionConfigs.project({
    onEdit: (item) => handleEdit(item),
    onDelete: (item) => handleDelete(item),
    onToggleFeatured: (item) => handleToggleFeatured(item),
  }),
  customActions: [
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      onClick: (item) => handleArchive(item),
    },
  ],
});
```

## Implementation Details

### Virtual Scrolling
- Uses `react-window` for efficient rendering of large datasets
- Automatically enabled when data length > 50 items
- Configurable row height and container height
- Maintains selection state during scrolling

### Column Resizing
- Visual resize handles on column headers
- Real-time resize feedback
- Maintains column widths during data updates
- Touch-friendly resize handles

### Bulk Operations
- Multi-select with checkboxes
- Bulk action buttons appear when items selected
- Confirmation dialogs for destructive operations
- Progress feedback for long-running operations

### Export Functionality
- CSV export with customizable field mapping
- JSON export with full data structure
- Extensible for additional formats (Excel, PDF)
- Respects current filters and selection

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 3.3**: Performance optimization with virtual scrolling
- **Requirement 5.3**: Enhanced UI components with better interactions
- **Requirement 8.1**: Column sorting and filtering
- **Requirement 8.2**: Bulk operations and export functionality

## Usage Examples

See `AdminDataTableExample.tsx` for a comprehensive usage example with:
- Project data structure
- Custom column definitions
- Bulk actions configuration
- Export options setup
- Filter fields configuration

See `AdminDataTableTest.tsx` for a minimal test implementation.