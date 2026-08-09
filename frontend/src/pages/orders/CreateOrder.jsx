import {
  UserRound,
  ShoppingBag,
  FileText,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2D8CE] bg-white text-[#6F5D50] transition hover:bg-[#F7F3EE]"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-[#2B2622]">
              Create Order
            </h1>

            <p className="mt-1 text-sm text-[#85786D]">
              Create a new customer order.
            </p>
          </div>

        </div>

      </div>


      {/* CUSTOMER */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E7DD]">
            <UserRound
              size={19}
              className="text-[#8B5E3C]"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#2B2622]">
              Customer
            </h2>

            <p className="text-xs text-[#85786D]">
              Select the customer for this order.
            </p>
          </div>

        </div>


        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">

          <input
            type="text"
            placeholder="Search customer by name, mobile or ID..."
            className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
          />

          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] px-5 text-sm font-medium text-white transition hover:bg-[#754B2F]"
          >
            <Plus size={17} />
            Add Customer
          </button>

        </div>


        <div className="mt-5 grid gap-4 rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4 sm:grid-cols-3">

          <div>
            <p className="text-xs text-[#9B8D81]">
              Customer Name
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              No customer selected
            </p>
          </div>

          <div>
            <p className="text-xs text-[#9B8D81]">
              Mobile
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              —
            </p>
          </div>

          <div>
            <p className="text-xs text-[#9B8D81]">
              Customer ID
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              —
            </p>
          </div>

        </div>

      </section>


      {/* ORDER DETAILS */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E7DD]">
            <ShoppingBag
              size={19}
              className="text-[#8B5E3C]"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#2B2622]">
              Order Details
            </h2>

            <p className="text-xs text-[#85786D]">
              Add the details of the customer's order.
            </p>
          </div>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Title
            </label>

            <input
              type="text"
              placeholder="Enter order title"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Expected Delivery
            </label>

            <input
              type="date"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>

        </div>


        {/* ITEMS */}

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <label className="text-sm font-medium text-[#5F5148]">
              Order Items
            </label>

            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-[#8B5E3C] hover:text-[#754B2F]"
            >
              <Plus size={16} />
              Add Item
            </button>

          </div>


          <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-[#DCCFC2] bg-[#FCFAF8]">

            <div className="text-center">

              <ShoppingBag
                size={28}
                className="mx-auto text-[#B9AA9D]"
              />

              <p className="mt-3 text-sm font-medium text-[#5F5148]">
                No items added
              </p>

              <p className="mt-1 text-xs text-[#9B8D81]">
                Add products or order details here.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* REMARKS */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E7DD]">
            <FileText
              size={19}
              className="text-[#8B5E3C]"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#2B2622]">
              Remarks
            </h2>

            <p className="text-xs text-[#85786D]">
              Add any additional notes for this order.
            </p>
          </div>

        </div>


        <textarea
          rows="4"
          placeholder="Enter order remarks..."
          className="w-full resize-none rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
        />

      </section>


      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-xl border border-[#DCCFC2] bg-white px-6 py-3 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-xl bg-[#8B5E3C] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754B2F]"
        >
          Create Order
        </button>

      </div>

    </div>
  );
};

export default CreateOrder;