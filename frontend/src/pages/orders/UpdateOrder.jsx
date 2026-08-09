import {
  UserRound,
  ShoppingBag,
  FileText,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpdateOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      {/* HEADER */}

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
            Update Order
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Update the details of an existing customer order.
          </p>
        </div>

      </div>


      {/* ORDER INFORMATION */}

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
              Order Information
            </h2>

            <p className="text-xs text-[#85786D]">
              Review and update the order details.
            </p>
          </div>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {/* ORDER ID */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order ID
            </label>

            <input
              type="text"
              value="ORD00021"
              readOnly
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#F3EFEA] px-4 text-sm font-medium text-[#6F5D50] outline-none"
            />
          </div>


          {/* CUSTOMER */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Customer
            </label>

            <div className="relative">

              <UserRound
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8D81]"
              />

              <input
                type="text"
                defaultValue="Rahul Sharma"
                className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
              />

            </div>
          </div>


          {/* ORDER TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Title
            </label>

            <input
              type="text"
              defaultValue="22K Gold Ring"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>


          {/* DELIVERY DATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Expected Delivery
            </label>

            <input
              type="date"
              defaultValue="2026-08-15"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>


          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Status
            </label>

            <select
              defaultValue="Pending"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Ready">
                Ready
              </option>

              <option value="Delivered">
                Delivered
              </option>
            </select>
          </div>

        </div>

      </section>


      {/* ORDER ITEMS */}

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
              Order Items
            </h2>

            <p className="text-xs text-[#85786D]">
              Review the items included in this order.
            </p>
          </div>

        </div>


        <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

          <div className="grid gap-4 sm:grid-cols-3">

            <div>
              <p className="text-xs text-[#9B8D81]">
                Item
              </p>

              <p className="mt-1 text-sm font-medium text-[#2B2622]">
                22K Gold Ring
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9B8D81]">
                Quantity
              </p>

              <p className="mt-1 text-sm font-medium text-[#2B2622]">
                1
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9B8D81]">
                Amount
              </p>

              <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                ₹1,25,000
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* REMARKS */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">

        <label className="mb-2 block text-sm font-medium text-[#5F5148]">
          Remarks
        </label>

        <textarea
          rows="4"
          defaultValue="Customer requested delivery before the festival."
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
          className="flex items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754B2F]"
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>

    </div>
  );
};

export default UpdateOrder;