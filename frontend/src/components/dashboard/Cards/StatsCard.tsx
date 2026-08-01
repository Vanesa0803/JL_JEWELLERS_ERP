import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  iconBg: string;
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
}: StatsCardProps) => {
  return (
    <div className="bg-white border border-[#E9E1D5] rounded-3xl px-6 py-5 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-start justify-between">

        <div className="flex flex-col">

          <p className="text-[15px] font-medium text-[#8C8C8C]">
            {title}
          </p>

          <h2 className="mt-3 text-[40px] leading-none font-semibold text-[#3C1414]">
            {value}
          </h2>

          <div className="mt-4 flex items-center gap-2">

            <TrendingUp size={15} className="text-green-600" />

            <span className="text-[14px] text-green-600 font-medium">
              {subtitle}
            </span>

          </div>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatsCard;