import { useEffect, useState } from "react";
import { getCurrentStock } from "../../services/inventory.service";
import { getProductById } from "../../services/product.service";

import StockOperationModal from "../../components/inventory/StockOperationModal";
import AddProductModal from "../../components/inventory/AddProductModal";
import ProductDetailsModal from "../../components/inventory/ProductDetailsModal";

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [operationType, setOperationType] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  const fetchStock = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCurrentStock({
        page: 1,
        limit: 100,
      });

      setStock(response.data?.data?.rows || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      setError("Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleProductClick = async (productId) => {
    try {
      setProductLoading(true);
      setError("");

      const response = await getProductById(productId);

      setSelectedProduct(response.data?.data?.rows);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Unable to load product details.");
    } finally {
      setProductLoading(false);
    }
  };

  const filteredStock = stock.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.product_name?.toLowerCase().includes(value) ||
      item.product_code?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage stock, movements and inventory levels.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          {/* Add Product */}
          <button
            onClick={() => setShowAddProduct(true)}
            className="rounded-lg bg-[#2B2622] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3A312B]"
          >
            + Add Product
          </button>

          {/* Stock In */}
          <button
            onClick={() => setOperationType("in")}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white"
          >
            + Stock In
          </button>

          {/* Stock Out */}
          <button
            onClick={() => setOperationType("out")}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            − Stock Out
          </button>

          {/* Adjust Stock */}
          <button
            onClick={() => setOperationType("adjust")}
            className="rounded-lg border border-[#DDD4CB] bg-white px-4 py-2 text-sm font-medium text-[#2B2622]"
          >
            Adjust Stock
          </button>

          {/* Stock Movements */}
          <button
            onClick={() => (window.location.href = "/inventory/movements")}
            className="rounded-lg border border-[#DDD4CB] bg-white px-4 py-2 text-sm font-medium text-[#2B2622]"
          >
            Stock Movements
          </button>

          {/* Refresh */}
          <button
            onClick={fetchStock}
            className="rounded-lg bg-[#2B2622] px-4 py-2 text-sm font-medium text-white"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-[#E5DED6] bg-white p-4">
        <input
          type="text"
          placeholder="Search product name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-[#E5DED6] bg-white p-8 text-center text-sm text-[#85786D]">
          Loading inventory...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5DED6] bg-white">

          {/* Table Header */}
          <div className="border-b border-[#E5DED6] px-5 py-4">
            <h2 className="font-medium text-[#2B2622]">
              Current Stock
            </h2>

            <p className="mt-1 text-xs text-[#85786D]">
              {filteredStock.length} inventory records
            </p>
          </div>

          {filteredStock.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#85786D]">
              No inventory records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b border-[#E5DED6] bg-[#F9F6F2]">
                  <tr>
                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Product Code
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Product
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Quantity
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Minimum
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Maximum
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStock.map((item) => {
                    const isLow =
                      Number(item.available_quantity) <=
                      Number(item.minimum_stock);

                    return (
                      <tr
                        key={item.inventory_id}
                        className="border-b border-[#EEE8E2] last:border-0"
                      >

                        <td className="px-5 py-4 font-medium text-[#2B2622]">
                          {item.product_code || "-"}
                        </td>

                        {/* CLICKABLE PRODUCT NAME */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleProductClick(item.product_id)
                            }
                            className="font-medium text-[#2B2622] underline-offset-4 transition hover:text-[#8B6914] hover:underline"
                          >
                            {item.product_name || "-"}
                          </button>
                        </td>

                        <td className="px-5 py-4 font-medium text-[#2B2622]">
                          {item.available_quantity ?? 0}
                        </td>

                        <td className="px-5 py-4 text-[#5E544C]">
                          {item.minimum_stock ?? 0}
                        </td>

                        <td className="px-5 py-4 text-[#5E544C]">
                          {item.maximum_stock ?? 0}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isLow
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {isLow ? "Low Stock" : "In Stock"}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSuccess={() => {
            setShowAddProduct(false);
            fetchStock();
          }}
        />
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* PRODUCT LOADING */}
      {productLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="rounded-xl bg-white px-6 py-4 text-sm text-[#5E544C] shadow-lg">
            Loading product details...
          </div>
        </div>
      )}

      {/* STOCK OPERATION MODAL */}
      {operationType && (
        <StockOperationModal
          type={operationType}
          onClose={() => setOperationType(null)}
          onSuccess={fetchStock}
        />
      )}

    </div>
  );
};

export default Inventory;