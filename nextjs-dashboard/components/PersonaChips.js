// components/PersonaChips.js
import React from "react";

export default function PersonaChips({
  personas = [],
  active = "",
  onToggle = () => {},
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <span
        onClick={() => onToggle("")}
        className={`chip ${active === "" ? "active" : ""}`}
      >
        All
      </span>
      {personas.map((p) => (
        <span
          key={p}
          onClick={() => onToggle(p)}
          className={`chip ${active === p ? "active" : ""}`}
        >
          {p}
        </span>
      ))}
    </div>
  );
}
