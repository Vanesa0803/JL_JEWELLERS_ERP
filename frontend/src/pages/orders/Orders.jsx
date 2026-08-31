import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  ShoppingCart,
  Pencil,
  XCircle,
  Truck,
  Eye,
  RefreshCw,
  AlertCircle,
  X,
  UserRound,
  FileText,
  CalendarDays,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { money, shortDate } from "../../lib/format";

/**
 * Convert API order into the shape used by this page.
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
  raw: order,
});

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

  // View modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Action loading
  const [actionLoading, setActionLoading] = useState(null);

  // --------------------------------------------------
  // LOAD ORDERS
  // --------------------------------------------------

  const loadOrders = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await api.get("/customer-orders");

      const data = response.data?.data ?? [];

      setOrders(data.map(fromApi));
    } catch (error) {
      console.error("Load orders error:", error);

      setLoadError(
        error.response?.data?.message ||
          error.message ||
          "Could not load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        (order.orderId ?? "").toLowerCase().includes(query) ||
        (order.customer ?? "").toLowerCase().includes(query);

      const matchesStatus =
        !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // --------------------------------------------------
  // VIEW ORDER
  // --------------------------------------------------

  const handleView = async (order) => {
    try {
      setViewLoading(true);

      const response = await api.get(
        `/customer-orders/${order.id}`
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load order details"
        );
      }

      setSelectedOrder(result.data);
    } catch (error) {
      console.error("View order error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not load order details"
      );
    } finally {
      setViewLoading(false);
    }
  };

  // --------------------------------------------------
  // UPDATE ORDER
  // --------------------------------------------------

  const handleEdit = (order) => {
    navigate(`/orders/update/${order.id}`);
  };

  // --------------------------------------------------
  // MARK DELIVERED
  // --------------------------------------------------

  const handleDeliver = async (order) => {
    if (
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Mark order ${order.orderId} as delivered?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(`deliver-${order.id}`);

      await api.patch(
        `/customer-orders/${order.id}/deliver`,
        {
          remarks: "Marked delivered from orders list",
        }
      );

      toast.success("Order marked as delivered.");

      await loadOrders();
    } catch (error) {
      console.error("Deliver order error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not mark order as delivered."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------------------------
  // CANCEL ORDER
  // --------------------------------------------------

  const handleCancel = async (order) => {
    if (
      order.status === "Cancelled" ||
      order.status === "Delivered"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel order ${order.orderId}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(`cancel-${order.id}`);

      await api.patch(
        `/customer-orders/${order.id}/cancel`,
        {
          remarks: "Cancelled from orders list",
        }
      );

      toast.success("Order cancelled successfully.");

      await loadOrders();
    } catch (error) {
      console.error("Cancel order error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not cancel order."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[#85786D]">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <>
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

        {/* SEARCH + FILTER */}

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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search order ID or customer..."
                className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Production">
                In Production
              </option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="flex h-11 items-center gap-2 rounded-xl border border-[#E2D8CE] bg-white px-4 text-sm font-medium text-[#5F554D] transition hover:bg-[#F7F3EE] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

          </div>

        </div>

        {/* TABLE */}

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

                {loadError ? (

                  <tr>
                    <td colSpan="7">

                      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">

                        <AlertCircle
                          size={22}
                          className="text-[#A33A2B]"
                        />

                        <p className="text-sm font-medium text-[#A33A2B]">
                          Could not load orders
                        </p>

                        <p className="text-xs text-[#8A5049]">
                          {loadError}
                        </p>

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

                        <ShoppingCart
                          size={22}
                          className="text-[#8B5E3C]"
                        />

                        <p className="text-sm font-medium text-[#665C54]">
                          {orders.length === 0
                            ? "No customer orders yet"
                            : "No orders match your search"}
                        </p>

                      </div>

                    </td>
                  </tr>

                ) : (

                  visibleOrders.map((order) => {

                    const delivering =
                      actionLoading ===
                      `deliver-${order.id}`;

                    const cancelling =
                      actionLoading ===
                      `cancel-${order.id}`;

                    return (
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
                              statusStyles[order.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.status}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            {/* VIEW */}

                            <button
                              type="button"
                              title="View order"
                              onClick={() =>
                                handleView(order)
                              }
                              disabled={viewLoading}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Eye size={16} />
                            </button>

                            {/* EDIT */}

                           <button
  type="button"
  title="Update order"
  onClick={() => navigate(`/orders/update/${order.id}`)}
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE]"
>
  <Pencil size={16} />
</button>

                            {/* DELIVERY */}

                            <button
                              type="button"
                              title={
                                order.status ===
                                "Delivered"
                                  ? "Already delivered"
                                  : order.status ===
                                    "Cancelled"
                                  ? "A cancelled order cannot be delivered"
                                  : "Mark delivered"
                              }
                              disabled={
                                order.status ===
                                  "Delivered" ||
                                order.status ===
                                  "Cancelled" ||
                                delivering ||
                                cancelling
                              }
                              onClick={() =>
                                handleDeliver(order)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2D8CE] text-[#6F5D50] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {delivering ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Truck size={16} />
                              )}
                            </button>

                            {/* CANCEL */}

                            <button
                              type="button"
                              title={
                                order.status ===
                                "Cancelled"
                                  ? "Already cancelled"
                                  : order.status ===
                                    "Delivered"
                                  ? "A delivered order cannot be cancelled"
                                  : "Cancel order"
                              }
                              disabled={
                                order.status ===
                                  "Cancelled" ||
                                order.status ===
                                  "Delivered" ||
                                delivering ||
                                cancelling
                              }
                              onClick={() =>
                                handleCancel(order)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8D4D4] text-[#A34B4B] transition hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {cancelling ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}

          <div className="flex flex-col gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-[#85786D]">
              Showing{" "}
              <span className="font-medium text-[#2B2622]">
                {visibleOrders.length}
              </span>{" "}
              {visibleOrders.length === 1
                ? "order"
                : "orders"}

              {visibleOrders.length !==
                orders.length && (
                <> of {orders.length}</>
              )}
            </p>

            <div className="flex gap-2">

              <button
                type="button"
                disabled
                className="rounded-lg border border-[#E2D8CE] px-3 py-2 text-sm text-[#85786D] opacity-50"
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
                disabled
                className="rounded-lg border border-[#E2D8CE] px-3 py-2 text-sm text-[#85786D] opacity-50"
              >
                Next
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          VIEW ORDER MODAL
          ================================================== */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#E7DED3] px-6 py-5">

              <div>
                <h2 className="text-xl font-semibold text-[#2B2622]">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-[#85786D]">
                  {selectedOrder.order?.order_number}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6F5D50] transition hover:bg-[#F7F3EE]"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-6">

              {/* BASIC INFO */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <div className="flex items-center gap-2 text-[#85786D]">
                    <FileText size={16} />
                    <span className="text-xs">
                      Order ID
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#2B2622]">
                    {selectedOrder.order
                      ?.order_number || "—"}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <div className="flex items-center gap-2 text-[#85786D]">
                    <UserRound size={16} />
                    <span className="text-xs">
                      Customer
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#2B2622]">
                    {selectedOrder.order
                      ?.customer_name || "—"}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <div className="flex items-center gap-2 text-[#85786D]">
                    <CalendarDays size={16} />
                    <span className="text-xs">
                      Order Date
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#2B2622]">
                    {shortDate(
                      selectedOrder.order
                        ?.order_date
                    )}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <div className="flex items-center gap-2 text-[#85786D]">
                    <Truck size={16} />
                    <span className="text-xs">
                      Expected Delivery
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#2B2622]">
                    {shortDate(
                      selectedOrder.order
                        ?.expected_delivery
                    )}
                  </p>

                </div>

              </div>

              {/* STATUS + TYPE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-[#E7DED3] bg-white p-4">

                  <p className="text-xs text-[#85786D]">
                    Order Type
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#2B2622]">
                    {selectedOrder.order
                      ?.order_type || "—"}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E7DED3] bg-white p-4">

                  <p className="text-xs text-[#85786D]">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[
                        selectedOrder.order
                          ?.order_status
                      ] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedOrder.order
                      ?.order_status || "—"}
                  </span>

                </div>

              </div>

              {/* AMOUNTS */}

              <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <div className="flex items-center gap-2 text-[#85786D]">
                    <IndianRupee size={15} />
                    <span className="text-xs">
                      Total Amount
                    </span>
                  </div>

                  <p className="mt-2 text-base font-semibold text-[#2B2622]">
                    {money(
                      selectedOrder.order
                        ?.total_amount
                    )}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <p className="text-xs text-[#85786D]">
                    Advance
                  </p>

                  <p className="mt-2 text-base font-semibold text-[#2B2622]">
                    {money(
                      selectedOrder.order
                        ?.advance_amount
                    )}
                  </p>

                </div>

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <p className="text-xs text-[#85786D]">
                    Balance
                  </p>

                  <p className="mt-2 text-base font-semibold text-[#2B2622]">
                    {money(
                      selectedOrder.order
                        ?.balance_amount
                    )}
                  </p>

                </div>

              </div>

              {/* ITEMS */}

              <div>

                <h3 className="mb-3 text-sm font-semibold text-[#2B2622]">
                  Order Items
                </h3>

                {selectedOrder.items?.length ? (

                  <div className="space-y-2">

                    {selectedOrder.items.map(
                      (item, index) => (

                        <div
                          key={
                            item.customer_order_item_id ||
                            index
                          }
                          className="grid gap-3 rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4 sm:grid-cols-4"
                        >

                          <div>
                            <p className="text-xs text-[#9B8D81]">
                              Item
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#2B2622]">
                              {item.product_name ||
                                "Product"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[#9B8D81]">
                              Quantity
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#2B2622]">
                              {item.quantity ?? "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[#9B8D81]">
                              Net Weight
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#2B2622]">
                              {item.net_weight ?? "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[#9B8D81]">
                              Estimated Price
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                              {money(
                                item.estimated_price
                              )}
                            </p>
                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">
                    <p className="text-sm text-[#85786D]">
                      No items found for this order.
                    </p>
                  </div>

                )}

              </div>

              {/* REMARKS */}

              <div>

                <h3 className="mb-2 text-sm font-semibold text-[#2B2622]">
                  Remarks
                </h3>

                <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

                  <p className="text-sm text-[#5F5148]">
                    {selectedOrder.order
                      ?.remarks || "No remarks."}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-[#E7DED3] px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-xl border border-[#DCCFC2] bg-white px-5 py-2.5 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE]"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* VIEW LOADING OVERLAY */}

      {viewLoading && !selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="rounded-xl bg-white px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">

              <RefreshCw
                size={18}
                className="animate-spin text-[#8B5E3C]"
              />

              <span className="text-sm text-[#5F5148]">
                Loading order details...
              </span>

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Orders;