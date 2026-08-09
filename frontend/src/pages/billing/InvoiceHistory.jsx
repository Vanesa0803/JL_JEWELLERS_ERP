import {
  Search,
  FileText,
  CreditCard,
  Pencil,
  CheckCircle2,
  XCircle,
  History,
} from "lucide-react";

const historyData = [
  {
    invoice: "INV000014",
    customer: "Rahul Sharma",
    action: "Bill Created",
    employee: "Rohan Sharma",
    date: "08 Aug 2026",
    time: "10:32 AM",
    type: "created",
    remarks: "New bill created",
  },
  {
    invoice: "INV000014",
    customer: "Rahul Sharma",
    action: "Payment Received",
    employee: "Rohan Sharma",
    date: "08 Aug 2026",
    time: "10:45 AM",
    type: "payment",
    remarks: "UPI payment received",
  },
  {
    invoice: "INV000014",
    customer: "Rahul Sharma",
    action: "Bill Edited",
    employee: "Rohan Sharma",
    date: "08 Aug 2026",
    time: "10:51 AM",
    type: "edited",
    remarks: "Discount updated",
  },
  {
    invoice: "INV000014",
    customer: "Rahul Sharma",
    action: "Bill Completed",
    employee: "Manager",
    date: "08 Aug 2026",
    time: "11:02 AM",
    type: "completed",
    remarks: "Bill marked as completed",
  },
  {
    invoice: "INV000013",
    customer: "Priya Singh",
    action: "Bill Created",
    employee: "Neha Sharma",
    date: "07 Aug 2026",
    time: "04:15 PM",
    type: "created",
    remarks: "New bill created",
  },
  {
    invoice: "INV000013",
    customer: "Priya Singh",
    action: "Payment Received",
    employee: "Neha Sharma",
    date: "07 Aug 2026",
    time: "04:29 PM",
    type: "payment",
    remarks: "Cash payment received",
  },
  {
    invoice: "INV000009",
    customer: "Ankit Mehra",
    action: "Bill Cancelled",
    employee: "Manager",
    date: "08 Aug 2026",
    time: "01:20 PM",
    type: "cancelled",
    remarks: "Customer requested cancellation",
  },
];

const actionConfig = {
  created: {
    icon: FileText,
    iconClass: "bg-[#F1E7DD] text-[#8B5E3C]",
  },
  payment: {
    icon: CreditCard,
    iconClass: "bg-[#E9F5EC] text-[#367347]",
  },
  edited: {
    icon: Pencil,
    iconClass: "bg-[#FFF4DE] text-[#936A1D]",
  },
  completed: {
    icon: CheckCircle2,
    iconClass: "bg-[#E9F5EC] text-[#367347]",
  },
  cancelled: {
    icon: XCircle,
    iconClass: "bg-[#FDECEC] text-[#A34B4B]",
  },
};

const InvoiceHistory = () => {
  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E7DD]">
            <History size={20} className="text-[#8B5E3C]" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#2B2622]">
              Invoice History
            </h1>

            <p className="mt-1 text-sm text-[#85786D]">
              Track bill creation, payments, edits, completion and cancellation.
            </p>
          </div>
        </div>
      </div>


      {/* SEARCH + FILTERS */}

      <div className="rounded-2xl border border-[#E7DED3] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]"
            />

            <input
              type="text"
              placeholder="Search invoice or customer..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />

          </div>


          {/* ACTION FILTER */}

          <select
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          >
            <option value="">All Actions</option>
            <option value="created">Bill Created</option>
            <option value="payment">Payment Received</option>
            <option value="edited">Bill Edited</option>
            <option value="completed">Bill Completed</option>
            <option value="cancelled">Bill Cancelled</option>
          </select>


          {/* DATE */}

          <input
            type="date"
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          />


          <button
            type="button"
            className="h-11 rounded-xl border border-[#E2D8CE] px-5 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
          >
            Apply
          </button>

        </div>

      </div>


      {/* HISTORY TABLE */}

      <div className="overflow-hidden rounded-2xl border border-[#E7DED3] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>

              <tr className="border-b border-[#E7DED3] bg-[#FAF7F3]">

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Invoice
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Action
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Employee
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Remarks
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-[#F0E8E0]">

              {historyData.map((item, index) => {

                const config = actionConfig[item.type];
                const Icon = config.icon;

                return (
                  <tr
                    key={`${item.invoice}-${index}`}
                    className="transition hover:bg-[#FCFAF8]"
                  >

                    {/* INVOICE */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-semibold text-[#2B2622]">
                        {item.invoice}
                      </span>

                    </td>


                    {/* CUSTOMER */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#2B2622]">
                        {item.customer}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconClass}`}
                        >
                          <Icon size={17} />
                        </div>

                        <span className="text-sm font-medium text-[#2B2622]">
                          {item.action}
                        </span>

                      </div>

                    </td>


                    {/* EMPLOYEE */}

                    <td className="px-5 py-4 text-sm text-[#5F5148]">
                      {item.employee}
                    </td>


                    {/* DATE */}

                    <td className="px-5 py-4">

                      <p className="text-sm text-[#5F5148]">
                        {item.date}
                      </p>

                      <p className="mt-0.5 text-xs text-[#9B8D81]">
                        {item.time}
                      </p>

                    </td>


                    {/* REMARKS */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#75675D]">
                        {item.remarks}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div className="flex flex-col gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-[#85786D]">
            Showing{" "}
            <span className="font-medium text-[#2B2622]">
              7
            </span>{" "}
            history records
          </p>


          <div className="flex gap-2">

            <button
              type="button"
              className="rounded-lg border border-[#E2D8CE] px-3 py-2 text-sm text-[#85786D] hover:bg-[#F7F3EE]"
            >
              Previous
            </button>

            <button
              type="button"
              className="rounded-lg bg-[#8B5E3C] px-3 py-2 text-sm font-medium text-white"
            >
              1
            </button>

            <button
              type="button"
              className="rounded-lg border border-[#E2D8CE] px-3 py-2 text-sm text-[#85786D] hover:bg-[#F7F3EE]"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceHistory;