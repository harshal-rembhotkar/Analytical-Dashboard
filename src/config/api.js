// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",

  // Default timeout for requests (in milliseconds)
  TIMEOUT: 10000,

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * API endpoint generators for metrics-related routes.
 *
 * Each function constructs a URL path for accessing metric data within a specific collection.
 *
 * @namespace API_ENDPOINTS
 */
export const API_ENDPOINTS = {
  /**
   * Returns the API endpoint for listing all metrics in a collection.
   *
   * @param {string} collection_name - The name of the collection.
   * @returns {string} The URL path for the metrics list endpoint.
   * @example
   * API_ENDPOINTS.metrics_list("orders");
   * // "/v1/collections/orders/metrics"
   */
  metrics_list: (collection_name) =>
    `/v1/collections/${collection_name}/metrics`,

  /**
   * Returns the API endpoint for the histogram timeseries of all metrics in a collection.
   *
   * @param {string} collection_name - The name of the collection.
   * @returns {string} The URL path for the metrics histogram endpoint.
   * @example
   * API_ENDPOINTS.metrics_histogram("orders");
   * // "/v1/collections/orders/metrics/timeseries/histogram"
   */
  metrics_histogram: (collection_name) =>
    `/v1/collections/${collection_name}/metrics/timeseries/histogram`,

  /**
   * Returns the API endpoint for the histogram timeseries of a specific metric in a collection.
   *
   * @param {string} collection_name - The name of the collection.
   * @param {string} metric_name - The name of the metric.
   * @returns {string} The URL path for the specific metric histogram endpoint.
   * @example
   * API_ENDPOINTS.metric_histogram("orders", "latency");
   * // "/v1/collections/orders/metrics/latency"
   */
  metric_histogram: (collection_name, metric_name) =>
    `/v1/collections/${collection_name}/metrics/${metric_name}`,
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to handle API errors
export const handleApiError = (error, context = "API call") => {
  console.error(`${context} failed:`, error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    throw new Error(`API Error ${status}: ${data?.message || "Unknown error"}`);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error("Network error: Unable to connect to server");
  } else {
    // Something else happened
    throw new Error(`Request error: ${error.message}`);
  }
};
