import {
  IndianRupee,
  Receipt,
  TrendingUp,
  Wallet,
  Clock,
  ShoppingBag,
  Package,
} from "lucide-react";

import StatsCard from "./StatsCard";
import { money, count } from "../../lib/format";

/**
 * The eight headline figures, from GET /dashboard -> data.summary.
 *
 * `summary` is undefined on the first render while the request is in flight;
 * every value falls back to an em dash rather than a zero, because "—" reads
 * as "not loaded yet" while "₹0" reads as "you sold nothing today". Showing a
 * confident wrong number is worse than showing none.
 */
const SummarySection = ({ summary }) => {
  const s = summary ?? {};

  const stats = [
    {
      title: "Today's Sales",
      value: money(s.today_sales),
      subtitle: "Today's total sales",
      icon: IndianRupee,
    },
    {
      title: "Today's Bills",
      value: count(s.today_bills),
      subtitle: "Bills generated today",
      icon: Receipt,
    },
    {
      title: "Revenue",
      value: money(s.revenue),
      subtitle: "Current revenue",
      icon: TrendingUp,
    },
    {
      title: "Profit",
      value: money(s.profit),
      subtitle: "Current profit",
      icon: Wallet,
    },
    {
      title: "Cash Flow",
      value: money(s.cash_flow),
      subtitle: "Current cash flow",
      icon: Wallet,
    },
    {
      title: "Pending Payments",
      value: money(s.pending_payments),
      subtitle: "Outstanding payments",
      icon: Clock,
    },
    {
      title: "Pending Orders",
      value: count(s.pending_orders),
      subtitle: "Orders awaiting completion",
      icon: ShoppingBag,
    },
    {
      title: "Inventory Quantity",
      value: count(s.inventory_quantity),
      subtitle: "Units currently in stock",
      icon: Package,
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default SummarySection;
