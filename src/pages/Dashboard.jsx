import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MetricCard from "../components/MetricCard";
import TrendChart from "../components/TrendChart";
import DataTable from "../components/DataTable";
import { getMetricsHistogram, getMetricsList } from "../services/api";
import {
  avgDatapoint,
  avgMTS,
  computeSummary,
  padHistogramBuckets,
  sumDatapoint,
  sumMTS,
} from "../util";

const collection_name = "observability_metrics_dim_20_card_4";

export default function Dashboard() {
  const [hours, setHours] = useState(1);
  const [search, setSearch] = useState("");
  const interval_minutes = hours * 5;
  const interval_count = 12;

  const hours_in_ms = hours * 60 * 60 * 1000;
  const start_time = new Date(Date.now() - hours_in_ms * 2);

  const {
    data: histogram,
    isLoading: loadingHistogram,
    isError: errorHistogram,
  } = useQuery({
    queryKey: ["histogram", hours],
    queryFn: async () => {
      const data = await getMetricsHistogram(collection_name, {
        start_time,
        page_size: interval_count * 2,
        interval_minutes,
      });
      data.buckets = padHistogramBuckets(
        start_time,
        interval_minutes,
        interval_count * 2,
        data.buckets,
      );
      return data;
    },
  });

  const {
    data: metricsList,
    isLoading: loadingTable,
    isError: errorTable,
  } = useQuery({
    queryKey: ["metricsList"],
    queryFn: () => getMetricsList(collection_name),
  });

  const chartData = useMemo(() => {
    if (!histogram?.buckets) return [];
    return histogram.buckets.slice(interval_count).map((b) => ({
      time: b.timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mts: b.mts_count,
    }));
  }, [histogram]);

  const {
    current: currentAvgMTS,
    prev: prevAvgMTS,
    change: percentChangeMTS,
  } = useMemo(() => {
    return computeSummary(histogram, avgMTS);
  }, [histogram]);

  const {
    current: currentTotalMTS,
    prev: prevTotalMTS,
    change: totalChangeMTS,
  } = useMemo(() => {
    return computeSummary(histogram, sumMTS);
  }, [histogram]);

  const {
    current: currentAvgDatapoints,
    prev: prevAvgDatapoints,
    change: percentChangeDatapoints,
  } = useMemo(() => {
    return computeSummary(histogram, avgDatapoint);
  }, [histogram]);

  const {
    current: currentTotalDatapoints,
    prev: prevTotalDatapoints,
    change: totalChangeDatapoints,
  } = useMemo(() => {
    return computeSummary(histogram, sumDatapoint);
  }, [histogram]);

  const {
    current: currentPointsPerMTS,
    prev: prevPointsPerMTS,
    change: changePointsPerMTS,
  } = useMemo(() => {
    return computeSummary(histogram, (buckets) => {
      const datapoints = sumDatapoint(buckets);
      const mts = sumMTS(buckets);
      return mts == 0 ? 0 : Math.round(datapoints / mts);
    });
  }, [histogram]);

  const {
    current: currentAvgPointsPerMTS,
    prev: prevAvgPointsPerMTS,
    change: changeAvgPointsPerMTS,
  } = useMemo(() => {
    return computeSummary(histogram, (buckets) => {
      const datapoints = avgDatapoint(buckets);
      const mts = sumMTS(buckets);
      return mts == 0 ? 0 : Math.round(datapoints / mts);
    });
  }, [histogram]);

  const filteredMetrics = useMemo(() => {
    const rows = metricsList?.metrics ?? [];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((m) => m.metric_name.toLowerCase().includes(q));
  }, [metricsList, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="input-modern"
        >
          <option value={1}>Last 1 hours</option>
          <option value={12}>Last 12 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
          <option value={72}>Last 72 hours</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total MTS"
          value={currentTotalMTS.toLocaleString()}
          delta={totalChangeMTS}
          subtitle={`Prev: ${prevTotalMTS.toLocaleString()}`}
        />
        <MetricCard
          title="Total Datapoints"
          value={currentTotalDatapoints.toLocaleString()}
          delta={totalChangeDatapoints}
          subtitle={`Prev: ${prevTotalDatapoints.toLocaleString()}`}
        />
        <MetricCard
          title="Datapoints/MTS"
          value={currentPointsPerMTS.toLocaleString()}
          delta={changePointsPerMTS}
          subtitle={`Prev: ${prevPointsPerMTS.toLocaleString()}`}
        />
        <MetricCard
          title="Avg MTS"
          value={currentAvgMTS.toLocaleString()}
          delta={percentChangeMTS}
          subtitle={`Prev: ${prevAvgMTS.toLocaleString()}`}
        />
        <MetricCard
          title="Avg Datapoints"
          value={currentAvgDatapoints.toLocaleString()}
          delta={percentChangeDatapoints}
          subtitle={`Prev: ${prevAvgDatapoints.toLocaleString()}`}
        />
        <MetricCard
          title="Avg Datapoints/MTS"
          value={currentAvgPointsPerMTS.toLocaleString()}
          delta={changeAvgPointsPerMTS}
          subtitle={`Prev: ${prevAvgPointsPerMTS.toLocaleString()}`}
        />
      </div>

      <section>
        {loadingHistogram && <div className="text-sm">Loading chart…</div>}
        {errorHistogram && (
          <div className="text-sm text-red-600">Failed to load chart.</div>
        )}
        {chartData && (
          <TrendChart
            data={chartData}
            lines={[{ dataKey: "mts", color: "#06b6d4", label: "MTS" }]}
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search metric name"
            className="input-modern w-full max-w-sm"
          />
        </div>
        <DataTable
          isLoading={loadingTable}
          isError={errorTable}
          columns={[
            { key: "metric_name", header: "Metric name" },
            {
              key: "utilization",
              header: "Utilization",
              cell: (r) => r.utilization.join(", "),
            },
            { key: "mts_count", header: "Metric time series (MTS)" },
            { key: "datapoint_count", header: "Datapoints" },
            {
              key: "mts_percentage_of_total",
              header: "Percentage over total (MTS)",
              cell: (r) => `${r.mts_percentage_of_total.toFixed(2)}%`,
            },
            {
              key: "datapoint_percentage_of_total",
              header: "Percentage over total (Datapoints)",
              cell: (r) => `${r.datapoint_percentage_of_total.toFixed(2)}%`,
            },
          ]}
          data={filteredMetrics}
        />
      </section>
    </div>
  );
}
