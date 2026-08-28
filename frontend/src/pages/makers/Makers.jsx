import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  IndianRupee,
  Eye,
  Pencil,
  MoreVertical,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";

import {
  getMakers,
  createMaker,
  updateMaker,
  deactivateMaker,
} from "../../services/maker.service";


/* =========================================================
   MAIN COMPONENT
========================================================= */

const Makers = () => {
  const [makers, setMakers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Types");

  const [showActions, setShowActions] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingMaker, setEditingMaker] = useState(null);

  /* =========================================================
     FORM
  ========================================================= */

  const emptyForm = {
    maker_name: "",
    mobile: "",
    alternate_mobile: "",
    address: "",
    joining_date: "",
    experience_years: "",
    payment_type: "",
    remarks: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* =========================================================
     FETCH MAKERS
  ========================================================= */

  const fetchMakers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMakers();

      setMakers(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch makers:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load makers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMakers();
  }, []);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalMakers = makers.length;

  const activeMakers = makers.filter(
    (maker) => maker.status === "Active"
  ).length;

  const inactiveMakers = makers.filter(
    (maker) => maker.status === "Inactive"
  ).length;

  const monthlyPaymentType = makers.filter(
    (maker) =>
      maker.payment_type?.toLowerCase() === "monthly"
  ).length;

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredMakers = useMemo(() => {
    let result = [...makers];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (maker) =>
          maker.maker_name
            ?.toLowerCase()
            .includes(query) ||
          maker.maker_code
            ?.toLowerCase()
            .includes(query) ||
          maker.mobile
            ?.toLowerCase()
            .includes(query)
      );
    }

    if (statusFilter !== "All Status") {
      result = result.filter(
        (maker) =>
          maker.status === statusFilter
      );
    }

    if (paymentFilter !== "All Types") {
      result = result.filter(
        (maker) =>
          maker.payment_type === paymentFilter
      );
    }

    return result;
  }, [
    makers,
    search,
    statusFilter,
    paymentFilter,
  ]);

  /* =========================================================
     OPEN ADD FORM
  ========================================================= */

  const openAddForm = () => {
    setEditingMaker(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  /* =========================================================
     OPEN EDIT FORM
  ========================================================= */

  const openEditForm = (maker) => {
    setEditingMaker(maker);

    setForm({
      maker_name: maker.maker_name || "",
      mobile: maker.mobile || "",
      alternate_mobile:
        maker.alternate_mobile || "",
      address: maker.address || "",
      joining_date:
        maker.joining_date
          ? String(maker.joining_date).slice(0, 10)
          : "",
      experience_years:
        maker.experience_years ?? "",
      payment_type:
        maker.payment_type || "",
      remarks: maker.remarks || "",
    });

    setShowForm(true);
    setShowActions(null);
    setError("");
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     SAVE MAKER
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.maker_name.trim()) {
      setError("Maker name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        maker_name: form.maker_name.trim(),
        mobile: form.mobile.trim(),
        alternate_mobile:
          form.alternate_mobile.trim(),
        address: form.address.trim(),
        joining_date:
          form.joining_date || null,
        experience_years:
          form.experience_years === ""
            ? 0
            : Number(form.experience_years),
        payment_type: form.payment_type,
        remarks: form.remarks.trim(),
      };

      if (editingMaker) {
        await updateMaker(
          editingMaker.maker_id,
          payload
        );
      } else {
        await createMaker(payload);
      }

      setShowForm(false);
      setEditingMaker(null);
      setForm(emptyForm);

      await fetchMakers();
    } catch (err) {
      console.error("Failed to save maker:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save maker."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DEACTIVATE
  ========================================================= */

  const handleDeactivate = async (maker) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${maker.maker_name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deactivateMaker(
        maker.maker_id
      );

      setShowActions(null);

      await fetchMakers();
    } catch (err) {
      console.error(
        "Failed to deactivate maker:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to deactivate maker."
      );
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Makers / Karigars
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage karigars, their details and work status.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
        >
          <Plus size={18} />
          Add Maker
        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !showForm && (
        <div className="rounded-xl border border-[#E8C8C2] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8B3E32]">
          {error}
        </div>
      )}


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Makers"
          value={totalMakers}
          subtitle="All maker records"
          icon={Users}
        />

        <SummaryCard
          title="Active Makers"
          value={activeMakers}
          subtitle="Currently active"
          icon={UserCheck}
        />

        <SummaryCard
          title="Inactive Makers"
          value={inactiveMakers}
          subtitle="Inactive records"
          icon={UserX}
        />

        <SummaryCard
          title="Monthly Payment"
          value={monthlyPaymentType}
          subtitle="Monthly payment makers"
          icon={IndianRupee}
        />

      </div>


      {/* =====================================================
          MAKER LIST
      ===================================================== */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white">

        {/* FILTERS */}

        <div className="border-b border-[#E7DED3] p-5 sm:p-6">

          <div className="mb-5">

            <h2 className="text-base font-semibold text-[#2B2622]">
              Maker List
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Search and manage your karigar records.
            </p>

          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">

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
                placeholder="Search maker, code or mobile..."
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

            {/* PAYMENT */}

            <SelectFilter
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={[
                "All Types",
                "Monthly",
                "Per Piece",
                "Per Gram",
                "Commission",
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
                  Maker
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Code
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Mobile
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Experience
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Payment
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Joining Date
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

                      Loading makers...

                    </div>

                  </td>

                </tr>

              ) : filteredMakers.length === 0 ? (

                <tr>

                  <td colSpan="8">

                    <div className="flex flex-col items-center justify-center py-14 text-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3EE]">

                        <Users
                          size={21}
                          className="text-[#8A6A1F]"
                        />

                      </div>

                      <p className="text-sm font-medium text-[#665C54]">
                        No makers found
                      </p>

                      <p className="mt-1 text-xs text-[#9B8E83]">
                        Try changing your search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredMakers.map((maker) => (

                  <tr
                    key={maker.maker_id}
                    className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                  >

                    {/* MAKER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3EE] text-sm font-semibold text-[#6F3E32]">
                          {maker.maker_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#2B2622]">
                            {maker.maker_name}
                          </p>

                          <p className="text-xs text-[#9B8E83]">
                            Karigar
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* CODE */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#6F3E32]">
                        {maker.maker_code}
                      </span>

                    </td>


                    {/* MOBILE */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {maker.mobile || "—"}
                      </span>

                    </td>


                    {/* EXPERIENCE */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {maker.experience_years ?? 0} years
                      </span>

                    </td>


                    {/* PAYMENT */}

                    <td className="px-5 py-4">

                      <span className="inline-flex rounded-full bg-[#F7F3EE] px-3 py-1 text-xs font-medium text-[#6F3E32]">
                        {maker.payment_type || "—"}
                      </span>

                    </td>


                    {/* JOINING DATE */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {formatDate(
                          maker.joining_date
                        )}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={maker.status}
                      />

                    </td>


                    {/* ACTION */}

                    <td className="relative px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          setShowActions(
                            showActions ===
                              maker.maker_id
                              ? null
                              : maker.maker_id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#85786D] transition hover:bg-[#F7F3EE] hover:text-[#6F3E32]"
                      >
                        <MoreVertical size={18} />
                      </button>


                      {showActions ===
                        maker.maker_id && (

                        <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-[#E7DED3] bg-white p-1.5 shadow-lg">

                          <ActionButton
                            icon={Eye}
                            label="View Maker"
                            onClick={() => {
                              setShowActions(null);
                            }}
                          />

                          <ActionButton
                            icon={Pencil}
                            label="Edit Maker"
                            onClick={() =>
                              openEditForm(maker)
                            }
                          />

                          {maker.status ===
                            "Active" && (
                            <ActionButton
                              icon={UserX}
                              label="Deactivate"
                              onClick={() =>
                                handleDeactivate(
                                  maker
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
              {filteredMakers.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-[#2B2622]">
              {makers.length}
            </span>{" "}

            makers

          </p>

        </div>

      </section>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#E7DED3] px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-[#2B2622]">
                  {editingMaker
                    ? "Edit Maker"
                    : "Add Maker"}
                </h2>

                <p className="mt-1 text-xs text-[#9B8E83]">
                  Enter the karigar's basic information.
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
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl border border-[#E8C8C2] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8B3E32]">
                  {error}
                </div>
              )}


              <div className="grid gap-4 sm:grid-cols-2">

                <FormField
                  label="Maker Name"
                  name="maker_name"
                  value={form.maker_name}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                />

                <FormField
                  label="Alternate Mobile"
                  name="alternate_mobile"
                  value={form.alternate_mobile}
                  onChange={handleChange}
                />

                <FormField
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={form.joining_date}
                  onChange={handleChange}
                />

                <FormField
                  label="Experience (Years)"
                  name="experience_years"
                  type="number"
                  min="0"
                  value={form.experience_years}
                  onChange={handleChange}
                />

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-[#665C54]">
                    Payment Type
                  </label>

                  <select
                    name="payment_type"
                    value={form.payment_type}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-3 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
                  >

                    <option value="">
                      Select payment type
                    </option>

                    <option value="Monthly">
                      Monthly
                    </option>

                    <option value="Per Piece">
                      Per Piece
                    </option>

                    <option value="Per Gram">
                      Per Gram
                    </option>

                    <option value="Commission">
                      Commission
                    </option>

                  </select>

                </div>

              </div>


              <div>

                <label className="mb-1.5 block text-xs font-medium text-[#665C54]">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter maker address"
                  className="w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] px-3 py-2.5 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
                />

              </div>


              <div>

                <label className="mb-1.5 block text-xs font-medium text-[#665C54]">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional remarks"
                  className="w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] px-3 py-2.5 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
                />

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

                  {editingMaker
                    ? "Update Maker"
                    : "Create Maker"}

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
        className="h-11 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] px-3 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
      />

    </div>
  );
};


/* =========================================================
   SELECT FILTER
========================================================= */

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


/* =========================================================
   STATUS BADGE
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


export default Makers;