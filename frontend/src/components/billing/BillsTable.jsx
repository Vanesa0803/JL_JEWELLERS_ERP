import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Eye, Printer, RefreshCw, AlertCircle, Receipt } from "lucide-react";

import api from "../../services/api";
import { money, shortDate } from "../../lib/format";

/**
 * The bills table, shared by all five billing screens.
 *
 * All Bills, Drafts, Completed, Cancelled and Invoice History were five copies
 * of the same markup differing only in which bills they showed. They are now
 * one component with a `status` prop, so a fix to the table is a fix to all
 * five rather than four places to forget.
 *
 *     <BillsTable status="Draft" title="Draft Bills" />
 *
 * `status` matches bills.bill_status — enum('Draft','Completed','Cancelled',
 * 'Returned'). Omit it to show everything.
 */
const paymentStyles = {
  Completed: "bg-[#E9F5EC] text-[#367347]",
  Partial: "bg-[#EAF1FA] text-[#2F5C93]",
  Pending: "bg-[#FBF0E6] text-[#8A5A1F]",
};

const statusStyles = {
  Completed: "bg-[#E9F5EC] text-[#367347]",
  Draft: "bg-[#F0E8DE] text-[#75563F]",
  Cancelled: "bg-[#FBF1EF] text-[#A33A2B]",
  Returned: "bg-[#EAF1FA] text-[#2F5C93]",
};

const BillsTable = ({
  status,
  title,
  subtitle,
  emptyMessage = "No bills to show.",
}) => {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [invoiceQuery, setInvoiceQuery] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");

  const loadBills = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/bills");
      setBills(response.data?.data ?? []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not load bills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  /*
   * Filtering happens here rather than on the server.
   *
   * GET /bills returns every bill, and GET /bills/search accepts
   * invoice_number, customer_id, bill_status and payment_status — but it takes
   * a customer_id, not a customer name, so the "search customer" box cannot use
   * it without first resolving the name to an id. Filtering the fetched list
   * keeps both boxes working today; moving to the server is a follow-up worth
   * doing once bill volume makes it matter.
   */
  const visibleBills = useMemo(() => {
    let rows = bills;

    if (status) {
      rows = rows.filter((bill) => bill.bill_status === status);
    }

    if (invoiceQuery.trim()) {
      const q = invoiceQuery.trim().toLowerCase();
      rows = rows.filter((bill) =>
        (bill.invoice_number ?? "").toLowerCase().includes(q)
      );
    }

    if (customerQuery.trim()) {
      const q = customerQuery.trim().toLowerCase();
      rows = rows.filter((bill) =>
        (bill.customer_name ?? "").toLowerCase().includes(q)
      );
    }

    return rows;
  }, [bills, status, invoiceQuery, customerQuery]);

  const total = useMemo(
    () => visibleBills.reduce((sum, bill) => sum + Number(bill.grand_total || 0), 0),
    [visibleBills]
  );

  const handlePrint = async (bill) => {
    try {
      await api.get(`/bills/${bill.bill_id}/print`);
      // The endpoint returns JSON, not a document — invoiceGenerator.js is a
      // 0-byte file, so there is nothing to open yet. Say so plainly instead
      // of opening a blank tab. See S2-4.
      toast("Invoice printing is not built yet", { icon: "🖨️" });
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Could not print");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#85786D]">{subtitle}</p>}
        </div>

        <button
          type="button"
          onClick={loadBills}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[#E7DED3] bg-white px-4 py-2 text-sm font-medium text-[#5F554D] transition hover:bg-[#F7F3EE] disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#E7DED3] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]" />
            <input
              type="text"
              value={invoiceQuery}
              onChange={(event) => setInvoiceQuery(event.target.value)}
              placeholder="Search invoice number..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C]"
            />
          </div>

          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]" />
            <input
              type="text"
              value={customerQuery}
              onChange={(event) => setCustomerQuery(event.target.value)}
              placeholder="Search customer..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C]"
            />
          </div>

          <div className="shrink-0 rounded-xl bg-[#F7F3EE] px-4 py-2.5 text-sm">
            <span className="text-[#85786D]">
              {visibleBills.length} bill{visibleBills.length === 1 ? "" : "s"} ·{" "}
            </span>
            <span className="font-semibold tabular-nums text-[#2B2622]">{money(total)}</span>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#E7DED3] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-[#E7DED3] bg-[#FAF7F3]">
                {["Invoice", "Customer", "Date", "Amount", "Payment", "Status", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#85786D] ${
                        heading === "Amount" || heading === "Actions"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0E8E0]">

              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-14 text-center text-sm text-[#9B8E83]">
                    Loading bills…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-5 py-14">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <AlertCircle size={22} className="text-[#A33A2B]" />
                      <p className="text-sm font-medium text-[#A33A2B]">
                        Could not load bills
                      </p>
                      <p className="text-xs text-[#8A5049]">{error}</p>
                      <button
                        type="button"
                        onClick={loadBills}
                        className="mt-2 rounded-lg border border-[#E7DED3] px-4 py-2 text-xs font-medium text-[#5F554D] hover:bg-[#F7F3EE]"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : visibleBills.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-14">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Receipt size={22} className="text-[#B8860B]" />
                      <p className="text-sm font-medium text-[#665C54]">
                        {bills.length === 0 ? emptyMessage : "Nothing matches your search"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleBills.map((bill) => (
                  <tr key={bill.bill_id} className="transition hover:bg-[#FCFAF8]">

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#2B2622]">
                        {bill.invoice_number}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#2B2622]">
                        {bill.customer_name}
                      </p>
                      {bill.employee_name && (
                        <p className="mt-0.5 text-xs text-[#9B8D81]">
                          by {bill.employee_name}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#5F5148]">
                      {shortDate(bill.bill_date)}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums text-[#2B2622]">
                      {money(bill.grand_total, { paise: true })}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          paymentStyles[bill.payment_status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {bill.payment_status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[bill.bill_status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {bill.bill_status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="View"
                          onClick={() => navigate(`/billing/history?bill=${bill.bill_id}`)}
                          className="rounded-lg p-2 text-[#5F554D] transition hover:bg-[#F7F3EE]"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Print"
                          onClick={() => handlePrint(bill)}
                          className="rounded-lg p-2 text-[#5F554D] transition hover:bg-[#F7F3EE]"
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BillsTable;
