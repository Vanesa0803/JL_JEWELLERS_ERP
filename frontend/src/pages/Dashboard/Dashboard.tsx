import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold text-[#2A0E06]">
            Business Overview
          </h2>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-[#2A0E06] px-5 py-2 font-semibold text-white transition hover:bg-[#4A1D12]"
          >
            Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;