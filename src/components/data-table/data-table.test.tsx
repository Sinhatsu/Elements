import { type ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataTable } from './data-table';

type Person = { id: string; name: string; age: number };
const data: Person[] = [
  { id: '1', name: 'Ada', age: 36 },
  { id: '2', name: 'Grace', age: 85 },
  { id: '3', name: 'Katherine', age: 101 },
];
const columns: ColumnDef<Person, unknown>[] = [
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
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

describe('DataTable', () => {
  it('supports filtering, sorting, row selection, and pagination', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={data}
        columns={columns}
        getRowId={(row) => row.id}
        caption="People"
        enableRowSelection
        defaultPageSize={2}
      />,
    );
    expect(screen.getByRole('table')).toHaveAccessibleName('People');
    await user.click(screen.getByRole('button', { name: /name, not sorted/i }));
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ada');
    await user.type(screen.getByRole('searchbox'), 'Grace');
    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.click(screen.getByRole('checkbox', { name: 'Select Ada' }));
    expect(screen.getByText('1 of 3 row(s) selected.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Katherine')).toBeInTheDocument();
  });

  it('supports controlled filter state and column visibility', async () => {
    const user = userEvent.setup();
    const onGlobalFilterChange = vi.fn();
    render(
      <DataTable
        data={data}
        columns={columns.slice(1)}
        globalFilter="Ada"
        onGlobalFilterChange={onGlobalFilterChange}
        enableColumnVisibility
      />,
    );
    expect(screen.getByText('Ada')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'x');
    expect(onGlobalFilterChange).toHaveBeenCalledWith('Adax');
    await user.click(screen.getByText('Columns'));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Age' }));
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument();
  });

  it('renders accessible loading and empty states', () => {
    const { rerender } = render(
      <DataTable data={data} columns={columns.slice(1)} loading caption="People" />,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    rerender(<DataTable data={[]} columns={columns.slice(1)} emptyState="Nobody here." />);
    expect(screen.getByText('Nobody here.')).toBeInTheDocument();
  });

  it('constrains the conventional selection column width', () => {
    const { container } = render(
      <DataTable data={data} columns={columns} enableRowSelection selectionColumnId="select" />,
    );
    expect(container.querySelector('col.w-12')).toHaveStyle({ width: '3rem' });
  });
});
