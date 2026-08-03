import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
}: StatsCardProps) => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      border
      border-[#E8DFD2]
      shadow-sm
      hover:shadow-md
      transition-all
      duration-300

      h-[128px]
      w-full

      px-6
      py-5
      "
    >
      <div className="flex justify-between items-start h-full">

        {/* LEFT */}

        <div className="flex flex-col justify-between h-full">

          <p className="text-[15px] font-semibold text-[#6B7280]">
            {title}
          </p>

          <h2 className="text-[24px] font-bold text-[#3C1414] leading-none">
            {value}
          </h2>

          <div className="flex items-center gap-2">

            <TrendingUp
              size={15}
              className="text-green-600"
            />

            <span className="text-[15px] font-medium text-green-600">
              {subtitle}
            </span>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
          w-12
          h-12

          rounded-xl

          flex
          items-center
          justify-center

          text-[#3C1414]
        "
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default StatsCard;