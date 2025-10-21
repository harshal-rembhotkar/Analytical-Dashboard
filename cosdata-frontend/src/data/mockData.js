// Summary cards
export const metricsSummary = [
  { title: 'CPU Load', value: '42%', delta: -3, subtitle: 'vs last hour' },
  { title: 'API Latency', value: '123 ms', delta: 5, subtitle: 'p95' },
  { title: 'Uptime', value: '99.98%', delta: 0.01, subtitle: '24h' },
  { title: 'Req/s', value: '2.1k', delta: 12, subtitle: 'avg' },
]

// Trend chart mock
const makeSeries = () => {
  const arr = []
  const now = Date.now()
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now - i * 60 * 60 * 1000)
    arr.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.round(30 + Math.random() * 50),
      latency: Math.round(80 + Math.random() * 120),
      uptime: Math.round(98 + Math.random() * 2 * 100) / 100,
    })
  }
  return arr
}

export const trendsData = {
  data: makeSeries(),
  lines: [
    { dataKey: 'cpu', color: '#3b82f6', label: 'CPU Load' },
    { dataKey: 'latency', color: '#22c55e', label: 'Latency' },
  ],
}

export const tableMetrics = makeSeries().map((d) => ({
  time: d.time,
  cpu: d.cpu,
  latency: d.latency,
  uptime: `${d.uptime}%`,
}))

// ---------------- MTS specific mocks per spec -----------------

export const makeHistogramBuckets = (hours = 24, startDate = new Date()) => {
  const buckets = []
  const start = new Date(startDate.getTime() - (hours - 1) * 60 * 60 * 1000)
  for (let i = 0; i < hours; i++) {
    const ts = new Date(start.getTime() + i * 60 * 60 * 1000)
    const mts = Math.round(20000 + Math.random() * 15000)
    buckets.push({
      timestamp: ts.toISOString(),
      mts_count: mts,
      datapoint_count: mts * Math.round(30 + Math.random() * 20),
      avg_points_per_mts: Math.round(30 + Math.random() * 20),
    })
  }
  return buckets
}

export const histogramResponse = (hours = 24) => {
  return {
    start_time: new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
    interval_minutes: 60,
    page: 1,
    page_size: hours,
    total_buckets: hours,
    buckets: makeHistogramBuckets(hours),
  }
}

export const metricsListResponse = () => {
  const list = [
    {
      metric_name: 'container_cpu_utilization',
      utilization: ['active_charts', 'detectors'],
      mts_count: 143,
      datapoint_count: 450000,
      avg_points_per_mts: 3146.85,
      percentage_of_total: 0.61,
    },
    {
      metric_name: 'cpu.utilization',
      utilization: ['detectors'],
      mts_count: 30,
      datapoint_count: 90000,
      avg_points_per_mts: 3000,
      percentage_of_total: 0.13,
    },
    {
      metric_name: 'container/cpu/utilizations',
      utilization: ['api_queries'],
      mts_count: 2,
      datapoint_count: 5400,
      avg_points_per_mts: 2700,
      percentage_of_total: 0.01,
    },
  ]
  return {
    total_count: list.length,
    total_mts: list.reduce((s, m) => s + m.mts_count, 0),
    total_datapoints: list.reduce((s, m) => s + m.datapoint_count, 0),
    page: 1,
    page_size: 10,
    metrics: list,
  }
}


