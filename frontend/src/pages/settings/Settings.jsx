import { useEffect, useState } from "react";
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
  RefreshCw,
  Save,
  LockKeyhole,
} from "lucide-react";

import {
  getMetalRate,
  updateMetalRate,
} from "../../services/settings.service.js";

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

  const [metalRates, setMetalRates] = useState({
    gold: null,
    silver: null,
  });

  const [newRates, setNewRates] = useState({
    gold: "",
    silver: "",
  });

  const [financialPins, setFinancialPins] = useState({
    gold: "",
    silver: "",
  });

  const [pinRequired, setPinRequired] = useState({
    gold: false,
    silver: false,
  });

  const [loadingRates, setLoadingRates] = useState(false);
  const [updatingMetal, setUpdatingMetal] = useState(null);
  const [error, setError] = useState("");

  const activeItem = settingsSections
    .flatMap((section) => section.items)
    .find((item) => item.id === activeSection);

  /*
   * -------------------------------------------------------------
   * Load metal rates
   * -------------------------------------------------------------
   */
  const loadMetalRates = async () => {
    setLoadingRates(true);
    setError("");

    try {
      const [goldResponse, silverResponse] = await Promise.all([
        getMetalRate("gold"),
        getMetalRate("silver"),
      ]);

      setMetalRates({
        gold: goldResponse?.data?.data || null,
        silver: silverResponse?.data?.data || null,
      });
    } catch (err) {
      console.error("Failed to load metal rates:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load metal rates. Please try again."
      );
    } finally {
      setLoadingRates(false);
    }
  };

  /*
   * Load rates whenever Metal Rates section is opened.
   */
  useEffect(() => {
    if (activeSection === "metal-rates") {
      loadMetalRates();
    }
  }, [activeSection]);

  /*
   * -------------------------------------------------------------
   * Update metal rate
   * -------------------------------------------------------------
   */
  const handleUpdateRate = async (metalType) => {
    const rate = newRates[metalType];
    const financialPin = financialPins[metalType];

    if (!rate || Number(rate) <= 0) {
      setError(
        `Please enter a valid ${metalType === "gold" ? "Gold" : "Silver"} rate.`
      );
      return;
    }

    if (pinRequired[metalType] && !financialPin) {
      setError("Financial PIN is required for this rate change.");
      return;
    }

    setUpdatingMetal(metalType);
    setError("");

    try {
      await updateMetalRate({
        metal_type: metalType,
        rate: Number(rate),
        ...(financialPin
          ? { financial_pin: financialPin }
          : {}),
      });

      /*
       * Clear the input and PIN after successful update.
       */
      setNewRates((prev) => ({
        ...prev,
        [metalType]: "",
      }));

      setFinancialPins((prev) => ({
        ...prev,
        [metalType]: "",
      }));

      setPinRequired((prev) => ({
        ...prev,
        [metalType]: false,
      }));

      /*
       * Fetch the newly updated rate.
       */
      await loadMetalRates();
    } catch (err) {
      console.error("Failed to update metal rate:", err);

      const message =
        err?.response?.data?.message ||
        "Unable to update metal rate. Please try again.";

      /*
       * Backend specifically asks for Financial PIN when
       * the rate change exceeds the allowed percentage.
       */
      if (
        message.toLowerCase().includes("financial pin required") ||
        message.toLowerCase().includes("pin required")
      ) {
        setPinRequired((prev) => ({
          ...prev,
          [metalType]: true,
        }));

        setError(
          "This rate change exceeds the allowed limit. Please enter the Financial PIN to continue."
        );
      } else {
        setError(message);
      }
    } finally {
      setUpdatingMetal(null);
    }
  };

  /*
   * -------------------------------------------------------------
   * Metal Rate Card
   * -------------------------------------------------------------
   */
  const renderMetalRateCard = (metalType, label, unit) => {
    const rate = metalRates[metalType];
    const isUpdating = updatingMetal === metalType;

    return (
      <div className="rounded-xl border border-[#E7DED3] bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#2B2622]">
              {label}
            </h3>

            <p className="mt-1 text-xs text-[#85786D]">
              Current market rate
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F3EE] text-[#3A1206]">
            <Coins size={19} />
          </div>
        </div>

        {/* Current Rate */}
        <div className="mt-5 rounded-lg bg-[#FCFAF8] px-4 py-3">
          <p className="text-xs text-[#9B8E83]">
            Current Rate
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-semibold text-[#2B2622]">
              {loadingRates
                ? "Loading..."
                : rate
                ? `₹${Number(rate.rate).toLocaleString("en-IN")}`
                : "Not available"}
            </span>

            <span className="text-xs text-[#85786D]">
              / {unit}
            </span>
          </div>

          {rate?.updated_at && (
            <p className="mt-1 text-[11px] text-[#9B8E83]">
              Last updated:{" "}
              {new Date(rate.updated_at).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* New Rate */}
        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-[#4B423C]">
            New Rate
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#85786D]">
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={newRates[metalType]}
                onChange={(e) => {
                  setNewRates((prev) => ({
                    ...prev,
                    [metalType]: e.target.value,
                  }));

                  setError("");
                }}
                placeholder="Enter new rate"
                className="w-full rounded-lg border border-[#DED4CA] bg-white py-2.5 pl-8 pr-3 text-sm text-[#2B2622] outline-none transition placeholder:text-[#B0A39A] focus:border-[#3A1206] focus:ring-1 focus:ring-[#3A1206]"
              />
            </div>

            <button
              type="button"
              onClick={() => handleUpdateRate(metalType)}
              disabled={isUpdating || loadingRates}
              className="flex items-center gap-2 rounded-lg bg-[#3A1206] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4B190A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Updating
                </>
              ) : (
                <>
                  <Save size={15} />
                  Update
                </>
              )}
            </button>
          </div>
        </div>

        {/* Financial PIN */}
        {pinRequired[metalType] && (
          <div className="mt-4 rounded-lg border border-[#E7DED3] bg-[#FCFAF8] p-4">
            <div className="flex items-center gap-2">
              <LockKeyhole size={16} className="text-[#3A1206]" />

              <p className="text-xs font-medium text-[#4B423C]">
                Financial PIN Required
              </p>
            </div>

            <p className="mt-1 text-[11px] text-[#85786D]">
              This rate change exceeds the allowed percentage limit.
            </p>

            <input
              type="password"
              inputMode="numeric"
              value={financialPins[metalType]}
              onChange={(e) => {
                setFinancialPins((prev) => ({
                  ...prev,
                  [metalType]: e.target.value,
                }));

                setError("");
              }}
              placeholder="Enter Financial PIN"
              className="mt-3 w-full rounded-lg border border-[#DED4CA] bg-white px-3 py-2.5 text-sm text-[#2B2622] outline-none focus:border-[#3A1206] focus:ring-1 focus:ring-[#3A1206]"
            />
          </div>
        )}
      </div>
    );
  };

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
                        onClick={() => {
                          setActiveSection(item.id);
                          setError("");
                        }}
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

          {/* METAL RATES */}
          {activeSection === "metal-rates" ? (
            <div className="space-y-5">

              {error && (
                <div className="rounded-lg border border-[#E7CFC5] bg-[#FFF8F5] px-4 py-3 text-sm text-[#8B3A20]">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-[#2B2622]">
                    Metal Rates
                  </h3>

                  <p className="mt-1 text-xs text-[#85786D]">
                    Update the current Gold and Silver rates used by the ERP.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadMetalRates}
                  disabled={loadingRates}
                  className="flex items-center gap-2 rounded-lg border border-[#DED4CA] bg-white px-3 py-2 text-xs font-medium text-[#4B423C] transition hover:bg-[#F7F3EE] disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={loadingRates ? "animate-spin" : ""}
                  />
                  Refresh
                </button>

              </div>

              <div className="grid gap-5 lg:grid-cols-2">

                {renderMetalRateCard(
                  "gold",
                  "Gold",
                  "10g"
                )}

                {renderMetalRateCard(
                  "silver",
                  "Silver",
                  "10g"
                )}

              </div>

            </div>
          ) : (

            /* OTHER SETTINGS — STILL PLACEHOLDER */
            <div className="rounded-xl border border-dashed border-[#DED4CA] bg-[#FCFAF8] p-8 text-center">

              <p className="text-sm font-medium text-[#4B423C]">
                {activeItem?.label} Settings
              </p>

              <p className="mt-2 text-xs text-[#9B8E83]">
                This section will be connected to the Settings backend.
              </p>

            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default Settings;