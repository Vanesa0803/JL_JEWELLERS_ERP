import {
  Search,
  Eye,
  History,
  MoreHorizontal,
} from "lucide-react";

const CancelledBills = () => {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Cancelled Bills
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Review cancelled invoices and their audit history.
          </p>
        </div>

        <div className="text-sm text-[#85786D]">
          <span className="font-semibold text-[#2B2622]">
            4
          </span>{" "}
          cancelled bills
        </div>

      </div>


      {/* ================= SEARCH + FILTER ================= */}

      <div className="rounded-2xl border border-[#E7DED3] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

          {/* Search */}

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


          {/* Date */}

          <input
            type="date"
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          />


          {/* Apply */}

          <button
            type="button"
            className="h-11 rounded-xl border border-[#E2D8CE] px-5 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
          >
            Apply
          </button>

        </div>

      </div>


      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-2xl border border-[#E7DED3] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead>

              <tr className="border-b border-[#E7DED3] bg-[#FAF7F3]">

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Invoice
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Original Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Cancelled On
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Cancelled By
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Reason
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-[#F0E8E0]">

              {/* ================= ROW 1 ================= */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    INV000009
                  </p>

                </td>


                <td className="px-5 py-4">

                  <p className="text-sm font-medium text-[#2B2622]">
                    Ankit Mehra
                  </p>

                  <p className="mt-0.5 text-xs text-[#9B8D81]">
                    98XXXXXXXX
                  </p>

                </td>


                <td className="px-5 py-4 text-sm font-semibold text-[#2B2622]">
                  ₹68,500.00
                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  08 Aug 2026
                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  Rohan Sharma
                </td>


                <td className="px-5 py-4">

                  <p className="max-w-[180px] truncate text-sm text-[#5F5148]">
                    Customer requested cancellation
                  </p>

                </td>


                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      title="View Details"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="History"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <History size={17} />
                    </button>

                    <button
                      type="button"
                      title="More"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <MoreHorizontal size={17} />
                    </button>

                  </div>

                </td>

              </tr>


              {/* ================= ROW 2 ================= */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    INV000007
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


                <td className="px-5 py-4 text-sm font-semibold text-[#2B2622]">
                  ₹92,000.00
                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  07 Aug 2026
                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  Manager
                </td>


                <td className="px-5 py-4">

                  <p className="max-w-[180px] truncate text-sm text-[#5F5148]">
                    Duplicate invoice
                  </p>

                </td>


                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      title="View Details"
                      className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="History"
                      className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]"
                    >
                      <History size={17} />
                    </button>

                  </div>

                </td>

              </tr>


              {/* ================= ROW 3 ================= */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    INV000004
                  </p>

                </td>


                <td className="px-5 py-4">

                  <p className="text-sm font-medium text-[#2B2622]">
                    Neha Verma
                  </p>

                  <p className="mt-0.5 text-xs text-[#9B8D81]">
                    96XXXXXXXX
                  </p>

                </td>


                <td className="px-5 py-4 text-sm font-semibold text-[#2B2622]">
                  ₹45,750.00
                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  05 Aug 2026
                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  Manager
                </td>


                <td className="px-5 py-4">

                  <p className="max-w-[180px] truncate text-sm text-[#5F5148]">
                    Billing correction
                  </p>

                </td>


                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      title="View Details"
                      className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="History"
                      className="rounded-lg p-2 text-[#75675D] hover:bg-[#F7F3EE]"
                    >
                      <History size={17} />
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* ================= FOOTER ================= */}

        <div className="flex flex-col gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-[#85786D]">
            Showing{" "}
            <span className="font-medium text-[#2B2622]">
              3
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#2B2622]">
              4
            </span>{" "}
            cancelled bills
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

export default CancelledBills;