import { ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { count } from "../../lib/format";

/**
 * From GET /dashboard -> data.low_stock_products, which returns
 * { product_name, available_quantity, minimum_stock } for anything at or
 * below its reorder level.
 *
 * An empty list here is good news, so it says so rather than showing the
 * bare "no data" that usually means something is broken.
 */
const LowStockProducts = ({ products, loading }) => {
  const navigate = useNavigate();
  const rows = products ?? [];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">Low Stock Products</h2>
          <p className="mt-1 text-sm text-[#85786D]">At or below reorder level</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/inventory")}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#8A6A1F] hover:text-[#B8860B]"
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="py-6 text-center text-sm text-[#9B8E83]">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#5F554D]">
            Everything is above its reorder level.
          </p>
        ) : (
          rows.map((product) => (
            <div
              key={product.product_name}
              className="flex items-center gap-3 rounded-xl border border-[#F1EBE5] px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <AlertTriangle size={15} />
              </div>

              <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#2B2622]">
                {product.product_name}
              </p>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium tabular-nums text-orange-600">
                  {count(product.available_quantity)} left
                </p>
                <p className="text-xs text-[#9B8E83]">
                  reorder at {count(product.minimum_stock)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LowStockProducts;
