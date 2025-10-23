/**
 * Pads histogram buckets so that the result always has `page_size` entries.
 * Missing earlier intervals are filled with zero buckets with correct timestamps.
 *
 * @param {Date} start_time - The start time for the histogram.
 * @param {number} interval_minutes - Interval between each bucket in minutes.
 * @param {number} page_size - Expected number of buckets in the output.
 * @param {import('./services/api').HistogramBucket[]} buckets - Existing histogram buckets.
 * @returns {import('./services/api').HistogramBucket[]} - Padded list of histogram buckets.
 */
export function padHistogramBuckets(start_time, interval_minutes, page_size, buckets) {
  const intervalMs = interval_minutes * 60 * 1000;

  // Compute the expected timestamps
  const expectedTimestamps = Array.from({ length: page_size }, (_, i) =>
    new Date(start_time.getTime() + i * intervalMs)
  );

  const bucketMap = new Map(
    buckets.map(b => [b.timestamp.getTime(), b])
  );

  // Fill missing buckets
  const padded = expectedTimestamps.map(ts => {
    const existing = bucketMap.get(ts.getTime());
    return existing || {
      timestamp: ts,
      mts_count: 0,
      datapoint_count: 0,
      avg_point_per_mts: 0,
    };
  });

  return padded;
}

/**
 *
 * @param {import('./services/api').HistogramBucket[]} arr
 * @returns {number}
 */
export function sumMTS(arr) {
  return arr.reduce((s, bucket) => s + bucket.mts_count, 0)
}

/**
 *
 * @param {import('./services/api').HistogramBucket[]} arr
 * @returns {number}
 */
export function avgMTS(arr) {
  return Math.round(arr.length == 0 ? 0 : sumMTS(arr) / arr.length)
}

/**
 *
 * @param {import('./services/api').HistogramBucket[]} arr
 * @returns {number}
 */
export function sumDatapoint(arr) {
  return arr.reduce((s, bucket) => s + bucket.datapoint_count, 0)
}

/**
 *
 * @param {import('./services/api').HistogramBucket[]} arr
 * @returns {number}
 */
export function avgDatapoint(arr) {
  return Math.round(arr.length == 0 ? 0 : sumDatapoint(arr) / arr.length)
}

/**
 * 
 * @param {number} p 
 * @param {number} c
 * @returns {number} 
 */
export function calculateChange(p, c) {
  return p == 0 ? (c == 0 ? 0 : Math.sign(c) * 100) : Math.round(((c - p) / p) * 100)
}

/**
 * Computes a summary comparison between two halves of a histogram dataset.
 *
 * The function splits the given `buckets` array into two halves — previous and current —
 * then applies the provided `summarize` callback to each half to produce numeric summaries.
 * It finally returns an object containing the current, previous, and percentage change values.
 *
 * @param {import('./services/api').HistogramResponse | undefined} histogram - The list of histogram buckets to summarize.
 * @param {(buckets: import('./services/api').HistogramBucket[]) => number} summarize - 
 *   A callback function that takes an array of `HistogramBucket` and returns a numeric summary (e.g., sum, average, etc.).
 * @returns {{
 *   current: number,  // Summary of the current (second half) buckets
 *   prev: number,     // Summary of the previous (first half) buckets
 *   change: number    // Percentage or relative change from prev to current
 * }}
 */
export function computeSummary(histogram, summarize) {
  if (!histogram || histogram.buckets.length == 0) return {
    current: 0,
    prev: 0,
    change: 0
  };
  const half = Math.floor(histogram.buckets.length / 2);
  const cur = histogram.buckets.slice(half);
  const prev = histogram.buckets.slice(0, half);
  const c = summarize(cur);
  const p = summarize(prev);
  const change = calculateChange(p, c);
  return {
    current: c,
    prev: p,
    change
  }
}