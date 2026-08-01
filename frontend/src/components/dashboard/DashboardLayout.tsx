import type { ReactNode } from "react";

import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-[#FCFAF6]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 px-12 py-10 overflow-auto">
  <div className="max-w-[1500px] mx-auto">
    {children}
  </div>
</main>

      </div>

    </div>
  );
};

export default DashboardLayout;