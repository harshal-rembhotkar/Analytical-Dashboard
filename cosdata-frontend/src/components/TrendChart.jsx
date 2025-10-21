import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function TrendChart({ data, lines }) {
  return (
    <div className="card-modern p-6">
      <div className="text-lg font-semibold text-[var(--text)] mb-4">Trend over time</div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)', 
                borderRadius: '8px',
                color: 'var(--text)'
              }} 
            />
            <Legend />
            {lines.map((l) => (
              <Line key={l.dataKey} type="monotone" dataKey={l.dataKey} stroke={l.color} strokeWidth={3} dot={{ fill: l.color, strokeWidth: 2, r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


