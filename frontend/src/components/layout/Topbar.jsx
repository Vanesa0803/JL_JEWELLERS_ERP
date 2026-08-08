import {
  Bell,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";

import { useLocation } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/billing": "Billing",
    "/orders": "Orders",
    "/payments": "Payments",
    "/customers": "Customers",
    "/suppliers": "Suppliers",
    "/makers": "Makers / Karigars",
    "/gold-schemes": "Gold Schemes",
    "/inventory": "Inventory",
    "/ledgers": "Ledgers",
    "/finance": "Finance",
    "/reports": "Reports",
    "/notifications": "Notifications",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-[#E7DED3] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-4">

        {/* Mobile Menu */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5F554D] transition hover:bg-[#F7F3EE] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        {/* Page Title */}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-[#2B2622] sm:text-3xl">
             {pageTitle}
          
</h1>
</div>
          
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Search */}
        <div className="hidden md:flex">
          <div className="flex h-10 w-64 items-center gap-2 rounded-xl border border-[#E7DED3] bg-[#F7F3EE] px-3 transition focus-within:border-[#B8860B] focus-within:bg-white lg:w-72">
            <Search
              size={17}
              className="shrink-0 text-[#9B8E83]"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D]"
            />

            
          </div>
        </div>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#5F554D] transition hover:bg-[#F7F3EE] hover:text-[#8A6A1F]"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />

          {/* Notification indicator */}
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#B8860B]" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-[#E7DED3] sm:block" />

        {/* User */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#F7F3EE]"
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6F3E32] text-sm font-semibold text-[#F7F3EE]">
            A
          </div>

          {/* User Details */}
          <div className="hidden text-left sm:block">
            <p className="max-w-[120px] truncate text-sm font-medium text-[#2B2622]">
              Admin
            </p>

            <p className="text-xs text-[#9B8E83]">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-[#9B8E83] sm:block"
          />
        </button>
      </div>
    </header>
  );
};

export default Topbar;