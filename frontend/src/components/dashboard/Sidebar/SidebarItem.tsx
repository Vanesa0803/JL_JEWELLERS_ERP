import type { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  title: string;
  active?: boolean;
}

const SidebarItem = ({
  icon,
  title,
  active = false,
}: SidebarItemProps) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-4 rounded-lg px-5 py-4 transition-all duration-300 ${
        active
          ? "bg-[#D4AF37] text-white shadow-lg"
          : "text-gray-300 hover:bg-[#252525] hover:text-white"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {icon}
      </span>

      <span className="font-medium">
        {title}
      </span>
    </button>
  );
};

export default SidebarItem;