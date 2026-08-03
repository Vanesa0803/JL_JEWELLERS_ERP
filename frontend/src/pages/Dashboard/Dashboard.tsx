import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardGrid from "../../components/dashboard/Cards/DashboardGrid";
import KPISection from "../../components/dashboard/sections/KPISection";
import SalesOverviewSection from "../../components/dashboard/sections/SalesOverviewSection";

const Dashboard = () => {
  return (
    <DashboardLayout>

      <section className="mb-12">

  <h1 className="text-[44px] font-bold tracking-tight text-[#3C1414]">
    Dashboard
  </h1>

  <p className="mt-2 text-[16px] text-[#7B7B7B]">
    Welcome back, Vanshika! 👋
  </p>

</section>

    <KPISection />

    <SalesOverviewSection />

    </DashboardLayout>
  );
};

export default Dashboard;