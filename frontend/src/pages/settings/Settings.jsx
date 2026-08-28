import { useState } from "react";
import {
  Building2,
  FileText,
  Receipt,
  Barcode,
  Coins,
  Percent,
  BadgePercent,
  Bell,
  ShieldCheck,
  History,
  Activity,
  ClipboardCheck,
  AlertTriangle,
  Database,
} from "lucide-react";

const settingsSections = [
  {
    title: "General",
    items: [
      {
        id: "company",
        label: "Company",
        icon: Building2,
      },
      {
        id: "gst",
        label: "GST",
        icon: Receipt,
      },
      {
        id: "invoice",
        label: "Invoice",
        icon: FileText,
      },
      {
        id: "barcode",
        label: "Barcode",
        icon: Barcode,
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        id: "metal-rates",
        label: "Metal Rates",
        icon: Coins,
      },
      {
        id: "tax",
        label: "Tax",
        icon: Percent,
      },
      {
        id: "discount",
        label: "Discount",
        icon: BadgePercent,
      },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Security & Logs",
    items: [
      {
        id: "login-logs",
        label: "Login History",
        icon: ShieldCheck,
      },
      {
        id: "activity-logs",
        label: "Activity Logs",
        icon: Activity,
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        icon: ClipboardCheck,
      },
      {
        id: "error-logs",
        label: "Error Logs",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Backup",
    items: [
      {
        id: "backup",
        label: "Backup & Restore",
        icon: Database,
      },
    ],
  },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("company");

  const activeItem = settingsSections
    .flatMap((section) => section.items)
    .find((item) => item.id === activeSection);

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold text-[#2B2622]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-[#85786D]">
          Manage your business configuration, preferences and system settings.
        </p>
      </div>


      {/* SETTINGS CONTAINER */}

      <div className="flex min-h-[650px] overflow-hidden rounded-2xl border border-[#E7DED3] bg-white">

        {/* LEFT SETTINGS NAVIGATION */}

        <aside className="w-64 shrink-0 border-r border-[#E7DED3] bg-[#FCFAF8] p-4">

          <div className="space-y-5">

            {settingsSections.map((section) => (
              <div key={section.title}>

                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B8E83]">
                  {section.title}
                </p>

                <div className="space-y-1">

                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          isActive
                            ? "bg-[#3A1206] font-medium text-white"
                            : "text-[#4B423C] hover:bg-[#F7F3EE]"
                        }`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                        />

                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                </div>
              </div>
            ))}

          </div>

        </aside>


        {/* RIGHT CONTENT */}

        <section className="min-w-0 flex-1 p-6 lg:p-8">

          <div className="mb-6 border-b border-[#E7DED3] pb-5">

            <h2 className="text-lg font-semibold text-[#2B2622]">
              {activeItem?.label}
            </h2>

            <p className="mt-1 text-sm text-[#85786D]">
              Configure your {activeItem?.label.toLowerCase()} settings.
            </p>

          </div>


          {/* TEMPORARY CONTENT */}

          <div className="rounded-xl border border-dashed border-[#DED4CA] bg-[#FCFAF8] p-8 text-center">

            <p className="text-sm font-medium text-[#4B423C]">
              {activeItem?.label} Settings
            </p>

            <p className="mt-2 text-xs text-[#9B8E83]">
              This section will be connected to the Settings backend.
            </p>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Settings;