import {
  BarChart3,
  Bell,
  Calculator,
  ClipboardList,
  Coins,
  CreditCard,
  FileText,
  Gem,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import jlSidebarLogo from "../../assets/logos/jl-logo-sidebar.png";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Billing",
    path: "/billing",
    icon: FileText,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: Package,
  },
  {
    label: "Makers / Karigars",
    path: "/makers",
    icon: Wrench,
  },
  {
    label: "Gold Schemes",
    path: "/gold-schemes",
    icon: Coins,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Gem,
  },
  {
    label: "Ledgers",
    path: "/ledgers",
    icon: ClipboardList,
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Calculator,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#3A1206]">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-5">
        <img
          src={jlSidebarLogo}
          alt="JL Jewellers"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-[#F7F3EE] hover:bg-white/10 hover:text-white"
                  }
                `
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2 : 1.8}
                      className={`
                        shrink-0
                        transition-colors
                        duration-200
                        ${
                          isActive
                            ? "text-white"
                            : "text-[#E8D8C8] group-hover:text-white"
                        }
                      `}
                    />

                    <span className="truncate">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;