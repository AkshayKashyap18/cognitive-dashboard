// components/Pagination.js
import React from "react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
      }}
    >
      <div className="text-sm text-muted">
        Page {page + 1} of {totalPages}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="input"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="btn-secondary"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            className="btn-secondary"
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
