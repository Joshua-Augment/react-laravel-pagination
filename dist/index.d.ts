import { AxiosInstance } from 'axios';
import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

type LaravelPaginationMeta = {
    current_page: number;
    from: number | null;
    to: number | null;
    per_page: number;
    last_page: number;
    total: number;
    path: string;
    first_page_url: string | null;
    last_page_url: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
    has_more_pages: boolean;
    on_first_page: boolean;
};
type LaravelPaginatedResponse<T> = {
    data: T[];
    meta: LaravelPaginationMeta;
};
type FiltersRecord = Record<string, unknown>;
type UsePaginationOptions<TData, TFilters extends FiltersRecord = FiltersRecord> = {
    endpoint: string;
    baseUrl?: string;
    initialPage?: number;
    initialPageSize?: number;
    initialSortBy?: string;
    initialSortDir?: "asc" | "desc";
    initialSearch?: string;
    initialFilters?: TFilters;
    staticParams?: Record<string, unknown>;
    fetcher?: (url: string, params: Record<string, unknown>) => Promise<LaravelPaginatedResponse<TData>>;
};
type UsePaginationResult<TData, TFilters extends FiltersRecord = FiltersRecord> = {
    data: TData[];
    meta: LaravelPaginationMeta | null;
    isLoading: boolean;
    error: Error | null;
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDir: "asc" | "desc";
    search: string;
    filters: TFilters;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSortBy: (field?: string) => void;
    setSortDir: (dir: "asc" | "desc") => void;
    setSearch: (value: string) => void;
    setFilters: (update: TFilters | ((prev: TFilters) => TFilters)) => void;
    nextPage: () => void;
    prevPage: () => void;
    reset: () => void;
};

type DefaultFetcherConfig = {
    axiosInstance?: AxiosInstance;
};
declare function createAxiosFetcher<TData>(config?: DefaultFetcherConfig): (url: string, params: Record<string, unknown>) => Promise<LaravelPaginatedResponse<TData>>;
declare function usePagination<TData, TFilters extends FiltersRecord = FiltersRecord>(options: UsePaginationOptions<TData, TFilters>): UsePaginationResult<TData, TFilters>;

type DefaultTableComponents = {
    Table: React.ComponentType<React.HTMLAttributes<HTMLTableElement>>;
    Thead: React.ComponentType<React.HTMLAttributes<HTMLTableSectionElement>>;
    Tbody: React.ComponentType<React.HTMLAttributes<HTMLTableSectionElement>>;
    Tr: React.ComponentType<React.HTMLAttributes<HTMLTableRowElement>>;
    Th: React.ComponentType<React.ThHTMLAttributes<HTMLTableCellElement>>;
    Td: React.ComponentType<React.TdHTMLAttributes<HTMLTableCellElement>>;
    PaginationWrapper: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
    Button: React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    Input: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
    Select: React.ComponentType<React.SelectHTMLAttributes<HTMLSelectElement>>;
    Spinner: React.ComponentType;
    EmptyState: React.ComponentType;
    ErrorState: React.ComponentType<{
        error: Error;
    }>;
};

type PaginatedTableProps<TData, TFilters extends FiltersRecord = FiltersRecord> = {
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
    components?: Partial<DefaultTableComponents>;
    renderToolbar?: (args: {
        search: string;
        setSearch: (value: string) => void;
        filters: TFilters;
        setFilters: (update: TFilters | ((prev: TFilters) => TFilters)) => void;
    }) => React.ReactNode;
    renderCell?: (info: {
        row: any;
        column: any;
        getValue: () => unknown;
    }) => React.ReactNode;
};
declare function PaginatedTable<TData, TFilters extends FiltersRecord = FiltersRecord>(props: PaginatedTableProps<TData, TFilters>): react_jsx_runtime.JSX.Element;

export { type DefaultTableComponents, type FiltersRecord, type LaravelPaginatedResponse, type LaravelPaginationMeta, PaginatedTable, type PaginatedTableProps, type UsePaginationOptions, type UsePaginationResult, createAxiosFetcher, usePagination };
