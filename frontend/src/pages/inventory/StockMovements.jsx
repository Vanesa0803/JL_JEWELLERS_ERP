import { useEffect, useState } from "react";
import { getStockMovements } from "../../services/inventory.service";

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStockMovements({
        page: 1,
        limit: 100,
      });

      setMovements(response.data?.data?.movements || []);
    } catch (err) {
      console.error("Failed to fetch stock movements:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load stock movements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const filteredMovements = movements.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.product_name?.toLowerCase().includes(value) ||
      item.movement_type?.toLowerCase().includes(value) ||
      item.reference_number?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Stock Movements
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            View all inventory stock-in, stock-out and adjustment movements.
          </p>
        </div>

        <button
          onClick={fetchMovements}
          className="rounded-lg bg-[#2B2622] px-4 py-2 text-sm font-medium text-white"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-[#E5DED6] bg-white p-4">
        <input
          type="text"
          placeholder="Search product, movement type or reference number..."
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
          Loading stock movements...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5DED6] bg-white">

          <div className="border-b border-[#E5DED6] px-5 py-4">
            <h2 className="font-medium text-[#2B2622]">
              Movement History
            </h2>

            <p className="mt-1 text-xs text-[#85786D]">
              {filteredMovements.length} movements found
            </p>
          </div>

          {filteredMovements.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#85786D]">
              No stock movements found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b border-[#E5DED6] bg-[#F9F6F2]">
                  <tr>
                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Date
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Product
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Movement Type
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Quantity
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Reference
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMovements.map((item) => {

                    const quantity = Number(item.quantity || 0);
                    const isOut = quantity < 0;

                    return (
                      <tr
                        key={item.movement_id}
                        className="border-b border-[#EEE8E2] last:border-0"
                      >

                        <td className="px-5 py-4 text-[#5E544C]">
                          {item.movement_date
                            ? new Date(item.movement_date).toLocaleString()
                            : "-"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-[#2B2622]">
                            {item.product_name || "-"}
                          </div>

                          {item.product_id && (
                            <div className="text-xs text-[#85786D]">
                              ID: {item.product_id}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#F3EEE8] px-3 py-1 text-xs font-medium text-[#5E544C]">
                            {item.movement_type || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`font-semibold ${
                              isOut
                                ? "text-red-600"
                                : "text-green-700"
                            }`}
                          >
                            {isOut ? "" : "+"}
                            {quantity}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-[#5E544C]">
                          {item.reference_number || "-"}
                        </td>

                        <td className="px-5 py-4 text-[#5E544C]">
                          {item.remarks || "-"}
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

    </div>
  );
};

export default StockMovements;