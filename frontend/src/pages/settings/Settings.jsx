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
  Activity,
  ClipboardCheck,
  AlertTriangle,
  Database,
  RefreshCw,
  Save,
  LockKeyhole,
  Plus,
  RotateCcw,
  Download,
} from "lucide-react";

import {
  getCompanySettings,
  createCompanySettings,
  updateCompanySettings,

  getGSTSettings,
  createGSTSettings,
  updateGSTSettings,

  getInvoiceSettings,
  createInvoiceSettings,
  updateInvoiceSettings,

  getBarcodeSettings,
  createBarcodeSettings,
  updateBarcodeSettings,

  getMetalRate,
  updateMetalRate,

  getTaxSettings,
  createTaxSetting,
  updateTaxSetting,

  getDiscountSettings,
  createDiscountSettings,
  updateDiscountSettings,

  getLoginLogs,
  getActivityLogs,
  getAuditLogs,
  getErrorLogs,

  createManualBackup,
  createAutomaticBackup,
  getBackupHistory,
  restoreBackup,
} from "../../services/settings.service.js";


/* ============================================================
   SETTINGS NAVIGATION
============================================================ */

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


/* ============================================================
   DEFAULT FORM VALUES
============================================================ */

const emptyCompany = {
  company_name: "",
  owner_name: "",
  phone: "",
  email: "",
  address: "",
};

const emptyGST = {
  gst_number: "",
  state: "",
};

const emptyInvoice = {
  prefix: "",
  suffix: "",
  starting_number: "",
};

const emptyBarcode = {
  barcode_type: "",
  prefix: "",
};

const emptyTax = {
  tax_name: "",
  tax_percentage: "",
};

const emptyDiscount = {
  discount_percentage: "",
};


/* ============================================================
   HELPERS
============================================================ */

const extractData = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("en-IN");
};


/* ============================================================
   REUSABLE INPUT
============================================================ */

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#4B423C]">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#DED4CA] bg-white px-3 py-2.5 text-sm text-[#2B2622] outline-none transition placeholder:text-[#B0A39A] focus:border-[#3A1206] focus:ring-1 focus:ring-[#3A1206]"
      />
    </div>
  );
};


/* ============================================================
   BUTTON
============================================================ */

const ActionButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  secondary = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        secondary
          ? "border border-[#DED4CA] bg-white text-[#4B423C] hover:bg-[#F7F3EE]"
          : "bg-[#3A1206] text-white hover:bg-[#4B190A]"
      }`}
    >
      {loading && (
        <RefreshCw size={15} className="animate-spin" />
      )}

      {!loading && children}
    </button>
  );
};


/* ============================================================
   SETTINGS COMPONENT
============================================================ */

const Settings = () => {
  const [activeSection, setActiveSection] = useState("company");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  /* ============================================================
     COMPANY
  ============================================================ */

  const [company, setCompany] = useState(null);

  const [companyForm, setCompanyForm] = useState(emptyCompany);

  const [companyExists, setCompanyExists] = useState(false);


  /* ============================================================
     GST
  ============================================================ */

  const [gst, setGST] = useState(null);

  const [gstForm, setGSTForm] = useState(emptyGST);

  const [gstExists, setGSTExists] = useState(false);


  /* ============================================================
     INVOICE
  ============================================================ */

  const [invoice, setInvoice] = useState(null);

  const [invoiceForm, setInvoiceForm] = useState(emptyInvoice);

  const [invoiceExists, setInvoiceExists] = useState(false);


  /* ============================================================
     BARCODE
  ============================================================ */

  const [barcode, setBarcode] = useState(null);

  const [barcodeForm, setBarcodeForm] = useState(emptyBarcode);

  const [barcodeExists, setBarcodeExists] = useState(false);


  /* ============================================================
     METAL RATES
  ============================================================ */

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

  const [updatingMetal, setUpdatingMetal] = useState(null);


  /* ============================================================
     TAX
  ============================================================ */

  const [taxSettings, setTaxSettings] = useState([]);

  const [taxForm, setTaxForm] = useState(emptyTax);

  const [editingTaxId, setEditingTaxId] = useState(null);


  /* ============================================================
     DISCOUNT
  ============================================================ */

  const [discount, setDiscount] = useState(null);

  const [discountForm, setDiscountForm] =
    useState(emptyDiscount);

  const [discountExists, setDiscountExists] =
    useState(false);


  /* ============================================================
     LOGS
  ============================================================ */

  const [loginLogs, setLoginLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);


  /* ============================================================
     BACKUPS
  ============================================================ */

  const [backups, setBackups] = useState([]);

  const [backupLoading, setBackupLoading] = useState(false);

  const [restoringBackup, setRestoringBackup] = useState(null);


  /* ============================================================
     ACTIVE ITEM
  ============================================================ */

  const activeItem = settingsSections
    .flatMap((section) => section.items)
    .find((item) => item.id === activeSection);


  /* ============================================================
     COMMON ERROR HANDLER
  ============================================================ */

  const getErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };


  /* ============================================================
     LOAD COMPANY
  ============================================================ */

  const loadCompany = async () => {
    try {
      const response = await getCompanySettings();

      const data = extractData(response);

      if (data) {
        setCompany(data);

        setCompanyForm({
          company_name: data.company_name || "",
          owner_name: data.owner_name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
        });

        setCompanyExists(true);
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        throw err;
      }

      setCompany(null);
      setCompanyExists(false);
      setCompanyForm(emptyCompany);
    }
  };


  /* ============================================================
     SAVE COMPANY
  ============================================================ */

  const handleSaveCompany = async () => {
    if (
      !companyForm.company_name ||
      !companyForm.owner_name ||
      !companyForm.phone ||
      !companyForm.email ||
      !companyForm.address
    ) {
      setError(
        "Company name, owner name, phone, email and address are required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let response;

      if (companyExists) {
        response = await updateCompanySettings(companyForm);
      } else {
        response = await createCompanySettings(companyForm);
      }

      const data = extractData(response);

      if (data) {
        setCompany(data);
        setCompanyExists(true);
      }

      setSuccess("Company details saved successfully.");

      await loadCompany();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save company details."
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     LOAD GST
  ============================================================ */

  const loadGST = async () => {
    try {
      const response = await getGSTSettings();

      const data = extractData(response);

      if (data) {
        setGST(data);

        setGSTForm({
          gst_number: data.gst_number || "",
          state: data.state || "",
        });

        setGSTExists(true);
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        throw err;
      }

      setGST(null);
      setGSTExists(false);
      setGSTForm(emptyGST);
    }
  };


  /* ============================================================
     SAVE GST
  ============================================================ */

  const handleSaveGST = async () => {
    if (!gstForm.gst_number || !gstForm.state) {
      setError("GST number and state are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (gstExists) {
        await updateGSTSettings(gstForm);
      } else {
        await createGSTSettings(gstForm);
      }

      setSuccess("GST settings saved successfully.");

      await loadGST();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save GST settings."
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     LOAD INVOICE
  ============================================================ */

  const loadInvoice = async () => {
    try {
      const response = await getInvoiceSettings();

      const data = extractData(response);

      if (data) {
        setInvoice(data);

        setInvoiceForm({
          prefix: data.prefix || "",
          suffix: data.suffix || "",
          starting_number:
            data.starting_number ??
            data.starting_invoice_number ??
            "",
        });

        setInvoiceExists(true);
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        throw err;
      }

      setInvoice(null);
      setInvoiceExists(false);
      setInvoiceForm(emptyInvoice);
    }
  };


  /* ============================================================
     SAVE INVOICE
  ============================================================ */

  const handleSaveInvoice = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (invoiceExists) {
        await updateInvoiceSettings(invoiceForm);
      } else {
        await createInvoiceSettings(invoiceForm);
      }

      setSuccess("Invoice settings saved successfully.");

      await loadInvoice();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save invoice settings."
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     LOAD BARCODE
  ============================================================ */

  const loadBarcode = async () => {
    try {
      const response = await getBarcodeSettings();

      const data = extractData(response);

      if (data) {
        setBarcode(data);

        setBarcodeForm({
          barcode_type:
            data.barcode_type ||
            data.format ||
            "",
          prefix: data.prefix || "",
        });

        setBarcodeExists(true);
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        throw err;
      }

      setBarcode(null);
      setBarcodeExists(false);
      setBarcodeForm(emptyBarcode);
    }
  };


  /* ============================================================
     SAVE BARCODE
  ============================================================ */

  const handleSaveBarcode = async () => {
    if (!barcodeForm.barcode_type) {
      setError("Barcode type is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (barcodeExists) {
        await updateBarcodeSettings(barcodeForm);
      } else {
        await createBarcodeSettings(barcodeForm);
      }

      setSuccess("Barcode settings saved successfully.");

      await loadBarcode();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save barcode settings."
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     LOAD METAL RATES
  ============================================================ */

  const loadMetalRates = async () => {
    setLoading(true);

    try {
      const [goldResponse, silverResponse] =
        await Promise.all([
          getMetalRate("gold"),
          getMetalRate("silver"),
        ]);

      setMetalRates({
        gold: extractData(goldResponse),
        silver: extractData(silverResponse),
      });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load metal rates."
        )
      );
    } finally {
      setLoading(false);
    }
  };


  /* ============================================================
     UPDATE METAL RATE
  ============================================================ */

  const handleUpdateRate = async (metalType) => {
    const rate = newRates[metalType];
    const financialPin = financialPins[metalType];

    if (!rate || Number(rate) <= 0) {
      setError(
        `Please enter a valid ${
          metalType === "gold" ? "Gold" : "Silver"
        } rate.`
      );
      return;
    }

    if (pinRequired[metalType] && !financialPin) {
      setError(
        "Financial PIN is required for this rate change."
      );
      return;
    }

    setUpdatingMetal(metalType);
    setError("");
    setSuccess("");

    try {
      await updateMetalRate({
        metal_type: metalType,
        rate: Number(rate),
        ...(financialPin
          ? {
              financial_pin: financialPin,
            }
          : {}),
      });

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

      setSuccess(
        `${
          metalType === "gold" ? "Gold" : "Silver"
        } rate updated successfully.`
      );

      await loadMetalRates();
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to update metal rate."
      );

      if (
        message
          .toLowerCase()
          .includes("financial pin required") ||
        message
          .toLowerCase()
          .includes("pin required")
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


  /* ============================================================
     LOAD TAX
  ============================================================ */

  const loadTax = async () => {
    try {
      const response = await getTaxSettings();

      const data = extractData(response);

      if (Array.isArray(data)) {
        setTaxSettings(data);
      } else if (data) {
        setTaxSettings([data]);
      } else {
        setTaxSettings([]);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setTaxSettings([]);
        return;
      }

      throw err;
    }
  };


  /* ============================================================
     SAVE TAX
  ============================================================ */

  const handleSaveTax = async () => {
    if (
      !taxForm.tax_name ||
      taxForm.tax_percentage === ""
    ) {
      setError(
        "Tax name and tax percentage are required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingTaxId) {
        await updateTaxSetting(
          editingTaxId,
          taxForm
        );

        setSuccess("Tax setting updated successfully.");
      } else {
        await createTaxSetting(taxForm);

        setSuccess("Tax setting created successfully.");
      }

      setTaxForm(emptyTax);
      setEditingTaxId(null);

      await loadTax();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save tax setting."
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     LOAD DISCOUNT
  ============================================================ */

  const loadDiscount = async () => {
    try {
      const response = await getDiscountSettings();

      const data = extractData(response);

      if (data) {
        setDiscount(data);

        setDiscountForm({
          discount_percentage:
            data.discount_percentage ??
            data.percentage ??
            "",
        });

        setDiscountExists(true);
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        throw err;
      }

      setDiscount(null);
      setDiscountExists(false);
      setDiscountForm(emptyDiscount);
    }
  };


  /* ============================================================
     SAVE DISCOUNT
  ============================================================ */

  const handleSaveDiscount = async () => {
    if (discountForm.discount_percentage === "") {
      setError("Discount percentage is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (discountExists) {
        await updateDiscountSettings(
          discountForm
        );
      } else {
        await createDiscountSettings(
          discountForm
        );
      }

      setSuccess(
        "Discount settings saved successfully."
      );

      await loadDiscount();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save discount settings."
        )
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     LOG LOADER
  ============================================================ */

  const loadLogs = async (type) => {
    setLoading(true);
    setError("");

    try {
      let response;

      if (type === "login-logs") {
        response = await getLoginLogs();
        setLoginLogs(extractData(response) || []);
      }

      if (type === "activity-logs") {
        response = await getActivityLogs();
        setActivityLogs(extractData(response) || []);
      }

      if (type === "audit-logs") {
        response = await getAuditLogs();
        setAuditLogs(extractData(response) || []);
      }

      if (type === "error-logs") {
        response = await getErrorLogs();
        setErrorLogs(extractData(response) || []);
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load logs."
        )
      );
    } finally {
      setLoading(false);
    }
  };


  /* ============================================================
     LOAD BACKUP HISTORY
  ============================================================ */

  const loadBackupHistory = async () => {
    setBackupLoading(true);
    setError("");

    try {
      const response = await getBackupHistory();

      const data = extractData(response);

      setBackups(
        Array.isArray(data)
          ? data
          : data
          ? [data]
          : []
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load backup history."
        )
      );
    } finally {
      setBackupLoading(false);
    }
  };


  /* ============================================================
     MANUAL BACKUP
  ============================================================ */

  const handleManualBackup = async () => {
    setBackupLoading(true);
    setError("");
    setSuccess("");

    try {
      await createManualBackup();

      setSuccess(
        "Manual backup created successfully."
      );

      await loadBackupHistory();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to create manual backup."
        )
      );
    } finally {
      setBackupLoading(false);
    }
  };


  /* ============================================================
     AUTOMATIC BACKUP
  ============================================================ */

  const handleAutomaticBackup = async () => {
    setBackupLoading(true);
    setError("");
    setSuccess("");

    try {
      await createAutomaticBackup();

      setSuccess(
        "Automatic backup created successfully."
      );

      await loadBackupHistory();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to create automatic backup."
        )
      );
    } finally {
      setBackupLoading(false);
    }
  };


  /* ============================================================
     RESTORE BACKUP
  ============================================================ */

  const handleRestoreBackup = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to restore this backup? Current database data may be replaced."
    );

    if (!confirmed) return;

    setRestoringBackup(id);
    setError("");
    setSuccess("");

    try {
      await restoreBackup(id);

      setSuccess(
        "Backup restored successfully."
      );

      await loadBackupHistory();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to restore backup."
        )
      );
    } finally {
      setRestoringBackup(null);
    }
  };


  /* ============================================================
     LOAD ACTIVE SECTION
  ============================================================ */

  const loadActiveSection = async (section) => {
    setError("");
    setSuccess("");

    try {
      if (section === "company") {
        await loadCompany();
      }

      if (section === "gst") {
        await loadGST();
      }

      if (section === "invoice") {
        await loadInvoice();
      }

      if (section === "barcode") {
        await loadBarcode();
      }

      if (section === "metal-rates") {
        await loadMetalRates();
      }

      if (section === "tax") {
        setLoading(true);
        await loadTax();
        setLoading(false);
      }

      if (section === "discount") {
        setLoading(true);
        await loadDiscount();
        setLoading(false);
      }

      if (
        section === "login-logs" ||
        section === "activity-logs" ||
        section === "audit-logs" ||
        section === "error-logs"
      ) {
        await loadLogs(section);
      }

      if (section === "backup") {
        await loadBackupHistory();
      }
    } catch (err) {
      setLoading(false);

      setError(
        getErrorMessage(
          err,
          "Unable to load settings."
        )
      );
    }
  };


  /* ============================================================
     INITIAL / SECTION LOAD
  ============================================================ */

  useEffect(() => {
    loadActiveSection(activeSection);
  }, [activeSection]);


  /* ============================================================
     METAL RATE CARD
  ============================================================ */

  const renderMetalRateCard = (
    metalType,
    label,
    unit
  ) => {
    const rate = metalRates[metalType];

    const isUpdating =
      updatingMetal === metalType;

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


        <div className="mt-5 rounded-lg bg-[#FCFAF8] px-4 py-3">

          <p className="text-xs text-[#9B8E83]">
            Current Rate
          </p>

          <div className="mt-1 flex items-baseline gap-2">

            <span className="text-xl font-semibold text-[#2B2622]">

              {loading
                ? "Loading..."
                : rate
                ? `₹${Number(
                    rate.rate
                  ).toLocaleString("en-IN")}`
                : "Not available"}

            </span>

            <span className="text-xs text-[#85786D]">
              / {unit}
            </span>

          </div>

          {rate?.updated_at && (
            <p className="mt-1 text-[11px] text-[#9B8E83]">
              Last updated:{" "}
              {formatDate(rate.updated_at)}
            </p>
          )}

        </div>


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
                    [metalType]:
                      e.target.value,
                  }));

                  setError("");
                }}
                placeholder="Enter new rate"
                className="w-full rounded-lg border border-[#DED4CA] bg-white py-2.5 pl-8 pr-3 text-sm text-[#2B2622] outline-none transition placeholder:text-[#B0A39A] focus:border-[#3A1206] focus:ring-1 focus:ring-[#3A1206]"
              />

            </div>

            <ActionButton
              onClick={() =>
                handleUpdateRate(metalType)
              }
              loading={isUpdating}
              disabled={loading}
            >
              {!isUpdating && (
                <Save size={15} />
              )}

              {isUpdating
                ? "Updating"
                : "Update"}
            </ActionButton>

          </div>

        </div>


        {pinRequired[metalType] && (
          <div className="mt-4 rounded-lg border border-[#E7DED3] bg-[#FCFAF8] p-4">

            <div className="flex items-center gap-2">

              <LockKeyhole
                size={16}
                className="text-[#3A1206]"
              />

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
                  [metalType]:
                    e.target.value,
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


  /* ============================================================
     LOG TABLE
  ============================================================ */

  const renderLogs = (logs, type) => {
    if (!Array.isArray(logs) || logs.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-[#DED4CA] bg-[#FCFAF8] p-10 text-center">

          <p className="text-sm font-medium text-[#4B423C]">
            No {activeItem?.label.toLowerCase()} found
          </p>

          <p className="mt-2 text-xs text-[#9B8E83]">
            There are currently no records available.
          </p>

        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-[#E7DED3]">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-[#FCFAF8]">

              <tr>

                {Object.keys(logs[0])
                  .slice(0, 6)
                  .map((key) => (
                    <th
                      key={key}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold capitalize text-[#6F6258]"
                    >
                      {key.replaceAll(
                        "_",
                        " "
                      )}
                    </th>
                  ))}

              </tr>

            </thead>

            <tbody className="divide-y divide-[#E7DED3] bg-white">

              {logs.map((log, index) => (

                <tr
                  key={
                    log.id ||
                    log.log_id ||
                    log.audit_id ||
                    index
                  }
                  className="hover:bg-[#FCFAF8]"
                >

                  {Object.entries(log)
                    .slice(0, 6)
                    .map(
                      ([key, value]) => (
                        <td
                          key={key}
                          className="max-w-[260px] px-4 py-3 text-xs text-[#4B423C]"
                        >
                          {key
                            .toLowerCase()
                            .includes("date") ||
                          key
                            .toLowerCase()
                            .includes(
                              "time"
                            ) ||
                          key ===
                            "created_at" ||
                          key ===
                            "updated_at"
                            ? formatDate(
                                value
                              )
                            : typeof value ===
                              "object"
                            ? JSON.stringify(
                                value
                              )
                            : String(
                                value ??
                                  "—"
                              )}
                        </td>
                      )
                    )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    );
  };


  /* ============================================================
     PAGE
  ============================================================ */

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


      {/* GLOBAL MESSAGES */}

      {error && (
        <div className="rounded-lg border border-[#E7CFC5] bg-[#FFF8F5] px-4 py-3 text-sm text-[#8B3A20]">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-[#D7E5D6] bg-[#F5FAF4] px-4 py-3 text-sm text-[#42613D]">
          {success}
        </div>
      )}


      {/* MAIN SETTINGS CONTAINER */}

      <div className="flex min-h-[650px] overflow-hidden rounded-2xl border border-[#E7DED3] bg-white">


        {/* LEFT NAVIGATION */}

        <aside className="w-64 shrink-0 overflow-y-auto border-r border-[#E7DED3] bg-[#FCFAF8] p-4">

          <div className="space-y-5">

            {settingsSections.map(
              (section) => (

                <div key={section.title}>

                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B8E83]">
                    {section.title}
                  </p>

                  <div className="space-y-1">

                    {section.items.map(
                      (item) => {

                        const Icon =
                          item.icon;

                        const isActive =
                          activeSection ===
                          item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveSection(
                                item.id
                              );

                              setError("");
                              setSuccess("");
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

                            <span>
                              {
                                item.label
                              }
                            </span>

                          </button>
                        );
                      }
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </aside>


        {/* RIGHT CONTENT */}

        <section className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">


          {/* SECTION HEADER */}

          <div className="mb-6 flex items-start justify-between border-b border-[#E7DED3] pb-5">

            <div>

              <h2 className="text-lg font-semibold text-[#2B2622]">
                {activeItem?.label}
              </h2>

              <p className="mt-1 text-sm text-[#85786D]">
                Configure your{" "}
                {activeItem?.label.toLowerCase()}{" "}
                settings.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadActiveSection(
                  activeSection
                )
              }
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-[#DED4CA] bg-white px-3 py-2 text-xs font-medium text-[#4B423C] transition hover:bg-[#F7F3EE] disabled:opacity-50"
            >

              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>


          {/* =====================================================
              COMPANY
          ===================================================== */}

          {activeSection === "company" && (
            <div className="space-y-6">

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="Company Name"
                  value={
                    companyForm.company_name
                  }
                  onChange={(value) =>
                    setCompanyForm(
                      (prev) => ({
                        ...prev,
                        company_name:
                          value,
                      })
                    )
                  }
                  placeholder="Enter company name"
                />

                <InputField
                  label="Owner Name"
                  value={
                    companyForm.owner_name
                  }
                  onChange={(value) =>
                    setCompanyForm(
                      (prev) => ({
                        ...prev,
                        owner_name:
                          value,
                      })
                    )
                  }
                  placeholder="Enter owner name"
                />

                <InputField
                  label="Phone"
                  value={
                    companyForm.phone
                  }
                  onChange={(value) =>
                    setCompanyForm(
                      (prev) => ({
                        ...prev,
                        phone: value,
                      })
                    )
                  }
                  placeholder="Enter phone number"
                />

                <InputField
                  label="Email"
                  type="email"
                  value={
                    companyForm.email
                  }
                  onChange={(value) =>
                    setCompanyForm(
                      (prev) => ({
                        ...prev,
                        email: value,
                      })
                    )
                  }
                  placeholder="Enter email address"
                />

              </div>

              <InputField
                label="Address"
                value={
                  companyForm.address
                }
                onChange={(value) =>
                  setCompanyForm(
                    (prev) => ({
                      ...prev,
                      address: value,
                    })
                  )
                }
                placeholder="Enter company address"
              />

              <div className="flex justify-end">

                <ActionButton
                  onClick={
                    handleSaveCompany
                  }
                  loading={saving}
                >
                  {!saving && (
                    <Save size={15} />
                  )}
                  Save Company
                </ActionButton>

              </div>

            </div>
          )}


          {/* =====================================================
              GST
          ===================================================== */}

          {activeSection === "gst" && (
            <div className="space-y-6">

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="GST Number"
                  value={
                    gstForm.gst_number
                  }
                  onChange={(value) =>
                    setGSTForm(
                      (prev) => ({
                        ...prev,
                        gst_number:
                          value.toUpperCase(),
                      })
                    )
                  }
                  placeholder="Enter GST number"
                />

                <InputField
                  label="State"
                  value={
                    gstForm.state
                  }
                  onChange={(value) =>
                    setGSTForm(
                      (prev) => ({
                        ...prev,
                        state: value,
                      })
                    )
                  }
                  placeholder="Enter state"
                />

              </div>

              <div className="flex justify-end">

                <ActionButton
                  onClick={
                    handleSaveGST
                  }
                  loading={saving}
                >
                  {!saving && (
                    <Save size={15} />
                  )}
                  Save GST
                </ActionButton>

              </div>

            </div>
          )}


          {/* =====================================================
              INVOICE
          ===================================================== */}

          {activeSection === "invoice" && (
            <div className="space-y-6">

              <div className="grid gap-5 md:grid-cols-3">

                <InputField
                  label="Invoice Prefix"
                  value={
                    invoiceForm.prefix
                  }
                  onChange={(value) =>
                    setInvoiceForm(
                      (prev) => ({
                        ...prev,
                        prefix: value,
                      })
                    )
                  }
                  placeholder="e.g. JL-"
                />

                <InputField
                  label="Invoice Suffix"
                  value={
                    invoiceForm.suffix
                  }
                  onChange={(value) =>
                    setInvoiceForm(
                      (prev) => ({
                        ...prev,
                        suffix: value,
                      })
                    )
                  }
                  placeholder="Optional"
                />

                <InputField
                  label="Starting Number"
                  type="number"
                  value={
                    invoiceForm.starting_number
                  }
                  onChange={(value) =>
                    setInvoiceForm(
                      (prev) => ({
                        ...prev,
                        starting_number:
                          value,
                      })
                    )
                  }
                  placeholder="e.g. 1001"
                />

              </div>

              <div className="flex justify-end">

                <ActionButton
                  onClick={
                    handleSaveInvoice
                  }
                  loading={saving}
                >
                  {!saving && (
                    <Save size={15} />
                  )}
                  Save Invoice
                </ActionButton>

              </div>

            </div>
          )}


          {/* =====================================================
              BARCODE
          ===================================================== */}

          {activeSection === "barcode" && (
            <div className="space-y-6">

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-medium text-[#4B423C]">
                    Barcode Type
                  </label>

                  <select
                    value={
                      barcodeForm.barcode_type
                    }
                    onChange={(e) =>
                      setBarcodeForm(
                        (prev) => ({
                          ...prev,
                          barcode_type:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full rounded-lg border border-[#DED4CA] bg-white px-3 py-2.5 text-sm text-[#2B2622] outline-none focus:border-[#3A1206] focus:ring-1 focus:ring-[#3A1206]"
                  >

                    <option value="">
                      Select barcode type
                    </option>

                    <option value="CODE128">
                      CODE128
                    </option>

                    <option value="CODE39">
                      CODE39
                    </option>

                    <option value="EAN13">
                      EAN13
                    </option>

                    <option value="UPC">
                      UPC
                    </option>

                  </select>

                </div>

                <InputField
                  label="Barcode Prefix"
                  value={
                    barcodeForm.prefix
                  }
                  onChange={(value) =>
                    setBarcodeForm(
                      (prev) => ({
                        ...prev,
                        prefix: value,
                      })
                    )
                  }
                  placeholder="e.g. JL"
                />

              </div>

              <div className="flex justify-end">

                <ActionButton
                  onClick={
                    handleSaveBarcode
                  }
                  loading={saving}
                >
                  {!saving && (
                    <Save size={15} />
                  )}
                  Save Barcode
                </ActionButton>

              </div>

            </div>
          )}


          {/* =====================================================
              METAL RATES
          ===================================================== */}

          {activeSection === "metal-rates" && (
            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-[#2B2622]">
                    Metal Rates
                  </h3>

                  <p className="mt-1 text-xs text-[#85786D]">
                    Update the current Gold and Silver rates used by the ERP.
                  </p>
                </div>

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
          )}


          {/* =====================================================
              TAX
          ===================================================== */}

          {activeSection === "tax" && (
            <div className="space-y-6">

              <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-5">

                <div className="mb-5">

                  <h3 className="text-sm font-semibold text-[#2B2622]">
                    {editingTaxId
                      ? "Edit Tax"
                      : "Add Tax"}
                  </h3>

                  <p className="mt-1 text-xs text-[#85786D]">
                    Configure tax percentages used by the ERP.
                  </p>

                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="Tax Name"
                    value={
                      taxForm.tax_name
                    }
                    onChange={(value) =>
                      setTaxForm(
                        (prev) => ({
                          ...prev,
                          tax_name: value,
                        })
                      )
                    }
                    placeholder="e.g. GST"
                  />

                  <InputField
                    label="Tax Percentage"
                    type="number"
                    value={
                      taxForm.tax_percentage
                    }
                    onChange={(value) =>
                      setTaxForm(
                        (prev) => ({
                          ...prev,
                          tax_percentage:
                            value,
                        })
                      )
                    }
                    placeholder="e.g. 5"
                  />

                </div>

                <div className="mt-5 flex justify-end gap-2">

                  {editingTaxId && (
                    <ActionButton
                      secondary
                      onClick={() => {
                        setEditingTaxId(
                          null
                        );
                        setTaxForm(
                          emptyTax
                        );
                      }}
                    >
                      Cancel
                    </ActionButton>
                  )}

                  <ActionButton
                    onClick={
                      handleSaveTax
                    }
                    loading={saving}
                  >
                    {!saving && (
                      <Save size={15} />
                    )}

                    {editingTaxId
                      ? "Update Tax"
                      : "Add Tax"}
                  </ActionButton>

                </div>

              </div>


              <div>

                <h3 className="mb-3 text-sm font-semibold text-[#2B2622]">
                  Existing Taxes
                </h3>

                {taxSettings.length ===
                0 ? (
                  <div className="rounded-xl border border-dashed border-[#DED4CA] bg-[#FCFAF8] p-8 text-center">
                    <p className="text-sm text-[#4B423C]">
                      No tax settings found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-[#E7DED3]">

                    <table className="w-full text-left text-sm">

                      <thead className="bg-[#FCFAF8]">

                        <tr>
                          <th className="px-4 py-3 text-xs font-semibold text-[#6F6258]">
                            Tax
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold text-[#6F6258]">
                            Percentage
                          </th>

                          <th className="px-4 py-3 text-right text-xs font-semibold text-[#6F6258]">
                            Action
                          </th>
                        </tr>

                      </thead>

                      <tbody className="divide-y divide-[#E7DED3] bg-white">

                        {taxSettings.map(
                          (tax, index) => {

                            const id =
                              tax.tax_id ||
                              tax.id;

                            return (
                              <tr
                                key={
                                  id ||
                                  index
                                }
                              >

                                <td className="px-4 py-3 text-sm text-[#2B2622]">
                                  {tax.tax_name ||
                                    tax.name ||
                                    "—"}
                                </td>

                                <td className="px-4 py-3 text-sm text-[#4B423C]">
                                  {tax.tax_percentage ??
                                    tax.percentage ??
                                    "—"}
                                  %
                                </td>

                                <td className="px-4 py-3 text-right">

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTaxId(
                                        id
                                      );

                                      setTaxForm(
                                        {
                                          tax_name:
                                            tax.tax_name ||
                                            tax.name ||
                                            "",
                                          tax_percentage:
                                            tax.tax_percentage ??
                                            tax.percentage ??
                                            "",
                                        }
                                      );
                                    }}
                                    className="text-xs font-medium text-[#3A1206] hover:underline"
                                  >
                                    Edit
                                  </button>

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </div>
          )}


          {/* =====================================================
              DISCOUNT
          ===================================================== */}

          {activeSection === "discount" && (
            <div className="space-y-6">

              <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-5">

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Discount Settings
                </h3>

                <p className="mt-1 text-xs text-[#85786D]">
                  Configure the default discount percentage used by the ERP.
                </p>

                <div className="mt-5 max-w-md">

                  <InputField
                    label="Discount Percentage"
                    type="number"
                    value={
                      discountForm.discount_percentage
                    }
                    onChange={(value) =>
                      setDiscountForm(
                        (prev) => ({
                          ...prev,
                          discount_percentage:
                            value,
                        })
                      )
                    }
                    placeholder="e.g. 15"
                  />

                </div>

                <div className="mt-5 flex justify-end">

                  <ActionButton
                    onClick={
                      handleSaveDiscount
                    }
                    loading={saving}
                  >
                    {!saving && (
                      <Save size={15} />
                    )}
                    Save Discount
                  </ActionButton>

                </div>

              </div>


              {discount && (
                <div className="rounded-xl border border-[#E7DED3] bg-white p-5">

                  <p className="text-xs text-[#9B8E83]">
                    Current Discount
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#2B2622]">
                    {discount.discount_percentage ??
                      discount.percentage ??
                      "—"}
                    %
                  </p>

                  {discount.updated_at && (
                    <p className="mt-1 text-xs text-[#9B8E83]">
                      Last updated:{" "}
                      {formatDate(
                        discount.updated_at
                      )}
                    </p>
                  )}

                </div>
              )}

            </div>
          )}


          {/* =====================================================
              NOTIFICATIONS
          ===================================================== */}

          {activeSection === "notifications" && (
            <div className="rounded-xl border border-dashed border-[#DED4CA] bg-[#FCFAF8] p-8 text-center">

              <Bell
                size={28}
                className="mx-auto text-[#9B8E83]"
              />

              <p className="mt-3 text-sm font-medium text-[#4B423C]">
                Notification Settings
              </p>

              <p className="mt-2 text-xs text-[#9B8E83]">
                Notification backend is available, but notification configuration can be connected separately.
              </p>

            </div>
          )}


          {/* =====================================================
              LOGIN HISTORY
          ===================================================== */}

          {activeSection === "login-logs" && (
            <div className="space-y-5">

              <div>

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Login History
                </h3>

                <p className="mt-1 text-xs text-[#85786D]">
                  Review user login activity.
                </p>

              </div>

              {renderLogs(
                loginLogs,
                "login-logs"
              )}

            </div>
          )}


          {/* =====================================================
              ACTIVITY LOGS
          ===================================================== */}

          {activeSection === "activity-logs" && (
            <div className="space-y-5">

              <div>

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Activity Logs
                </h3>

                <p className="mt-1 text-xs text-[#85786D]">
                  Review system and user activity.
                </p>

              </div>

              {renderLogs(
                activityLogs,
                "activity-logs"
              )}

            </div>
          )}


          {/* =====================================================
              AUDIT LOGS
          ===================================================== */}

          {activeSection === "audit-logs" && (
            <div className="space-y-5">

              <div>

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Audit Logs
                </h3>

                <p className="mt-1 text-xs text-[#85786D]">
                  Review important database and business changes.
                </p>

              </div>

              {renderLogs(
                auditLogs,
                "audit-logs"
              )}

            </div>
          )}


          {/* =====================================================
              ERROR LOGS
          ===================================================== */}

          {activeSection === "error-logs" && (
            <div className="space-y-5">

              <div>

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Error Logs
                </h3>

                <p className="mt-1 text-xs text-[#85786D]">
                  Review errors recorded by the system.
                </p>

              </div>

              {renderLogs(
                errorLogs,
                "error-logs"
              )}

            </div>
          )}


          {/* =====================================================
              BACKUP & RESTORE
          ===================================================== */}

          {activeSection === "backup" && (
            <div className="space-y-6">

              <div>

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Backup & Restore
                </h3>

                <p className="mt-1 text-xs text-[#85786D]">
                  Create database backups and restore previous versions.
                </p>

              </div>


              {/* BACKUP ACTIONS */}

              <div className="grid gap-5 md:grid-cols-2">

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3A1206]">
                      <Database
                        size={19}
                      />
                    </div>

                    <div>

                      <h4 className="text-sm font-semibold text-[#2B2622]">
                        Manual Backup
                      </h4>

                      <p className="mt-1 text-xs text-[#85786D]">
                        Create a backup immediately.
                      </p>

                    </div>

                  </div>

                  <div className="mt-5">

                    <ActionButton
                      onClick={
                        handleManualBackup
                      }
                      loading={
                        backupLoading
                      }
                    >
                      {!backupLoading && (
                        <Save size={15} />
                      )}
                      Create Manual Backup
                    </ActionButton>

                  </div>

                </div>


                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3A1206]">
                      <RefreshCw
                        size={19}
                      />
                    </div>

                    <div>

                      <h4 className="text-sm font-semibold text-[#2B2622]">
                        Automatic Backup
                      </h4>

                      <p className="mt-1 text-xs text-[#85786D]">
                        Trigger the automatic backup process.
                      </p>

                    </div>

                  </div>

                  <div className="mt-5">

                    <ActionButton
                      onClick={
                        handleAutomaticBackup
                      }
                      loading={
                        backupLoading
                      }
                    >
                      {!backupLoading && (
                        <RefreshCw
                          size={15}
                        />
                      )}
                      Create Automatic Backup
                    </ActionButton>

                  </div>

                </div>

              </div>


              {/* BACKUP HISTORY */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-[#2B2622]">
                      Backup History
                    </h3>

                    <p className="mt-1 text-xs text-[#85786D]">
                      Available database backups.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      loadBackupHistory
                    }
                    disabled={
                      backupLoading
                    }
                    className="flex items-center gap-2 rounded-lg border border-[#DED4CA] bg-white px-3 py-2 text-xs font-medium text-[#4B423C] hover:bg-[#F7F3EE] disabled:opacity-50"
                  >

                    <RefreshCw
                      size={14}
                      className={
                        backupLoading
                          ? "animate-spin"
                          : ""
                      }
                    />

                    Refresh

                  </button>

                </div>


                {backups.length === 0 ? (

                  <div className="rounded-xl border border-dashed border-[#DED4CA] bg-[#FCFAF8] p-10 text-center">

                    <Database
                      size={28}
                      className="mx-auto text-[#9B8E83]"
                    />

                    <p className="mt-3 text-sm font-medium text-[#4B423C]">
                      No backups found
                    </p>

                    <p className="mt-2 text-xs text-[#9B8E83]">
                      Create a manual backup to get started.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-hidden rounded-xl border border-[#E7DED3]">

                    <div className="overflow-x-auto">

                      <table className="w-full text-left text-sm">

                        <thead className="bg-[#FCFAF8]">

                          <tr>

                            <th className="px-4 py-3 text-xs font-semibold text-[#6F6258]">
                              Backup
                            </th>

                            <th className="px-4 py-3 text-xs font-semibold text-[#6F6258]">
                              Type
                            </th>

                            <th className="px-4 py-3 text-xs font-semibold text-[#6F6258]">
                              Date
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-[#6F6258]">
                              Action
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-[#E7DED3] bg-white">

                          {backups.map(
                            (backup, index) => {

                              const id =
                                backup.id ||
                                backup.backup_id;

                              return (
                                <tr
                                  key={
                                    id ||
                                    index
                                  }
                                  className="hover:bg-[#FCFAF8]"
                                >

                                  <td className="px-4 py-3">

                                    <div className="flex items-center gap-2">

                                      <Database
                                        size={15}
                                        className="text-[#3A1206]"
                                      />

                                      <span className="text-xs font-medium text-[#2B2622]">
                                        {backup.file_name ||
                                          backup.filename ||
                                          backup.name ||
                                          `Backup #${
                                            id ||
                                            index +
                                              1
                                          }`}
                                      </span>

                                    </div>

                                  </td>

                                  <td className="px-4 py-3 text-xs capitalize text-[#4B423C]">
                                    {backup.type ||
                                      backup.backup_type ||
                                      backup.mode ||
                                      "—"}
                                  </td>

                                  <td className="px-4 py-3 text-xs text-[#4B423C]">
                                    {formatDate(
                                      backup.created_at ||
                                        backup.createdAt ||
                                        backup.date
                                    )}
                                  </td>

                                  <td className="px-4 py-3 text-right">

                                    {id && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRestoreBackup(
                                            id
                                          )
                                        }
                                        disabled={
                                          restoringBackup ===
                                          id
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#3A1206] px-3 py-2 text-xs font-medium text-white hover:bg-[#4B190A] disabled:opacity-50"
                                      >

                                        {restoringBackup ===
                                        id ? (
                                          <RefreshCw
                                            size={
                                              14
                                            }
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <RotateCcw
                                            size={
                                              14
                                            }
                                          />
                                        )}

                                        {restoringBackup ===
                                        id
                                          ? "Restoring..."
                                          : "Restore"}

                                      </button>
                                    )}

                                  </td>

                                </tr>
                              );
                            }
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}

              </div>

            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default Settings;