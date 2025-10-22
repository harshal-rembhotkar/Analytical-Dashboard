# API Integration Guide

This document explains how to integrate the frontend with a real backend API instead of using mock data.

## Backend API Requirements

The frontend expects the following API endpoints to be implemented:

### 1. Metrics Summary
- **Endpoint**: `GET /api/v1/metrics/summary`
- **Purpose**: Get summary metrics for dashboard cards
- **Response**: Array of metric objects with `title`, `value`, `delta`, `subtitle`
- **Example Response**:
```json
[
  {
    "title": "CPU Load",
    "value": "42%",
    "delta": -3,
    "subtitle": "vs last hour"
  },
  {
    "title": "API Latency", 
    "value": "123 ms",
    "delta": 5,
    "subtitle": "p95"
  }
]
```

### 2. Metrics Trends
- **Endpoint**: `GET /api/v1/metrics/trends`
- **Purpose**: Get trend data for charts
- **Response**: Object with `data` array and `lines` configuration

### 3. Metrics Table
- **Endpoint**: `GET /api/v1/metrics`
- **Purpose**: Get paginated list of metrics
- **Parameters**: `page`, `page_size`, `sort_by`, `sort_order`
- **Response**: Object with `total_count`, `total_mts`, `total_datapoints`, `page`, `page_size`, `metrics` array

### 4. Metrics Histogram
- **Endpoint**: `GET /api/v1/metrics/timeseries/histogram`
- **Purpose**: Get time-bucketed MTS counts for trend visualization
- **Parameters**: `start_time`, `interval_minutes`, `page`, `page_size`
- **Response**: Object with `start_time`, `interval_minutes`, `page`, `page_size`, `total_buckets`, `buckets` array

### 5. Metric Detail
- **Endpoint**: `GET /api/v1/metrics/{metric_name}`
- **Purpose**: Get detailed MTS stats for a single metric
- **Parameters**: `start_time`, `interval_minutes`, `page`, `page_size`
- **Response**: Object with `metric_name` and histogram data

## Frontend Configuration

### Environment Variables

Create a `.env` file in the `cosdata-frontend` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Development Configuration
VITE_DEV_MODE=true
```

### API Base URL

The frontend is configured to use the `VITE_API_BASE_URL` environment variable. If not set, it defaults to `/api`.

Update the base URL in `src/config/api.js` if needed:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  // ... other config
}
```

## Data Structure Requirements

### Histogram Response
```json
{
  "start_time": "2025-10-13T00:00:00Z",
  "interval_minutes": 60,
  "page": 1,
  "page_size": 24,
  "total_buckets": 168,
  "buckets": [
    {
      "timestamp": "2025-10-13T00:00:00Z",
      "mts_count": 30000,
      "datapoint_count": 1200000,
      "avg_points_per_mts": 40
    }
  ]
}
```

### Metrics List Response
```json
{
  "total_count": 150,
  "total_mts": 23610,
  "total_datapoints": 9850000,
  "page": 1,
  "page_size": 10,
  "metrics": [
    {
      "metric_name": "container_cpu_utilization",
      "utilization": ["active_charts", "detectors"],
      "mts_count": 143,
      "datapoint_count": 450000,
      "avg_points_per_mts": 3146.85,
      "percentage_of_total": 0.61
    }
  ]
}
```

## Error Handling

The frontend includes comprehensive error handling:

- Network errors are caught and displayed to users
- API errors include status codes and messages
- Loading states are shown during API calls
- Error boundaries prevent crashes

## CORS Configuration

Ensure your backend API has proper CORS configuration to allow requests from the frontend:

```javascript
// Example for Express.js
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}))
```

## Testing the Integration

1. Start your backend API server
2. Update the `VITE_API_BASE_URL` in your `.env` file
3. Start the frontend development server: `npm run dev`
4. Check the browser console for any API errors
5. Verify that data loads correctly in the dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has proper CORS configuration
2. **404 Errors**: Check that your API endpoints match the expected paths
3. **Data Format Errors**: Ensure your API responses match the expected data structure
4. **Network Errors**: Check that your backend is running and accessible

### Debug Mode

Enable debug logging by setting `VITE_DEV_MODE=true` in your `.env` file. This will log additional information about API calls and responses.

## Production Deployment

For production deployment:

1. Set the correct `VITE_API_BASE_URL` for your production API
2. Ensure your backend API is accessible from the frontend domain
3. Configure proper CORS settings for your production domain
4. Test all API endpoints in the production environment
