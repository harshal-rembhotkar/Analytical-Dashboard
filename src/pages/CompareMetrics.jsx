import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMetricDetail } from '../services/api'
import TrendChart from '../components/TrendChart'
import { padHistogramBuckets } from '../util';
import NotFound from './NotFound'

const collection_name = "observability_metrics_dim_20_card_4";

const colors = ["#06b6d4", "#0901ecff", "#e89b16ff", "#22e34cff"]

export default function MetricDetail() {
  const { metrics: metricsStr } = useParams()
  const metrics = metricsStr.split(",")
  const [hours, setHours] = useState(1)
  const interval_minutes = hours * 5
  const start_time = new Date(Date.now() - hours * 60 * 60 * 1000)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['metric-detail', metrics, hours],
    queryFn: async () => {
      const data = await Promise.all(metrics.map(metric => getMetricDetail(collection_name, metric, { start_time, page_size: 12, interval_minutes })))
      data.forEach((data) => data.buckets = padHistogramBuckets(start_time, interval_minutes, 12, data.buckets))
      return data
    },
  })

  const chartData = useMemo(() => {
    if (!data) return []
    const chartData = data[0].buckets.map(bucket => ({
      time: bucket.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      [data[0].metric_name]: bucket.mts_count
    }));
    for (let i = 1; i < data.length; i++) {
      const metric_name = data[i].metric_name
      const buckets = data[i].buckets;
      for (let j = 0; j < buckets.length; j++) {
        chartData[j][metric_name] = buckets[j].mts_count
      }
    }
    return chartData;
  }, [data])

  const chartLines = useMemo(() => {
    if (!data) return []
    return data.map((data, i) => ({ dataKey: data.metric_name, color: colors[i], label: data.metric_name }))
  }, [data])

  if (metricsStr.length == 0 || metrics.length > 4) return NotFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold break-all">{metrics.join(" vs ")}</h2>
        <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">
          <option value={1}>Last 1 hours</option>
          <option value={12}>Last 12 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
          <option value={72}>Last 72 hours</option>
        </select>
      </div>

      {isLoading && <div className="text-sm">Loading…</div>}
      {isError && <div className="text-sm text-red-600">Failed to load metric.</div>}
      {chartData && <TrendChart data={chartData} lines={chartLines} />}
    </div>
  )
}