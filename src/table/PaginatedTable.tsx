// src/table/PaginatedTable.tsx

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePagination } from "../usePagination";
import {
  FiltersRecord,
  UsePaginationOptions,
} from "../types";
import {
  DefaultTableComponents,
} from "./tableTypes";
import { defaultHtmlComponents } from "./defaultHtmlComponents";

export type PaginatedTableProps<
  TData,
  TFilters extends FiltersRecord = FiltersRecord
> = {
  endpoint: string;
  baseUrl?: string;
  columns: ColumnDef<TData, any>[];

  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDir?: "asc" | "desc";
  initialSearch?: string;
  initialFilters?: TFilters;
  staticParams?: Record<string, unknown>;
  fetcher?: UsePaginationOptions<TData, TFilters>["fetcher"];

  /**
   * List of column keys that are sortable (server-side).
   * Typically these match your Laravel `sort_by` values.
   * e.g. ["name", "email", "created_at"]
   */
  sortableColumns?: string[];

  // UI customization
  components?: Partial<DefaultTableComponents>;

  // Custom toolbar (search, filters)
  renderToolbar?: (args: {
    search: string;
    setSearch: (value: string) => void;
    filters: TFilters;
    setFilters: (update: TFilters | ((prev: TFilters) => TFilters)) => void;
  }) => React.ReactNode;

  // Custom cell renderer
  renderCell?: (info: {
    row: any;
    column: any;
    getValue: () => unknown;
  }) => React.ReactNode;
};

export function PaginatedTable<
  TData,
  TFilters extends FiltersRecord = FiltersRecord
>(props: PaginatedTableProps<TData, TFilters>) {
  const {
    endpoint,
    baseUrl,
    columns,
    initialPage,
    initialPageSize,
    initialSortBy,
    initialSortDir,
    initialSearch,
    initialFilters,
    staticParams,
    fetcher,
    sortableColumns,
    components,
    renderToolbar,
    renderCell,
  } = props;

  const C: DefaultTableComponents = {
    ...defaultHtmlComponents,
    ...(components || {}),
  };

  const {
    data,
    meta,
    isLoading,
    error,
    page,
    pageSize,
    sortBy,
    sortDir,
    search,
    filters,
    setPage,
    setPageSize,
    setSortBy,
    setSortDir,
    setSearch,
    setFilters,
  } = usePagination<TData, TFilters>({
    endpoint,
    baseUrl,
    initialPage,
    initialPageSize,
    initialSortBy,
    initialSortDir,
    initialSearch,
    initialFilters,
    staticParams,
    fetcher,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = meta?.last_page ?? 1;
  const canPrev = page > 1;
  const canNext = meta?.has_more_pages ?? false;

  const handlePrev = () => {
    if (canPrev) setPage(page - 1);
  };

  const handleNext = () => {
    if (canNext) setPage(page + 1);
  };

  const isColumnSortable = (columnId: string, accessorKey: unknown): boolean => {
    if (!sortableColumns || sortableColumns.length === 0) return false;
    const key = accessorKey ?? columnId;
    if (typeof key !== "string") return false;
    return sortableColumns.includes(key);
  };

  const getSortKeyForColumn = (columnId: string, accessorKey: unknown): string | undefined => {
    if (typeof accessorKey === "string") return accessorKey;
    if (typeof columnId === "string") return columnId;
    return undefined;
  };

  const handleHeaderClick = (columnId: string, accessorKey: unknown) => {
    const sortKey = getSortKeyForColumn(columnId, accessorKey);
    if (!sortKey) return;
    if (!sortableColumns || !sortableColumns.includes(sortKey)) return;

    if (sortBy !== sortKey) {
      setSortBy(sortKey);
      setSortDir("asc");
    } else {
      // toggle asc <-> desc
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }

    // reset to first page on sort change
    setPage(1);
  };

  const renderSortIndicator = (sortKey: string | undefined) => {
    if (!sortKey || sortKey !== sortBy) return null;
    return (
      <span style={{ marginLeft: 4 }}>
        {sortDir === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div>
      {/* Toolbar: default or custom */}
      <div style={{ marginBottom: "0.5rem" }}>
        {renderToolbar ? (
          renderToolbar({
            search,
            setSearch,
            filters,
            setFilters,
          })
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <C.Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <C.Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 15, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </C.Select>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div style={{ marginBottom: "0.5rem" }}>
          <C.ErrorState error={error} />
        </div>
      )}

      {/* Table */}
      <C.Table>
        <C.Thead>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <C.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                if (header.isPlaceholder) {
                  return <C.Th key={header.id} />;
                }

                const accessorKey = header.column.columnDef.accessorKey;
                const sortable = isColumnSortable(
                  header.column.id,
                  accessorKey
                );
                const sortKey = getSortKeyForColumn(
                  header.column.id,
                  accessorKey
                );

                const handleClick = sortable
                  ? () => handleHeaderClick(header.column.id, accessorKey)
                  : undefined;

                return (
                  <C.Th
                    key={header.id}
                    onClick={handleClick}
                    style={{
                      cursor: sortable ? "pointer" : undefined,
                      userSelect: sortable ? "none" : undefined,
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {sortable && renderSortIndicator(sortKey)}
                    </span>
                  </C.Th>
                );
              })}
            </C.Tr>
          ))}
        </C.Thead>
        <C.Tbody>
          {isLoading ? (
            <C.Tr>
              <C.Td colSpan={columns.length}>
                <C.Spinner />
              </C.Td>
            </C.Tr>
          ) : data.length === 0 ? (
            <C.Tr>
              <C.Td colSpan={columns.length}>
                <C.EmptyState />
              </C.Td>
            </C.Tr>
          ) : (
            table.getRowModel().rows.map((row:any) => (
              <C.Tr key={row.id}>
                {row.getVisibleCells().map((cell:any) => (
                  <C.Td key={cell.id}>
                    {renderCell
                      ? renderCell({
                          row,
                          column: cell.column,
                          getValue: cell.getValue,
                        })
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                  </C.Td>
                ))}
              </C.Tr>
            ))
          )}
        </C.Tbody>
      </C.Table>

      {/* Pagination controls */}
      <C.PaginationWrapper>
        <div>
          {meta ? (
            <span>
              Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <C.Button onClick={handlePrev} disabled={!canPrev}>
            Previous
          </C.Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <C.Button onClick={handleNext} disabled={!canNext}>
            Next
          </C.Button>
        </div>
      </C.PaginationWrapper>
    </div>
  );
}
