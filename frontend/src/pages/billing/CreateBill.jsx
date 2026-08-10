import { useMemo, useState } from "react";


import {
  Search,
  Plus,
  Trash2,
  UserPlus,
  ChevronDown,
} from "lucide-react";

import api from"../api/axios";

const GST_PERCENT = 3;

const CreateBill = () => {
  const [items, setItems] = useState([]);

  const [paymentAmount, setPaymentAmount] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  /*
   * ============================
   * ITEM MANAGEMENT
   * ============================
   */

const newItem = {
  id: Date.now(),
  product_id: "",
  metal_type: "",
  purity: "",
  quantity: 1,
  net_weight: "",
  rate: "",
  making_charge_percent: "",
  discount: 0,
}; 

    setItems((previousItems) => [
      ...previousItems,
      newItem,
    ]);
  };

  const removeItem = (id) => {
    setItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  };

  const updateItem = (id, field, value) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  /*
   * ============================
   * ITEM CALCULATIONS
   * ============================
   */

  const calculateItem = (item) => {
    const quantity = Number(item.quantity) || 0;
    const weight = Number(item.netWeight) || 0;
    const rate = Number(item.rate) || 0;
    const makingPercent =
      Number(item.makingPercent) || 0;
    const discount = Number(item.discount) || 0;

    /*
     * Metal Value
     *
     * Weight × Rate × Quantity
     */
    const metalValue =
      weight * rate * quantity;

    /*
     * Making Charge
     *
     * Metal Value × Making %
     */
    const makingCharge =
      metalValue * (makingPercent / 100);

    /*
     * Taxable Value
     *
     * Metal Value
     * + Making Charge
     * - Discount
     */
    const taxableValue = Math.max(
      0,
      metalValue + makingCharge - discount
    );

    /*
     * GST
     */
    const gst =
      taxableValue * (GST_PERCENT / 100);

    /*
     * Final line total
     */
    const total =
      taxableValue + gst;

    return {
      metalValue,
      makingCharge,
      discount,
      taxableValue,
      gst,
      total,
    };
  };

  /*
   * ============================
   * BILL SUMMARY
   * ============================
   */

  const billSummary = useMemo(() => {
    return items.reduce(
      (summary, item) => {
        const calculation = calculateItem(item);

        return {
          metalValue:
            summary.metalValue +
            calculation.metalValue,

          makingCharges:
            summary.makingCharges +
            calculation.makingCharge,

          discount:
            summary.discount +
            calculation.discount,

          taxableValue:
            summary.taxableValue +
            calculation.taxableValue,

          gst:
            summary.gst +
            calculation.gst,

          grandTotal:
            summary.grandTotal +
            calculation.total,
        };
      },
      {
        metalValue: 0,
        makingCharges: 0,
        discount: 0,
        taxableValue: 0,
        gst: 0,
        grandTotal: 0,
      }
    );
  }, [items]);

  /*
   * ============================
   * PAYMENT CALCULATION
   * ============================
   */

  const paidAmount =
    Number(paymentAmount) || 0;

  const remainingAmount = Math.max(
    0,
    billSummary.grandTotal - paidAmount
  );

  /*
   * ============================
   * FORMATTING
   * ============================
   */

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h3 className="text-xl font-semibold text-[#2B2622]">
            Create New Bill
          </h3>

          <p className="mt-1 text-sm text-[#85786D]">
            Create a customer invoice and record the payment.
          </p>
        </div>

        <div className="rounded-xl border border-[#E7DED3] bg-white px-4 py-2.5">

          <p className="text-xs text-[#9B8E83]">
            Bill Date
          </p>

          <p className="text-sm font-medium text-[#2B2622]">
            08 Aug 2026
          </p>

        </div>

      </div>


      {/* ================= CUSTOMER ================= */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h4 className="text-base font-semibold text-[#2B2622]">
              Customer
            </h4>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Select an existing customer for this invoice.
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#DCCFC3] px-3 py-2 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
          >
            <UserPlus size={17} />
            Add Customer
          </button>

        </div>


        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
          />

          <input
            type="text"
            placeholder="Search customer by name, mobile or customer ID..."
            className="h-12 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] pl-11 pr-4 text-sm text-[#2B2622] outline-none transition placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
          />

        </div>


        {/* Selected Customer */}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">

          <div className="rounded-xl bg-[#F7F3EE] p-4">

            <p className="text-xs text-[#9B8E83]">
              Customer Name
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              —
            </p>

          </div>


          <div className="rounded-xl bg-[#F7F3EE] p-4">

            <p className="text-xs text-[#9B8E83]">
              Mobile
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              —
            </p>

          </div>


          <div className="rounded-xl bg-[#F7F3EE] p-4">

            <p className="text-xs text-[#9B8E83]">
              Customer ID
            </p>

            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              —
            </p>

          </div>

        </div>

      </section>


      {/* ================= BILL ITEMS ================= */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div>

            <h4 className="text-base font-semibold text-[#2B2622]">
              Bill Items
            </h4>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Add the jewellery products included in this bill.
            </p>

          </div>


          <button
            type="button"
            onClick={addItem}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5D332A]"
          >
            <Plus size={17} />
            Add Item
          </button>

        </div>


        {/* Desktop Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px] border-collapse">

            <thead>

              <tr className="border-b border-[#E7DED3] text-left">

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Product
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Qty
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Net Weight
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Rate
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Making %
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Making Charge
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Discount
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Total
                </th>

                <th className="px-3 py-3" />

              </tr>

            </thead>


            <tbody>

              {items.length === 0 ? (

                <tr>

                  <td colSpan="9">

                    <div className="flex flex-col items-center justify-center py-14 text-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3EE]">

                        <Plus
                          size={21}
                          className="text-[#8A6A1F]"
                        />

                      </div>

                      <p className="text-sm font-medium text-[#665C54]">
                        No items added yet
                      </p>

                      <p className="mt-1 text-xs text-[#9B8E83]">
                        Click "Add Item" to add jewellery products.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                items.map((item) => {

                  const calculation =
                    calculateItem(item);

                  const handleCreateBill = async () => {
  try {
    // Basic validation
    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    // For now, employee_id is temporary until we connect logged-in user data
    const employeeId = 1;

    const payload = {
      customer_id: 1, // TEMPORARY: replace with selected customer ID
      employee_id: employeeId,
      payment_status: paymentStatus,
      items: items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
        net_weight: Number(item.netWeight),
        rate: Number(item.rate),
        making_charge_percent: Number(item.makingPercent),
        discount: Number(item.discount) || 0,
      })),
    };

    console.log("CREATE BILL PAYLOAD:", payload);

    const response = await api.post("/bills", payload);

    console.log("CREATE BILL RESPONSE:", response.data);

    alert("Bill created successfully.");

  } catch (error) {
    console.error("CREATE BILL ERROR:", error);

    alert(
      error.response?.data?.message ||
      "Failed to create bill."
    );
  }
};


                  return (

                    <tr
                      key={item.id}
                      className="border-b border-[#F0E9E2] last:border-0"
                    >

                      {/* Product */}

                      <td className="px-3 py-3">

                       <input
  type="number"
  value={item.product_id}
  onChange={(event) =>
    updateItem(
      item.id,
      "product_id",
      event.target.value
    )
  }
  placeholder="Product ID"
/>

                      </td>


                      {/* Quantity */}

                      <td className="px-3 py-3">

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "quantity",
                              event.target.value
                            )
                          }
                          className="h-10 w-20 rounded-lg border border-[#DED4CA] px-3 text-sm outline-none focus:border-[#B8860B]"
                        />

                      </td>


                      {/* Weight */}

                      <td className="px-3 py-3">

                        <input
                          type="number"
                          min="0"
                          step="0.001"
                          value={item.net_weight}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "net_weight",
                              event.target.value
                            )
                          }
                          placeholder="0.000"
                          className="h-10 w-28 rounded-lg border border-[#DED4CA] px-3 text-sm outline-none focus:border-[#B8860B]"
                        />

                        <span className="mt-1 block text-[10px] text-[#9B8E83]">
                          grams
                        </span>

                      </td>


                      {/* Rate */}

                      <td className="px-3 py-3">

                        <input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "rate",
                              event.target.value
                            )
                          }
                          placeholder="₹ 0"
                          className="h-10 w-28 rounded-lg border border-[#DED4CA] px-3 text-sm outline-none focus:border-[#B8860B]"
                        />

                        <span className="mt-1 block text-[10px] text-[#9B8E83]">
                          per gram
                        </span>

                      </td>


                      {/* Making % */}

                      <td className="px-3 py-3">

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.making_charge_percent}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "making_charge_percent",
                              event.target.value
                            )
                          }
                          placeholder="0"
                          className="h-10 w-24 rounded-lg border border-[#DED4CA] px-3 text-sm outline-none focus:border-[#B8860B]"
                        />

                      </td>


                      {/* Making Charge */}

                      <td className="px-3 py-3">

                        <span className="text-sm font-medium text-[#665C54]">
                          {formatCurrency(
                            calculation.makingCharge
                          )}
                        </span>

                      </td>


                      {/* Discount */}

                      <td className="px-3 py-3">

                        <input
                          type="number"
                          min="0"
                          value={item.discount}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "discount",
                              event.target.value
                            )
                          }
                          placeholder="₹ 0"
                          className="h-10 w-28 rounded-lg border border-[#DED4CA] px-3 text-sm outline-none focus:border-[#B8860B]"
                        />

                      </td>


                      {/* Total */}

                      <td className="px-3 py-3">

                        <span className="text-sm font-semibold text-[#6F3E32]">
                          {formatCurrency(
                            calculation.total
                          )}
                        </span>

                      </td>


                      {/* Delete */}

                      <td className="px-3 py-3">

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9B6B62] transition hover:bg-[#F8ECE9] hover:text-[#8B3E32]"
                          aria-label="Remove item"
                        >
                          <Trash2 size={17} />
                        </button>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>


        {/* Item Calculation Hint */}

        {items.length > 0 && (

          <div className="mt-4 rounded-xl bg-[#F7F3EE] p-4">

            <div className="grid gap-3 sm:grid-cols-3">

              <div>

                <p className="text-xs text-[#9B8E83]">
                  Metal Value
                </p>

                <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                  {formatCurrency(
                    billSummary.metalValue
                  )}
                </p>

              </div>


              <div>

                <p className="text-xs text-[#9B8E83]">
                  Making Charges
                </p>

                <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                  {formatCurrency(
                    billSummary.makingCharges
                  )}
                </p>

              </div>


              <div>

                <p className="text-xs text-[#9B8E83]">
                  Taxable Value
                </p>

                <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                  {formatCurrency(
                    billSummary.taxableValue
                  )}
                </p>

              </div>

            </div>

          </div>

        )}

      </section>


      {/* ================= BOTTOM SECTION ================= */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* ================= PAYMENT ================= */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

          <div className="mb-5">

            <h4 className="text-base font-semibold text-[#2B2622]">
              Payment
            </h4>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Record the payment received for this bill.
            </p>

          </div>


          <div className="space-y-5">

            {/* Status */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#4B423C]">
                Payment Status
              </label>

              <div className="relative">

                <select
                  value={paymentStatus}
                  onChange={(event) =>
                    setPaymentStatus(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-4 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partial">
                    Partial
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
                />

              </div>

            </div>


            {/* Method */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#4B423C]">
                Payment Method
              </label>

              <div className="relative">

                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-4 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
                >

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Mixed Payment">
                    Mixed Payment
                  </option>

                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
                />

              </div>

            </div>


            {/* Amount */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#4B423C]">
                Amount Received
              </label>

              <input
                type="number"
                min="0"
                value={paymentAmount}
                onChange={(event) =>
                  setPaymentAmount(
                    event.target.value
                  )
                }
                placeholder="₹ 0.00"
                className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-4 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B]"
              />

            </div>

          </div>

        </section>


        {/* ================= BILL SUMMARY ================= */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

          <div className="mb-5">

            <h4 className="text-base font-semibold text-[#2B2622]">
              Bill Summary
            </h4>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Final invoice amount and payment balance.
            </p>

          </div>


          <div className="space-y-4">

            {/* Metal Value */}

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#85786D]">
                Metal Value
              </span>

              <span className="font-medium text-[#2B2622]">
                {formatCurrency(
                  billSummary.metalValue
                )}
              </span>

            </div>


            {/* Making Charges */}

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#85786D]">
                Making Charges
              </span>

              <span className="font-medium text-[#2B2622]">
                {formatCurrency(
                  billSummary.makingCharges
                )}
              </span>

            </div>


            {/* Subtotal */}

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#85786D]">
                Subtotal
              </span>

              <span className="font-medium text-[#2B2622]">
                {formatCurrency(
                  billSummary.metalValue +
                  billSummary.makingCharges
                )}
              </span>

            </div>


            {/* Discount */}

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#85786D]">
                Discount
              </span>

              <span className="font-medium text-[#2B2622]">
                -{" "}
                {formatCurrency(
                  billSummary.discount
                )}
              </span>

            </div>


            {/* Taxable Value */}

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#85786D]">
                Taxable Value
              </span>

              <span className="font-medium text-[#2B2622]">
                {formatCurrency(
                  billSummary.taxableValue
                )}
              </span>

            </div>


            {/* GST */}

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#85786D]">
                GST ({GST_PERCENT}%)
              </span>

              <span className="font-medium text-[#2B2622]">
                {formatCurrency(
                  billSummary.gst
                )}
              </span>

            </div>


            {/* Grand Total */}

            <div className="border-t border-[#E7DED3] pt-4">

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold text-[#4B423C]">
                  Grand Total
                </span>

                <span className="text-2xl font-semibold text-[#6F3E32]">
                  {formatCurrency(
                    billSummary.grandTotal
                  )}
                </span>

              </div>

            </div>


            {/* Payment */}

            <div className="rounded-xl bg-[#F7F3EE] p-4">

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#85786D]">
                  Paid
                </span>

                <span className="font-medium text-[#2B2622]">
                  {formatCurrency(
                    paidAmount
                  )}
                </span>

              </div>


              <div className="mt-2 flex items-center justify-between text-sm">

                <span className="text-[#85786D]">
                  Remaining
                </span>

                <span className="font-semibold text-[#8A6A1F]">
                  {formatCurrency(
                    remainingAmount
                  )}
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* ================= ADDITIONAL DETAILS ================= */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <h4 className="text-base font-semibold text-[#2B2622]">
          Additional Details
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          {/* Employee */}

          <div>

            <label className="mb-2 block text-sm font-medium text-[#4B423C]">
              Salesperson
            </label>

            <div className="relative">

              <select
                defaultValue=""
                className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-4 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
              >

                <option value="" disabled>
                  Select salesperson
                </option>

                <option>
                  Rohan Sharma
                </option>

                <option>
                  Aditya
                </option>

                <option>
                  Admin
                </option>

              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
              />

            </div>

          </div>


          {/* Remarks */}

          <div>

            <label className="mb-2 block text-sm font-medium text-[#4B423C]">
              Remarks
            </label>

            <input
              type="text"
              placeholder="Add any internal remarks..."
              className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-4 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B]"
            />

          </div>

        </div>

      </section>


      {/* ================= ACTIONS ================= */}

      <div className="flex flex-col-reverse gap-3 border-t border-[#E7DED3] pt-6 sm:flex-row sm:justify-end">

        <button
          type="button"
          className="rounded-xl border border-[#DCCFC3] bg-white px-5 py-3 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
        >
          Save as Draft
        </button>

        <button
  type="button"
  onClick={handleCreateBill}
  className="rounded-xl bg-[#6F3E32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
>
  Create Bill
</button>

      </div>

    </div>
  );


export default CreateBill;