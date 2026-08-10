import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          <Topbar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;