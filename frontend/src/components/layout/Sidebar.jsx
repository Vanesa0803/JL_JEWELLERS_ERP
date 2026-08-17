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

import jlEmblem from "../../assets/logos/jl-emblem.png";

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
    // h-full, not h-550: `h-550` is not a Tailwind class and never generated
    // any CSS, so this had no height at all and simply grew with its content.
    // The logo stays put while the nav list below scrolls on its own if the
    // window is short.
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden bg-[#3A1206]">
      {/*
        Emblem + wordmark.

        The wordmark is real text, not the old jl-logo-sidebar image. That file
        is a JPEG despite its .png name, so it can carry no transparency and
        its maroon is part of the picture — set against this panel it risks a
        visible rectangle wherever the two shades disagree, and JPEG banding
        shows badly on a flat dark colour.

        Text also stays sharp at any zoom, can be read aloud by a screen
        reader, and puts the shop name somewhere it can be changed without an
        image editor.

        min-w-0 lets the text block shrink instead of pushing past the panel
        edge on a narrow window; truncate then clips it cleanly.
      */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-4">
        <img
          src={jlEmblem}
          alt=""
          aria-hidden="true"
          className="h-11 w-11 shrink-0 object-contain"
        />

        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight text-[#F5E9DA]">
            Chepuri&rsquo;s JL Jewellers
          </p>

          <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.18em] text-[#C9A227]">
            ERP System
          </p>
        </div>
      </div>

      {/* Navigation — its own scroll region, so a long nav on a short screen
          scrolls here rather than pushing the whole page. `no-scrollbar`
          hides the bar; scrolling still works normally. */}
      <nav className="no-scrollbar flex-1 overflow-y-auto">
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
      </nav>
    </aside>
  );
};

export default Sidebar;