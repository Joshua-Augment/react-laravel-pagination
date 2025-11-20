// src/table/tableTypes.ts

import React from "react";

export type DefaultTableComponents = {
  Table: React.ComponentType<React.HTMLAttributes<HTMLTableElement>>;
  Thead: React.ComponentType<
    React.HTMLAttributes<HTMLTableSectionElement>
  >;
  Tbody: React.ComponentType<
    React.HTMLAttributes<HTMLTableSectionElement>
  >;
  Tr: React.ComponentType<React.HTMLAttributes<HTMLTableRowElement>>;
  Th: React.ComponentType<
    React.ThHTMLAttributes<HTMLTableCellElement>
  >;
  Td: React.ComponentType<
    React.TdHTMLAttributes<HTMLTableCellElement>
  >;

  PaginationWrapper: React.ComponentType<
    React.HTMLAttributes<HTMLDivElement>
  >;
  Button: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >;
  Input: React.ComponentType<
    React.InputHTMLAttributes<HTMLInputElement>
  >;
  Select: React.ComponentType<
    React.SelectHTMLAttributes<HTMLSelectElement>
  >;

  Spinner: React.ComponentType;
  EmptyState: React.ComponentType;
  ErrorState: React.ComponentType<{ error: Error }>;
};
