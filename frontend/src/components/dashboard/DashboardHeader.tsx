import { Bell, Settings } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="flex items-start justify-between">
      {/* Left */}
      <div>
        <h1 className="mt-2 text-xl text-gray-500">
          
        </h1>

        <p className="text-2xl font-semibold text-[#2A0E06]">
         Good Morning, Vanshika 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <button className="h-14 w-14 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-center">
          <Bell size={24} />
        </button>

        <button className="h-14 w-14 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-center">
          <Settings size={24} />
        </button>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <div className="h-14 w-14 rounded-full bg-[#2A0E06] text-white flex items-center justify-center font-bold text-xl">
            VS
          </div>

          <div>
            <p className="font-semibold text-lg text-[#2A0E06]">
              Vanshika
            </p>

            <p className="text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>

      
    </header>
    
  );
};

export default DashboardHeader;