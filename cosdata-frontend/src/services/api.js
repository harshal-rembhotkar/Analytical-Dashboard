import axios from 'axios'
import { metricsSummary, trendsData, tableMetrics, histogramResponse, metricsListResponse } from '../data/mockData'

// Placeholder endpoints; switch to real API later
const http = axios.create({ baseURL: '/' })

export async function fetchMetricsSummary() {
  // const { data } = await http.get('/api/metrics/summary')
  // return data
  await new Promise((r) => setTimeout(r, 300))
  return metricsSummary
}

export async function fetchTrends() {
  // const { data } = await http.get('/api/trends')
  await new Promise((r) => setTimeout(r, 300))
  return trendsData
}

export async function fetchTableMetrics() {
  // const { data } = await http.get('/api/metrics')
  await new Promise((r) => setTimeout(r, 300))
  return tableMetrics
}

// --- MTS spec endpoints (mocked) ---
export async function getMetricsHistogram({ start_time, interval_minutes = 60, page = 1, page_size = 24 } = {}) {
  // const { data } = await http.get('/api/v1/metrics/timeseries/histogram', { params: { start_time, interval_minutes, page, page_size } })
  await new Promise((r) => setTimeout(r, 300))
  return histogramResponse(page_size)
}

export async function getMetricsList({ page = 1, page_size = 10, sort_by = 'name', sort_order = 'asc' } = {}) {
  // const { data } = await http.get('/api/v1/metrics', { params: { page, page_size, sort_by, sort_order } })
  await new Promise((r) => setTimeout(r, 300))
  const res = metricsListResponse()
  // simple client-side mock for sorting and pagination on the mock payload
  const keyMap = { name: 'metric_name', mts_count: 'mts_count', percentage: 'percentage_of_total' }
  const key = keyMap[sort_by] || 'metric_name'
  const sorted = [...res.metrics].sort((a, b) => {
    const dir = sort_order === 'desc' ? -1 : 1
    if (a[key] < b[key]) return -1 * dir
    if (a[key] > b[key]) return 1 * dir
    return 0
  })
  const start = (page - 1) * page_size
  const paged = sorted.slice(start, start + page_size)
  return { ...res, page, page_size, metrics: paged }
}

export async function getMetricDetail(metric_name, { start_time, interval_minutes = 60, page = 1, page_size = 24 } = {}) {
  // const { data } = await http.get(`/api/v1/metrics/${metric_name}`, { params: { start_time, interval_minutes, page, page_size } })
  await new Promise((r) => setTimeout(r, 300))
  const base = histogramResponse(page_size)
  return { metric_name, ...base }
}


