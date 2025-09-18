// components/ExportMenu.js
import React, { useState } from "react";
import { exportCsv } from "../utils/exportCsv";

export default function ExportMenu({
  filteredRows = [],
  pageRows = [],
  selected = null,
  personas = [],
  onExportPersona = null, // optional: callback to request persona-specific rows
}) {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState(personas[0] || "");

  function doExportAll() {
    exportCsv(
      filteredRows,
      `students_filtered_${new Date().toISOString().slice(0, 19)}.csv`
    );
    setOpen(false);
  }
  function doExportPage() {
    exportCsv(
      pageRows,
      `students_page_${new Date().toISOString().slice(0, 19)}.csv`
    );
    setOpen(false);
  }
  function doExportSelected() {
    if (!selected) {
      alert("No student selected.");
      return;
    }
    exportCsv([selected], `student_${selected.student_id || "selected"}.csv`);
    setOpen(false);
  }
  function doExportPersona() {
    if (onExportPersona) {
      // parent can return rows for the persona (sync) — fallback: attempt to compute here if not provided
      const personaRows = onExportPersona(persona);
      exportCsv(personaRows, `students_persona_${persona || "all"}.csv`);
    } else {
      // if parent didn't supply handler, try filtering by persona from provided filteredRows
      const personaRows = filteredRows.filter((r) => r.persona === persona);
      exportCsv(personaRows, `students_persona_${persona || "all"}.csv`);
    }
    setOpen(false);
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((v) => !v)} className="btn">
        Export
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            minWidth: 220,
            background: "var(--card)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            borderRadius: 10,
            padding: 12,
            zIndex: 60,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn-secondary" onClick={doExportAll}>
              Export all filtered
            </button>
            <button className="btn-secondary" onClick={doExportPage}>
              Export current page
            </button>
            <button className="btn-secondary" onClick={doExportSelected}>
              Export selected student
            </button>

            <div style={{ marginTop: 6 }}>
              <div className="text-sm text-muted" style={{ marginBottom: 6 }}>
                Export by persona
              </div>
              <select
                className="input"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
              >
                <option value="">-- choose persona --</option>
                {personas.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  className="btn"
                  onClick={doExportPersona}
                  disabled={!persona}
                >
                  Export persona
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
