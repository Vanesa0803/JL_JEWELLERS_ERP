import type { ReactNode } from "react";

import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen bg-[#F8F6F2] overflow-hidden">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Area */}

      <div className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        {/* Dashboard Content */}

        <main className="flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-[1600px] px-10 py-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;