// src/usePagination.ts

import { useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosInstance } from "axios";
import {
  FiltersRecord,
  LaravelPaginatedResponse,
  LaravelPaginationMeta,
  UsePaginationOptions,
  UsePaginationResult,
} from "./types";

function buildUrl(baseUrl: string | undefined, endpoint: string): string {
  if (!baseUrl) return endpoint;
  const base = baseUrl.replace(/\/+$/, "");
  const ep = endpoint.replace(/^\/+/, "");
  return `${base}/${ep}`;
}

type DefaultFetcherConfig = {
  axiosInstance?: AxiosInstance;
};

export function createAxiosFetcher<TData>(
  config: DefaultFetcherConfig = {}
): (url: string, params: Record<string, unknown>) => Promise<LaravelPaginatedResponse<TData>> {
  const client = config.axiosInstance ?? axios;

  return async (url, params) => {
    const response = await client.get<LaravelPaginatedResponse<TData>>(url, {
      params,
      // Important for Laravel Sanctum / CSRF setups
      withCredentials: true,
    });

    return response.data;
  };
}

const defaultFetcher = createAxiosFetcher<any>();

export function usePagination<TData, TFilters extends FiltersRecord = FiltersRecord>(
  options: UsePaginationOptions<TData, TFilters>
): UsePaginationResult<TData, TFilters> {
  const {
    endpoint,
    baseUrl,
    initialPage = 1,
    initialPageSize = 15,
    initialSortBy,
    initialSortDir = "asc",
    initialSearch = "",
    initialFilters,
    staticParams = {},
    fetcher = defaultFetcher,
  } = options;

  const fetcherRef = useRef(fetcher);

  // keep ref in sync if fetcher prop ever changes
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const [staticParamsState] = useState(staticParams);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir);
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFiltersState] = useState<TFilters>(
    (initialFilters ?? ({} as TFilters)) as TFilters
  );

  const [data, setData] = useState<TData[]>([]);
  const [meta, setMeta] = useState<LaravelPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const url = useMemo(() => buildUrl(baseUrl, endpoint), [baseUrl, endpoint]);

  const params = useMemo(
    () => ({
      page,
      per_page: pageSize,
      sort_by: sortBy,
      sort_dir: sortDir,
      search: search || undefined,
      ...staticParams,
      filters,
    }),
    [page, pageSize, sortBy, sortDir, search, staticParamsState, filters]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetcherRef.current(url, params);
        if (cancelled) return;

        setData(res.data);
        setMeta(res.meta);
      } catch (e: any) {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, params]);

  const setFilters = (update: TFilters | ((prev: TFilters) => TFilters)) => {
    setPage(1);
    setFiltersState((prev) => (typeof update === "function" ? (update as any)(prev) : update));
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const reset = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setSortBy(initialSortBy);
    setSortDir(initialSortDir);
    setSearch(initialSearch);
    setFiltersState((initialFilters ?? ({} as TFilters)) as TFilters);
  };

  return {
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
    setSortBy: (field?: string) => {
      setPage(1);
      setSortBy(field);
    },
    setSortDir: (dir: "asc" | "desc") => {
      setPage(1);
      setSortDir(dir);
    },
    setSearch: (value: string) => {
      setPage(1);
      setSearch(value);
    },
    setFilters,

    nextPage,
    prevPage,
    reset,
  };
}
