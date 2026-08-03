import {
  IndianRupee,
  Receipt,
  TrendingUp,
  Wallet,
  Users,
  ShoppingBag,
  Clock,
  Package,
} from "lucide-react";

import StatsCard from "./StatsCard";
import MetalRateCard from "./MetalRateCard";

const DashboardGrid = () => {
  return (
    <div className="space-y-8">

      {/* ================= ROW 1 ================= */}

      <div className="grid grid-cols-5 gap-6">

        <StatsCard
          title="Today's Sales"
          value="₹12.4L"
          subtitle="+12.4% from yesterday"
          icon={<IndianRupee size={22} />}
        />

        <StatsCard
          title="Today's Bills"
          value="328"
          subtitle="+8.1% from yesterday"
          icon={<Receipt size={22} />}
        />

        <StatsCard
          title="Revenue"
          value="₹18.6L"
          subtitle="+5.6% this month"
          icon={<TrendingUp size={22} />}
        />

        <StatsCard
          title="Profit"
          value="₹4.2L"
          subtitle="+3.2% this month"
          icon={<Wallet size={22} />}
        />

        <StatsCard
          title="Customers"
          value="1284"
          subtitle="+18 New"
          icon={<Users size={22} />}
        />

      </div>

      {/* ================= ROW 2 ================= */}

      <div className="grid grid-cols-4 gap-6">

        {/* LEFT */}

        <div className="col-span-3 grid grid-cols-3 gap-6">

          <StatsCard
            title="Pending Orders"
            value="36"
            subtitle="View all"
            icon={<ShoppingBag size={22} />}
          />

          <StatsCard
            title="Pending Payments"
            value="₹1.8L"
            subtitle="7 Customers"
            icon={<Clock size={22} />}
          />

          <StatsCard
            title="Inventory Value"
            value="₹28L"
            subtitle="View Details"
            icon={<Package size={22} />}
          />

        </div>

        {/* RIGHT */}

        <MetalRateCard />

      </div>

    </div>
  );
};

export default DashboardGrid;