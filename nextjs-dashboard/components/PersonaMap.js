// components/PersonaMap.js (defensive, improved)
import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

function colorForPersona(p) {
  const palette = [
    "#0ea5a4",
    "#8ed1c6",
    "#f97316",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
  ];
  let n = 0;
  const s = String(p || "unknown");
  for (let i = 0; i < s.length; i++)
    n = (n * 31 + s.charCodeAt(i)) % palette.length;
  return palette[n];
}

export default function PersonaMap({
  onSelectPersona = () => {},
  highlightPersona = "",
}) {
  const [pts, setPts] = useState(null); // null = loading, [] = loaded empty
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/persona_map.json");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!Array.isArray(json)) {
          throw new Error("persona_map.json is not an array");
        }
        // coerce numeric fields and filter valid points
        const cleaned = json
          .map((p, i) => {
            const x = Number(p.x);
            const y = Number(p.y);
            return {
              ...p,
              x: Number.isFinite(x) ? x : 0,
              y: Number.isFinite(y) ? y : 0,
              persona: p.persona || "Unknown",
              student_id: p.student_id ?? i,
              name: p.name ?? `Student ${i + 1}`,
            };
          })
          .filter(Boolean);
        console.log("[PersonaMap] loaded", cleaned.length, "points");
        setPts(cleaned);
      } catch (err) {
        console.error("[PersonaMap] failed to load persona_map.json:", err);
        setError(String(err.message || err));
        setPts([]); // mark loaded so UI can show message
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="card" style={{ height: 320 }}>
        <h4 className="mb-3">Persona map</h4>
        <div className="text-sm text-muted">
          Failed to load persona_map.json: {error}
        </div>
        <div className="text-sm mt-2">
          Check <code>public/data/persona_map.json</code> exists and is valid
          JSON.
        </div>
      </div>
    );
  }

  if (pts === null) {
    return (
      <div className="card" style={{ height: 320 }}>
        <h4 className="mb-3">Persona map</h4>
        <div className="text-muted">Loading persona map…</div>
      </div>
    );
  }

  if (!pts.length) {
    return (
      <div className="card" style={{ height: 320 }}>
        <h4 className="mb-3">Persona map</h4>
        <div className="text-muted">
          No persona points found. Create{" "}
          <code>public/data/persona_map.json</code> or run the Python export
          script.
        </div>
        <div style={{ marginTop: 8 }}>
          <small className="text-sm text-muted">
            Tip: try the sample JSON if you don't have data.
          </small>
        </div>
      </div>
    );
  }

  // group by persona
  const groups = {};
  pts.forEach((p) => {
    const label = p.persona || "Unknown";
    if (!groups[label]) groups[label] = [];
    groups[label].push(p);
  });

  // Create datasets for Chart.js; include a 'meta' object to use in tooltip/click
  const datasets = Object.entries(groups).map(([label, arr]) => ({
    label,
    data: arr.map((a) => ({
      x: a.x,
      y: a.y,
      _meta: { id: a.student_id, name: a.name },
    })),
    backgroundColor: colorForPersona(label),
    pointRadius: highlightPersona && highlightPersona !== label ? 4 : 7,
  }));

  const data = { datasets };

  const options = {
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          title: (items) => {
            const ds = items[0];
            return ds.dataset.label;
          },
          label: (ctx) => {
            const d = ctx.raw;
            const meta = d._meta || {};
            return `${meta.name || ""} (id: ${meta.id ?? "—"})`;
          },
        },
      },
    },
    scales: { x: { display: false }, y: { display: false } },
    maintainAspectRatio: false,
    onClick: (evt, elements) => {
      if (!elements.length) return;
      const el = elements[0];
      const ds = data.datasets[el.datasetIndex];
      onSelectPersona(ds.label);
    },
  };

  return (
    <div className="card" style={{ height: 320 }}>
      <h4 className="mb-3">Persona map</h4>
      <Scatter data={data} options={options} />
    </div>
  );
}
