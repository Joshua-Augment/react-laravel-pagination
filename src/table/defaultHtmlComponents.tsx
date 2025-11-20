// src/table/defaultHtmlComponents.tsx

import React from "react";
import { DefaultTableComponents } from "./tableTypes";

export const defaultHtmlComponents: DefaultTableComponents = {
  Table: (props) => (
    <table
      {...props}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        ...(props.style || {}),
      }}
    />
  ),
  Thead: (props) => <thead {...props} />,
  Tbody: (props) => <tbody {...props} />,
  Tr: (props) => <tr {...props} />,
  Th: (props) => (
    <th
      {...props}
      style={{
        textAlign: "left",
        padding: "0.5rem",
        borderBottom: "1px solid #ddd",
        ...(props.style || {}),
      }}
    />
  ),
  Td: (props) => (
    <td
      {...props}
      style={{
        padding: "0.5rem",
        borderBottom: "1px solid #eee",
        ...(props.style || {}),
      }}
    />
  ),
  PaginationWrapper: (props) => (
    <div
      {...props}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "0.75rem",
        ...(props.style || {}),
      }}
    />
  ),
  Button: (props) => (
    <button
      type="button"
      {...props}
      style={{
        padding: "0.25rem 0.5rem",
        cursor: props.disabled ? "not-allowed" : "pointer",
        ...(props.style || {}),
      }}
    />
  ),
  Input: (props) => (
    <input
      {...props}
      style={{
        padding: "0.25rem 0.5rem",
        ...(props.style || {}),
      }}
    />
  ),
  Select: (props) => (
    <select
      {...props}
      style={{
        padding: "0.25rem 0.5rem",
        ...(props.style || {}),
      }}
    />
  ),
  Spinner: () => <span>Loading...</span>,
  EmptyState: () => <div>No results.</div>,
  ErrorState: ({ error }) => (
    <div style={{ color: "red" }}>Error: {error.message}</div>
  ),
};
