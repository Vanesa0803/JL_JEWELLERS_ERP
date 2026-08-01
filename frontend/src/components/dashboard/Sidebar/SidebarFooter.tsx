import { Gem } from "lucide-react";

const SidebarFooter = () => {
  return (
    <div className="m-5 rounded-3xl border border-[#2B2B2B] p-6">

      <div className="flex justify-center mb-5">

        <Gem
          size={60}
          className="text-[#D4AF37]"
        />

      </div>

      <h3 className="text-center text-lg font-semibold">
        Crafting Purity,
      </h3>

      <p className="text-center text-gray-400">
        Delivering Trust
      </p>

    </div>
  );
};

export default SidebarFooter;