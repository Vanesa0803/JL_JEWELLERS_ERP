import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-4xl font-bold text-[#2A0E06]">
          Business Overview
        </h2>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;