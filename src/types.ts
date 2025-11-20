// src/types.ts

export type LaravelPaginationMeta = {
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

export type LaravelPaginatedResponse<T> = {
  data: T[];
  meta: LaravelPaginationMeta;
};

export type FiltersRecord = Record<string, unknown>;

export type UsePaginationOptions<
  TData,
  TFilters extends FiltersRecord = FiltersRecord
> = {
  endpoint: string; // "/api/users"
  baseUrl?: string; // "https://api.example.com" (optional)

  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDir?: "asc" | "desc";
  initialSearch?: string;
  initialFilters?: TFilters;

  staticParams?: Record<string, unknown>; // extra params always sent

  // Override transport if you don't want the default axios-based one
  fetcher?: (
    url: string,
    params: Record<string, unknown>
  ) => Promise<LaravelPaginatedResponse<TData>>;
};

export type UsePaginationResult<
  TData,
  TFilters extends FiltersRecord = FiltersRecord
> = {
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
