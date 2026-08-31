import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  MoreVertical,
  UserX,
  Eye,
  X,
  Loader2,
  Layers,
  CheckCircle,
  XCircle,
  IndianRupee,
  ChevronDown,
} from "lucide-react";

import {
  getSchemeTypes,
  createSchemeType,
  updateSchemeType,
  deactivateSchemeType,
} from "../../services/goldScheme.service";


const emptyForm = {
  scheme_code: "",
  scheme_name: "",
  scheme_description: "",
  installment_type: "",
  installment_amount: "",
  installment_weight: "",
  duration_months: "",
  bonus_type: "",
  bonus_value: "",
  minimum_installment: "",
  maximum_installment: "",
};


const GoldSchemes = () => {
  const [schemes, setSchemes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [showActions, setShowActions] = useState(null);

  const [form, setForm] = useState(emptyForm);


  /* =====================================================
     FETCH
  ===================================================== */

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSchemeTypes();

      setSchemes(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch schemes:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load gold schemes."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSchemes();
  }, []);


  /* =====================================================
     SUMMARY
  ===================================================== */

  const totalSchemes = schemes.length;

  const activeSchemes = schemes.filter(
    (scheme) => scheme.status === "Active"
  ).length;

  const inactiveSchemes = schemes.filter(
    (scheme) => scheme.status === "Inactive"
  ).length;

  const monthlySchemes = schemes.filter(
    (scheme) =>
      scheme.installment_type?.toLowerCase() === "monthly"
  ).length;


  /* =====================================================
     FILTER
  ===================================================== */

  const filteredSchemes = useMemo(() => {
    let result = [...schemes];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (scheme) =>
          scheme.scheme_name
            ?.toLowerCase()
            .includes(query) ||
          scheme.scheme_code
            ?.toLowerCase()
            .includes(query) ||
          scheme.scheme_description
            ?.toLowerCase()
            .includes(query)
      );
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (scheme) =>
          scheme.status === statusFilter
      );
    }

    return result;
  }, [schemes, search, statusFilter]);


  /* =====================================================
     ADD
  ===================================================== */

  const openAddForm = () => {
    setEditingScheme(null);
    setForm(emptyForm);
    setShowForm(true);
    setShowActions(null);
    setError("");
  };


  /* =====================================================
     EDIT
  ===================================================== */

  const openEditForm = (scheme) => {
    setEditingScheme(scheme);

    setForm({
      scheme_code: scheme.scheme_code || "",
      scheme_name: scheme.scheme_name || "",
      scheme_description:
        scheme.scheme_description || "",
      installment_type:
        scheme.installment_type || "",
      installment_amount:
        scheme.installment_amount ?? "",
      installment_weight:
        scheme.installment_weight ?? "",
      duration_months:
        scheme.duration_months ?? "",
      bonus_type:
        scheme.bonus_type || "",
      bonus_value:
        scheme.bonus_value ?? "",
      minimum_installment:
        scheme.minimum_installment ?? "",
      maximum_installment:
        scheme.maximum_installment ?? "",
    });

    setShowForm(true);
    setShowActions(null);
    setError("");
  };


  /* =====================================================
     CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =====================================================
     SAVE
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.scheme_code.trim()) {
      setError("Scheme code is required.");
      return;
    }

    if (!form.scheme_name.trim()) {
      setError("Scheme name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        scheme_code: form.scheme_code.trim(),
        scheme_name: form.scheme_name.trim(),
        scheme_description:
          form.scheme_description.trim(),

        installment_type:
          form.installment_type,

        installment_amount:
          form.installment_amount === ""
            ? 0
            : Number(form.installment_amount),

        installment_weight:
          form.installment_weight === ""
            ? 0
            : Number(form.installment_weight),

        duration_months:
          form.duration_months === ""
            ? 0
            : Number(form.duration_months),

        bonus_type:
          form.bonus_type,

        bonus_value:
          form.bonus_value === ""
            ? 0
            : Number(form.bonus_value),

        minimum_installment:
          form.minimum_installment === ""
            ? 0
            : Number(form.minimum_installment),

        maximum_installment:
          form.maximum_installment === ""
            ? 0
            : Number(form.maximum_installment),
      };


      if (editingScheme) {
        await updateSchemeType(
          editingScheme.scheme_type_id,
          payload
        );
      } else {
        await createSchemeType(payload);
      }


      setShowForm(false);
      setEditingScheme(null);
      setForm(emptyForm);

      await fetchSchemes();

    } catch (err) {
  console.error("Failed to save scheme:", err);

  console.log("BACKEND ERROR:", err.response?.data);

  setError(
    err.response?.data?.message ||
      "Unable to save scheme."
  );
}
    
    finally {
      setSaving(false);
    }
  };


  /* =====================================================
     DEACTIVATE
  ===================================================== */

  const handleDeactivate = async (scheme) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${scheme.scheme_name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deactivateSchemeType(
        scheme.scheme_type_id
      );

      setShowActions(null);

      await fetchSchemes();

    } catch (err) {
      console.error(
        "Failed to deactivate scheme:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to deactivate scheme."
      );
    }
  };


  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Gold Schemes
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage gold savings schemes and customer
            enrollments.
          </p>
        </div>


        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
        >
          <Plus size={18} />
          Add Scheme
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && !showForm && (
        <div className="rounded-xl border border-[#E8C8C2] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8B3E32]">
          {error}
        </div>
      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Schemes"
          value={totalSchemes}
          subtitle="All scheme types"
          icon={Layers}
        />

        <SummaryCard
          title="Active Schemes"
          value={activeSchemes}
          subtitle="Currently available"
          icon={CheckCircle}
        />

        <SummaryCard
          title="Inactive Schemes"
          value={inactiveSchemes}
          subtitle="Deactivated schemes"
          icon={XCircle}
        />

        <SummaryCard
          title="Monthly Schemes"
          value={monthlySchemes}
          subtitle="Monthly installment plans"
          icon={IndianRupee}
        />

      </div>


      {/* =================================================
          SCHEME LIST
      ================================================= */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white">

        <div className="border-b border-[#E7DED3] p-5 sm:p-6">

          <div className="mb-5">

            <h2 className="text-base font-semibold text-[#2B2622]">
              Scheme Types
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Create and manage gold savings plans.
            </p>

          </div>


          <div className="grid gap-3 lg:grid-cols-[1fr_180px]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search scheme or code..."
                className="h-11 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] pl-11 pr-4 text-sm text-[#2B2622] outline-none transition placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
              />

            </div>


            {/* STATUS */}

            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All Status",
                "Active",
                "Inactive",
              ]}
            />

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] border-collapse">

            <thead>

              <tr className="border-b border-[#E7DED3] bg-[#FCFAF8] text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Scheme
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Code
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Installment
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Duration
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Bonus
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Min / Max
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="8">

                    <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#85786D]">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Loading schemes...

                    </div>

                  </td>

                </tr>

              ) : filteredSchemes.length === 0 ? (

                <tr>

                  <td colSpan="8">

                    <div className="flex flex-col items-center justify-center py-14 text-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3EE]">

                        <Layers
                          size={21}
                          className="text-[#8A6A1F]"
                        />

                      </div>

                      <p className="text-sm font-medium text-[#665C54]">
                        No schemes found
                      </p>

                      <p className="mt-1 text-xs text-[#9B8E83]">
                        Add your first gold savings scheme.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredSchemes.map((scheme) => (

                  <tr
                    key={scheme.scheme_type_id}
                    className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                  >

                    {/* SCHEME */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3EE] text-[#8A6A1F]">
                          <Layers size={18} />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#2B2622]">
                            {scheme.scheme_name}
                          </p>

                          <p className="max-w-[250px] truncate text-xs text-[#9B8E83]">
                            {scheme.scheme_description ||
                              "Gold savings scheme"}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* CODE */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#6F3E32]">
                        {scheme.scheme_code}
                      </span>

                    </td>


                    {/* INSTALLMENT */}

                    <td className="px-5 py-4">

                      <div>

                        <p className="text-sm font-medium text-[#2B2622]">
                          {scheme.installment_amount
                            ? `₹${Number(
                                scheme.installment_amount
                              ).toLocaleString("en-IN")}`
                            : scheme.installment_weight
                              ? `${scheme.installment_weight} g`
                              : "—"}
                        </p>

                        <p className="text-xs text-[#9B8E83]">
                          {scheme.installment_type || "—"}
                        </p>

                      </div>

                    </td>


                    {/* DURATION */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {scheme.duration_months || 0} months
                      </span>

                    </td>


                    {/* BONUS */}

                    <td className="px-5 py-4">

                      <span className="inline-flex rounded-full bg-[#F7F3EE] px-3 py-1 text-xs font-medium text-[#6F3E32]">
                        {scheme.bonus_type
                          ? `${scheme.bonus_type}${
                              scheme.bonus_value
                                ? ` • ${scheme.bonus_value}`
                                : ""
                            }`
                          : "No bonus"}
                      </span>

                    </td>


                    {/* MIN MAX */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        ₹
                        {Number(
                          scheme.minimum_installment || 0
                        ).toLocaleString("en-IN")}
                        {" / "}
                        ₹
                        {Number(
                          scheme.maximum_installment || 0
                        ).toLocaleString("en-IN")}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={scheme.status}
                      />

                    </td>


                    {/* ACTION */}

                    <td className="relative px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          setShowActions(
                            showActions ===
                              scheme.scheme_type_id
                              ? null
                              : scheme.scheme_type_id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#85786D] transition hover:bg-[#F7F3EE] hover:text-[#6F3E32]"
                      >

                        <MoreVertical size={18} />

                      </button>


                      {showActions ===
                        scheme.scheme_type_id && (

                        <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-[#E7DED3] bg-white p-1.5 shadow-lg">

                          <ActionButton
                            icon={Eye}
                            label="View Scheme"
                            onClick={() =>
                              setShowActions(null)
                            }
                          />

                          <ActionButton
                            icon={Pencil}
                            label="Edit Scheme"
                            onClick={() =>
                              openEditForm(scheme)
                            }
                          />

                          {scheme.status ===
                            "Active" && (

                            <ActionButton
                              icon={UserX}
                              label="Deactivate"
                              onClick={() =>
                                handleDeactivate(
                                  scheme
                                )
                              }
                            />

                          )}

                        </div>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div className="border-t border-[#E7DED3] px-5 py-4">

          <p className="text-xs text-[#85786D]">

            Showing{" "}

            <span className="font-medium text-[#2B2622]">
              {filteredSchemes.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-[#2B2622]">
              {schemes.length}
            </span>{" "}

            schemes

          </p>

        </div>

      </section>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#E7DED3] px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-[#2B2622]">
                  {editingScheme
                    ? "Edit Gold Scheme"
                    : "Add Gold Scheme"}
                </h2>

                <p className="mt-1 text-xs text-[#9B8E83]">
                  Configure the scheme's installment and
                  bonus rules.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#85786D] hover:bg-[#F7F3EE]"
              >
                <X size={18} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >

              {error && (
                <div className="rounded-xl border border-[#E8C8C2] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8B3E32]">
                  {error}
                </div>
              )}


              {/* BASIC */}

              <div>

                <h3 className="mb-3 text-sm font-semibold text-[#2B2622]">
                  Basic Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <FormField
                    label="Scheme Code"
                    name="scheme_code"
                    value={form.scheme_code}
                    onChange={handleChange}
                    required
                  />

                  <FormField
                    label="Scheme Name"
                    name="scheme_name"
                    value={form.scheme_name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="mb-1.5 block text-xs font-medium text-[#665C54]">
                  Description
                </label>

                <textarea
                  name="scheme_description"
                  value={form.scheme_description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe this gold savings scheme"
                  className="w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] px-3 py-2.5 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
                />

              </div>


              {/* INSTALLMENT */}

              <div>

                <h3 className="mb-3 text-sm font-semibold text-[#2B2622]">
                  Installment Configuration
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <SelectField
  label="Installment Type"
  name="installment_type"
  value={form.installment_type}
  onChange={handleChange}
  options={[
    "Amount",
    "Weight",
  ]}
/>

                  <FormField
                    label="Installment Amount"
                    name="installment_amount"
                    type="number"
                    min="0"
                    value={form.installment_amount}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Installment Weight (g)"
                    name="installment_weight"
                    type="number"
                    min="0"
                    step="0.001"
                    value={form.installment_weight}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Duration (Months)"
                    name="duration_months"
                    type="number"
                    min="1"
                    value={form.duration_months}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Minimum Installment"
                    name="minimum_installment"
                    type="number"
                    min="0"
                    value={form.minimum_installment}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Maximum Installment"
                    name="maximum_installment"
                    type="number"
                    min="0"
                    value={form.maximum_installment}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* BONUS */}

              <div>

                <h3 className="mb-3 text-sm font-semibold text-[#2B2622]">
                  Bonus Configuration
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  

                  <SelectField
  label="Bonus Type"
  name="bonus_type"
  value={form.bonus_type}
  onChange={handleChange}
  options={[
    "None",
    "One Installment",
    "Percentage",
  ]}
/>
                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-[#E7DED3] pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-xl border border-[#DED4CA] px-5 py-2.5 text-sm font-medium text-[#665C54] hover:bg-[#F7F3EE]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5D332A] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingScheme
                    ? "Update Scheme"
                    : "Create Scheme"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};


/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
}) => {

  return (
    <div className="rounded-2xl border border-[#E7DED3] bg-white p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-[#85786D]">
            {title}
          </p>

          <p className="mt-2 text-xl font-semibold text-[#2B2622]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#9B8E83]">
            {subtitle}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">

          <Icon
            size={20}
            className="text-[#8A6A1F]"
          />

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  step,
}) => {

  return (
    <div>

      <label className="mb-1.5 block text-xs font-medium text-[#665C54]">

        {label}

        {required && (
          <span className="ml-1 text-[#8B3E32]">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        className="h-11 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] px-3 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
      />

    </div>
  );
};


/* =========================================================
   SELECT FIELD
========================================================= */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  allowEmpty = false,
}) => {

  return (
    <div>

      <label className="mb-1.5 block text-xs font-medium text-[#665C54]">
        {label}
      </label>

      <div className="relative">

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-3 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
        >

          {allowEmpty && (
            <option value="">
              Select bonus type
            </option>
          )}

          {!allowEmpty && (
            <option value="">
              Select installment type
            </option>
          )}

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}

        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8E83]"
        />

      </div>

    </div>
  );
};


/* =========================================================
   STATUS
========================================================= */

const StatusBadge = ({ status }) => {

  const styles = {
    Active:
      "bg-[#EAF4EC] text-[#397047]",

    Inactive:
      "bg-[#F8ECE9] text-[#8B3E32]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-[#F7F3EE] text-[#85786D]"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};


/* =========================================================
   ACTION BUTTON
========================================================= */

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
}) => {

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#4B423C] transition hover:bg-[#F7F3EE] hover:text-[#6F3E32]"
    >

      <Icon size={15} />

      {label}

    </button>
  );
};


const SelectFilter = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-4 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={17}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
      />
    </div>
  );
};

export default GoldSchemes;