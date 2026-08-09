import {
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

const DraftBills = () => {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Draft Bills
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Continue working on unfinished customer invoices.
          </p>
        </div>

        <div className="text-sm text-[#85786D]">
          <span className="font-semibold text-[#2B2622]">
            3
          </span>{" "}
          draft bills
        </div>

      </div>


      {/* ================= SEARCH ================= */}

      <div className="rounded-2xl border border-[#E7DED3] bg-white p-4 shadow-sm">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]"
          />

          <input
            type="text"
            placeholder="Search draft invoice or customer..."
            className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
          />

        </div>

      </div>


      {/* ================= DRAFT TABLE ================= */}

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
                  Created
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Amount
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

              {/* ================= ROW 1 ================= */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    DRAFT00017
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
                    ₹75,000.00
                  </span>

                </td>


                <td className="px-5 py-4">

                  <span className="inline-flex rounded-full bg-[#FFF4DE] px-3 py-1 text-xs font-medium text-[#936A1D]">
                    Draft
                  </span>

                </td>


                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      title="View"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="Continue Editing"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Pencil size={17} />
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
                    DRAFT00018
                  </p>

                </td>


                <td className="px-5 py-4">

                  <p className="text-sm font-medium text-[#2B2622]">
                    Amit Kumar
                  </p>

                  <p className="mt-0.5 text-xs text-[#9B8D81]">
                    99XXXXXXXX
                  </p>

                </td>


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  08 Aug 2026
                </td>


                <td className="px-5 py-4 text-right">

                  <span className="text-sm font-semibold text-[#2B2622]">
                    ₹42,500.00
                  </span>

                </td>


                <td className="px-5 py-4">

                  <span className="inline-flex rounded-full bg-[#FFF4DE] px-3 py-1 text-xs font-medium text-[#936A1D]">
                    Draft
                  </span>

                </td>


                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      title="View"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="Continue Editing"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      title="Delete Draft"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </td>

              </tr>


              {/* ================= ROW 3 ================= */}

              <tr className="transition hover:bg-[#FCFAF8]">

                <td className="px-5 py-4">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    DRAFT00019
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


                <td className="px-5 py-4 text-sm text-[#5F5148]">
                  07 Aug 2026
                </td>


                <td className="px-5 py-4 text-right">

                  <span className="text-sm font-semibold text-[#2B2622]">
                    ₹1,25,800.00
                  </span>

                </td>


                <td className="px-5 py-4">

                  <span className="inline-flex rounded-full bg-[#FFF4DE] px-3 py-1 text-xs font-medium text-[#936A1D]">
                    Draft
                  </span>

                </td>


                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      title="View"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="Continue Editing"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-[#8B5E3C]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      title="Delete Draft"
                      className="rounded-lg p-2 text-[#75675D] transition hover:bg-[#F7F3EE] hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* ================= FOOTER ================= */}

        <div className="flex items-center justify-between border-t border-[#E7DED3] px-5 py-4">

          <p className="text-sm text-[#85786D]">
            Showing{" "}
            <span className="font-medium text-[#2B2622]">
              3
            </span>{" "}
            draft bills
          </p>

          <button
            type="button"
            className="rounded-lg border border-[#E2D8CE] px-4 py-2 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
          >
            Refresh
          </button>

        </div>

      </div>

    </div>
  );
};

export default DraftBills;