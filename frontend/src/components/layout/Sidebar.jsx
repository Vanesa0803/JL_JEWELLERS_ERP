import { useState } from "react";

import {
  BarChart3,
  Bell,
  Calculator,
  ChevronDown,
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
    const [billingOpen, setBillingOpen] = useState(false);
  return (
    <aside className="flex h-550 w-64 shrink-0 flex-col bg-[#3A1206]">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-5">
        <img
          src={jlSidebarLogo}
          alt="JL Jewellers"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
     {navigationItems.map((item) => {
  const Icon = item.icon;

  // Special handling for Billing
  if (item.label === "Billing") {
    return (
      <div key={item.path}>
        <button
          type="button"
          onClick={() => setBillingOpen((previous) => !previous)}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#F7F3EE] transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <Icon
            size={19}
            strokeWidth={1.8}
            className="shrink-0 text-[#E8D8C8] transition-colors duration-200 group-hover:text-white"
          />

          <span className="flex-1 truncate">
            {item.label}
          </span>

          <ChevronDown
            size={17}
            className={`shrink-0 transition-transform duration-200 ${
              billingOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {billingOpen && (
          <div className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-3">
            <NavLink
              to="/billing"
              className={({ isActive }) =>
                `
                block rounded-lg px-3 py-2.5 text-sm transition
                ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-[#E8D8C8] hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              Create New Bill
            </NavLink>

            <NavLink
              to="/billing/all"
              className={({ isActive }) =>
                `
                block rounded-lg px-3 py-2.5 text-sm transition
                ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-[#E8D8C8] hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              All Bills
            </NavLink>

            <NavLink
              to="/billing/drafts"
              className={({ isActive }) =>
                `
                block rounded-lg px-3 py-2.5 text-sm transition
                ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-[#E8D8C8] hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              Draft Bills
            </NavLink>

            <NavLink
              to="/billing/completed"
              className={({ isActive }) =>
                `
                block rounded-lg px-3 py-2.5 text-sm transition
                ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-[#E8D8C8] hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              Completed Bills
            </NavLink>

            <NavLink
              to="/billing/cancelled"
              className={({ isActive }) =>
                `
                block rounded-lg px-3 py-2.5 text-sm transition
                ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-[#E8D8C8] hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              Cancelled Bills
            </NavLink>

            <NavLink
              to="/billing/history"
              className={({ isActive }) =>
                `
                block rounded-lg px-3 py-2.5 text-sm transition
                ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-[#E8D8C8] hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              Invoice History
            </NavLink>
          </div>
        )}
      </div>
    );
  }

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




    </aside>
  );
};

export default Sidebar;