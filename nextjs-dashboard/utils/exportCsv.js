// utils/exportCsv.js
export function exportCsv(rows = [], filename = "export.csv") {
  if (!rows || !rows.length) {
    // create empty CSV with no rows
    const blobEmpty = new Blob([""], { type: "text/csv;charset=utf-8;" });
    const urlEmpty = URL.createObjectURL(blobEmpty);
    const aEmpty = document.createElement("a");
    aEmpty.href = urlEmpty;
    aEmpty.download = filename;
    document.body.appendChild(aEmpty);
    aEmpty.click();
    aEmpty.remove();
    URL.revokeObjectURL(urlEmpty);
    return;
  }

  const keys = Object.keys(rows[0]);
  // build CSV lines. Wrap quotes and escape inner quotes.
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => {
        const v = r[k] === null || r[k] === undefined ? "" : String(r[k]);
        return `"${v.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
