// pages/index.js
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import PersonaChips from "../components/PersonaChips";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import ExportMenu from "../components/ExportMenu";
import ExcelUploader from "../components/ExcelUploader";

const ChartsClient = dynamic(() => import("../components/ChartsClient"), {
  ssr: false,
});
const StudentModal = dynamic(() => import("../components/StudentModal"), {
  ssr: false,
});
const PersonaMap = dynamic(() => import("../components/PersonaMap"), {
  ssr: false,
});

export default function Home() {
  const [rawData, setRawData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({
    class: "",
    persona: "",
    minScore: 0,
    maxScore: 100,
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState({
    key: "assessment_score",
    dir: "desc",
  });
  const [mounted, setMounted] = useState(false);

  // mark mounted (charts are client-only)
  useEffect(() => setMounted(true), []);

  // initial load from public JSON (fallback). If user uploads Excel, setRawData will replace this.
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/students.json");
        if (!res.ok) return; // it's ok if file missing
        const json = await res.json();
        const cleaned = json.map((d) => ({
          ...d,
          comprehension: Number(d.comprehension || 0),
          attention: Number(d.attention || 0),
          focus: Number(d.focus || 0),
          retention: Number(d.retention || 0),
          engagement_time: Number(d.engagement_time || 0),
          assessment_score: Number(d.assessment_score || 0),
        }));
        setRawData(cleaned);
      } catch (e) {
        console.error("Failed to load students.json", e);
      }
    }
    load();
  }, []);

  // persona and class lists for UI
  const personaList = useMemo(
    () => [...new Set(rawData.map((r) => r.persona).filter(Boolean))],
    [rawData]
  );
  const classList = useMemo(
    () => [...new Set(rawData.map((r) => r.class).filter(Boolean))],
    [rawData]
  );

  // filtered data (search + filters)
  const filtered = useMemo(
    () =>
      rawData.filter((s) => {
        if (q) {
          const qq = q.toLowerCase();
          if (
            !(
              String(s.name || "")
                .toLowerCase()
                .includes(qq) ||
              String(s.student_id || "").includes(qq) ||
              String(s.class || "")
                .toLowerCase()
                .includes(qq) ||
              String(s.persona || "")
                .toLowerCase()
                .includes(qq)
            )
          )
            return false;
        }
        if (filters.class && s.class !== filters.class) return false;
        if (filters.persona && s.persona !== filters.persona) return false;
        if (
          (s.assessment_score || 0) < (filters.minScore || 0) ||
          (s.assessment_score || 0) > (filters.maxScore || 100)
        )
          return false;
        return true;
      }),
    [rawData, q, filters]
  );

  // sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sortBy;
    arr.sort(
      (a, b) =>
        ((a[key] || 0) === (b[key] || 0)
          ? 0
          : (a[key] || 0) < (b[key] || 0)
          ? -1
          : 1) * (dir === "asc" ? 1 : -1)
    );
    return arr;
  }, [filtered, sortBy]);

  const total = sorted.length;
  const pageRows = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const avg = useMemo(
    () => (field) => {
      if (!rawData.length) return 0;
      return (
        rawData.reduce((s, r) => s + (Number(r[field]) || 0), 0) /
        rawData.length
      ).toFixed(1);
    },
    [rawData]
  );

  const skills = [
    "comprehension",
    "attention",
    "focus",
    "retention",
    "engagement_time",
  ];
  const barData = skills.map((s) => ({
    skill: s.replace("_", " "),
    avgSkill: Number(
      (
        rawData.reduce((a, b) => a + (Number(b[s]) || 0), 0) /
        (rawData.length || 1)
      ).toFixed(1)
    ),
    avgScore: Number(avg("assessment_score")),
  }));

  // keep header "Export" backwards-compatible (uses sorted data)
  useEffect(() => {
    const handler = () => {
      const rows = sorted;
      if (!rows.length) return;
      const keys = Object.keys(rows[0]);
      const csv = [
        keys.join(","),
        ...rows.map((r) =>
          keys
            .map((k) => `"${String(r[k] || "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_export_${new Date()
        .toISOString()
        .slice(0, 19)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    window.addEventListener("export-all", handler);
    return () => window.removeEventListener("export-all", handler);
  }, [sorted]);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Cognitive Dashboard</title>
      </Head>

      <Header
        onSearch={(v) => {
          setQ(v);
          setPage(0);
        }}
      />

      <main className="container mt-6">
        {/* Excel uploader (if user uploads, it replaces the dataset in-memory) */}
        <ExcelUploader
          onData={(rows) => {
            // reset pagination and selection when new data loaded
            setRawData(rows || []);
            setPage(0);
            setSelected(null);
          }}
        />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Avg Assessment"
            value={avg("assessment_score")}
            subtitle="Overall"
          />
          <StatCard
            title="Avg Engagement"
            value={avg("engagement_time")}
            subtitle="Minutes"
          />
          <StatCard title="Students" value={rawData.length} subtitle="Total" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="card">
              {!mounted ? (
                <div className="text-muted">Loading charts…</div>
              ) : (
                <ChartsClient
                  barData={barData}
                  rawData={sorted}
                  selected={selected}
                />
              )}
            </div>
          </div>

          <div>
            <div className="card mb-3">
              <h4 className="mb-2">Persona</h4>
              <PersonaChips
                personas={personaList}
                active={filters.persona || ""}
                onToggle={(p) =>
                  setFilters((f) => ({
                    ...f,
                    persona: f.persona === p ? "" : p,
                  }))
                }
              />
            </div>

            <div className="card mb-3">
              <FilterPanel
                classes={classList}
                personas={personaList}
                filters={filters}
                setFilters={(f) => setFilters(f)}
              />
            </div>

            {mounted && (
              <PersonaMap
                onSelectPersona={(p) =>
                  setFilters((f) => ({ ...f, persona: p }))
                }
                highlightPersona={filters.persona}
              />
            )}
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="input"
                placeholder="Search name / class / persona..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
              />
              <select
                className="input"
                value={sortBy.key}
                onChange={(e) => setSortBy({ ...sortBy, key: e.target.value })}
              >
                <option value="assessment_score">Score</option>
                <option value="attention">Attention</option>
                <option value="comprehension">Comprehension</option>
                <option value="engagement_time">Engagement</option>
              </select>
              <select
                className="input"
                value={sortBy.dir}
                onChange={(e) => setSortBy({ ...sortBy, dir: e.target.value })}
              >
                <option value="desc">desc</option>
                <option value="asc">asc</option>
              </select>
            </div>

            {/* Export menu & results */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <ExportMenu
                filteredRows={sorted}
                pageRows={pageRows}
                selected={selected}
                personas={personaList}
                onExportPersona={(p) => sorted.filter((r) => r.persona === p)}
              />
              <div className="text-muted">{total} results</div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Score</th>
                  <th>Persona</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((s) => (
                  <tr
                    key={s.student_id}
                    onClick={() => setSelected(s)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>{s.class}</td>
                    <td>{s.assessment_score}</td>
                    <td>{s.persona}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(0);
            }}
          />
        </div>

        {mounted && selected && (
          <StudentModal student={selected} onClose={() => setSelected(null)} />
        )}
      </main>
    </div>
  );
}
