import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS, handleApiError } from '../config/api'

// Configure axios instance
const http = axios.create({ 
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
})

export async function fetchMetricsSummary() {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_SUMMARY)
    return data
  } catch (error) {
    handleApiError(error, 'Fetch metrics summary')
  }
}

export async function fetchTrends() {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_TRENDS)
    return data
  } catch (error) {
    handleApiError(error, 'Fetch trends')
  }
}

export async function fetchTableMetrics() {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_TABLE)
    return data
  } catch (error) {
    handleApiError(error, 'Fetch table metrics')
  }
}

// --- MTS spec endpoints ---
export async function getMetricsHistogram({ start_time, interval_minutes = 60, page = 1, page_size = 24 } = {}) {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_HISTOGRAM, { 
      params: { start_time, interval_minutes, page, page_size } 
    })
    return data
  } catch (error) {
    handleApiError(error, 'Fetch metrics histogram')
  }
}

export async function getMetricsList({ page = 1, page_size = 10, sort_by = 'name', sort_order = 'asc' } = {}) {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_TABLE, { 
      params: { page, page_size, sort_by, sort_order } 
    })
    return data
  } catch (error) {
    handleApiError(error, 'Fetch metrics list')
  }
}

export async function getMetricDetail(metric_name, { start_time, interval_minutes = 60, page = 1, page_size = 24 } = {}) {
  try {
    const { data } = await http.get(`${API_ENDPOINTS.METRIC_DETAIL}/${metric_name}`, { 
      params: { start_time, interval_minutes, page, page_size } 
    })
    return data
  } catch (error) {
    handleApiError(error, 'Fetch metric detail')
  }
}


