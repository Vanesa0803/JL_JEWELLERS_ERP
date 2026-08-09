import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  UserCheck,
  UserX,
  IndianRupee,
  Eye,
  Pencil,
  Trash2,
  UserX as DeactivateIcon,
  UserCheck as ActivateIcon,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   MOCK SUPPLIER DATA
   Replace with backend API later.
========================================================= */

const initialSuppliers = [
  {
    supplier_id: 201,
    supplier_code: "SUP-001",
    supplier_name: "Shree Gold Suppliers",
    contact_person: "Ramesh Patel",
    mobile: "9876543210",
    email: "shreegold@gmail.com",
    supplier_type: "Wholesaler",
    opening_balance: 125000,
    status: "Active",
  },
  {
    supplier_id: 202,
    supplier_code: "SUP-002",
    supplier_name: "Raj Jewellers Manufacturing",
    contact_person: "Raj Mehta",
    mobile: "9812345678",
    email: "rajmanufacturing@gmail.com",
    supplier_type: "Manufacturer",
    opening_balance: 85000,
    status: "Active",
  },
  {
    supplier_id: 203,
    supplier_code: "SUP-003",
    supplier_name: "Kohinoor Distributors",
    contact_person: "Amit Sharma",
    mobile: "9898989898",
    email: "kohinoor@gmail.com",
    supplier_type: "Distributor",
    opening_balance: 45000,
    status: "Active",
  },
  {
    supplier_id: 204,
    supplier_code: "SUP-004",
    supplier_name: "Sharma Local Vendors",
    contact_person: "Neha Sharma",
    mobile: "9765432109",
    email: "sharmavendors@gmail.com",
    supplier_type: "Local Vendor",
    opening_balance: 22000,
    status: "Inactive",
  },
  {
    supplier_id: 205,
    supplier_code: "SUP-005",
    supplier_name: "Perfect Jewellery Services",
    contact_person: "Karan Mehta",
    mobile: "9988776655",
    email: "perfectservices@gmail.com",
    supplier_type: "Service Provider",
    opening_balance: 18000,
    status: "Active",
  },
  {
    supplier_id: 206,
    supplier_code: "SUP-006",
    supplier_name: "Mohan Gold Works",
    contact_person: "Mohan Gupta",
    mobile: "9876123456",
    email: "mohangold@gmail.com",
    supplier_type: "Manufacturer",
    opening_balance: 95000,
    status: "Active",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [supplierTypeFilter, setSupplierTypeFilter] =
    useState("All Types");
  const [sortBy, setSortBy] = useState("Newest");

  const [showActions, setShowActions] = useState(null);

  /* =========================================================
     STATS
  ========================================================= */

  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === "Active"
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) => supplier.status === "Inactive"
  ).length;

  const totalOpeningBalance = suppliers.reduce(
    (total, supplier) =>
      total + Number(supplier.opening_balance || 0),
    0
  );

  /* =========================================================
     FILTER + SEARCH + SORT
  ========================================================= */

  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];

    /* Search */

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (supplier) =>
          supplier.supplier_name
            .toLowerCase()
            .includes(query) ||
          supplier.contact_person
            .toLowerCase()
            .includes(query) ||
          supplier.mobile.includes(query) ||
          supplier.supplier_code
            .toLowerCase()
            .includes(query)
      );
    }

    /* Status */

    if (statusFilter !== "All Status") {
      result = result.filter(
        (supplier) =>
          supplier.status === statusFilter
      );
    }

    /* Supplier Type */

    if (supplierTypeFilter !== "All Types") {
      result = result.filter(
        (supplier) =>
          supplier.supplier_type ===
          supplierTypeFilter
      );
    }

    /* Sorting */

    if (sortBy === "Name A-Z") {
      result.sort((a, b) =>
        a.supplier_name.localeCompare(
          b.supplier_name
        )
      );
    }

    if (sortBy === "Name Z-A") {
      result.sort((a, b) =>
        b.supplier_name.localeCompare(
          a.supplier_name
        )
      );
    }

    if (sortBy === "Newest") {
      result.sort(
        (a, b) => b.supplier_id - a.supplier_id
      );
    }

    if (sortBy === "Oldest") {
      result.sort(
        (a, b) => a.supplier_id - b.supplier_id
      );
    }

    return result;
  }, [
    suppliers,
    search,
    statusFilter,
    supplierTypeFilter,
    sortBy,
  ]);

  /* =========================================================
     TOGGLE SUPPLIER STATUS
  ========================================================= */

  const toggleStatus = (id) => {
    setSuppliers((previous) =>
      previous.map((supplier) =>
        supplier.supplier_id === id
          ? {
              ...supplier,
              status:
                supplier.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : supplier
      )
    );

    setShowActions(null);
  };

  /* =========================================================
     DELETE SUPPLIER
  ========================================================= */

  const deleteSupplier = (id) => {
    const supplier = suppliers.find(
      (item) => item.supplier_id === id
    );

    if (!supplier) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${supplier.supplier_name}?`
    );

    if (!confirmed) return;

    setSuppliers((previous) =>
      previous.filter(
        (supplier) =>
          supplier.supplier_id !== id
      )
    );

    setShowActions(null);
  };

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage supplier records, contacts and outstanding balances.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
        >
          <Plus size={18} />
          Add Supplier
        </button>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Suppliers"
          value={totalSuppliers}
          subtitle="All supplier records"
          icon={Building2}
        />

        <SummaryCard
          title="Active Suppliers"
          value={activeSuppliers}
          subtitle="Currently active"
          icon={UserCheck}
        />

        <SummaryCard
          title="Inactive Suppliers"
          value={inactiveSuppliers}
          subtitle="Inactive records"
          icon={UserX}
        />

        <SummaryCard
          title="Opening Balance"
          value={formatCurrency(
            totalOpeningBalance
          )}
          subtitle="Total supplier balance"
          icon={IndianRupee}
        />

      </div>


      {/* =====================================================
          SUPPLIER TABLE SECTION
      ===================================================== */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white">

        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="border-b border-[#E7DED3] p-5 sm:p-6">

          <div className="mb-5">

            <h2 className="text-base font-semibold text-[#2B2622]">
              Supplier List
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Search, filter and manage your supplier records.
            </p>

          </div>


          <div className="grid gap-3 lg:grid-cols-[1fr_180px_190px_170px]">

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
                placeholder="Search supplier, contact, mobile or code..."
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


            {/* Supplier Type */}

            <SelectFilter
              value={supplierTypeFilter}
              onChange={setSupplierTypeFilter}
              options={[
                "All Types",
                "Manufacturer",
                "Wholesaler",
                "Distributor",
                "Local Vendor",
                "Service Provider",
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

          <table className="w-full min-w-[1100px] border-collapse">

            <thead>

              <tr className="border-b border-[#E7DED3] bg-[#FCFAF8] text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Supplier
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Code
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Contact
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Mobile
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Opening Balance
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

              {filteredSuppliers.length === 0 ? (

                <tr>

                  <td colSpan="8">

                    <div className="flex flex-col items-center justify-center py-14 text-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3EE]">

                        <Building2
                          size={21}
                          className="text-[#8A6A1F]"
                        />

                      </div>

                      <p className="text-sm font-medium text-[#665C54]">
                        No suppliers found
                      </p>

                      <p className="mt-1 text-xs text-[#9B8E83]">
                        Try changing your search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredSuppliers.map((supplier) => (

                  <tr
                    key={supplier.supplier_id}
                    className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                  >

                    {/* Supplier */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3EE] text-sm font-semibold text-[#6F3E32]">
                          {supplier.supplier_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#2B2622]">
                            {supplier.supplier_name}
                          </p>

                          <p className="text-xs text-[#9B8E83]">
                            {supplier.contact_person}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Code */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#6F3E32]">
                        {supplier.supplier_code}
                      </span>

                    </td>


                    {/* Contact */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {supplier.contact_person}
                      </span>

                    </td>


                    {/* Type */}

                    <td className="px-5 py-4">

                      <span className="inline-flex rounded-full bg-[#F7F3EE] px-3 py-1 text-xs font-medium text-[#6F3E32]">
                        {supplier.supplier_type}
                      </span>

                    </td>


                    {/* Mobile */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-[#4B423C]">
                        {supplier.mobile}
                      </span>

                    </td>


                    {/* Opening Balance */}

                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#4B423C]">
                        {formatCurrency(
                          supplier.opening_balance
                        )}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={supplier.status}
                      />

                    </td>


                    {/* Actions */}

                    <td className="relative px-5 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          setShowActions(
                            showActions ===
                              supplier.supplier_id
                              ? null
                              : supplier.supplier_id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#85786D] transition hover:bg-[#F7F3EE] hover:text-[#6F3E32]"
                      >
                        <MoreVertical size={18} />
                      </button>


                      {showActions ===
                        supplier.supplier_id && (

                        <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-[#E7DED3] bg-white p-1.5 shadow-lg">

                          <ActionButton
                            icon={Eye}
                            label="View Supplier"
                            onClick={() =>
                              setShowActions(null)
                            }
                          />

                          <ActionButton
                            icon={Pencil}
                            label="Edit Supplier"
                            onClick={() =>
                              setShowActions(null)
                            }
                          />

                          <ActionButton
                            icon={
                              supplier.status ===
                              "Active"
                                ? DeactivateIcon
                                : ActivateIcon
                            }
                            label={
                              supplier.status ===
                              "Active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() =>
                              toggleStatus(
                                supplier.supplier_id
                              )
                            }
                          />

                          <ActionButton
                            icon={Trash2}
                            label="Delete Supplier"
                            onClick={() =>
                              deleteSupplier(
                                supplier.supplier_id
                              )
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
              {filteredSuppliers.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-[#2B2622]">
              {suppliers.length}
            </span>{" "}

            suppliers

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


export default Suppliers;