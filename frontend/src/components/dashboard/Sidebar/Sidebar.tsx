import {
  LayoutDashboard,
  Receipt,
  Users,
  Boxes,
  ShoppingCart,
  Hammer,
  Truck,
  UserCog,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

const Sidebar = () => {
  return (
    <aside className="w-[250px] min-h-screen bg-[#2a0e06ff] text-white flex flex-col shadow-2xl">

      {/* Logo */}

      <div className="flex flex-col items-center justify-center py-10 border-b border-[#5A2525]">

        <img
          src="/logo/dark_jl_logo.png"
          alt="JL Jewellers"
          className="w-50 h-45 object-contain"
        />

      </div>

      {/* Menu */}

      <nav className="flex-1 px-5 py-8">

        <div className="flex flex-col gap-6">

          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            title="Dashboard"
            active
          />

          <SidebarItem
            icon={<Receipt size={20} />}
            title="Billing"
          />

          <SidebarItem
            icon={<Users size={20} />}
            title="Customers"
          />

          <SidebarItem
            icon={<Boxes size={20} />}
            title="Inventory"
          />

          <SidebarItem
            icon={<ShoppingCart size={20} />}
            title="Orders"
          />

          <SidebarItem
            icon={<Hammer size={20} />}
            title="Makers"
          />

          <SidebarItem
            icon={<Truck size={20} />}
            title="Suppliers"
          />

          <SidebarItem
            icon={<UserCog size={20} />}
            title="Employees"
          />

          <SidebarItem
            icon={<BarChart3 size={20} />}
            title="Reports"
          />

          <SidebarItem
            icon={<Bell size={20} />}
            title="Notifications"
          />

          <SidebarItem
            icon={<Settings size={20} />}
            title="Settings"
          />

        </div>

      </nav>

      <SidebarFooter />

    </aside>
  );
};

export default Sidebar;