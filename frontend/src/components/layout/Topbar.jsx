import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import useAuthStore from "../../store/authStore";

import { getUnreadCount } from "../../services/notification.service";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef(null);

  // =========================
  // LOAD UNREAD NOTIFICATIONS
  // =========================
  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();

      const count =
        response.data?.data?.unread_count ??
        response.data?.unread_count ??
        0;

      setUnreadCount(Number(count));
    } catch (error) {
      console.error("UNREAD NOTIFICATION ERROR:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();

    // Refresh unread count every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Refresh count whenever user comes back from Notifications page
  useEffect(() => {
    loadUnreadCount();
  }, [location.pathname]);

  // =========================
  // CLOSE USER DROPDOWN
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();

    toast.success("Logged out");

    navigate("/login", {
      replace: true,
    });
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const displayName = user?.name || "User";
  const displayRole = user?.role || "";
  const initial = displayName.charAt(0).toUpperCase();

  // =========================
  // PAGE TITLES
  // =========================
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

  const pageTitle =
    pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-[#E7DED3] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

      {/* =========================
          LEFT SECTION
      ========================= */}
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

      {/* =========================
          RIGHT SECTION
      ========================= */}
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

        {/* =========================
            NOTIFICATION BELL
        ========================= */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#5F554D] transition hover:bg-[#F7F3EE] hover:text-[#8A6A1F]"
          aria-label="Notifications"
        >
          <Bell
            size={20}
            strokeWidth={1.8}
          />

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B8860B] px-1 text-[10px] font-bold text-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-[#E7DED3] sm:block" />

        {/* =========================
            USER DROPDOWN
        ========================= */}
        <div
          className="relative"
          ref={menuRef}
        >
          <button
            type="button"
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#F7F3EE]"
          >

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6F3E32] text-sm font-semibold text-[#F7F3EE]">
              {initial}
            </div>

            {/* User Details */}
            <div className="hidden text-left sm:block">

              <p className="max-w-[120px] truncate text-sm font-medium text-[#2B2622]">
                {displayName}
              </p>

              <p className="text-xs capitalize text-[#9B8E83]">
                {displayRole}
              </p>

            </div>

            <ChevronDown
              size={16}
              className={`hidden text-[#9B8E83] transition-transform sm:block ${
                menuOpen
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#E7DED3] bg-white shadow-lg"
            >

              {/* Who is signed in */}
              <div className="border-b border-[#F0E9E1] px-4 py-3">

                <p className="truncate text-sm font-medium text-[#2B2622]">
                  {displayName}
                </p>

                <p className="truncate text-xs text-[#9B8E83]">
                  {user?.email || "Not signed in"}
                </p>

              </div>

              {/* Profile */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#5F554D] transition hover:bg-[#F7F3EE]"
              >
                <User size={16} />
                My Profile
              </button>

              {/* Logout */}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 border-t border-[#F0E9E1] px-4 py-2.5 text-left text-sm font-medium text-[#A33A2B] transition hover:bg-[#FBF1EF]"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Topbar;