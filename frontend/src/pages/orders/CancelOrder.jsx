import {
  AlertTriangle,
  ArrowLeft,
  FileText,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CancelOrder = () => {
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
            Cancel Order
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Review the order before cancelling it.
          </p>
        </div>

      </div>


      {/* WARNING */}

      <div className="flex gap-4 rounded-2xl border border-[#E8D7B7] bg-[#FFF9ED] p-5">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7E9C8]">
          <AlertTriangle
            size={20}
            className="text-[#9A741E]"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#6F5318]">
            Cancel Order
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#806C45]">
            Cancelling an order is an important action. Please verify the
            order details and provide a cancellation reason before continuing.
          </p>
        </div>

      </div>


      {/* ORDER DETAILS */}

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
              Order Details
            </h2>

            <p className="text-xs text-[#85786D]">
              Confirm that this is the order you want to cancel.
            </p>
          </div>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {/* ORDER ID */}

          <div>
            <p className="text-xs text-[#9B8D81]">
              Order ID
            </p>

            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              ORD00021
            </p>
          </div>


          {/* CUSTOMER */}

          <div>
            <div className="flex items-center gap-2">

              <UserRound
                size={15}
                className="text-[#9B8D81]"
              />

              <p className="text-xs text-[#9B8D81]">
                Customer
              </p>

            </div>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              Rahul Sharma
            </p>
          </div>


          {/* ORDER TITLE */}

          <div>
            <p className="text-xs text-[#9B8D81]">
              Order
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              22K Gold Ring
            </p>
          </div>


          {/* AMOUNT */}

          <div>
            <p className="text-xs text-[#9B8D81]">
              Order Amount
            </p>

            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              ₹1,25,000
            </p>
          </div>


          {/* STATUS */}

          <div>
            <p className="text-xs text-[#9B8D81]">
              Current Status
            </p>

            <span className="mt-1 inline-flex rounded-full bg-[#FFF4DE] px-3 py-1 text-xs font-medium text-[#936A1D]">
              Pending
            </span>
          </div>


          {/* DELIVERY */}

          <div>
            <p className="text-xs text-[#9B8D81]">
              Expected Delivery
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              15 Aug 2026
            </p>
          </div>

        </div>

      </section>


      {/* CANCELLATION REASON */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="font-semibold text-[#2B2622]">
            Cancellation Reason
          </h2>

          <p className="mt-1 text-xs text-[#85786D]">
            Please provide a reason for cancelling this order.
          </p>

        </div>


        <div className="space-y-4">

          {/* REASON */}

          <div>

            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Reason
            </label>

            <select
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            >
              <option value="">
                Select cancellation reason
              </option>

              <option value="customer_request">
                Customer Request
              </option>

              <option value="order_mistake">
                Order Mistake
              </option>

              <option value="product_unavailable">
                Product Unavailable
              </option>

              <option value="other">
                Other
              </option>
            </select>

          </div>


          {/* REMARKS */}

          <div>

            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Additional Remarks
            </label>

            <textarea
              rows="4"
              placeholder="Enter additional cancellation details..."
              className="w-full resize-none rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />

          </div>

        </div>

      </section>


      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-xl border border-[#DCCFC2] bg-white px-6 py-3 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
        >
          Keep Order
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#A34B4B] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8F3E3E]"
        >
          <XCircle size={17} />
          Cancel Order
        </button>

      </div>

    </div>
  );
};

export default CancelOrder;