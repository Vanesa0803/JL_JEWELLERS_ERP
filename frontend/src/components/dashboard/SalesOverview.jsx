import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { money } from "../../lib/format";

/**
 * From GET /dashboard -> data.sales_overview, which returns
 * { date, sales } for the last 7 days of completed bills.
 *
 * The mock version showed twelve months and carried a "This Year / This Month"
 * dropdown that was not wired to anything. Both are gone: the heading now says
 * what the data actually is, and a control that silently does nothing is worse
 * than no control.
 *
 * A working range selector belongs on GET /dashboard/sales-analytics, which
 * already accepts from_date and to_date. That is a small follow-up, not
 * something to fake here.
 */
const dayLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value ?? "");
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const SalesOverview = ({ salesOverview, loading }) => {
  const rows = (salesOverview ?? []).map((row) => ({
    label: dayLabel(row.date),
    sales: Number(row.sales) || 0,
  }));

  const total = rows.reduce((sum, row) => sum + row.sales, 0);

  return (
    <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#2B2622]">Sales Overview</h2>
        <p className="mt-1 text-sm text-[#85786D]">Completed bills, last 7 days</p>
      </div>

      {/* Total */}
      <div className="mt-6">
        <p className="text-sm text-[#85786D]">Total Sales</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-[#2B2622]">
          {loading ? "…" : money(total)}
        </p>
      </div>

      {/* Chart */}
      <div className="mt-8 h-[320px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#9B8E83]">
            Loading chart…
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#9B8E83]">
            No completed bills in the last 7 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={rows}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE6DE" />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9B8E83" }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9B8E83" }}
                tickFormatter={(value) => money(value)}
                width={80}
              />

              <Tooltip formatter={(value) => [money(value), "Sales"]} />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#B8860B"
                fill="#B8860B"
                strokeWidth={2}
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default SalesOverview;
