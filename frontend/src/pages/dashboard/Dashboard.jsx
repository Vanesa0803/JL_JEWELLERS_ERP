import SummarySection from "../../components/dashboard/SummarySection";
import MetalRateSection from "../../components/dashboard/MetalRateSection";
import SalesOverview from "../../components/dashboard/SalesOverview";
import RecentBills from "../../components/dashboard/RecentBills";
import RecentActivities from "../../components/dashboard/RecentActivities";
import LowStockProducts from "../../components/dashboard/LowStockProducts";
import TopSellingProducts from "../../components/dashboard/TopSellingProducts";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#2B2622]">
          Welcome, Mr. Chepuri
        </h1>

        <p className="mt-1 text-sm text-[#85786D]">
          Overview of your jewellery business
        </p>
      </div>

      {/* Summary Cards */}
      <SummarySection />

      {/* Metal Rates */}
      <MetalRateSection />

      {/*Sales Overview*/}
      <SalesOverview />


    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
  <RecentBills />
  <RecentActivities />
</div>

<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
  <LowStockProducts />
  <TopSellingProducts />
</div>
    </div>
  );
};

export default Dashboard;