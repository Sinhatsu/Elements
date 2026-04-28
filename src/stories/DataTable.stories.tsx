import type { Meta } from '@storybook/react-vite';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table';

type User = { id: string; name: string; email: string; role: string; status: 'Active' | 'Invited' };

const users: User[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Grace Hopper', email: 'grace@example.com', role: 'Engineer', status: 'Active' },
  {
    id: '3',
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    role: 'Analyst',
    status: 'Invited',
  },
];

const columns: ColumnDef<User, unknown>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        aria-label="Select all rows"
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        aria-label={`Select ${row.original.name}`}
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A responsive, accessible data table powered by TanStack Table. Features can be fully controlled for server-side data sources.',
      },
    },
  },
} satisfies Meta<typeof DataTable>;
export default meta;

export const Default = {
  render: () => (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      caption="Team members"
      enableRowSelection
      enableColumnVisibility
      defaultPageSize={10}
    />
  ),
};
export const Loading = {
  render: () => (
    <DataTable data={users} columns={columns.slice(1)} loading caption="Loading team members" />
  ),
};
export const Empty = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns.slice(1)}
      emptyState="No team members yet."
      caption="Team members"
    />
  ),
};
