export default function MetricCard({ title, value, delta, subtitle }) {
  const deltaColor = delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-slate-500'
  const deltaSign = delta > 0 ? '+' : ''
  return (
    <div className="card-modern p-6 hover:shadow-lg transition-all duration-200">
      <div className="text-sm text-[var(--text-muted)] font-medium">{title}</div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-[var(--text)]">{value}</div>
          {subtitle && <div className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</div>}
        </div>
        <div className={`text-sm font-semibold px-2 py-1 rounded-full ${deltaColor} ${delta > 0 ? 'bg-emerald-50' : delta < 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
          {deltaSign}{delta}%
        </div>
      </div>
    </div>
  )
}


