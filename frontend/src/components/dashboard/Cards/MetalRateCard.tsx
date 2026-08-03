import { Coins, TrendingUp } from "lucide-react";

const MetalRateCard = () => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      border
      border-[#E8DFD2]
      shadow-sm

      h-full
      p-6

      flex
      flex-col
      justify-between
      "
    >
      {/* GOLD */}

      <div>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Gold Rate
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#3C1414]">
              ₹10,250/g
            </h2>

          </div>

          <div className="h-12 w-12 rounded-xl bg-[#FFF7DA] flex items-center justify-center">

            <Coins size={22} className="text-[#D4AF37]" />

          </div>

        </div>

        <div className="mt-3 flex items-center gap-2 text-green-600">

          <TrendingUp size={15} />

          <span className="text-sm font-medium">
            +₹85 Today
          </span>

        </div>

      </div>

      <div className="my-6 border-t border-[#ECE4D8]" />

      {/* SILVER */}

      <div>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Silver Rate
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#3C1414]">
              ₹118/g
            </h2>

          </div>

          <div className="h-12 w-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">

            <Coins size={22} className="text-gray-500" />

          </div>

        </div>

        <div className="mt-3 flex items-center gap-2 text-green-600">

          <TrendingUp size={15} />

          <span className="text-sm font-medium">
            +₹2 Today
          </span>

        </div>

      </div>

    </div>
  );
};

export default MetalRateCard;