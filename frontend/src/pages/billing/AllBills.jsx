import {
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Printer,
  CreditCard,
  History,
} from "lucide-react";

const AllBills = () => {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-semibold text-[#2B2622]">
          All Bills
        </h1>

        <p className="mt-1 text-sm text-[#85786D]">
          Search, view and manage customer invoices.
        </p>
      </div>


      {/* ================= FILTER BAR ================= */}

      <div className="rounded-2xl border border-[#E7DED3] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

          {/* Search Invoice */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]"
            />

            <input
              type="text"
              placeholder="Search invoice number..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />

          </div>


          {/* Customer Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]"
            />

            <input
              type="text"
              placeholder="Search customer..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />

          </div>


          {/* Date */}

          <input
            type="date"
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          />


          {/* Payment Status */}

          <select
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          >
            <option value="">Payment Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>


          {/* Bill Status */}

          <select
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          >
            <option value="">Bill Status</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>


          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D8CE] px-4 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>

        </div>

      </div>


      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-2xl border border-[#E7DED3] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>
              <tr className="border-b border-[#E7DED3] bg-[#FAF7F3]">

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Invoice
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-[#F0E8E0]">

              {/* SAMPLE ROW */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    INV000014
                  </p>

                </td>


                <td className="px-5 py-4">

                  <p className="text-sm font-medium text-[#2B2622]">
                    Rahul Sharma
                  </p>

                  <p className="mt-0.5 text-xs text-[#9B8D81]">
                    98XXXXXXXX
                  </p>

                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  08 Aug 2026
                </td>


                <td className="px-5 py-4 text-right">

                  <span className="text-sm font-semibold text-[#2B2622]">
                    ₹1,11,797.50
                  </span>

                </td>


                <td className="px-5 py-4">

                  <span className="inline-flex rounded-full bg-[#E9F5EC] px-3 py-1 text-xs font-medium text-[#367347]">
                    Paid
                  </span>

                </td>


                <td className="px-5 py-4">

                  <span className="inline-flex rounded-full bg-[#F0E8DE] px-3 py-1 text-xs font-medium text-[#75563F]">
                    Completed
                  </span>

                </td>


                {/* ACTIONS */}

                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      title="View"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      title="Edit"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      title="Print"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Printer size={17} />
                    </button>

                    <button
                      title="Payment"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <CreditCard size={17} />
                    </button>

                    <button
                      title="History"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <History size={17} />
                    </button>

                  </div>

                </td>

              </tr>


              {/* SECOND SAMPLE ROW */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#2B2622]">
                    INV000013
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-[#2B2622]">
                    Priya Singh
                  </p>

                  <p className="mt-0.5 text-xs text-[#9B8D81]">
                    97XXXXXXXX
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  07 Aug 2026
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-semibold text-[#2B2622]">
                    ₹85,000.00
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#FFF4DE] px-3 py-1 text-xs font-medium text-[#936A1D]">
                    Partial
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#F0E8DE] px-3 py-1 text-xs font-medium text-[#75563F]">
                    Completed
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">

                    <button className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]">
                      <Eye size={17} />
                    </button>

                    <button className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]">
                      <Printer size={17} />
                    </button>

                    <button className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]">
                      <CreditCard size={17} />
                    </button>

                    <button className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]">
                      <History size={17} />
                    </button>

                  </div>
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* ================= PAGINATION ================= */}

        <div className="flex flex-col gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-[#85786D]">
            Showing <span className="font-medium text-[#2B2622]">1–2</span> of{" "}
            <span className="font-medium text-[#2B2622]">24</span> bills
          </p>

          <div className="flex items-center gap-2">

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
              2
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

export default AllBills;