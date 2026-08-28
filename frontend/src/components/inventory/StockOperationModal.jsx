import { useEffect, useState } from "react";
import {
  stockIn,
  stockOut,
  adjustStock,
} from "../../services/inventory.service";
import api from "../../services/api";

const StockOperationModal = ({ type, onClose, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [form, setForm] = useState({
  product_id: "",
  quantity: "",
  minimum_stock: "",
  maximum_stock: "",
  movement_type: type === "adjust" ? "Adjustment" : "Purchase",
  reference_number: "",
  remarks: "",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load products when modal opens
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await api.get("/products", {
          params: {
            page: 1,
            limit: 100,
            is_active: true,
          },
        });

        setProducts(response.data?.data?.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.product_id || !form.quantity) {
  setError("Please select a product and enter quantity.");
  return;
}

if (type === "in") {
  if (form.minimum_stock === "" || form.maximum_stock === "") {
    setError("Please enter minimum and maximum stock.");
    return;
  }

  if (Number(form.minimum_stock) > Number(form.maximum_stock)) {
    setError("Minimum stock cannot be greater than maximum stock.");
    return;
  }
}

    try {
      setLoading(true);
      setError("");

      const operationData = {
  product_id: Number(form.product_id),
  quantity: Number(form.quantity),
  movement_type: form.movement_type,
  minimum_stock: Number(form.minimum_stock),
  maximum_stock: Number(form.maximum_stock),
  reference_number: form.reference_number || undefined,
  remarks: form.remarks || undefined,
};

      if (type === "in") {
        await stockIn(operationData);
      } else if (type === "out") {
        await stockOut(operationData);
      } else {
        await adjustStock(operationData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Stock operation failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to complete stock operation."
      );
    } finally {
      setLoading(false);
    }
  };

  const title =
    type === "in"
      ? "Stock In"
      : type === "out"
      ? "Stock Out"
      : "Adjust Stock";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#2B2622]">
              {title}
            </h2>

            <p className="mt-1 text-sm text-[#85786D]">
              Record an inventory stock operation.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#85786D] hover:text-[#2B2622]"
          >
            ×
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Product */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#5E544C]">
              Product
            </label>

            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              disabled={loadingProducts}
              className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
            >
              <option value="">
                {loadingProducts
                  ? "Loading products..."
                  : "Select a product"}
              </option>

              {products.map((product) => (
                <option
                  key={product.product_id}
                  value={product.product_id}
                >
                  {product.product_name} ({product.product_code})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
<div>
  <label className="mb-1 block text-sm font-medium text-[#5E544C]">
    Quantity
  </label>

  <input
    name="quantity"
    type="number"
    min="1"
    value={form.quantity}
    onChange={handleChange}
    placeholder="Enter quantity"
    className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
  />
</div>

{/* Minimum + Maximum Stock */}
{type === "in" && (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

    <div>
      <label className="mb-1 block text-sm font-medium text-[#5E544C]">
        Minimum Stock
      </label>

      <input
        name="minimum_stock"
        type="number"
        min="0"
        value={form.minimum_stock}
        onChange={handleChange}
        placeholder="e.g. 5"
        className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-[#5E544C]">
        Maximum Stock
      </label>

      <input
        name="maximum_stock"
        type="number"
        min="0"
        value={form.maximum_stock}
        onChange={handleChange}
        placeholder="e.g. 50"
        className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
      />
    </div>

  </div>
)}

{/* Movement Type */}
          
          <div>
            <label className="mb-1 block text-sm font-medium text-[#5E544C]">
              Movement Type
            </label>

            <select
              name="movement_type"
              value={form.movement_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
            >
              <option value="Purchase">Purchase</option>
              <option value="Sale">Sale</option>
              <option value="Return">Return</option>
              <option value="Repair">Repair</option>
              <option value="Adjustment">Adjustment</option>
              <option value="Opening Stock">Opening Stock</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          {/* Reference */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#5E544C]">
              Reference Number
            </label>

            <input
              name="reference_number"
              value={form.reference_number}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#5E544C]">
              Remarks
            </label>

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Optional remarks"
              rows="3"
              className="w-full resize-none rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm font-medium text-[#5E544C]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || loadingProducts}
              className="rounded-lg bg-[#2B2622] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Operation"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StockOperationModal;