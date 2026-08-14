import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { count } from "../../lib/format";

/**
 * From GET /dashboard -> data.top_selling_products, which returns
 * { product_name, total_sold }.
 *
 * The mock version showed a category per product. The query does not join
 * categories, so that column is gone rather than filled with a placeholder —
 * a made-up category on a real product name is worse than no category.
 */
const TopSellingProducts = ({ products, loading }) => {
  const navigate = useNavigate();
  const rows = products ?? [];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">Top Selling Products</h2>
          <p className="mt-1 text-sm text-[#85786D]">Best performing products</p>
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
          <p className="py-6 text-center text-sm text-[#9B8E83]">
            Nothing sold yet.
          </p>
        ) : (
          rows.map((product, index) => (
            <div
              key={product.product_name}
              className="flex items-center gap-3 rounded-xl border border-[#F1EBE5] px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EBD9] text-sm font-semibold text-[#B8860B]">
                {index + 1}
              </div>

              <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#2B2622]">
                {product.product_name}
              </p>

              <div className="flex shrink-0 items-center gap-1.5 text-sm text-[#5F554D]">
                <TrendingUp size={15} className="text-[#B8860B]" />
                <span className="tabular-nums">{count(product.total_sold)}</span>
                <span className="text-[#9B8E83]">sold</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TopSellingProducts;
