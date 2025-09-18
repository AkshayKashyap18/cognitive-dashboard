// components/StudentModal.js
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function StudentModal({ student, onClose }) {
  const [model, setModel] = useState(null);
  useEffect(() => {
    fetch("/data/model_summary.json")
      .then((r) => r.json())
      .then(setModel)
      .catch(() => setModel(null));
  }, []);

  if (!student) return null;

  function predict() {
    if (!model || !model.linear) return "—";
    const lin = model.linear;
    let s = lin.intercept || 0;
    lin.features.forEach((f) => {
      s += (lin.coef[f] || 0) * (Number(student[f]) || 0);
    });
    return Math.round(s * 10) / 10;
  }

  const radar = {
    labels: ["Comprehension", "Attention", "Focus", "Retention", "Engagement"],
    datasets: [
      {
        label: student.name,
        data: [
          Number(student.comprehension) || 0,
          Number(student.attention) || 0,
          Number(student.focus) || 0,
          Number(student.retention) || 0,
          Math.round((Number(student.engagement_time) || 0) / 2),
        ],
        backgroundColor: "rgba(14,165,164,0.25)",
        borderColor: "#0ea5a4",
        borderWidth: 2,
        pointBackgroundColor: "#0ea5a4",
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div
        className="card z-60 max-w-xl w-full"
        style={{ position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{student.name}</h3>
            <div className="text-muted">{student.class || "—"}</div>
          </div>
          <div>
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div style={{ height: 230, marginTop: 12 }}>
          <Radar
            data={radar}
            options={{ scales: { r: { suggestedMin: 0, suggestedMax: 100 } } }}
          />
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div>
            <div className="text-muted">Assessment</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>
              {student.assessment_score}
            </div>
          </div>
          <div>
            <div className="text-muted">Predicted (linear)</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>{predict()}</div>
          </div>
        </div>

        {model && model.rf && (
          <div style={{ marginTop: 12 }}>
            <div className="text-muted">Feature importances (RF)</div>
            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
              {Object.entries(model.rf.feature_importances)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => (
                  <li key={k} className="text-sm">
                    {k}: {(v * 100).toFixed(1)}%
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
