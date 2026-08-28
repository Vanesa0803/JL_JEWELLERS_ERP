import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getMetalTypes,
  getPurities,
} from "../../services/product.service";

const emptyForm = {
  product_code: "",
  product_name: "",
  category_id: "",
  subcategory_id: "",
  design_id: "",
  metal_type_id: "",
  purity_id: "",
  stone_type_id: "",
  hsn_code: "",
  description: "",
  is_customizable: false,
  is_active: true,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metalTypes, setMetalTypes] = useState([]);
  const [purities, setPurities] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  // ===============================
  // LOAD PRODUCTS
  // ===============================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        limit: 100,
        search,
      });

      setProducts(response.data?.data?.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD MASTER DATA
  // ===============================

  const fetchMasters = async () => {
    try {
      const [categoryRes, metalRes, purityRes] =
        await Promise.all([
          getCategories(),
          getMetalTypes(),
          getPurities(),
        ]);

      setCategories(
        categoryRes.data?.data || []
      );

      setMetalTypes(
        metalRes.data?.data || []
      );

      setPurities(
        purityRes.data?.data || []
      );
    } catch (err) {
      console.error("Failed to load master data:", err);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  // ===============================
  // FORM
  // ===============================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (product) => {
    setEditingId(product.product_id);

    setForm({
      product_code: product.product_code || "",
      product_name: product.product_name || "",
      category_id: product.category_id || "",
      subcategory_id: product.subcategory_id || "",
      design_id: product.design_id || "",
      metal_type_id: product.metal_type_id || "",
      purity_id: product.purity_id || "",
      stone_type_id: product.stone_type_id || "",
      hsn_code: product.hsn_code || "",
      description: product.description || "",
      is_customizable: Boolean(product.is_customizable),
      is_active: Boolean(product.is_active),
    });

    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ===============================
  // SAVE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.product_code ||
      !form.product_name ||
      !form.category_id ||
      !form.metal_type_id ||
      !form.purity_id
    ) {
      setError(
        "Product code, name, category, metal type and purity are required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,

        category_id: Number(form.category_id),
        subcategory_id:
          form.subcategory_id
            ? Number(form.subcategory_id)
            : null,

        design_id:
          form.design_id
            ? Number(form.design_id)
            : null,

        metal_type_id: Number(form.metal_type_id),
        purity_id: Number(form.purity_id),

        stone_type_id:
          form.stone_type_id
            ? Number(form.stone_type_id)
            : null,

        is_customizable: form.is_customizable ? 1 : 0,
        is_active: form.is_active ? 1 : 0,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      closeForm();
      await fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  // ===============================
  // HELPERS
  // ===============================

  const getCategoryName = (id) => {
    const item = categories.find(
      (category) =>
        Number(category.category_id) === Number(id)
    );

    return item?.category_name || "-";
  }; 

  const getMetalName = (id) => {
    const item = metalTypes.find(
      (metal) =>
        Number(metal.metal_type_id) === Number(id)
    );

    return item?.metal_type_name || "-";
  };

  const getPurityName = (id) => {
    const item = purities.find(
      (purity) =>
        Number(purity.purity_id) === Number(id)
    );

    return item?.purity_name || item?.name || "-";
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Products
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage jewellery products and product information.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="rounded-lg bg-[#2B2622] px-5 py-2.5 text-sm font-medium text-white"
        >
          + Add Product
        </button>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="rounded-xl border border-[#E5DED6] bg-white p-4">

        <input
          type="text"
          placeholder="Search by product name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm outline-none focus:border-[#2B2622]"
        />

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ================= TABLE ================= */}

      {loading ? (
        <div className="rounded-xl border border-[#E5DED6] bg-white p-8 text-center text-sm text-[#85786D]">
          Loading products...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5DED6] bg-white">

          <div className="border-b border-[#E5DED6] px-5 py-4">
            <h2 className="font-medium text-[#2B2622]">
              Product List
            </h2>

            <p className="mt-1 text-xs text-[#85786D]">
              {products.length} products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#85786D]">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="border-b border-[#E5DED6] bg-[#F9F6F2]">

                  <tr>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Code
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Product
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Category
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Metal
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Purity
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium text-[#5E544C]">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr
                      key={product.product_id}
                      className="border-b border-[#EEE8E2] last:border-0"
                    >

                      <td className="px-5 py-4 font-medium text-[#2B2622]">
                        {product.product_code}
                      </td>

                      <td className="px-5 py-4 text-[#5E544C]">
                        {product.product_name}
                      </td>

                      <td className="px-5 py-4 text-[#5E544C]">
                        {getCategoryName(product.category_id)}
                      </td>

                      <td className="px-5 py-4 text-[#5E544C]">
                        {getMetalName(product.metal_type_id)}
                      </td>

                      <td className="px-5 py-4 text-[#5E544C]">
                        {getPurityName(product.purity_id)}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {product.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="rounded-lg border border-[#DDD4CB] px-3 py-1.5 text-xs font-medium text-[#5E544C]"
                          >
                            Edit
                          </button> 

                          <button
                            onClick={() =>
                              handleDelete(product.product_id)
                            }
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

      {/* ================= FORM MODAL ================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold text-[#2B2622]">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-[#85786D]">
                  Enter product information.
                </p>

              </div>

              <button
                onClick={closeForm}
                className="text-xl text-[#85786D]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >

              {/* Product Code */}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  Product Code *
                </label>

                <input
                  name="product_code"
                  value={form.product_code}
                  onChange={handleChange}
                  maxLength={15}
                  required
                  className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm"
                  placeholder="e.g. JL001"
                />
              </div>

              {/* Product Name */}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  Product Name *
                </label>

                <input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm"
                  placeholder="e.g. Gold Ring"
                />
              </div>

              {/* Category */}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  Category *
                </label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}

                </select>
              </div>

              {/* Metal */}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  Metal Type *
                </label>

                <select
                  name="metal_type_id"
                  value={form.metal_type_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm"
                >
                  <option value="">
                    Select metal type
                  </option>

                  {metalTypes.map((metal) => (
                    <option
                      key={metal.metal_type_id}
                      value={metal.metal_type_id}
                    >
                      {metal.metal_type_name}
                    </option>
                  ))}

                </select>
              </div>

              {/* Purity */}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  Purity *
                </label>

                <select
                  name="purity_id"
                  value={form.purity_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#DDD4CB] bg-white px-4 py-2.5 text-sm"
                >
                  <option value="">
                    Select purity
                  </option>

                  {purities.map((purity) => (
                    <option
                      key={purity.purity_id}
                      value={purity.purity_id}
                    >
                      {purity.purity_name || purity.name}
                    </option>
                  ))}

                </select>
              </div>

              {/* HSN */}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  HSN Code
                </label>

                <input
                  name="hsn_code"
                  value={form.hsn_code}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm"
                  placeholder="Optional"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">

                <label className="mb-1 block text-sm font-medium text-[#5E544C]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full resize-none rounded-lg border border-[#DDD4CB] px-4 py-2.5 text-sm"
                  placeholder="Product description..."
                />

              </div>

              {/* Customizable */}

              <label className="flex items-center gap-2 text-sm text-[#5E544C]">

                <input
                  type="checkbox"
                  name="is_customizable"
                  checked={form.is_customizable}
                  onChange={handleChange}
                />

                Customizable product

              </label>

              {/* Active */}

              <label className="flex items-center gap-2 text-sm text-[#5E544C]">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

                Active

              </label>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-4 md:col-span-2">

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-[#DDD4CB] px-5 py-2.5 text-sm font-medium text-[#5E544C]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#2B2622] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Create Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Products;