import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 🔹 helper to format large numbers (1K, 2.5M, etc.)
function formatNumber(value) {
  if (value == null) return "";
  if (typeof value != "number") return value;
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1_000_000)
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return value.toString();
}

export default function TrendChart({ data, lines }) {
  // spacing per extra axis on same side (pixels). Tune this if labels still overlap.
  const extraAxisSpacing = 56;

  const yAxes = lines.map((line, idx) => {
    const isLeft = idx % 2 == 0;
    const orientation = isLeft ? "left" : "right";
    const axisId = `y${idx}`;

    return (
      <YAxis
        key={axisId}
        yAxisId={axisId}
        orientation={orientation}
        stroke={line.color}
        tick={{ fill: line.color, fontSize: 12 }}
        tickFormatter={formatNumber}
        domain={["auto", "auto"]}
        label={{
          value: line.label || line.dataKey,
          angle: orientation === "left" ? -90 : 90,
          fill: line.color,
          fontSize: 12,
        }}
        axisLine
        tickLine={false}
      />
    );
  });

  return (
    <div className="card-modern p-6">
      <div className="text-lg font-semibold text-[var(--text)] mb-4">
        Trend over time
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            // compute margins so extra axes on each side have room.
            margin={{
              top: 20,
              // base right and left margins plus extra space for additional axes per side
              right:
                60 +
                Math.max(0, Math.floor((lines.length - 1) / 2) - 0) *
                  extraAxisSpacing,
              left:
                40 +
                Math.max(0, Math.floor(lines.length / 2) - 1) *
                  extraAxisSpacing,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            />
            {yAxes}
            <Tooltip
              formatter={(value) => formatNumber(value)} // apply same abbrev in tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text)",
              }}
            />
            <Legend />
            {lines.map((l, idx) => (
              <Line
                key={l.dataKey}
                yAxisId={`y${idx}`}
                type="monotone"
                dataKey={l.dataKey}
                stroke={l.color}
                strokeWidth={3}
                dot={{ fill: l.color, strokeWidth: 2, r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
