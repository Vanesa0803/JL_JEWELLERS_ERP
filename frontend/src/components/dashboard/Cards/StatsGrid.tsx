import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
} from "lucide-react";

import StatsCard from "./StatsCard";

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-3">
        <StatsCard
          title="Total Sales"
          value="₹12.4L"
          subtitle="+12.4% from yesterday"
          icon={<IndianRupee size={22} className="text-white" />}
          iconBg="bg-[#D4AF37]"
        />
      </div>

      <div className="col-span-3">
        <StatsCard
          title="Orders"
          value="328"
          subtitle="+8.1% from yesterday"
          icon={<ShoppingBag size={22} className="text-white" />}
          iconBg="bg-[#99663E]"
        />
      </div>

      <div className="col-span-3">
        <StatsCard
          title="Customers"
          value="1,284"
          subtitle="+5.6% from yesterday"
          icon={<Users size={22} className="text-white" />}
          iconBg="bg-[#3C1414]"
          
        />
      </div>

      <div className="col-span-3">
        <StatsCard
          title="Inventory"
          value="856"
          subtitle="+2.3% from yesterday"
          icon={<Package size={22} className="text-white" />}
          iconBg="bg-[#C79B6C] w-1 h-1"
        />
      </div>

    </div>
  );
};

export default StatsGrid;