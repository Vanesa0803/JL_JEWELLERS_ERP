import {
  UserRound,
  ShoppingBag,
  FileText,
  Plus,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

const CreateOrder = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");

  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [orderType, setOrderType] = useState("Custom Jewellery");

  const [remarks, setRemarks] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
      gross_weight: "",
      net_weight: "",
      purity_id: "",
      making_charge: "",
      estimated_price: "",
      remarks: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  /*
   * Add another item
   */
  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        product_id: "",
        quantity: 1,
        gross_weight: "",
        net_weight: "",
        purity_id: "",
        making_charge: "",
        estimated_price: "",
        remarks: "",
      },
    ]);
  };

  /*
   * Remove an item
   */
  const removeItem = (index) => {
    setItems((current) => {
      if (current.length === 1) return current;

      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  /*
   * Update one item field
   */
  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  /*
   * Total order amount comes from the item estimated prices.
   */
  const totalAmount = items.reduce(
    (total, item) => total + Number(item.estimated_price || 0),
    0
  );

  const advance = Number(advanceAmount || 0);

  const balanceAmount = Math.max(totalAmount - advance, 0);

  /*
   * Create order
   */
  const handleCreateOrder = async () => {
    if (!customerId.trim()) {
      toast.error("Please enter a customer ID.");
      return;
    }

    if (!expectedDelivery) {
      toast.error("Please select an expected delivery date.");
      return;
    }

    if (!orderType) {
      toast.error("Please select an order type.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one order item.");
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !item.product_id ||
        Number(item.quantity) <= 0 ||
        Number(item.estimated_price) < 0
    );

    if (invalidItem) {
      toast.error("Please complete the product, quantity and price fields.");
      return;
    }

    if (advance > totalAmount) {
      toast.error("Advance amount cannot exceed the total amount.");
      return;
    }

    const payload = {
      customer_id: Number(customerId),

      expected_delivery: expectedDelivery,

      order_type: orderType,

      total_amount: totalAmount,

      advance_amount: advance,

      remarks,

      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        gross_weight: Number(item.gross_weight || 0),
        net_weight: Number(item.net_weight || 0),
        purity_id: item.purity_id ? Number(item.purity_id) : null,
        making_charge: Number(item.making_charge || 0),
        estimated_price: Number(item.estimated_price || 0),
        remarks: item.remarks || null,
      })),
    };

    try {
      setLoading(true);

      await api.post("/customer-orders", payload);

      toast.success("Order created successfully.");

      navigate("/orders");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not create order."
      );
    } finally {
      setLoading(false);
    }
  };

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
              Enter the customer information for this order.
            </p>
          </div>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Customer ID *
            </label>

            <input
              type="number"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              placeholder="Enter customer ID"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Customer Name
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Enter customer name"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C]"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Mobile
            </label>

            <input
              type="text"
              value={customerMobile}
              onChange={(event) => setCustomerMobile(event.target.value)}
              placeholder="Enter mobile number"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none transition focus:border-[#8B5E3C]"
            />
          </div>

        </div>

        <p className="mt-3 text-xs text-[#9B8D81]">
          Customer name and mobile are for display only. The backend uses
          Customer ID to create the order.
        </p>

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

          {/* ORDER TYPE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Order Type
            </label>

            <select
  value={orderType}
  onChange={(event) => setOrderType(event.target.value)}
  className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
>
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
              Expected Delivery *
            </label>

            <input
              type="date"
              value={expectedDelivery}
              onChange={(event) =>
                setExpectedDelivery(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />
          </div>

        </div>


        {/* ITEMS */}

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <label className="text-sm font-medium text-[#5F5148]">
                Order Items
              </label>

              <p className="mt-1 text-xs text-[#9B8D81]">
                Add the jewellery products included in this order.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-sm font-medium text-[#8B5E3C] hover:text-[#754B2F]"
            >
              <Plus size={16} />
              Add Item
            </button>

          </div>


          <div className="space-y-4">

            {items.map((item, index) => (

              <div
                key={index}
                className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4"
              >

                <div className="mb-4 flex items-center justify-between">

                  <p className="text-sm font-semibold text-[#2B2622]">
                    Item {index + 1}
                  </p>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A34B4B] transition hover:bg-[#FDECEC]"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                </div>


                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  {/* PRODUCT */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Product ID *
                    </label>

                    <input
                      type="number"
                      value={item.product_id}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "product_id",
                          event.target.value
                        )
                      }
                      placeholder="Product ID"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />
                  </div>


                  {/* QUANTITY */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Quantity *
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "quantity",
                          event.target.value
                        )
                      }
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />
                  </div>


                  {/* PURITY */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Purity ID
                    </label>

                    <input
                      type="number"
                      value={item.purity_id}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "purity_id",
                          event.target.value
                        )
                      }
                      placeholder="Purity ID"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />
                  </div>


                  {/* GROSS WEIGHT */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Gross Weight
                    </label>

                    <input
                      type="number"
                      step="0.001"
                      value={item.gross_weight}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "gross_weight",
                          event.target.value
                        )
                      }
                      placeholder="0.000"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />
                  </div>


                  {/* NET WEIGHT */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Net Weight
                    </label>

                    <input
                      type="number"
                      step="0.001"
                      value={item.net_weight}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "net_weight",
                          event.target.value
                        )
                      }
                      placeholder="0.000"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />
                  </div>


                  {/* MAKING CHARGE */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Making Charge
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      value={item.making_charge}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "making_charge",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />
                  </div>


                  {/* ESTIMATED PRICE */}

                  <div className="md:col-span-2 lg:col-span-1">

                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Estimated Price *
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.estimated_price}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "estimated_price",
                          event.target.value
                        )
                      }
                      placeholder="₹0.00"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />

                  </div>


                  {/* ITEM REMARKS */}

                  <div className="md:col-span-2 lg:col-span-2">

                    <label className="mb-2 block text-xs font-medium text-[#5F5148]">
                      Item Remarks
                    </label>

                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "remarks",
                          event.target.value
                        )
                      }
                      placeholder="Optional item remarks"
                      className="h-10 w-full rounded-lg border border-[#E2D8CE] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* PAYMENT */}

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
              Payment Summary
            </h2>

            <p className="text-xs text-[#85786D]">
              Enter the advance received for this order.
            </p>
          </div>

        </div>


        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-[#FCFAF8] p-4">

            <p className="text-xs text-[#9B8D81]">
              Total Amount
            </p>

            <p className="mt-1 text-lg font-semibold text-[#2B2622]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-[#5F5148]">
              Advance Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={advanceAmount}
              onChange={(event) =>
                setAdvanceAmount(event.target.value)
              }
              placeholder="₹0.00"
              className="h-11 w-full rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C]"
            />

          </div>


          <div className="rounded-xl bg-[#FCFAF8] p-4">

            <p className="text-xs text-[#9B8D81]">
              Balance Amount
            </p>

            <p className="mt-1 text-lg font-semibold text-[#8B5E3C]">
              ₹{balanceAmount.toLocaleString("en-IN")}
            </p>

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
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Enter order remarks..."
          className="w-full resize-none rounded-xl border border-[#E2D8CE] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2B2622] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10"
        />

      </section>


      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => navigate("/orders")}
          disabled={loading}
          className="rounded-xl border border-[#DCCFC2] bg-white px-6 py-3 text-sm font-medium text-[#5F5148] transition hover:bg-[#F7F3EE] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleCreateOrder}
          disabled={loading}
          className="rounded-xl bg-[#8B5E3C] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754B2F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Order..." : "Create Order"}
        </button>

      </div>

    </div>
  );
};

export default CreateOrder;