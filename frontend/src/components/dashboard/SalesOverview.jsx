import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
  { month: "Apr", sales: 0 },
  { month: "May", sales: 0 },
  { month: "Jun", sales: 0 },
  { month: "Jul", sales: 0 },
  { month: "Aug", sales: 0 },
  { month: "Sep", sales: 0 },
  { month: "Oct", sales: 0 },
  { month: "Nov", sales: 0 },
  { month: "Dec", sales: 0 },
];

const SalesOverview = () => {
  return (
    <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-[#85786D]">
            Track your sales performance
          </p>
        </div>

        <select
          className="h-9 rounded-lg border border-[#E7DED3] bg-white px-3 text-sm text-[#5F554D] outline-none focus:border-[#B8860B]"
          defaultValue="year"
        >
          <option value="year">This Year</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Total */}
      <div className="mt-6">
        <p className="text-sm text-[#85786D]">
          Total Sales
        </p>

        <p className="mt-1 text-3xl font-semibold text-[#2B2622]">
          ₹0
        </p>
      </div>

      {/* Chart */}
      <div className="mt-8 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />

            <Tooltip
              formatter={(value) => [`₹${value}`, "Sales"]}
            />

            <Area
              type="monotone"
              dataKey="sales"
              strokeWidth={2}
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SalesOverview;