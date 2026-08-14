import { ArrowRight, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { money, shortDate } from "../../lib/format";

/**
 * Latest bills, from GET /dashboard -> data.recent_bills.
 *
 * Status colours follow bills.payment_status, which is
 * enum('Pending','Partial','Completed') — not the 'Paid' the mock data used.
 */
const statusStyles = {
  Completed: "bg-green-50 text-green-700",
  Partial: "bg-blue-50 text-blue-700",
  Pending: "bg-orange-50 text-orange-700",
};

const RecentBills = ({ bills, loading }) => {
  const navigate = useNavigate();
  const rows = bills ?? [];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">Recent Bills</h2>

          <p className="mt-1 text-sm text-[#85786D]">Latest billing activity</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/billing/all")}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#8A6A1F] hover:text-[#B8860B]"
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Bills */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center text-sm text-[#9B8E83]">Loading bills…</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#9B8E83]">No bills yet.</p>
        ) : (
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-[#EEE6DE] text-left">
                <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                  Bill
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                  Customer
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                  Date
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                  Amount
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((bill) => (
                <tr
                  key={bill.invoice_number}
                  className="border-b border-[#F1EBE5] last:border-b-0"
                >
                  <td className="py-4 text-sm font-medium text-[#2B2622]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EBD9] text-[#B8860B]">
                        <Receipt size={15} />
                      </div>

                      <span className="truncate">{bill.invoice_number}</span>
                    </div>
                  </td>

                  <td className="py-4 text-sm text-[#5F554D]">{bill.customer_name}</td>

                  <td className="py-4 text-sm text-[#5F554D]">
                    {shortDate(bill.bill_date)}
                  </td>

                  <td className="py-4 text-sm font-medium tabular-nums text-[#2B2622]">
                    {money(bill.grand_total)}
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[bill.payment_status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {bill.payment_status ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default RecentBills;
