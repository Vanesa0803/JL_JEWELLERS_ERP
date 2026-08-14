import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Users,
  Star,
  UserCheck,
  UserX,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import { shortDate } from "../../lib/format";

/* =========================================================
   API <-> PAGE SHAPE
========================================================= */

/**
 * Maps an API customer onto the shape this page was written against.
 *
 * The page predates the API and uses its own field names, so rather than
 * rename several hundred lines of JSX, the translation happens here in one
 * place. Note `vip`: there is no is_vip column — VIP is customer_type,
 * enum('Regular','VIP','Wholesale').
 */
const fromApi = (customer) => ({
  id: customer.customer_id,
  code: customer.customer_code,
  name: [customer.first_name, customer.last_name].filter(Boolean).join(" "),
  first_name: customer.first_name,
  last_name: customer.last_name,
  mobile: customer.mobile,
  email: customer.email || "—",
  city: customer.city,
  status: customer.status,
  vip: customer.customer_type === "VIP",
  customerType: customer.customer_type,
  loyaltyPoints: customer.loyalty_points,
  createdAt: shortDate(customer.created_at),
});



/* =========================================================
   MAIN COMPONENT
========================================================= */

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  /*
   * The list is fetched once with a high limit and then filtered, sorted and
   * paged in the browser, because that is how this page was already written.
   *
   * The API supports all of it server-side — search, customer_type, status,
   * sortBy, sortOrder, page, limit — which is the right way round once the
   * shop has thousands of customers. Moving to it means debouncing the search
   * box and refetching on every filter change, so it is left as a deliberate
   * follow-up rather than smuggled in with the wiring.
   */
  const loadCustomers = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await api.get("/customers", { params: { limit: 500 } });
      const rows = response.data?.data?.customers ?? [];
      setCustomers(rows.map(fromApi));
    } catch (error) {
      setLoadError(
        error.response?.data?.message || error.message || "Could not load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [vipFilter, setVipFilter] = useState("All Customers");
  const [customerTypeFilter, setCustomerTypeFilter] =
    useState("All Types");
  const [sortBy, setSortBy] = useState("Newest");

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showActions, setShowActions] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  /* =========================================================
     STATS
  ========================================================= */

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const vipCustomers = customers.filter(
    (customer) => customer.vip
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  /* =========================================================
     FILTER + SEARCH + SORT
  ========================================================= */

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    /* Search */

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.mobile.includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          String(customer.id).includes(query)
      );
    }

    /* Status */

    if (statusFilter !== "All Status") {
      result = result.filter(
        (customer) => customer.status === statusFilter
      );
    }

    /* VIP */

    if (vipFilter === "VIP Only") {
      result = result.filter((customer) => customer.vip);
    }

    if (vipFilter === "Non VIP") {
      result = result.filter((customer) => !customer.vip);
    }

    /* Customer Type */

    if (customerTypeFilter !== "All Types") {
      result = result.filter(
        (customer) =>
          customer.customerType === customerTypeFilter
      );
    }

    /* Sorting */

    if (sortBy === "Name A-Z") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "Name Z-A") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    if (sortBy === "Newest") {
      result.sort((a, b) => b.id - a.id);
    }

    if (sortBy === "Oldest") {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [
    customers,
    search,
    statusFilter,
    vipFilter,
    customerTypeFilter,
    sortBy,
  ]);

  /* =========================================================
     ADD CUSTOMER
  ========================================================= */

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.mobile) {
      return;
    }

    setSaving(true);

    try {
      // The API takes first and last name separately. Everything after the
      // first space becomes the surname, which handles "Rahul Kumar Sharma"
      // sensibly and leaves a single-word name with no surname.
      const [firstName, ...rest] = newCustomer.name.trim().split(/\s+/);

      await api.post("/customers", {
        first_name: firstName,
        last_name: rest.join(" ") || null,
        mobile: newCustomer.mobile.trim(),
        email: newCustomer.email?.trim() || null,
        customer_type: "Regular",
      });

      toast.success("Customer added");

      setNewCustomer({ name: "", mobile: "", email: "" });
      setShowAddCustomer(false);

      // Refetch rather than push the new row in locally: the server generates
      // customer_code from the new id, so only it knows the finished record.
      await loadCustomers();
    } catch (error) {
      // 409 is a duplicate mobile, which is the common case and worth saying
      // plainly rather than as "request failed".
      toast.error(
        error.response?.data?.message || error.message || "Could not add customer"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     TOGGLE CUSTOMER STATUS
  ========================================================= */

  const toggleStatus = async (id) => {
    setShowActions(null);

    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    const next = customer.status === "Active" ? "Inactive" : "Active";

    // Update on screen immediately, then put it back if the server refuses.
    // A status toggle should feel instant; waiting on a round trip to redraw
    // a pill makes the whole page feel slow.
    setCustomers((previous) =>
      previous.map((c) => (c.id === id ? { ...c, status: next } : c))
    );

    try {
      await api.patch(`/customers/${id}/activate`, { status: next });
      toast.success(`Customer marked ${next}`);
    } catch (error) {
      setCustomers((previous) =>
        previous.map((c) => (c.id === id ? { ...c, status: customer.status } : c))
      );
      toast.error(error.response?.data?.message || "Could not change status");
    }
  };

  /* =========================================================
     TOGGLE VIP
  ========================================================= */

  const toggleVIP = async (id) => {
    setShowActions(null);

    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    // VIP is not a flag: it is customer_type, enum('Regular','VIP','Wholesale').
    // Turning VIP off returns the customer to Regular — which would be wrong
    // for a Wholesale customer, so leave those alone.
    if (!customer.vip && customer.customerType === "Wholesale") {
      toast.error("A wholesale customer cannot be marked VIP");
      return;
    }

    const nextType = customer.vip ? "Regular" : "VIP";

    setCustomers((previous) =>
      previous.map((c) =>
        c.id === id ? { ...c, vip: !c.vip, customerType: nextType } : c
      )
    );

    try {
      await api.patch(`/customers/${id}/vip`, { customer_type: nextType });
      toast.success(nextType === "VIP" ? "Marked as VIP" : "VIP removed");
    } catch (error) {
      setCustomers((previous) =>
        previous.map((c) =>
          c.id === id
            ? { ...c, vip: customer.vip, customerType: customer.customerType }
            : c
        )
      );
      toast.error(error.response?.data?.message || "Could not update VIP status");
    }
  };

  /* =========================================================
     DELETE CUSTOMER
  ========================================================= */

  const deleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowActions(null);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) {
      return;
    }

    setSaving(true);

    try {
      await api.delete(`/customers/${customerToDelete.id}`);

      setCustomers((previous) =>
        previous.filter((customer) => customer.id !== customerToDelete.id)
      );

      toast.success("Customer deleted");
      setCustomerToDelete(null);
    } catch (error) {
      /*
       * A customer with bills, payments, orders or ledger entries CANNOT be
       * deleted — those foreign keys are NO ACTION, deliberately. The server
       * turns that into a clear 400, so show its message rather than a generic
       * failure: "they have associated records" tells the user why, and that
       * they should mark the customer Inactive instead.
       */
      toast.error(
        error.response?.data?.message || "Could not delete this customer"
      );
      setCustomerToDelete(null);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Customers
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage customer records, VIP customers and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCustomer(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
        >
          <Plus size={18} />
          Add Customer
        </button>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Customers"
          value={totalCustomers}
          subtitle="All customer records"
          icon={Users}
        />

        <SummaryCard
          title="Active Customers"
          value={activeCustomers}
          subtitle="Currently active"
          icon={UserCheck}
        />

        <SummaryCard
          title="VIP Customers"
          value={vipCustomers}
          subtitle="Premium customers"
          icon={Star}
        />

        <SummaryCard
          title="Inactive"
          value={inactiveCustomers}
          subtitle="Inactive customer records"
          icon={UserX}
        />

      </div>

      {/* =====================================================
          CUSTOMER TABLE
      ===================================================== */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white">

        {/* Filters */}

        <div className="border-b border-[#E7DED3] p-5 sm:p-6">

          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#2B2622]">
              Customer List
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Search, filter and manage your customer records.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_170px_170px]">

            {/* Search */}

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
                placeholder="Search name, mobile, email or ID..."
                className="h-11 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] pl-11 pr-4 text-sm text-[#2B2622] outline-none transition placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
              />

            </div>

            {/* Status */}

            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All Status",
                "Active",
                "Inactive",
              ]}
            />

            {/* VIP */}

            <SelectFilter
              value={vipFilter}
              onChange={setVipFilter}
              options={[
                "All Customers",
                "VIP Only",
                "Non VIP",
              ]}
            />

            {/* Customer Type */}

            <SelectFilter
              value={customerTypeFilter}
              onChange={setCustomerTypeFilter}
              options={[
                "All Types",
                "Regular",
                "VIP",
                "Wholesale",
              ]}
            />

            {/* Sort */}

            <SelectFilter
              value={sortBy}
              onChange={setSortBy}
              options={[
                "Newest",
                "Oldest",
                "Name A-Z",
                "Name Z-A",
              ]}
            />

          </div>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] border-collapse">

            <thead>

              <tr className="border-b border-[#E7DED3] bg-[#FCFAF8] text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Mobile
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Email
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  VIP
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Created
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {/*
                Three different empty states, because they mean different
                things: still loading, the request failed, or there genuinely
                are no matches. Showing "No customers found" while a request is
                in flight — or after it failed — would be a lie.
              */}
              {loading ? (

                <tr>
                  <td colSpan="8">
                    <div className="py-14 text-center text-sm text-[#9B8E83]">
                      Loading customers…
                    </div>
                  </td>
                </tr>

              ) : loadError ? (

                <tr>
                  <td colSpan="8">
                    <div className="flex flex-col items-center justify-center py-14 text-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FBF1EF]">
                        <AlertCircle size={21} className="text-[#A33A2B]" />
                      </div>

                      <p className="text-sm font-medium text-[#A33A2B]">
                        Could not load customers
                      </p>

                      <p className="mt-1 text-xs text-[#8A5049]">{loadError}</p>

                      <button
                        type="button"
                        onClick={loadCustomers}
                        className="mt-4 flex items-center gap-2 rounded-lg border border-[#E7DED3] bg-white px-4 py-2 text-xs font-medium text-[#5F554D] hover:bg-[#F7F3EE]"
                      >
                        <RefreshCw size={13} />
                        Try again
                      </button>

                    </div>
                  </td>
                </tr>

              ) : filteredCustomers.length === 0 ? (

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
                        {customers.length === 0
                          ? "No customers yet"
                          : "No customers found"}
                      </p>

                      <p className="mt-1 text-xs text-[#9B8E83]">
                        {customers.length === 0
                          ? "Add your first customer to get started."
                          : "Try changing your search or filters."}
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredCustomers.map((customer) => (

                  <tr
                    key={customer.id}
                    className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                  >

                    {/* Customer */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3EE] text-sm font-semibold text-[#6F3E32]">
                          {customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#2B2622]">
                            {customer.name}
                          </p>

                          <p className="text-xs text-[#9B8E83]">
                            {customer.customerType}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ID */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#6F3E32]">
                        #{customer.id}
                      </span>

                    </td>

                    {/* Mobile */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {customer.mobile}
                      </span>

                    </td>

                    {/* Email */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#85786D]">
                        {customer.email}
                      </span>

                    </td>

                    {/* VIP */}

                    <td className="px-5 py-4">

                      {customer.vip ? (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF5DE] px-3 py-1 text-xs font-medium text-[#96701A]">

                          <Star
                            size={13}
                            fill="currentColor"
                          />

                          VIP

                        </span>

                      ) : (

                        <span className="text-xs text-[#A4978D]">
                          —
                        </span>

                      )}

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={customer.status}
                      />

                    </td>

                    {/* Created */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#85786D]">
                        {customer.createdAt}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="relative px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          setShowActions(
                            showActions === customer.id
                              ? null
                              : customer.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#85786D] transition hover:bg-[#F7F3EE] hover:text-[#6F3E32]"
                      >

                        <MoreVertical size={18} />

                      </button>

                      {showActions === customer.id && (

                        <div className="absolute right-5 top-12 z-20 w-44 rounded-xl border border-[#E7DED3] bg-white p-1.5 shadow-lg">

                          <ActionButton
                            icon={Eye}
                            label="View Customer"
                            onClick={() => {
                              navigate(
                                `/customers/${customer.id}`
                              );
                              setShowActions(null);
                            }}
                          />

                          <ActionButton
                            icon={Pencil}
                            label="Edit Customer"
                            onClick={() => {
                              navigate(
                                `/customers/${customer.id}/edit`
                              );
                              setShowActions(null);
                            }}
                          />

                          <ActionButton
                            icon={Star}
                            label={
                              customer.vip
                                ? "Remove VIP"
                                : "Make VIP"
                            }
                            onClick={() =>
                              toggleVIP(customer.id)
                            }
                          />

                          <ActionButton
                            icon={
                              customer.status === "Active"
                                ? UserX
                                : UserCheck
                            }
                            label={
                              customer.status === "Active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() =>
                              toggleStatus(customer.id)
                            }
                          />

                          <ActionButton
                            icon={Trash2}
                            label="Delete Customer"
                            onClick={() =>
                              deleteCustomer(customer)
                            }
                          />

                        </div>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex flex-col justify-between gap-3 border-t border-[#E7DED3] px-5 py-4 sm:flex-row sm:items-center">

          <p className="text-xs text-[#85786D]">

            Showing{" "}
            <span className="font-medium text-[#2B2622]">
              {filteredCustomers.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#2B2622]">
              {customers.length}
            </span>{" "}
            customers

          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED4CA] text-[#85786D] hover:bg-[#F7F3EE]"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#6F3E32] px-3 text-xs font-medium text-white">
              1
            </span>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED4CA] text-[#85786D] hover:bg-[#F7F3EE]"
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          ADD CUSTOMER MODAL
      ===================================================== */}

      {showAddCustomer && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-start justify-between">

              <div>

                <h2 className="text-lg font-semibold text-[#2B2622]">
                  Add Customer
                </h2>

                <p className="mt-1 text-xs text-[#9B8E83]">
                  Create a new customer record.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddCustomer(false)
                }
                className="text-xl text-[#85786D] hover:text-[#2B2622]"
              >
                ×
              </button>

            </div>

            <div className="space-y-4">

              <InputField
                label="Customer Name"
                placeholder="Enter customer name"
                value={newCustomer.name}
                onChange={(value) =>
                  setNewCustomer({
                    ...newCustomer,
                    name: value,
                  })
                }
              />

              <InputField
                label="Mobile Number"
                placeholder="Enter mobile number"
                value={newCustomer.mobile}
                onChange={(value) =>
                  setNewCustomer({
                    ...newCustomer,
                    mobile: value,
                  })
                }
              />

              <InputField
                label="Email Address"
                placeholder="Enter email address"
                value={newCustomer.email}
                onChange={(value) =>
                  setNewCustomer({
                    ...newCustomer,
                    email: value,
                  })
                }
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowAddCustomer(false)
                }
                className="rounded-xl border border-[#DCCFC3] px-5 py-2.5 text-sm font-medium text-[#6F3E32] hover:bg-[#F7F3EE]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddCustomer}
                className="rounded-xl bg-[#6F3E32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5D332A]"
              >
                Add Customer
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          DELETE CUSTOMER MODAL
      ===================================================== */}

      {customerToDelete && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-2xl">

            {/* Warning Icon */}

            <div className="flex justify-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5DE]">

                <AlertTriangle
                  size={23}
                  className="text-[#B8860B]"
                />

              </div>

            </div>

            {/* Content */}

            <div className="mt-4 text-center">

              <h2 className="text-lg font-semibold text-[#2B2622]">
                Delete Customer?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#85786D]">

                Are you sure you want to delete{" "}

                <span className="font-semibold text-[#4B423C]">
                  {customerToDelete.name}
                </span>

                ?

              </p>

              <p className="mt-1 text-xs text-[#A4978D]">
                This action will remove the customer from the customer list.
              </p>

            </div>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setCustomerToDelete(null)
                }
                className="flex-1 rounded-xl border border-[#DCCFC3] bg-white px-4 py-2.5 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteCustomer}
                className="flex-1 rounded-xl bg-[#8B3E32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74332A]"
              >
                Delete Customer
              </button>

            </div>

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
    Active: "bg-[#EAF4EC] text-[#397047]",
    Inactive: "bg-[#F8ECE9] text-[#8B3E32]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-[#F7F3EE] text-[#85786D]"
      }`}
    >
      {status}
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

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#4B423C]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-4 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B]"
      />

    </div>
  );
};

export default Customers;