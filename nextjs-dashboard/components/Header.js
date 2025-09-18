// components/Header.js
import React from "react";

export default function Header({ onSearch = () => {} }) {
  return (
    <header className="app-header">
      <div className="container flex items-center justify-between">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#0ea5a4,#3b82f6)",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              CD
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                Cognitive Skills
              </div>
              <div className="text-muted" style={{ marginTop: 2 }}>
                Student performance & learning personas
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="search"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              borderRadius: 10,
              padding: "6px 10px",
              border: "1px solid rgba(11,82,91,0.06)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21l-4.35-4.35"
                stroke="#0B525B"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search students..."
              className="input"
              style={{ border: "none", outline: "none" }}
            />
          </div>

          <button
            className="btn"
            title="Export CSV"
            onClick={() => {
              const event = new CustomEvent("export-all");
              window.dispatchEvent(event);
            }}
          >
            Export
          </button>

          <button
            className="btn-secondary"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            Toggle Dark
          </button>
        </div>
      </div>
    </header>
  );
}
