import {
  IndianRupee,
  Receipt,
  TrendingUp,
  Wallet,
  Clock,
  ShoppingBag,
  Package,
  Coins,
} from "lucide-react";

import StatsCard from "./StatsCard";

const SummarySection = () => {
  const stats = [
    {
      title: "Today's Sales",
      value: "₹0",
      subtitle: "Today's total sales",
      icon: IndianRupee,
    },
    {
      title: "Today's Bills",
      value: "0",
      subtitle: "Bills generated today",
      icon: Receipt,
    },
    {
      title: "Revenue",
      value: "₹0",
      subtitle: "Current revenue",
      icon: TrendingUp,
    },
    {
      title: "Profit",
      value: "₹0",
      subtitle: "Current profit",
      icon: Wallet,
    },
    {
      title: "Cash Flow",
      value: "₹0",
      subtitle: "Current cash flow",
      icon: Wallet,
    },
    {
      title: "Pending Payments",
      value: "₹0",
      subtitle: "Outstanding payments",
      icon: Clock,
    },
    {
      title: "Pending Orders",
      value: "0",
      subtitle: "Orders awaiting completion",
      icon: ShoppingBag,
    },
    {
      title: "Inventory Value",
      value: "₹0",
      subtitle: "Current inventory value",
      icon: Package,
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>
    </section>
  );
};

export default SummarySection;