import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Printer,
  FileSpreadsheet,
  Download,
  BarChart3,
  Package,
  RefreshCw,
} from "lucide-react";

import {
  getSalesReport,
  getInventoryReport,
  exportReportPDF,
  exportReportExcel,
} from "../../services/report.service";

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      const today = new Date();
      const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const formatDateForAPI = (date) => {
        return date.toISOString().split("T")[0];
      };

      params.from_date = formatDateForAPI(firstDay);
      params.to_date = formatDateForAPI(today);

      const [salesResponse, inventoryResponse] =
        await Promise.all([
          getSalesReport(params),
          getInventoryReport(),
        ]);

      // SALES

      const salesPayload = salesResponse?.data;

      const sales =
        Array.isArray(salesPayload?.data)
          ? salesPayload.data
          : Array.isArray(salesPayload)
          ? salesPayload
          : [];

      // INVENTORY

      const inventoryPayload = inventoryResponse?.data;

      const inventory =
        Array.isArray(inventoryPayload?.data)
          ? inventoryPayload.data
          : Array.isArray(inventoryPayload)
          ? inventoryPayload
          : [];

      setSalesData(sales);
      setInventoryData(inventory);
    } catch (err) {
      console.error("Failed to load reports:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatCompactCurrency = (value) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)}Cr`;
    }

    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    }

    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}k`;
    }

    return `${Math.round(amount)}`;
  };

  const getNumber = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
          return number;
        }
      }
    }

    return 0;
  };

  const getDate = (row) => {
    return (
      row?.bill_date ||
      row?.invoice_date ||
      row?.date ||
      row?.created_at ||
      row?.payment_date ||
      null
    );
  };

  // --------------------------------------------------
  // DAILY SALES
  // --------------------------------------------------

  const dailySales = useMemo(() => {
    const days = [
      {
        label: "Mon",
        value: 0,
      },
      {
        label: "Tue",
        value: 0,
      },
      {
        label: "Wed",
        value: 0,
      },
      {
        label: "Thu",
        value: 0,
      },
      {
        label: "Fri",
        value: 0,
      },
      {
        label: "Sat",
        value: 0,
      },
      {
        label: "Sun",
        value: 0,
      },
    ];

    salesData.forEach((row) => {
      const dateValue = getDate(row);

      if (!dateValue) return;

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) return;

      const dayIndex = date.getDay();

      const mondayIndex =
        dayIndex === 0 ? 6 : dayIndex - 1;

      days[mondayIndex].value += getNumber(
        row.grand_total,
        row.total_amount,
        row.total,
        row.amount
      );
    });

    return days;
  }, [salesData]);

  // --------------------------------------------------
  // MONTHLY PROFIT TREND
  // --------------------------------------------------

  const monthlyProfit = useMemo(() => {
    const months = [];

    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        label: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        month: date.getMonth(),
        year: date.getFullYear(),
        value: 0,
      });
    }

    salesData.forEach((row) => {
      const dateValue = getDate(row);

      if (!dateValue) return;

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) return;

      const month = months.find(
        (item) =>
          item.month === date.getMonth() &&
          item.year === date.getFullYear()
      );

      if (!month) return;

      const revenue = getNumber(
        row.grand_total,
        row.total_amount,
        row.total,
        row.amount
      );

      const expense = getNumber(
        row.total_expense,
        row.expense,
        row.cost
      );

      month.value += revenue - expense;
    });

    return months;
  }, [salesData]);

  // --------------------------------------------------
  // TOP PRODUCTS
  // --------------------------------------------------

  const topProducts = useMemo(() => {
    const products = {};

    inventoryData.forEach((row) => {
      const name =
        row.product_name ||
        row.product ||
        row.name ||
        "Product";

      const quantity = getNumber(
        row.available_quantity,
        row.quantity,
        row.stock_quantity,
        row.total_quantity
      );

      if (!products[name]) {
        products[name] = 0;
      }

      products[name] += quantity;
    });

    return Object.entries(products)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [inventoryData]);

  // --------------------------------------------------
  // GOLD SCHEME / CATEGORY BREAKDOWN
  // --------------------------------------------------

  const schemeData = useMemo(() => {
    const categories = {};

    inventoryData.forEach((row) => {
      const category =
        row.category_name ||
        row.category ||
        row.metal_name ||
        row.metal ||
        "Other";

      const quantity = getNumber(
        row.available_quantity,
        row.quantity,
        row.stock_quantity,
        row.total_quantity
      );

      categories[category] =
        (categories[category] || 0) + quantity;
    });

    const result = Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    if (result.length === 0) {
      return [
        {
          name: "Gold",
          value: 40,
        },
        {
          name: "Silver",
          value: 25,
        },
        {
          name: "Diamond",
          value: 20,
        },
        {
          name: "Stone",
          value: 15,
        },
      ];
    }

    return result;
  }, [inventoryData]);

  // --------------------------------------------------
  // CHART VALUES
  // --------------------------------------------------

  const maxDailySales = Math.max(
    ...dailySales.map((item) => item.value),
    1
  );

  const maxMonthlyProfit = Math.max(
    ...monthlyProfit.map((item) => item.value),
    1
  );

  const maxProductValue = Math.max(
    ...topProducts.map((item) => item.value),
    1
  );

  // --------------------------------------------------
  // EXPORT
  // --------------------------------------------------

  const handleExport = async (type) => {
    try {
      let response;

      if (type === "pdf") {
        response = await exportReportPDF("sales");
      }

      if (type === "excel") {
        response = await exportReportExcel("sales");
      }

      if (!response) return;

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        type === "excel"
          ? "reports.xlsx"
          : "reports.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          `Unable to export ${type}.`
      );
    }
  };

  // --------------------------------------------------
  // PRINT
  // --------------------------------------------------

  const handlePrint = () => {
    window.print();
  };

  // --------------------------------------------------
  // DONUT
  // --------------------------------------------------

  const donutColors = [
    "#E7B52E",
    "#A66A36",
    "#3FAE73",
    "#4C9BCB",
    "#F16B4A",
  ];

  const totalSchemeValue = schemeData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  let cumulative = 0;

  const donutSegments = schemeData.map(
    (item, index) => {
      const percentage =
        totalSchemeValue > 0
          ? (item.value / totalSchemeValue) * 100
          : 0;

      const start = cumulative;

      cumulative += percentage;

      return {
        ...item,
        percentage,
        start,
        color:
          donutColors[index % donutColors.length],
      };
    }
  );

  const donutGradient = donutSegments
    .map(
      (segment) =>
        `${segment.color} ${segment.start}% ${
          segment.start + segment.percentage
        }%`
    )
    .join(", ");

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[600px] bg-[#FBF8F2] p-8">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#756A60]">
            <RefreshCw
              size={18}
              className="animate-spin"
            />
            Loading reports...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-full bg-[#FBF8F2] p-6 lg:p-8">

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">

        <div>
          <h1 className="font-serif text-[30px] font-semibold tracking-[-0.5px] text-[#302820]">
            Reports &amp; Analytics
          </h1>

          <p className="mt-1 text-[14px] text-[#756A60]">
            Insights into sales, inventory, customers and makers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* THIS MONTH */}

          <button
            onClick={fetchReports}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#E5DDD1] bg-[#FFFDF9] px-4 text-sm font-medium text-[#302820] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition hover:bg-white"
          >
            <CalendarDays size={16} />
            This Month
          </button>

          {/* PRINT */}

          <button
            onClick={handlePrint}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#E5DDD1] bg-[#FFFDF9] px-4 text-sm font-medium text-[#302820] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition hover:bg-white"
          >
            <Printer size={16} />
            Print
          </button>

          {/* EXCEL */}

          <button
            onClick={() => handleExport("excel")}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#E5DDD1] bg-[#FFFDF9] px-4 text-sm font-medium text-[#302820] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition hover:bg-white"
          >
            <FileSpreadsheet size={16} />
            Excel
          </button>

          {/* PDF */}

          <button
            onClick={() => handleExport("pdf")}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#E9B62D] px-4 text-sm font-semibold text-[#302820] shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition hover:bg-[#DDAA23]"
          >
            <Download size={16} />
            PDF
          </button>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-[#E8C9C1] bg-[#FFF4F1] px-4 py-3 text-sm text-[#8B4338]">
          <span>{error}</span>

          <button
            onClick={fetchReports}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ============================================
          CHART GRID
      ============================================ */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* ========================================
            DAILY SALES
        ======================================== */}

        <section className="rounded-2xl border border-[#E8E0D5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">

          <h2 className="font-serif text-[17px] font-semibold text-[#302820]">
            Daily Sales
          </h2>

          <div className="mt-6">

            <div className="relative h-[220px]">

              {/* Y AXIS LABELS */}

              <div className="absolute bottom-0 left-0 top-0 flex w-10 flex-col justify-between text-right text-[11px] text-[#82776C]">

                <span>
                  {formatCompactCurrency(
                    maxDailySales
                  )}
                </span>

                <span>
                  {formatCompactCurrency(
                    maxDailySales * 0.75
                  )}
                </span>

                <span>
                  {formatCompactCurrency(
                    maxDailySales * 0.5
                  )}
                </span>

                <span>
                  {formatCompactCurrency(
                    maxDailySales * 0.25
                  )}
                </span>

                <span>0k</span>

              </div>

              {/* CHART */}

              <div className="absolute bottom-0 left-14 right-0 top-0">

                {/* GRID */}

                <div className="absolute inset-0 flex flex-col justify-between">

                  {[0, 1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="border-t border-dashed border-[#E7DED3]"
                      />
                    )
                  )}

                </div>

                {/* BARS */}

                <div className="absolute inset-0 flex items-end justify-between gap-3 px-1">

                  {dailySales.map(
                    (item) => {
                      const height =
                        item.value > 0
                          ? Math.max(
                              (item.value /
                                maxDailySales) *
                                100,
                              4
                            )
                          : 2;

                      return (
                        <div
                          key={item.label}
                          className="flex h-full flex-1 items-end"
                        >
                          <div
                            className="w-full rounded-t-[8px] bg-[#E8B32C] transition-all duration-500 hover:bg-[#DCA623]"
                            style={{
                              height: `${height}%`,
                            }}
                            title={`${item.label}: ${formatCurrency(
                              item.value
                            )}`}
                          />
                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            </div>

            {/* X AXIS */}

            <div className="ml-14 mt-2 flex justify-between px-1 text-[11px] text-[#756A60]">

              {dailySales.map(
                (item) => (
                  <span
                    key={item.label}
                    className="flex-1 text-center"
                  >
                    {item.label}
                  </span>
                )
              )}

            </div>

          </div>
        </section>

        {/* ========================================
            MONTHLY PROFIT TREND
        ======================================== */}

        <section className="rounded-2xl border border-[#E8E0D5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">

          <h2 className="font-serif text-[17px] font-semibold text-[#302820]">
            Monthly Profit Trend
          </h2>

          <div className="mt-6">

            <div className="relative h-[220px]">

              {/* Y AXIS */}

              <div className="absolute bottom-0 left-0 top-0 flex w-10 flex-col justify-between text-right text-[11px] text-[#82776C]">

                <span>
                  {formatCompactCurrency(
                    maxMonthlyProfit
                  )}
                </span>

                <span>
                  {formatCompactCurrency(
                    maxMonthlyProfit * 0.75
                  )}
                </span>

                <span>
                  {formatCompactCurrency(
                    maxMonthlyProfit * 0.5
                  )}
                </span>

                <span>
                  {formatCompactCurrency(
                    maxMonthlyProfit * 0.25
                  )}
                </span>

                <span>0L</span>

              </div>

              <div className="absolute bottom-0 left-14 right-0 top-0">

                {/* GRID */}

                <div className="absolute inset-0 flex flex-col justify-between">

                  {[0, 1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="border-t border-dashed border-[#E7DED3]"
                      />
                    )
                  )}

                </div>

                {/* LINE SVG */}

                <svg
                  viewBox="0 0 700 220"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full overflow-visible"
                >

                  {monthlyProfit.length > 0 && (
                    <>
                      <polyline
                        fill="none"
                        stroke="#3BAE72"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={monthlyProfit
                          .map(
                            (item, index) => {
                              const x =
                                monthlyProfit.length ===
                                1
                                  ? 350
                                  : (index /
                                      (monthlyProfit.length -
                                        1)) *
                                    680 +
                                    10;

                              const y =
                                205 -
                                (Math.max(
                                  item.value,
                                  0
                                ) /
                                  maxMonthlyProfit) *
                                  185;

                              return `${x},${y}`;
                            }
                          )
                          .join(" ")}
                      />

                      {monthlyProfit.map(
                        (item, index) => {
                          const x =
                            monthlyProfit.length ===
                            1
                              ? 350
                              : (index /
                                  (monthlyProfit.length -
                                    1)) *
                                680 +
                                10;

                          const y =
                            205 -
                            (Math.max(
                              item.value,
                              0
                            ) /
                              maxMonthlyProfit) *
                              185;

                          return (
                            <circle
                              key={`${item.label}-${index}`}
                              cx={x}
                              cy={y}
                              r="5"
                              fill="white"
                              stroke="#3BAE72"
                              strokeWidth="3"
                            />
                          );
                        }
                      )}
                    </>
                  )}

                </svg>

              </div>
            </div>

            {/* X AXIS */}

            <div className="ml-14 mt-2 flex justify-between text-[11px] text-[#756A60]">

              {monthlyProfit.map(
                (item) => (
                  <span key={`${item.label}-${item.year}`}>
                    {item.label}
                  </span>
                )
              )}

            </div>

          </div>
        </section>

        {/* ========================================
            TOP PRODUCTS
        ======================================== */}

        <section className="rounded-2xl border border-[#E8E0D5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">

          <h2 className="font-serif text-[17px] font-semibold text-[#302820]">
            Top Products
          </h2>

          <div className="mt-7 space-y-4">

            {topProducts.length === 0 ? (
              <div className="flex h-[190px] items-center justify-center text-sm text-[#82776C]">
                No product data available.
              </div>
            ) : (
              topProducts.map(
                (product) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-4"
                  >

                    {/* LABEL */}

                    <div className="w-[92px] shrink-0 text-right text-xs text-[#756A60]">
                      {product.name}
                    </div>

                    {/* BAR */}

                    <div className="flex-1">

                      <div className="h-[37px] overflow-hidden rounded-r-[8px] bg-[#E8B02B] transition-all hover:bg-[#DCA623]">
                        <div
                          style={{
                            width: `${Math.max(
                              (product.value /
                                maxProductValue) *
                                100,
                              3
                            )}%`,
                          }}
                          className="h-full rounded-r-[8px]"
                        />
                      </div>

                    </div>

                  </div>
                )
              )
            )}

          </div>
        </section>

        {/* ========================================
            GOLD SCHEME COLLECTION
        ======================================== */}

        <section className="rounded-2xl border border-[#E8E0D5] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">

          <h2 className="font-serif text-[17px] font-semibold text-[#302820]">
            Gold Scheme Collection
          </h2>

          <div className="flex min-h-[250px] items-center justify-center gap-10">

            {/* DONUT */}

            <div className="relative h-[180px] w-[180px] shrink-0">

              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(${donutGradient})`,
                }}
              />

              <div className="absolute inset-[38px] rounded-full bg-white" />

            </div>

            {/* LEGEND */}

            <div className="space-y-4">

              {donutSegments.map(
                (item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3"
                  >

                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span className="text-xs text-[#665C54]">
                      {item.name}
                    </span>

                    <span className="text-xs font-semibold text-[#302820]">
                      {Math.round(
                        item.percentage
                      )}
                      %
                    </span>

                  </div>
                )
              )}

            </div>

          </div>
        </section>

      </div>

      {/* ============================================
          SMALL FOOTER STATUS
      ============================================ */}

      <div className="mt-6 flex items-center justify-between text-xs text-[#9A8F84]">

        <span>
          Showing current business analytics
        </span>

        <button
          onClick={fetchReports}
          className="flex items-center gap-1.5 transition hover:text-[#302820]"
        >
          <RefreshCw size={13} />
          Refresh data
        </button>

      </div>

    </div>
  );
};

export default Reports;