import axios from "axios";
import { API_CONFIG, API_ENDPOINTS, handleApiError } from "../config/api";

/**
 * @typedef {{
 *   timestamp: Date,
 *   mts_count: number,
 *   datapoint_count: number,
 *   avg_point_per_mts: number,
 * }} HistogramBucket
 *
 * @typedef {{
 *   start_time: Date,
 *   interval_minutes: number,
 *   page: number,
 *   page_size: number,
 *   total_buckets: number,
 *   buckets: HistogramBucket[]
 * }} HistogramResponse
 *
 * @typedef {{
 *   metric_name: string,
 *   utilization: string[],
 *   mts_count: number,
 *   datapoint_count: number,
 *   avg_points_per_mts: number,
 *   mts_percentage_of_total: number,
 *   datapoint_percentage_of_total: number,
 * }} Metric
 *
 * @typedef {{
 *   total_count: number,
 *   total_mts: number,
 *   total_datapoints: number,
 *   page: number,
 *   page_size: number,
 *   metrics: Metric[]
 * }} MetricListResponse
 *
 */

// Configure axios instance
const http = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchMetricsSummary() {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_SUMMARY);
    return data;
  } catch (error) {
    handleApiError(error, "Fetch metrics summary");
  }
}

export async function fetchTrends() {
  try {
    const { data } = await http.get(API_ENDPOINTS.METRICS_TRENDS);
    return data;
  } catch (error) {
    handleApiError(error, "Fetch trends");
  }
}

// --- MTS spec endpoints ---
/**
 * Fetches metrics histogram data.
 *
 * @param {string} collection_name - Name of the collection.
 * @param {Object} options - Configuration parameters.
 * @param {Date} options.start_time - The start time for the histogram data.
 * @param {number} [options.interval_minutes=5] - Interval between data points, in minutes.
 * @param {number} [options.page=0] - The page number for pagination.
 * @param {number} [options.page_size=24] - The number of items per page.
 * @returns {Promise<HistogramResponse>} The histogram response from the API.
 */
export async function getMetricsHistogram(
  collection_name,
  { start_time, interval_minutes = 5, page = 0, page_size = 24 },
) {
  try {
    const { data } = await http.get(
      API_ENDPOINTS.metrics_histogram(collection_name),
      {
        params: {
          start_time: start_time.toISOString(),
          interval_minutes,
          page,
          page_size,
        },
      },
    );
    // converting string timestamps to `Date` objects
    return {
      ...data,
      start_time: new Date(data.start_time),
      buckets: data.buckets.map((bucket) => ({
        ...bucket,
        timestamp: new Date(bucket.timestamp),
      })),
    };
  } catch (error) {
    handleApiError(error, "Fetch metrics histogram");
  }
}

/**
 * Fetches list of all metrics.
 *
 * @param {string} collection_name - Name of the collection.
 * @param {Object} [options] - Configuration parameters.
 * @param {number} [options.page=0] - The page number for pagination.
 * @param {number} [options.page_size=10] - The number of items per page.
 * @param {"name" | "mts_count" | "datapoint_count" | "mts_percentage" | "datapoint_percentage"} [options.sort_by="name"] - The
 * @param {"asc" | "desc"} [options.sort_order="asc"]
 * @returns {Promise<MetricListResponse>}
 */
export async function getMetricsList(
  collection_name,
  { page = 0, page_size = 10, sort_by = "name", sort_order = "asc" } = {},
) {
  try {
    const { data } = await http.get(API_ENDPOINTS.metrics_list(collection_name), {
      params: { page, page_size, sort_by, sort_order },
    });
    return data;
  } catch (error) {
    handleApiError(error, "Fetch metrics list");
  }
}

/**
 * Fetches histogram data for a single metric.
 *
 * @param {string} collection_name - Name of the collection.
 * @param {string} metric_name - Name of the metric.
 * @param {Object} options - Configuration parameters.
 * @param {Date} options.start_time - The start time for the histogram data.
 * @param {number} [options.interval_minutes=5] - Interval between data points, in minutes.
 * @param {number} [options.page=0] - The page number for pagination.
 * @param {number} [options.page_size=24] - The number of items per page.
 * @returns {Promise<HistogramResponse | { metric_name: string }>} The histogram response from the API.
 */
export async function getMetricDetail(
  collection_name,
  metric_name,
  { start_time, interval_minutes = 5, page = 0, page_size = 24 },
) {
  try {
    const { data } = await http.get(
      API_ENDPOINTS.metric_histogram(collection_name, metric_name),
      {
        params: { start_time: start_time.toISOString(), interval_minutes, page, page_size },
      },
    );
    // converting string timestamps to `Date` objects
    return {
      ...data,
      start_time: new Date(data.start_time),
      buckets: data.buckets.map((bucket) => ({
        ...bucket,
        timestamp: new Date(bucket.timestamp),
      })),
    };
  } catch (error) {
    handleApiError(error, "Fetch metric detail");
  }
}
