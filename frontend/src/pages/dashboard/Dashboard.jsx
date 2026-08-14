import { RefreshCw, AlertCircle } from "lucide-react";

import SummarySection from "../../components/dashboard/SummarySection";
import MetalRateSection from "../../components/dashboard/MetalRateSection";
import SalesOverview from "../../components/dashboard/SalesOverview";
import RecentBills from "../../components/dashboard/RecentBills";
import RecentActivities from "../../components/dashboard/RecentActivities";
import LowStockProducts from "../../components/dashboard/LowStockProducts";
import TopSellingProducts from "../../components/dashboard/TopSellingProducts";

import useApi from "../../hooks/useApi";
import useAuthStore from "../../store/authStore";

/**
 * The dashboard.
 *
 * ONE request feeds all seven widgets — GET /dashboard returns summary,
 * sales_overview, recent_bills, recent_activities, low_stock_products and
 * top_selling_products together. Each widget takes its slice as a prop and
 * owns nothing; this page is the only thing here that talks to the API.
 *
 * That is the pattern the rest of the screens should follow: the page fetches,
 * the components display.
 */
const Dashboard = () => {
  const { data, loading, error, reload } = useApi("/dashboard");
  const user = useAuthStore((state) => state.user);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2B2622]">
            {firstName ? `Welcome, ${firstName}` : "Welcome"}
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Overview of your jewellery business
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[#E7DED3] bg-white px-4 py-2 text-sm font-medium text-[#5F554D] transition hover:bg-[#F7F3EE] disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/*
        An error here means the API could not be reached or returned a failure.
        It says so plainly and offers a retry, rather than rendering empty
        widgets that look like a business with no sales.
      */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-[#E4B4AE] bg-[#FBF1EF] px-4 py-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#A33A2B]" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#A33A2B]">
              Could not load the dashboard
            </p>
            <p className="mt-0.5 text-sm text-[#8A5049]">{error}</p>
          </div>

          <button
            type="button"
            onClick={reload}
            className="shrink-0 text-sm font-medium text-[#A33A2B] underline"
          >
            Try again
          </button>
        </div>
      )}

      <SummarySection summary={data?.summary} />

      <MetalRateSection summary={data?.summary} />

      <SalesOverview salesOverview={data?.sales_overview} loading={loading} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RecentBills bills={data?.recent_bills} loading={loading} />
        <RecentActivities activities={data?.recent_activities} loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <LowStockProducts products={data?.low_stock_products} loading={loading} />
        <TopSellingProducts products={data?.top_selling_products} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
