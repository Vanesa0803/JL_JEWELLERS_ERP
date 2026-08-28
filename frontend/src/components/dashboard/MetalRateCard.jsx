import { TrendingUp } from "lucide-react";

const MetalRateCard = ({
  metal,
  rate,
  unit,
  change,
  icon: Icon,
}) => {
  const isPositive = change >= 0;

  return (
    <div className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EBD9] text-[#B8860B]">
            {Icon && <Icon size={21} />}
          </div>

          <div>
            <p className="text-sm font-medium text-[#85786D]">
              {metal}
            </p>

            <p className="mt-1 text-xs text-[#A4978D]">
              Current market rate
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          <TrendingUp size={14} />
          {change}%
        </div>
      </div>

      <div className="mt-6">
        <p className="text-3xl font-semibold text-[#2B2622]">
          {rate}
        </p>

        <p className="mt-1 text-sm text-[#85786D]">
          {unit}
        </p>
      </div>
    </div>
  );
};

export default MetalRateCard;