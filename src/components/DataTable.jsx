export default function DataTable({ columns, data, isLoading, isError }) {
  if (isLoading)
    return (
      <div className="card-modern p-6 text-center">
        <div className="text-[var(--text-muted)]">Loading table…</div>
      </div>
    );
  if (isError)
    return (
      <div className="card-modern p-6 text-center">
        <div className="text-red-500">Failed to load data.</div>
      </div>
    );
  return (
    <div className="card-modern overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--card)]/80">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-6 py-3 font-semibold text-[var(--text)] border-b border-[var(--border)] tracking-wide uppercase text-[12px]"
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`${idx % 2 === 0 ? "bg-[color:var(--accent-light)]/10" : ""} border-b border-[var(--border)] hover:bg-[var(--accent-light)]/30 transition-colors`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="px-6 py-3 whitespace-nowrap text-[var(--text)]"
                  >
                    {c.cell ? c.cell(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
