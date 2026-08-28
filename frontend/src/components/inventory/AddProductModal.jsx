import { useEffect, useState } from "react";
import {
  createProduct,
  getCategories,
  getMetalTypes,
  getPurities,
} from "../../services/product.service";

const AddProductModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    product_code: "",
    product_name: "",
    category_id: "",
    metal_type_id: "",
    purity_id: "",
    hsn_code: "",
    description: "",
    is_customizable: false,
  });

  const [categories, setCategories] = useState([]);
  const [metalTypes, setMetalTypes] = useState([]);
  const [purities, setPurities] = useState([]);

  const [loadingMasters, setLoadingMasters] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoadingMasters(true);

        const [categoriesResponse, metalTypesResponse, puritiesResponse] =
          await Promise.all([
            getCategories(),
            getMetalTypes(),
            getPurities(),
          ]);

        const categoriesData =
          categoriesResponse.data?.data?.categories ??
          categoriesResponse.data?.data ??
          [];

        const metalTypesData =
          metalTypesResponse.data?.data?.metalTypes ??
          metalTypesResponse.data?.data ??
          [];

        const puritiesData =
          puritiesResponse.data?.data?.purities ??
          puritiesResponse.data?.data ??
          [];

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setMetalTypes(Array.isArray(metalTypesData) ? metalTypesData : []);
        setPurities(Array.isArray(puritiesData) ? puritiesData : []);
      } catch (err) {
        console.error("Failed to load product master data:", err);
        setError("Unable to load product options.");
      } finally {
        setLoadingMasters(false);
      }
    };

    loadMasterData();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.product_code.trim() ||
      !form.product_name.trim() ||
      !form.category_id ||
      !form.metal_type_id ||
      !form.purity_id
    ) {
      setError(
        "Product code, product name, category, metal type and purity are required."
      );
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        product_code: form.product_code.trim(),
        product_name: form.product_name.trim(),
        category_id: Number(form.category_id),
        metal_type_id: Number(form.metal_type_id),
        purity_id: Number(form.purity_id),
        hsn_code: form.hsn_code.trim() || null,
        description: form.description.trim() || null,
        is_customizable: form.is_customizable,
        is_active: true,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-[#E5DED6] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[#2B2622]">
              Add New Product
            </h2>
            <p className="mt-1 text-sm text-[#85786D]">
              Add a jewellery product to your inventory system.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#85786D] hover:bg-[#F5F1EC]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {loadingMasters ? (
              <div className="py-10 text-center text-sm text-[#85786D]">
                Loading product options...
              </div>
            ) : (
              <div className="space-y-5">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                      Product Code *
                    </label>

                    <input
                      type="text"
                      name="product_code"
                      value={form.product_code}
                      onChange={handleChange}
                      placeholder="e.g. GR001"
                      maxLength={15}
                      className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                      Product Name *
                    </label>

                    <input
                      type="text"
                      name="product_name"
                      value={form.product_name}
                      onChange={handleChange}
                      placeholder="e.g. 22K Gold Ring"
                      maxLength={150}
                      className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                      Category *
                    </label>

                    <select
                      name="category_id"
                      value={form.category_id}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.category_name ||
                            category.name ||
                            `Category ${category.category_id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                      Metal Type *
                    </label>

                    <select
                      name="metal_type_id"
                      value={form.metal_type_id}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                    >
                      <option value="">Select metal type</option>

                      {metalTypes.map((metal) => (
                        <option
                          key={metal.metal_type_id}
                          value={metal.metal_type_id}
                        >
                          {metal.metal_type_name ||
                            metal.name ||
                            `Metal ${metal.metal_type_id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                      Purity *
                    </label>

                    <select
                      name="purity_id"
                      value={form.purity_id}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                    >
                      <option value="">Select purity</option>

                      {purities.map((purity) => (
                        <option
                          key={purity.purity_id}
                          value={purity.purity_id}
                        >
                          {purity.purity_name ||
                            purity.name ||
                            purity.purity ||
                            `Purity ${purity.purity_id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                      HSN Code
                    </label>

                    <input
                      type="text"
                      name="hsn_code"
                      value={form.hsn_code}
                      onChange={handleChange}
                      placeholder="Optional"
                      maxLength={20}
                      className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                    />
                  </div>

                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5E544C]">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Add product description..."
                    className="w-full resize-none rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#8B6F47]"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_customizable"
                    checked={form.is_customizable}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-[#5E544C]">
                    This product is customizable
                  </span>
                </label>

              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E5DED6] px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-[#DDD4CB] bg-white px-5 py-2.5 text-sm font-medium text-[#5E544C] hover:bg-[#F8F5F1]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingMasters}
              className="rounded-lg bg-[#2B2622] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#403731] disabled:opacity-50"
            >
              {saving ? "Adding Product..." : "Add Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
