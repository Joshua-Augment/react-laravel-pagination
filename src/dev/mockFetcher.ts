// src/dev/mockFetcher.ts
import { LaravelPaginatedResponse, LaravelPaginationMeta } from "../types";
import { MOCK_USERS, User } from "./mockUsers";

type AnyFilters = Record<string, unknown>;

export async function mockUsersFetcher(
  url: string,
  params: Record<string, unknown>
): Promise<LaravelPaginatedResponse<User>> {
  console.log("mockUsersFetcher called with:", url, params);

  const page = Number(params.page ?? 1);
  const perPage = Number(params.per_page ?? 15);
  const search = (params.search as string | undefined)?.toLowerCase() ?? "";
  const sortBy = (params.sort_by as string | undefined) ?? "id";
  const sortDir = (params.sort_dir as "asc" | "desc" | undefined) ?? "asc";

  // filters are in params.filters but we will just ignore them for now
  const filters = (params.filters ?? {}) as AnyFilters;

  // 1. Filter by search
  let items = [...MOCK_USERS];

  if (search) {
    items = items.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  // 2. Sort
  items.sort((a, b) => {
    const aVal = (a as any)[sortBy];
    const bVal = (b as any)[sortBy];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortDir === "asc" ? -1 : 1;
    if (bVal == null) return sortDir === "asc" ? 1 : -1;

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const offset = (currentPage - 1) * perPage;
  const pageItems = items.slice(offset, offset + perPage);

  const from = total === 0 ? null : offset + 1;
  const to = total === 0 ? null : offset + pageItems.length;
  const hasMore = currentPage < lastPage;

  const meta: LaravelPaginationMeta = {
    current_page: currentPage,
    from,
    last_page: lastPage,
    per_page: perPage,
    to,
    total,
    has_more_pages: hasMore,
  };

  // Optional: simulate network latency
  await new Promise((res) => setTimeout(res, 300));

  return {
    data: pageItems,
    meta,
  };
}
