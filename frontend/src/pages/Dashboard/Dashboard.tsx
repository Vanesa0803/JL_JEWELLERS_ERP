import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatsGrid from "../../components/dashboard/Cards/StatsGrid";
import SalesChart from "../../components/dashboard/Charts/SalesChart";
import QuickActionCard from "../../components/dashboard/Cards/QuickActionCard";

const Dashboard = () => {
  return (
   <DashboardLayout>

  <div className="mb-14">
    <h1 className="text-[35px] font-bold text-[#3C1414]">
      Dashboard
    </h1>

    <p className="mt-2 text-lg text-gray-600">
      Welcome back, Vanshika! 👋
    </p>
  </div>

  {/* KPI CARDS */}
<div className="mt-10">
  <StatsGrid />
  </div>

  {/* SECOND ROW */}

  <div className="grid grid-cols-4 gap-7 mb-10">
  <div className="col-span-8">
    <SalesChart />
  </div>

  <div className="col-span-4">
    <QuickActionCard />
  </div>

</div>

</DashboardLayout>
  );
};

export default Dashboard;