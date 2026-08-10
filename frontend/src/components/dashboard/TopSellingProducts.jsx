import { ArrowRight, TrendingUp } from "lucide-react";

const TopSellingProducts = () => {
  const products = [
    {
      name: "Gold Necklace",
      category: "Necklace",
      sold: 24,
    },
    {
      name: "Gold Ring",
      category: "Ring",
      sold: 19,
    },
    {
      name: "Diamond Earrings",
      category: "Earrings",
      sold: 16,
    },
    {
      name: "Gold Bracelet",
      category: "Bracelet",
      sold: 13,
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">
            Top Selling Products
          </h2>

          <p className="mt-1 text-sm text-[#85786D]">
            Best performing products
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#8A6A1F] hover:text-[#B8860B]"
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Products */}
      <div className="mt-6 space-y-4">
        {products.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center gap-3 rounded-xl border border-[#F0E9E1] p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EBD9] text-sm font-semibold text-[#8A6A1F]">
              #{index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#2B2622]">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-[#9B8E83]">
                {product.category}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <TrendingUp
                size={15}
                className="text-green-600"
              />

              <div className="text-right">
                <p className="text-sm font-semibold text-[#2B2622]">
                  {product.sold}
                </p>

                <p className="text-xs text-[#9B8E83]">
                  sold
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSellingProducts;