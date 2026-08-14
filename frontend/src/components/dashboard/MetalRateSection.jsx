import { Coins, Gem } from "lucide-react";

import MetalRateCard from "./MetalRateCard";
import { money } from "../../lib/format";

/**
 * Today's metal rates, from GET /dashboard -> data.summary.
 *
 * The API returns a single current rate per metal and no previous value, so
 * there is nothing to compute a change from. `change` is left at 0 rather
 * than invented — the `metal_rate_history` table exists and would give a real
 * day-on-day movement, but nothing populates or reads it yet.
 */
const MetalRateSection = ({ summary }) => {
  const s = summary ?? {};

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <MetalRateCard
        metal="Gold"
        rate={money(s.gold_rate)}
        unit="per 10 grams"
        change={0}
        icon={Coins}
      />

      <MetalRateCard
        metal="Silver"
        rate={money(s.silver_rate)}
        unit="per kilogram"
        change={0}
        icon={Gem}
      />
    </section>
  );
};

export default MetalRateSection;
