import { Gem } from "lucide-react";

const SidebarFooter = () => {
  return (
    <div className="m-5 rounded-3xl border border-[#2B2B2B] p-6">
      <div className="mb-5 flex justify-center">
        <Gem size={60} className="text-[#D4AF37]" />
      </div>

      <h3 className="text-center text-lg font-semibold">
        Crafting Purity,
      </h3>

      <p className="text-center text-gray-400">
        Delivering Trust
      </p>

      <div className="mt-6 border-t border-[#3A3A3A] pt-4">
        <p className="text-xs font-medium uppercase text-gray-500">
          Signed in
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          Admin
        </p>
      </div>
    </div>
  );
};

export default SidebarFooter;