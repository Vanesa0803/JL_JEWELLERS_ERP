import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  PackageCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Delivery = () => {
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
            Order Delivery
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Complete the delivery of a customer order.
          </p>
        </div>

      </div>


      {/* DELIVERY STATUS */}

      <div className="flex gap-4 rounded-2xl border border-[#D8E8DC] bg-[#F1F8F3] p-5">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDEFE1]">
          <PackageCheck
            size={20}
            className="text-[#367347]"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#367347]">
            Ready for Delivery
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#607666]">
            Verify the customer and order details before marking this order
            as delivered.
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
              Confirm the order before completing delivery.
            </p>
          </div>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

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


          {/* ORDER */}

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


          {/* ORDER STATUS */}

          <div>

            <p className="text-xs text-[#9B8D81]">
              Current Status
            </p>

            <span className="mt-1 inline-flex rounded-full bg-[#E9F5EC] px-3 py-1 text-xs font-medium text-[#367347]">
              Ready
            </span>

          </div>


          {/* DELIVERY DATE */}

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


      {/* DELIVERY INFORMATION */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="font-semibold text-[#2B2622]">
            Delivery Information
          </h2>

          <p className="mt-1 text-xs text-[#85786D]">
            Record the details related to this delivery.
          </p>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {/* DELIVERY DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Delivery Date
            </label>

            <input
              type="date"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />

          </div>


          {/* RECEIVED BY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Received By
            </label>

            <input
              type="text"
              placeholder="Enter receiver name"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />

          </div>

        </div>


        {/* REMARKS */}

        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-[#5F5148]">
            Delivery Remarks
          </label>

          <textarea
            rows="4"
            placeholder="Enter any delivery remarks..."
            className="w-full resize-none rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
          />

        </div>

      </section>


      {/* CONFIRMATION */}

      <div className="rounded-2xl border border-[#E7DED3] bg-[#FCFAF8] p-5">

        <div className="flex gap-3">

          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-[#367347]"
          />

          <div>

            <p className="text-sm font-semibold text-[#2B2622]">
              Confirm Delivery
            </p>

            <p className="mt-1 text-sm text-[#85786D]">
              Once confirmed, this order will be marked as delivered.
            </p>

          </div>

        </div>

      </div>


      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-xl border border-[#DCCFC2] bg-white px-6 py-3 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
        >
          Back to Orders
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#367347] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D603A]"
        >
          <CheckCircle2 size={17} />
          Confirm Delivery
        </button>

      </div>

    </div>
  );
};

export default Delivery;