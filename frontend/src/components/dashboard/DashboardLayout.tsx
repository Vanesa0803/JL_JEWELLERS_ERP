import type { ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen bg-[#F8F6F2]">
      <Sidebar />

      {/* Scrollable Content */}
   <main className="flex-1 overflow-y-auto bg-[#F8F6F2]">

    <div className="p-10">

        <section
            className="w-full rounded-3xl"
        >

            {children}

        </section>

    </div>

</main>
    </div>
  );
};

export default DashboardLayout;