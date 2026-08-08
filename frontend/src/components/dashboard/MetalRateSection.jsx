import { Coins, Gem } from "lucide-react";

import MetalRateCard from "./MetalRateCard";

const MetalRateSection = () => {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <MetalRateCard
        metal="Gold"
        rate="₹0"
        unit="per 10 grams"
        change={0}
        icon={Coins}
      />

      <MetalRateCard
        metal="Silver"
        rate="₹0"
        unit="per kilogram"
        change={0}
        icon={Gem}
      />
    </section>
  );
};

export default MetalRateSection;