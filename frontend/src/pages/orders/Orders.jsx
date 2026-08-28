import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  ShoppingCart,
  Pencil,
  XCircle,
  Truck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import { money, shortDate } from "../../lib/format";

/**
 * Maps a customer order from GET /customer-orders onto this page's shape.
 *
 * order_status is enum('Pending','Approved','In Production','Ready',
 * 'Delivered','Cancelled') — six values. The mock used "In Progress", which is
 * not one of them, so the status pill would never have coloured correctly for
 * a real order.
 */
const fromApi = (order) => ({
  id: order.customer_order_id,
  orderId: order.order_number,
  customer: order.customer_name || "—",
  orderDate: shortDate(order.order_date),
  deliveryDate: shortDate(order.expected_delivery),
  amount: money(order.total_amount),
  balance: Number(order.balance_amount ?? 0),
  status: order.order_status,
  type: order.order_type,
});




/* Keys match order_status exactly. "In Progress" was in the mock and is not a
   real status; the schema has "Approved" and "In Production" instead. */
const statusStyles = {
  Pending: "bg-[#FFF4DE] text-[#936A1D]",
  Approved: "bg-[#EAF0FA] text-[#46658A]",
  "In Production": "bg-[#EAF0FA] text-[#46658A]",
  Ready: "bg-[#E9F5EC] text-[#367347]",
  Delivered: "bg-[#E9F5EC] text-[#367347]",
  Cancelled: "bg-[#FDECEC] text-[#A34B4B]",
};

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await api.get("/customer-orders");
      setOrders((response.data?.data ?? []).map(fromApi));
    } catch (error) {
      setLoadError(
        error.response?.data?.message || error.message || "Could not load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        (order.orderId ?? "").toLowerCase().includes(query) ||
        (order.customer ?? "").toLowerCase().includes(query);

      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  /**
   * Cancel and Deliver are the two status changes with their own endpoints
   * (PATCH /customer-orders/:id/cancel and /deliver). Both write a row to
   * order_status_history, so the order keeps an audit trail of how it moved.
   *
   * The screens at /orders/cancel and /orders/delivery are still forms with no
   * order to act on, so the action happens from the row itself where the order
   * is already identified.
   */
  const changeStatus = async (order, action) => {
    const verb = action === "cancel" ? "Cancel" : "Mark delivered";

    if (!window.confirm(`${verb} order ${order.orderId}?`)) return;

    try {
      await api.patch(`/customer-orders/${order.id}/${action}`, {
        remarks: `${verb} from the orders list`,
      });

      toast.success(action === "cancel" ? "Order cancelled" : "Order delivered");
      await loadOrders();
    } catch (error) {
      // The service refuses to deliver a cancelled order, or cancel one that
      // is already cancelled, with a clear message worth showing as-is.
      toast.error(
        error.response?.data?.message || `Could not ${verb.toLowerCase()} the order`
      );
    }
  };

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
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order ID or customer..."
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />

          </div>


          {/* STATUS — the six real order_status values */}

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Production">In Production</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>


          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-xl border border-[#E2D8CE] bg-white px-4 text-sm font-medium text-[#5F554D] transition hover:bg-[#F7F3EE] disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

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

              {loading ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center text-sm text-[#9B8E83]">
                    Loading orders…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan="7">
                    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                      <AlertCircle size={22} className="text-[#A33A2B]" />
                      <p className="text-sm font-medium text-[#A33A2B]">
                        Could not load orders
                      </p>
                      <p className="text-xs text-[#8A5049]">{loadError}</p>
                      <button
                        type="button"
                        onClick={loadOrders}
                        className="mt-2 rounded-lg border border-[#E7DED3] px-4 py-2 text-xs font-medium text-[#5F554D] hover:bg-[#F7F3EE]"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                      <ShoppingCart size={22} className="text-[#8B5E3C]" />
                      <p className="text-sm font-medium text-[#665C54]">
                        {orders.length === 0
                          ? "No customer orders yet"
                          : "No orders match your search"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleOrders.map((order) => (

                <tr
                  key={order.id}
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
                        title="Update order"
                        onClick={() => navigate(`/orders/update?order=${order.id}`)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE]"
                      >
                        <Pencil size={16} />
                      </button>


                      {/* DELIVERY — disabled once the order is finished */}

                      <button
                        type="button"
                        title={
                          order.status === "Delivered"
                            ? "Already delivered"
                            : order.status === "Cancelled"
                            ? "A cancelled order cannot be delivered"
                            : "Mark delivered"
                        }
                        disabled={
                          order.status === "Delivered" || order.status === "Cancelled"
                        }
                        onClick={() => changeStatus(order, "deliver")}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Truck size={16} />
                      </button>


                      {/* CANCEL */}

                      <button
                        type="button"
                        title={
                          order.status === "Cancelled"
                            ? "Already cancelled"
                            : order.status === "Delivered"
                            ? "A delivered order cannot be cancelled"
                            : "Cancel order"
                        }
                        disabled={
                          order.status === "Cancelled" || order.status === "Delivered"
                        }
                        onClick={() => changeStatus(order, "cancel")}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8D4D4] text-[#A34B4B] transition hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <XCircle size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

                ))
              )}

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div className="flex flex-col gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          {/*
            visibleOrders, not ordersData: `ordersData` was the hardcoded array
            this page used before it was wired to the API. The array went when
            the real fetch landed; this one reference to it did not, so the page
            threw on render and showed nothing at all.

            It counts the FILTERED list because that is what the table above is
            showing — reporting the unfiltered total next to a filtered table
            reads as a bug to whoever is searching.
          */}
          <p className="text-sm text-[#85786D]">
            Showing{" "}
            <span className="font-medium text-[#2B2622]">
              {visibleOrders.length}
            </span>{" "}
            {visibleOrders.length === 1 ? "order" : "orders"}
            {visibleOrders.length !== orders.length && (
              <> of {orders.length}</>
            )}
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