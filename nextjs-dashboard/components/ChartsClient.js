// components/ChartsClient.js
import React from "react";
import { Bar, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

export default function ChartsClient({
  barData = [],
  rawData = [],
  selected = null,
}) {
  const labels = barData.map((d) => d.skill);
  const barDataset = {
    labels,
    datasets: [
      {
        label: "Avg Skill",
        data: barData.map((d) => d.avgSkill),
        backgroundColor: "#0ea5a4",
      },
      {
        label: "Avg Score",
        data: barData.map((d) => d.avgScore),
        backgroundColor: "#8ed1c6",
      },
    ],
  };

  const scatterDataset = {
    datasets: [
      {
        label: "Students",
        data: rawData.map((d) => ({ x: d.attention, y: d.assessment_score })),
        backgroundColor: "#0ea5a4",
      },
    ],
  };

  const radarDataset = {
    labels: ["Comprehension", "Attention", "Focus", "Retention", "Engagement"],
    datasets: [
      {
        label: selected?.name || "Student",
        data: selected
          ? [
              selected.comprehension,
              selected.attention,
              selected.focus,
              selected.retention,
              Math.round(selected.engagement_time / 2),
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: "rgba(14,165,164,0.25)",
        borderColor: "#0ea5a4",
      },
    ],
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ height: 260 }}>
        <Bar data={barDataset} options={{ maintainAspectRatio: false }} />
      </div>

      <div style={{ height: 240 }}>
        <Scatter
          data={scatterDataset}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: { title: { display: true, text: "Attention" } },
              y: { title: { display: true, text: "Score" } },
            },
          }}
        />
      </div>

      <div style={{ height: 260 }}>
        <Radar
          data={radarDataset}
          options={{
            maintainAspectRatio: false,
            scales: { r: { suggestedMin: 0, suggestedMax: 100 } },
          }}
        />
      </div>
    </div>
  );
}
