import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type Row,
  type SortingState,
  type Table as TableInstance,
  type VisibilityState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/cn';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

export interface DataTableProps<TData> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The rows to display. Client-side features operate on this array. */
  data: TData[];
  /** TanStack Table column definitions. Use `meta: { className: '...' }` for cell alignment. */
  columns: ColumnDef<TData, unknown>[];
  /** A stable identifier is recommended when rows can be reordered or selected. */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  caption?: ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  enableFiltering?: boolean;
  filterPlaceholder?: string;
  globalFilter?: string;
  defaultGlobalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  enableSorting?: boolean;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  enableRowSelection?: boolean | ((row: TData) => boolean);
  /** The ID of the selection-checkbox column. It is constrained to 3rem to avoid unused space. */
  selectionColumnId?: string;
  rowSelection?: RowSelectionState;
  defaultRowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enableColumnVisibility?: boolean;
  columnVisibility?: VisibilityState;
  defaultColumnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  enablePagination?: boolean;
  pagination?: PaginationState;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Receives the underlying TanStack table instance for advanced integrations. */
  onTableReady?: (table: TableInstance<TData>) => void;
}

function resolveUpdate<T>(update: T | ((old: T) => T), current: T): T {
  return typeof update === 'function' ? (update as (old: T) => T)(current) : update;
}

function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: OnChangeFn<T>,
): [T, OnChangeFn<T>] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;

  const setValue: OnChangeFn<T> = (update) => {
    const nextValue = resolveUpdate(update, currentValue);
    if (value === undefined) setUncontrolledValue(nextValue);
    onChange?.(nextValue);
  };

  return [currentValue, setValue];
}

const DataTable = forwardRef(function DataTable<TData>(
  {
    data,
    columns,
    getRowId,
    caption,
    emptyState = 'No results found.',
    loading = false,
    enableFiltering = true,
    filterPlaceholder = 'Filter results…',
    globalFilter,
    defaultGlobalFilter = '',
    onGlobalFilterChange,
    enableSorting = true,
    sorting,
    defaultSorting = [],
    onSortingChange,
    enableRowSelection = false,
    selectionColumnId = 'select',
    rowSelection,
    defaultRowSelection = {},
    onRowSelectionChange,
    enableColumnVisibility = false,
    columnVisibility,
    defaultColumnVisibility = {},
    onColumnVisibilityChange,
    enablePagination = true,
    pagination,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50],
    onPaginationChange,
    onTableReady,
    className,
    ...props
  }: DataTableProps<TData>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [currentGlobalFilter, setGlobalFilter] = useControllableState(
    globalFilter,
    defaultGlobalFilter,
    onGlobalFilterChange
      ? (update) => onGlobalFilterChange(resolveUpdate(update, currentGlobalFilter))
      : undefined,
  );
  const [currentSorting, setSorting] = useControllableState(
    sorting,
    defaultSorting,
    onSortingChange,
  );
  const [currentRowSelection, setRowSelection] = useControllableState(
    rowSelection,
    defaultRowSelection,
    onRowSelectionChange,
  );
  const [currentColumnVisibility, setColumnVisibility] = useControllableState(
    columnVisibility,
    defaultColumnVisibility,
    onColumnVisibilityChange,
  );
  const [currentPagination, setPagination] = useControllableState(
    pagination,
    { pageIndex: 0, pageSize: defaultPageSize },
    onPaginationChange,
  );

  // TanStack Table intentionally exposes a mutable table instance for event handlers.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      globalFilter: currentGlobalFilter,
      sorting: currentSorting,
      rowSelection: currentRowSelection,
      columnVisibility: currentColumnVisibility,
      pagination: currentPagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    enableRowSelection: (row) =>
      typeof enableRowSelection === 'function'
        ? enableRowSelection(row.original)
        : enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    onTableReady?.(table);
  }, [onTableReady, table]);
  const visibleColumns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  const rows = enablePagination ? table.getRowModel().rows : table.getPrePaginationRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div ref={ref} data-slot="data-table" className={cn('grid gap-4', className)} {...props}>
      {(enableFiltering || (enableColumnVisibility && visibleColumns.length > 0)) && (
        <div
          data-slot="data-table-toolbar"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          {enableFiltering ? (
            <label className="relative block min-w-[14rem] flex-1 sm:max-w-sm">
              <span className="sr-only">{filterPlaceholder}</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={currentGlobalFilter}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder={filterPlaceholder}
                className="flex h-9 w-full rounded-md border border-input bg-transparent py-1 pr-3 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </label>
          ) : (
            <span />
          )}
          {enableColumnVisibility && visibleColumns.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                >
                  Columns
                  <ChevronDown
                    className="size-4 transition-transform duration-150 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Toggle columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(visible) => column.toggleVisibility(visible)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      )}

      <div
        data-slot="data-table-scroll-area"
        className="overflow-x-auto rounded-md border border-border"
      >
        <table className="w-full caption-bottom text-sm" aria-busy={loading || undefined}>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <colgroup>
            {table.getVisibleLeafColumns().map((column) => (
              <col
                key={column.id}
                className={column.id === selectionColumnId ? 'w-12' : undefined}
                style={column.id === selectionColumnId ? { width: '3rem' } : undefined}
              />
            ))}
          </colgroup>
          <thead className="border-b border-border bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border last:border-0">
                {headerGroup.headers.map((header) => {
                  const sortable = enableSorting && header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={cn(
                        'h-10 px-3 text-left align-middle font-medium text-muted-foreground',
                        header.column.id === selectionColumnId && 'w-12 px-3',
                      )}
                    >
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          className="-ml-2 flex min-h-8 items-center gap-1 rounded px-2 text-left hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDirection === 'asc' ? (
                            <ArrowUp className="size-4" aria-hidden="true" />
                          ) : sortDirection === 'desc' ? (
                            <ArrowDown className="size-4" aria-hidden="true" />
                          ) : null}
                          <span className="sr-only">
                            {header.column.getIsSorted() === 'asc'
                              ? ', sorted ascending'
                              : header.column.getIsSorted() === 'desc'
                                ? ', sorted descending'
                                : ', not sorted'}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(currentPagination.pageSize, 5) }, (_, index) => (
                <tr key={`loading-${index}`} className="border-b border-border last:border-0">
                  {table.getVisibleLeafColumns().map((column) => (
                    <td
                      key={column.id}
                      className={cn('p-3', column.id === selectionColumnId && 'w-12 px-3')}
                    >
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        'p-3 align-middle',
                        cell.column.id === selectionColumnId && 'w-12 px-3',
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 p-3 text-center text-muted-foreground"
                >
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enablePagination ? (
        <div
          data-slot="data-table-pagination"
          className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2">
              Rows per page
              <select
                aria-label="Rows per page"
                value={currentPagination.pageSize}
                onChange={(event) => table.setPageSize(Number(event.target.value))}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-muted-foreground">
              Page {currentPagination.pageIndex + 1} of {Math.max(pageCount, 1)}
            </span>
            <button
              type="button"
              aria-label="Previous page"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="inline-flex size-8 items-center justify-center rounded-md border border-input disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="inline-flex size-8 items-center justify-center rounded-md border border-input disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}) as (<TData>(
  props: DataTableProps<TData> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactElement) & {
  displayName?: string;
};

DataTable.displayName = 'DataTable';

export { DataTable };
