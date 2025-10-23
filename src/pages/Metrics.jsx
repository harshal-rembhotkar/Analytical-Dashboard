import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import { getMetricsList } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const collection_name = "observability_metrics_dim_20_card_4";

export default function Metrics() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["metrics", page, pageSize, sortBy, sortOrder],
    queryFn: () =>
      getMetricsList(collection_name, {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    keepPreviousData: true,
  });

  const filtered = useMemo(() => {
    const rows = data?.metrics ?? [];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((m) => m.metric_name.toLowerCase().includes(q));
  }, [data, search]);

  const total = data?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search metric name"
          className="input-modern"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-modern"
        >
          <option value="name">Sort: Name</option>
          <option value="mts_count">Sort: MTS</option>
          <option value="datapoint_count">Sort: Datapoint</option>
          <option value="mts_percentage">Sort: % of total (MTS)</option>
          <option value="datapoint_percentage">
            Sort: % of total (Datapoint)
          </option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="input-modern"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="input-modern"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        {selected.length >= 2 && (
          <button
            onClick={() => navigate("/compare-metrics/" + selected.join(","))}
            className="btn-secondary ml-auto"
          >
            Compare
          </button>
        )}
      </div>

      <DataTable
        isLoading={isLoading}
        isError={isError}
        columns={[
          {
            key: "select",
            header: "",
            cell: (r) => (
              <input
                type="checkbox"
                checked={selected.includes(r.metric_name)}
                disabled={
                  !selected.includes(r.metric_name) && selected.length >= 4
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected([...selected, r.metric_name]);
                  } else {
                    setSelected(
                      selected.filter((name) => name != r.metric_name),
                    );
                  }
                }}
              />
            ),
          },
          {
            key: "metric_name",
            header: "Metric name",
            cell: (r) => (
              <Link
                className="text-blue-600"
                to={`/metrics/${encodeURIComponent(r.metric_name)}`}
              >
                {r.metric_name}
              </Link>
            ),
          },
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
        data={filtered}
      />

      <div className="flex items-center gap-2 justify-end">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="btn-secondary disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page + 1} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
          className="btn-secondary disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
