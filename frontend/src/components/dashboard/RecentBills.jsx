import { ArrowRight, Receipt } from "lucide-react";

const RecentBills = () => {
  const bills = [
    {
      id: "#1024",
      customer: "Customer Name",
      amount: "₹45,000",
      status: "Paid",
    },
    {
      id: "#1023",
      customer: "Customer Name",
      amount: "₹28,500",
      status: "Pending",
    },
    {
      id: "#1022",
      customer: "Customer Name",
      amount: "₹16,200",
      status: "Paid",
    },
    {
      id: "#1021",
      customer: "Customer Name",
      amount: "₹32,800",
      status: "Partial",
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">
            Recent Bills
          </h2>

          <p className="mt-1 text-sm text-[#85786D]">
            Latest billing activity
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#8A6A1F] hover:text-[#B8860B]"
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Bills */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-[#EEE6DE] text-left">
              <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                Bill
              </th>

              <th className="pb-3 text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
                Customer
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
            {bills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b border-[#F1EBE5] last:border-b-0"
              >
                <td className="py-4 text-sm font-medium text-[#2B2622]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EBD9] text-[#B8860B]">
                      <Receipt size={15} />
                    </div>

                    {bill.id}
                  </div>
                </td>

                <td className="py-4 text-sm text-[#5F554D]">
                  {bill.customer}
                </td>

                <td className="py-4 text-sm font-medium text-[#2B2622]">
                  {bill.amount}
                </td>

                <td className="py-4">
                  <span
                    className={`
                      inline-flex rounded-full px-2.5 py-1 text-xs font-medium
                      ${
                        bill.status === "Paid"
                          ? "bg-green-50 text-green-700"
                          : bill.status === "Pending"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-blue-50 text-blue-700"
                      }
                    `}
                  >
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentBills;