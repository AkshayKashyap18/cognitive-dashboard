// components/StatCard.js
import React from "react";

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <div className="text-muted">{title}</div>
      <div className="kpi">{value}</div>
      {subtitle && <div className="text-sm text-muted mt-3">{subtitle}</div>}
    </div>
  );
}
