// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Default timeout for requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

// API Endpoints
export const API_ENDPOINTS = {
  METRICS_SUMMARY: '/v1/metrics/summary',
  METRICS_TRENDS: '/v1/metrics/trends',
  METRICS_TABLE: '/v1/metrics',
  METRICS_HISTOGRAM: '/v1/metrics/timeseries/histogram',
  METRIC_DETAIL: '/v1/metrics',
}

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to handle API errors
export const handleApiError = (error, context = 'API call') => {
  console.error(`${context} failed:`, error)
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    throw new Error(`API Error ${status}: ${data?.message || 'Unknown error'}`)
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Network error: Unable to connect to server')
  } else {
    // Something else happened
    throw new Error(`Request error: ${error.message}`)
  }
}
