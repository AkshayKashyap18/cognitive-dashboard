// components/ExcelUploader.js
import React from "react";
import * as XLSX from "xlsx";

/**
 * ExcelUploader
 * Props:
 *  - onData(rowsArray)  // called with cleaned rows array when uploaded
 *
 * Expected columns in spreadsheet (case-insensitive):
 * student_id, name, class, comprehension, attention, focus, retention, engagement_time, assessment_score, persona
 */
export default function ExcelUploader({ onData }) {
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // use first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // convert sheet to JSON; defval ensures missing cells become empty string
        const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // normalize keys (lowercase) and map to your expected schema
        const cleaned = raw.map((row, i) => {
          // helper to read multiple possible column names
          const get = (...keys) => {
            for (const k of keys) {
              if (k in row) return row[k];
              const lower = Object.keys(row).find(
                (rk) => rk.toLowerCase() === k.toLowerCase()
              );
              if (lower) return row[lower];
            }
            return "";
          };

          const student_id =
            get("student_id", "id", "Student ID", "ID") || i + 1;
          const name = get("name", "Name") || `Student ${i + 1}`;
          const cls = get("class", "Class", "section") || "";
          const comprehension = Number(
            get("comprehension", "Comprehension") || 0
          );
          const attention = Number(get("attention", "Attention") || 0);
          const focus = Number(get("focus", "Focus") || 0);
          const retention = Number(get("retention", "Retention") || 0);
          const engagement_time = Number(
            get("engagement_time", "engagement time", "Engagement") || 0
          );
          const assessment_score = Number(
            get("assessment_score", "score", "assessment score") || 0
          );
          const persona = get("persona", "Persona") || "";

          return {
            student_id,
            name,
            class: cls,
            comprehension,
            attention,
            focus,
            retention,
            engagement_time,
            assessment_score,
            persona,
          };
        });

        // send cleaned data back to parent
        onData(cleaned);
      } catch (err) {
        console.error("Error reading Excel file:", err);
        alert("Failed to parse Excel file. See console for details.");
      }
    };

    reader.readAsBinaryString(file);
    // reset input value so same file can be uploaded again if needed
    e.target.value = "";
  }

  return (
    <div className="card mb-4">
      <h4 className="mb-2">Upload Excel</h4>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        style={{ display: "block", marginBottom: 8 }}
      />
      <div className="text-sm text-muted">
        Upload a spreadsheet with columns like:
        <br />
        <code>
          student_id, name, class, comprehension, attention, focus, retention,
          engagement_time, assessment_score, persona
        </code>
      </div>
    </div>
  );
}
