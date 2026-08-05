import type { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  title: string;
  active?: boolean;
}

const SidebarItem = ({ icon, title, active = false }: SidebarItemProps) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-[#D4AF37] text-[#2A0E06]"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span>{title}</span>
    </button>
  );
};

export default SidebarItem;
