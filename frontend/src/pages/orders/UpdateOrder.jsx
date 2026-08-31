import {
  UserRound,
  ShoppingBag,
  FileText,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    expected_delivery: "",
    order_type: "",
    total_amount: "",
    advance_amount: "",
    remarks: "",
  });

  // --------------------------------------------------
  // FETCH ORDER
  // --------------------------------------------------

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/customer-orders/${id}`);

        const result = response.data;

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch order"
          );
        }

        const data = result.data;

        setOrder(data);

        setFormData({
          expected_delivery:
            data.order?.expected_delivery || "",

          order_type:
            data.order?.order_type || "",

          total_amount:
            data.order?.total_amount ?? "",

          advance_amount:
            data.order?.advance_amount ?? "",

          remarks:
            data.order?.remarks || "",
        });
      } catch (err) {
        console.error("Fetch order error:", err);

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load order";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // --------------------------------------------------
  // HANDLE INPUT
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // CALCULATE BALANCE
  // --------------------------------------------------

  const balanceAmount =
    Number(formData.total_amount || 0) -
    Number(formData.advance_amount || 0);

  // --------------------------------------------------
  // SAVE CHANGES
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.order_type) {
      toast.error("Please select an order type.");
      return;
    }

    if (Number(formData.total_amount || 0) < 0) {
      toast.error("Total amount cannot be negative.");
      return;
    }

    if (Number(formData.advance_amount || 0) < 0) {
      toast.error("Advance amount cannot be negative.");
      return;
    }

    if (balanceAmount < 0) {
      toast.error(
        "Advance amount cannot be greater than total amount."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        expected_delivery:
          formData.expected_delivery || null,

        order_type:
          formData.order_type,

        total_amount:
          Number(formData.total_amount || 0),

        advance_amount:
          Number(formData.advance_amount || 0),

        balance_amount:
          balanceAmount,

        remarks:
          formData.remarks,
      };

      const response = await api.put(
        `/customer-orders/${id}`,
        payload
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update order"
        );
      }

      toast.success("Order updated successfully.");

      navigate("/orders");
    } catch (err) {
      console.error("Update order error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order";

      setError(message);

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[#85786D]">
          Loading order...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error && !order) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2D8CE] bg-white text-[#6F5D50] transition hover:bg-[#F7F3EE]"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const orderData = order?.order;
  const items = order?.items || [];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
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

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

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
              value={orderData?.order_number || ""}
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
                value={orderData?.customer_name || ""}
                readOnly
                className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#F3EFEA] pl-10 pr-4 text-sm text-[#6F5D50] outline-none"
              />
            </div>
          </div>

          {/* ORDER DATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Date
            </label>

            <input
              type="date"
              value={orderData?.order_date || ""}
              readOnly
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#F3EFEA] px-4 text-sm text-[#6F5D50] outline-none"
            />
          </div>

          {/* ORDER TYPE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Type
            </label>

            <select
              name="order_type"
              value={formData.order_type}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            >
              <option value="">
                Select order type
              </option>

              <option value="Ready Stock">
                Ready Stock
              </option>

              <option value="Custom Jewellery">
                Custom Jewellery
              </option>

              <option value="Repair">
                Repair
              </option>
            </select>
          </div>

          {/* EXPECTED DELIVERY */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Expected Delivery
            </label>

            <input
              type="date"
              name="expected_delivery"
              value={formData.expected_delivery}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Status
            </label>

            <input
              type="text"
              value={orderData?.order_status || ""}
              readOnly
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#F3EFEA] px-4 text-sm font-medium text-[#6F5D50] outline-none"
            />

            <p className="mt-1 text-xs text-[#9B8D81]">
              Status is managed separately.
            </p>
          </div>

          {/* TOTAL AMOUNT */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Total Amount
            </label>

            <input
              type="number"
              min="0"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* ADVANCE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Advance Amount
            </label>

            <input
              type="number"
              min="0"
              name="advance_amount"
              value={formData.advance_amount}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* BALANCE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Balance Amount
            </label>

            <input
              type="text"
              value={`₹${balanceAmount.toLocaleString("en-IN")}`}
              readOnly
              className={`h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#F3EFEA] px-4 text-sm font-semibold outline-none ${
                balanceAmount < 0
                  ? "text-red-600"
                  : "text-[#6F5D50]"
              }`}
            />
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
              Items included in this order.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">
            <p className="text-sm text-[#85786D]">
              No items found for this order.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={
                  item.customer_order_item_id || index
                }
                className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <p className="text-xs text-[#9B8D81]">
                      Item
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#2B2622]">
                      {item.product_name || "Product"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9B8D81]">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#2B2622]">
                      {item.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9B8D81]">
                      Net Weight
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#2B2622]">
                      {item.net_weight}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9B8D81]">
                      Estimated Price
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                      ₹
                      {Number(
                        item.estimated_price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REMARKS */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-[#5F5148]">
          Remarks
        </label>

        <textarea
          rows="4"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full resize-none rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
        />
      </section>

      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          disabled={saving}
          className="rounded-xl border border-[#DCCFC2] bg-white px-6 py-3 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#8B5E3C] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754B2F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default UpdateOrder;