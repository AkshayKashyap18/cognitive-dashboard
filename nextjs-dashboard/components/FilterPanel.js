// components/FilterPanel.js
import React from "react";

export default function FilterPanel({
  classes = [],
  personas = [],
  filters,
  setFilters,
}) {
  return (
    <div className="card">
      <div className="text-muted mb-2">Filters</div>

      <label className="text-sm text-muted">Class</label>
      <select
        className="input mb-3"
        value={filters.class || ""}
        onChange={(e) => setFilters({ ...filters, class: e.target.value })}
      >
        <option value="">All</option>
        {classes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="text-sm text-muted">Persona</label>
      <select
        className="input mb-3"
        value={filters.persona || ""}
        onChange={(e) => setFilters({ ...filters, persona: e.target.value })}
      >
        <option value="">All</option>
        {personas.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <label className="text-sm text-muted">Score min</label>
      <input
        type="number"
        className="input"
        value={filters.minScore || 0}
        onChange={(e) =>
          setFilters({ ...filters, minScore: Number(e.target.value) })
        }
      />
      <label className="text-sm text-muted mt-2">Score max</label>
      <input
        type="number"
        className="input"
        value={filters.maxScore || 100}
        onChange={(e) =>
          setFilters({ ...filters, maxScore: Number(e.target.value) })
        }
      />
    </div>
  );
}
