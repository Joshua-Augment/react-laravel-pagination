# @augmentmy/react-laravel-pagination

React hooks and table components for **Laravel-style paginated APIs**.

This library is built to work with a backend that returns data in the shape:

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "from": 1,
    "to": 25,
    "per_page": 25,
    "last_page": 6,
    "total": 143,
    "path": "https://api.example.com/api/users",
    "first_page_url": "...",
    "last_page_url": "...",
    "next_page_url": "...",
    "prev_page_url": null,
    "has_more_pages": true,
    "on_first_page": true
  }
}
```

which matches the JSON produced by the sibling Laravel package (https://packagist.org/packages/augmentmy/laravel-query-pagination). 

You get:

- `usePagination` — a hook that talks to the Laravel API and manages page/search/sort/filter.
- `PaginatedTable` — a **UI-agnostic** React table component using TanStack React Table, with pluggable render components (HTML by default, Chakra-ready).

---

## Installation

```bash
npm install @augmentmy/react-laravel-pagination
# or
yarn add @augmentmy/react-laravel-pagination
# or
pnpm add @augmentmy/react-laravel-pagination
```

### Peer dependencies

You must also have these installed in your app (they are declared as `peerDependencies`):

- `react`
- `react-dom`
- `@tanstack/react-table` (v8)
- `axios`

Example:

```bash
npm install react react-dom @tanstack/react-table axios
```

This package assumes you already configure `axios` globally in your Laravel frontend (CSRF token, base URL, auth, etc.). The library will use that same axios instance.

---

## Backend expectations (Laravel or otherwise)

Your API endpoint should accept the following query parameters:

- `page` — integer, 1-based
- `per_page` — integer
- `search` — string
- `filters[field]` — object mapping fields to values
- `sort_by` — string, field name
- `sort_dir` — `"asc"` or `"desc"`

And respond with:

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "from": 1,
    "to": 25,
    "per_page": 25,
    "last_page": 6,
    "total": 143,
    "path": "...",
    "first_page_url": "...",
    "last_page_url": "...",
    "next_page_url": "...",
    "prev_page_url": null,
    "has_more_pages": true,
    "on_first_page": true
  }
}
```

For example, using the PHP package:

```php
return PaginatedQuery::make(
    baseQuery: User::query(),
    searchable: ['name', 'email'],
    filterable: ['role', 'status'],
    sortable: ['name', 'created_at'],
    defaultSort: 'created_at',
    defaultSortDir: 'desc',
)->toResponse($request);
```

---

## `usePagination` hook

### Basic usage

```tsx
import { usePagination } from "@augmentmy/react-laravel-pagination";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function UsersList() {
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
    nextPage,
    prevPage,
    reset,
  } = usePagination<User>({
    endpoint: "/api/users", // relative to your axios baseURL
    initialPage: 1,
    initialPageSize: 25,
    initialSortBy: "created_at",
    initialSortDir: "desc",
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      <ul>
        {data.map((user) => (
          <li key={user.id}>
            {user.name} – {user.email}
          </li>
        ))}
      </ul>

      <button onClick={prevPage} disabled={page <= 1}>
        Prev
      </button>
      <span>
        Page {page} of {meta?.last_page ?? 1}
      </span>
      <button onClick={nextPage} disabled={!meta?.has_more_pages}>
        Next
      </button>
    </div>
  );
}
```

### Hook options

```ts
type UsePaginationOptions<TData, TFilters = Record<string, unknown>> = {
  endpoint: string;
  baseUrl?: string;

  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDir?: "asc" | "desc";
  initialSearch?: string;
  initialFilters?: TFilters;

  staticParams?: Record<string, unknown>;

  fetcher?: (
    url: string,
    params: Record<string, unknown>
  ) => Promise<LaravelPaginatedResponse<TData>>;
};
```

If you don’t provide `fetcher`, a default `axios.get(url, { params, withCredentials: true })` is used.

### Returned values

```ts
type UsePaginationResult<TData, TFilters> = {
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

  setPage(page: number): void;
  setPageSize(size: number): void;
  setSortBy(field?: string): void;
  setSortDir(dir: "asc" | "desc"): void;
  setSearch(value: string): void;
  setFilters(
    update: TFilters | ((prev: TFilters) => TFilters)
  ): void;

  nextPage(): void;
  prevPage(): void;
  reset(): void;
};
```

---

## `PaginatedTable` component

A generic table component that:

- Uses `usePagination` under the hood.
- Uses TanStack React Table for row/column logic.
- Is **UI-agnostic** — by default uses plain HTML, but you can inject Chakra (or any other) components.

### Basic example (HTML default)

```tsx
import {
  PaginatedTable,
} from "@augmentmy/react-laravel-pagination";
import type { ColumnDef } from "@tanstack/react-table";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

export function UsersTable() {
  return (
    <PaginatedTable<User>
      endpoint="/api/users"
      columns={columns}
      sortableColumns={["name", "email", "role", "created_at"]}
    />
  );
}
```

This gives you:

- Search input
- Page size selector
- Loading/error/empty states
- Clickable headers for server-side sorting
- Pagination controls

### Props

```ts
type PaginatedTableProps<TData, TFilters> = {
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

  sortableColumns?: string[]; // which fields your backend allows for `sort_by`

  components?: Partial<DefaultTableComponents>;

  renderToolbar?: (args: {
    search: string;
    setSearch: (value: string) => void;
    filters: TFilters;
    setFilters: (
      update: TFilters | ((prev: TFilters) => TFilters)
    ) => void;
  }) => React.ReactNode;

  renderCell?: (info: {
    row: any;
    column: any;
    getValue: () => unknown;
  }) => React.ReactNode;
};
```

`sortableColumns` should match the `sort_by` keys your Laravel API expects (e.g. `['name', 'email', 'created_at']`).

---

## Customizing UI with Chakra UI

The library ships with default HTML components, but you can plug in Chakra components via the `components` prop.

```tsx
import {
  PaginatedTable,
} from "@augmentmy/react-laravel-pagination";
import { ColumnDef } from "@tanstack/react-table";
import {
  Table as CTable,
  Thead as CThead,
  Tbody as CTbody,
  Tr as CTr,
  Th as CTh,
  Td as CTd,
  Button as CButton,
  Input as CInput,
  Select as CSelect,
  Spinner as CSpinner,
  Flex,
  Text,
} from "@chakra-ui/react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

export function UsersTableChakra() {
  return (
    <PaginatedTable<User>
      endpoint="/api/users"
      columns={columns}
      sortableColumns={["name", "email", "role", "created_at"]}
      components={{
        Table: (props) => (
          <CTable variant="striped" size="sm" {...props} />
        ),
        Thead: CThead,
        Tbody: CTbody,
        Tr: CTr,
        Th: CTh,
        Td: CTd,
        PaginationWrapper: (props) => (
          <Flex mt={4} justify="space-between" align="center" {...props} />
        ),
        Button: (props) => <CButton size="sm" {...props} />,
        Input: (props) => <CInput size="sm" {...props} />,
        Select: (props) => <CSelect size="sm" {...props} />,
        Spinner: CSpinner,
        EmptyState: () => <Text>No users found.</Text>,
        ErrorState: ({ error }) => (
          <Text color="red.500">{error.message}</Text>
        ),
      }}
    />
  );
}
```

You can also override `renderToolbar` to build a completely custom header (filters, bulk actions, etc.).

---

## Types

Useful exports:

```ts
import type {
  LaravelPaginatedResponse,
  LaravelPaginationMeta,
  FiltersRecord,
  UsePaginationOptions,
  UsePaginationResult,
} from "@augmentmy/react-laravel-pagination";
```

These mirror the backend pagination contract and the hook’s shape.

---

## Development

```bash
# install deps
npm install

# build
npm run build

# test (if you add tests)
npm test
```

---

## License

MIT.
