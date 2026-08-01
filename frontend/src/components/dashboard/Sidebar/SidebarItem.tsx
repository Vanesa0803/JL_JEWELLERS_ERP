import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  active?: boolean;
}

const SidebarItem = ({ icon, title, active }: Props) => {
  return (
    <button
      className={`w-62 flex items-center gap-4 px-5 py-4  transition-all duration-300

      ${
        active
          ? "bg-[#D4AF37] text-white shadow-lg"
          : "text-gray-300 hover:bg-[#252525] hover:text-white"
      }`}
    >
      {icon}

      <span className="font-medium">
        {title}
      </span>
    </button>
  );
};

export default SidebarItem;