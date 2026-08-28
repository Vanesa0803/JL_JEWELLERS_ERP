import { X } from "lucide-react";

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5DED6] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[#2B2622]">
              {product.product_name}
            </h2>

            <p className="mt-1 text-sm text-[#85786D]">
              {product.product_code || "No product code"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#85786D] transition hover:bg-[#F7F3EE] hover:text-[#2B2622]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 px-6 py-6">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Category
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.category_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Metal
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.metal_type_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Purity
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.purity_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Current Stock
            </p>
            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              {product.available_quantity ?? 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Minimum Stock
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.minimum_stock ?? 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Maximum Stock
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.maximum_stock ?? 0}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              HSN Code
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.hsn_code || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
              Customizable
            </p>
            <p className="mt-1 text-sm font-medium text-[#2B2622]">
              {product.is_customizable ? "Yes" : "No"}
            </p>
          </div>

        </div>

        {/* Description */}
        <div className="border-t border-[#E5DED6] px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#85786D]">
            Description
          </p>

          <p className="mt-2 text-sm leading-6 text-[#5E544C]">
            {product.description || "No description available."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#E5DED6] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2B2622] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3A312B]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsModal;
