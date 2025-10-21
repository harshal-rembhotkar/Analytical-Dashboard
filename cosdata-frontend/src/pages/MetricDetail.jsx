import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMetricDetail } from '../services/api'
import TrendChart from '../components/TrendChart'

export default function MetricDetail() {
  const { metric } = useParams()
  const [hours, setHours] = useState(24)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['metric-detail', metric, hours],
    queryFn: () => getMetricDetail(metric, { page_size: hours }),
  })

  const chartData = useMemo(() => {
    if (!data?.buckets) return []
    return data.buckets.map((b) => ({
      time: new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit' }),
      mts: b.mts_count,
    }))
  }, [data])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold break-all">{metric}</h2>
        <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
          <option value={72}>Last 72 hours</option>
        </select>
      </div>

      {isLoading && <div className="text-sm">Loading…</div>}
      {isError && <div className="text-sm text-red-600">Failed to load metric.</div>}
      {chartData && <TrendChart data={chartData} lines={[{ dataKey: 'mts', color: '#06b6d4', label: 'MTS' }]} />}
    </div>
  )
}


