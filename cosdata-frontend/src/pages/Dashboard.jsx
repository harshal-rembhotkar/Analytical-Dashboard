import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import MetricCard from '../components/MetricCard'
import TrendChart from '../components/TrendChart'
import DataTable from '../components/DataTable'
import { fetchMetricsSummary, getMetricsHistogram, getMetricsList } from '../services/api'

export default function Dashboard() {
  const [hours, setHours] = useState(24)
  const [search, setSearch] = useState('')
  const { data: summary, isLoading: loadingSummary, isError: errorSummary } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchMetricsSummary,
  })

  const { data: histogram, isLoading: loadingHistogram, isError: errorHistogram } = useQuery({
    queryKey: ['histogram', hours],
    queryFn: () => getMetricsHistogram({ page_size: hours }),
  })

  const { data: metricsList, isLoading: loadingTable, isError: errorTable } = useQuery({
    queryKey: ['metricsList'],
    queryFn: () => getMetricsList({}),
  })

  const chartData = useMemo(() => {
    if (!histogram?.buckets) return []
    return histogram.buckets.map((b) => ({
      time: new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit' }),
      mts: b.mts_count,
    }))
  }, [histogram])

  const { currentAvg, prevAvg, percentChange } = useMemo(() => {
    const buckets = histogram?.buckets ?? []
    if (buckets.length === 0) return { currentAvg: 0, prevAvg: 0, percentChange: 0 }
    const half = Math.floor(buckets.length / 2)
    const cur = buckets.slice(half)
    const prev = buckets.slice(0, half)
    const avg = (arr) => Math.round(arr.reduce((s, b) => s + b.mts_count, 0) / Math.max(arr.length, 1))
    const c = avg(cur)
    const p = avg(prev)
    const change = p === 0 ? 0 : Math.round(((c - p) / p) * 100)
    return { currentAvg: c, prevAvg: p, percentChange: change }
  }, [histogram])

  const { currentTotal, prevTotal, totalChange } = useMemo(() => {
    const buckets = histogram?.buckets ?? []
    if (buckets.length === 0) return { currentTotal: 0, prevTotal: 0, totalChange: 0 }
    const half = Math.floor(buckets.length / 2)
    const cur = buckets.slice(half)
    const prev = buckets.slice(0, half)
    const sum = (arr) => arr.reduce((s, b) => s + b.mts_count, 0)
    const c = sum(cur)
    const p = sum(prev)
    const change = p === 0 ? 0 : Math.round(((c - p) / p) * 100)
    return { currentTotal: c, prevTotal: p, totalChange: change }
  }, [histogram])

  const filteredMetrics = useMemo(() => {
    const rows = metricsList?.metrics ?? []
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter((m) => m.metric_name.toLowerCase().includes(q))
  }, [metricsList, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="input-modern"
        >
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
          <option value={72}>Last 72 hours</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingSummary && <div className="text-sm">Loading metrics…</div>}
        {errorSummary && <div className="text-sm text-red-600">Failed to load summary.</div>}
        <MetricCard title="Total MTS" value={currentTotal.toLocaleString()} delta={totalChange} subtitle={`Prev: ${prevTotal.toLocaleString()}`} />
        <MetricCard title="Avg MTS/hr" value={currentAvg.toLocaleString()} delta={percentChange} subtitle={`Prev: ${prevAvg.toLocaleString()}`} />
        {summary && Array.isArray(summary) && summary.slice(0,2).map((m) => (
          <MetricCard key={m.title} title={m.title} value={m.value} delta={m.delta} subtitle={m.subtitle} />
        ))}
      </div>

      <section>
        {loadingHistogram && <div className="text-sm">Loading chart…</div>}
        {errorHistogram && <div className="text-sm text-red-600">Failed to load chart.</div>}
        {chartData && <TrendChart data={chartData} lines={[{ dataKey: 'mts', color: '#06b6d4', label: 'MTS' }]} />}
      </section>

      <section className="space-y-3">
        <div className="flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search metric name"
            className="input-modern w-full max-w-sm"
          />
        </div>
        <DataTable
          isLoading={loadingTable}
          isError={errorTable}
          columns={[
            { key: 'metric_name', header: 'Metric name' },
            { key: 'utilization', header: 'Utilization', cell: (r) => r.utilization.join(', ') },
            { key: 'mts_count', header: 'Metric time series (MTS)' },
            { key: 'percentage_of_total', header: 'Percentage over total', cell: (r) => `${(r.percentage_of_total * 100).toFixed(2)}%` },
          ]}
          data={filteredMetrics}
        />
      </section>
    </div>
  )
}


