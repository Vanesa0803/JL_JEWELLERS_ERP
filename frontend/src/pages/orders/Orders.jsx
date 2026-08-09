import {
  Search,
  Plus,
  ShoppingCart,
  Pencil,
  XCircle,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const ordersData = [
  {
    orderId: "ORD00021",
    customer: "Rahul Sharma",
    orderDate: "08 Aug 2026",
    deliveryDate: "15 Aug 2026",
    amount: "₹1,25,000",
    status: "Pending",
  },
  {
    orderId: "ORD00020",
    customer: "Priya Singh",
    orderDate: "07 Aug 2026",
    deliveryDate: "12 Aug 2026",
    amount: "₹85,000",
    status: "In Progress",
  },
  {
    orderId: "ORD00019",
    customer: "Amit Kumar",
    orderDate: "06 Aug 2026",
    deliveryDate: "10 Aug 2026",
    amount: "₹62,500",
    status: "Ready",
  },
  {
    orderId: "ORD00018",
    customer: "Neha Mehra",
    orderDate: "05 Aug 2026",
    deliveryDate: "09 Aug 2026",
    amount: "₹48,000",
    status: "Delivered",
  },
  {
    orderId: "ORD00017",
    customer: "Rohan Sharma",
    orderDate: "04 Aug 2026",
    deliveryDate: "08 Aug 2026",
    amount: "₹95,000",
    status: "Cancelled",
  },
];

const statusStyles = {
  Pending: "bg-[#FFF4DE] text-[#936A1D]",
  "In Progress": "bg-[#EAF0FA] text-[#46658A]",
  Ready: "bg-[#E9F5EC] text-[#367347]",
  Delivered: "bg-[#E9F5EC] text-[#367347]",
  Cancelled: "bg-[#FDECEC] text-[#A34B4B]",
};

const Orders = () => {
    const navigate = useNavigate();
    
  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E7DD]">
              <ShoppingCart
                size={20}
                className="text-[#8B5E3C]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#2B2622]">
                Customer Orders
              </h1>

              <p className="mt-1 text-sm text-[#85786D]">
                Manage customer orders and their delivery status.
              </p>
            </div>

          </div>
        </div>


        {/* CREATE ORDER */}

      <button
  type="button"
  onClick={() => navigate("/orders/create")}
  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754B2F]"
>
  <Plus size={18} />
  Create Order
</button>
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
              placeholder="Search order ID or customer..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />

          </div>


          {/* STATUS */}

          <select
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>


          {/* DATE */}

          <input
            type="date"
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          />

        </div>

      </div>


      {/* ORDERS TABLE */}

      <div className="overflow-hidden rounded-2xl border border-[#E7DED3] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead>

              <tr className="border-b border-[#E7DED3] bg-[#FAF7F3]">

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Order ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Order Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Delivery
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#85786D]">
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

              {ordersData.map((order) => (

                <tr
                  key={order.orderId}
                  className="transition hover:bg-[#FCFAF8]"
                >

                  {/* ORDER ID */}

                  <td className="px-5 py-4">

                    <span className="text-sm font-semibold text-[#2B2622]">
                      {order.orderId}
                    </span>

                  </td>


                  {/* CUSTOMER */}

                  <td className="px-5 py-4">

                    <span className="text-sm font-medium text-[#2B2622]">
                      {order.customer}
                    </span>

                  </td>


                  {/* ORDER DATE */}

                  <td className="px-5 py-4 text-sm text-[#5F5148]">
                    {order.orderDate}
                  </td>


                  {/* DELIVERY DATE */}

                  <td className="px-5 py-4 text-sm text-[#5F5148]">
                    {order.deliveryDate}
                  </td>


                  {/* AMOUNT */}

                  <td className="px-5 py-4">

                    <span className="text-sm font-semibold text-[#2B2622]">
                      {order.amount}
                    </span>

                  </td>


                  {/* STATUS */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status}
                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {/* UPDATE */}

                   <button
  type="button"
  title="Update Order"
  onClick={() => navigate("/orders/update")}
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE]"
>
  <Pencil size={16} />
</button>


                      {/* DELIVERY */}

                     <button
  type="button"
  title="Delivery"
  onClick={() => navigate("/orders/delivery")}
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE]"
>
  <Truck size={16} />
</button>


                      {/* CANCEL */}

                      <button
  type="button"
  title="Cancel Order"
  onClick={() => navigate("/orders/cancel")}
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8D4D4] text-[#A34B4B] transition hover:bg-[#FDECEC]"
>
  <XCircle size={16} />
</button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div className="flex flex-col gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-[#85786D]">
            Showing{" "}
            <span className="font-medium text-[#2B2622]">
              {ordersData.length}
            </span>{" "}
            orders
          </p>


          <div className="flex gap-2">

            <button
              type="button"
              className="rounded-lg border border-[#E2D8CE] px-3 py-2 text-sm text-[#85786D] transition hover:bg-[#F7F3EE]"
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
              className="rounded-lg border border-[#E2D8CE] px-3 py-2 text-sm text-[#85786D] transition hover:bg-[#F7F3EE]"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Orders;