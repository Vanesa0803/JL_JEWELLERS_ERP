import { ArrowRight, AlertTriangle } from "lucide-react";

const LowStockProducts = () => {
  const products = [
    {
      name: "Gold Ring",
      sku: "JL-GR-001",
      stock: 2,
    },
    {
      name: "Diamond Earrings",
      sku: "JL-DE-014",
      stock: 3,
    },
    {
      name: "Gold Bracelet",
      sku: "JL-GB-022",
      stock: 4,
    },
    {
      name: "Temple Necklace",
      sku: "JL-TN-008",
      stock: 5,
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">
            Low Stock Products
          </h2>

          <p className="mt-1 text-sm text-[#85786D]">
            Products that need attention
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
        {products.map((product) => (
          <div
            key={product.sku}
            className="flex items-center gap-3 rounded-xl border border-[#F0E9E1] p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EBD9] text-[#B8860B]">
              <AlertTriangle size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#2B2622]">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-[#9B8E83]">
                {product.sku}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-red-600">
                {product.stock}
              </p>

              <p className="text-xs text-[#9B8E83]">
                left
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LowStockProducts;