import React from 'react';
import { AdminDataTable } from './AdminDataTable';
import { createActionColumnDef } from './ActionColumn';
import { Badge } from '@/components/ui/badge';

// Simple test data
const testData = [
  { id: '1', name: 'Test Item 1', status: 'active', priority: 1 },
  { id: '2', name: 'Test Item 2', status: 'inactive', priority: 2 },
];

const testColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status', 
    cell: ({ row }: any) => <Badge>{row.getValue('status')}</Badge> },
  { accessorKey: 'priority', header: 'Priority' },
  createActionColumnDef({
    onEdit: (item) => console.log('Edit:', item),
    onDelete: (item) => console.log('Delete:', item),
  }),
];

export const AdminDataTableTest: React.FC = () => (
  <AdminDataTable
    title="Test Table"
    columns={testColumns}
    data={testData}
    virtualScrolling={false}
    stickyHeader={true}
    enableColumnResizing={true}
  />
);