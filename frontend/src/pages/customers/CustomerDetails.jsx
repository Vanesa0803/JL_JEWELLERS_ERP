import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Star,
  UserCheck,
  UserX,
  Phone,
  Mail,
  User,
  Calendar,
  Hash,
} from "lucide-react";

const customers = [
  {
    id: 101,
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul.sharma@gmail.com",
    status: "Active",
    vip: true,
    customerType: "VIP",
    createdAt: "08 Aug 2026",
  },
  {
    id: 102,
    name: "Priya Singh",
    mobile: "9812345678",
    email: "priya.singh@gmail.com",
    status: "Active",
    vip: false,
    customerType: "Regular",
    createdAt: "07 Aug 2026",
  },
  {
    id: 103,
    name: "Amit Kumar",
    mobile: "9898989898",
    email: "amit.kumar@gmail.com",
    status: "Active",
    vip: true,
    customerType: "VIP",
    createdAt: "06 Aug 2026",
  },
  {
    id: 104,
    name: "Neha Verma",
    mobile: "9765432109",
    email: "neha.verma@gmail.com",
    status: "Inactive",
    vip: false,
    customerType: "Regular",
    createdAt: "05 Aug 2026",
  },
  {
    id: 105,
    name: "Karan Mehta",
    mobile: "9988776655",
    email: "karan.mehta@gmail.com",
    status: "Active",
    vip: false,
    customerType: "Wholesale",
    createdAt: "04 Aug 2026",
  },
  {
    id: 106,
    name: "Anjali Gupta",
    mobile: "9876123456",
    email: "anjali.gupta@gmail.com",
    status: "Active",
    vip: true,
    customerType: "VIP",
    createdAt: "03 Aug 2026",
  },
];

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const customer = customers.find(
    (customer) => customer.id === Number(id)
  );

  if (!customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F3EE]">
          <User size={24} className="text-[#8A6A1F]" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-[#2B2622]">
          Customer Not Found
        </h2>

        <p className="mt-1 text-sm text-[#85786D]">
          The customer you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="mt-5 rounded-xl bg-[#6F3E32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D332A]"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#85786D] transition hover:text-[#6F3E32]"
          >
            <ArrowLeft size={17} />
            Back to Customers
          </button>

          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Customer Details
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            View customer information and account details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/customers/${customer.id}/edit`)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
        >
          <Pencil size={17} />
          Edit Customer
        </button>

      </div>


      {/* PROFILE CARD */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F3EE] text-xl font-semibold text-[#6F3E32]">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>

              <h2 className="text-xl font-semibold text-[#2B2622]">
                {customer.name}
              </h2>

              <p className="mt-1 text-sm text-[#9B8E83]">
                Customer #{customer.id}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">

                {customer.vip && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF5DE] px-3 py-1 text-xs font-medium text-[#96701A]">
                    <Star size={13} fill="currentColor" />
                    VIP Customer
                  </span>
                )}

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    customer.status === "Active"
                      ? "bg-[#EAF4EC] text-[#397047]"
                      : "bg-[#F8ECE9] text-[#8B3E32]"
                  }`}
                >
                  {customer.status}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* INFORMATION GRID */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* CONTACT INFORMATION */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-6">

          <h2 className="text-base font-semibold text-[#2B2622]">
            Contact Information
          </h2>

          <p className="mt-1 text-xs text-[#9B8E83]">
            Customer contact details.
          </p>

          <div className="mt-6 space-y-5">

            <InfoRow
              icon={Phone}
              label="Mobile Number"
              value={customer.mobile}
            />

            <InfoRow
              icon={Mail}
              label="Email Address"
              value={customer.email}
            />

          </div>

        </section>


        {/* CUSTOMER INFORMATION */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-6">

          <h2 className="text-base font-semibold text-[#2B2622]">
            Customer Information
          </h2>

          <p className="mt-1 text-xs text-[#9B8E83]">
            Account and customer details.
          </p>

          <div className="mt-6 space-y-5">

            <InfoRow
              icon={Hash}
              label="Customer ID"
              value={`#${customer.id}`}
            />

            <InfoRow
              icon={User}
              label="Customer Type"
              value={customer.customerType}
            />

            <InfoRow
              icon={Calendar}
              label="Created On"
              value={customer.createdAt}
            />

          </div>

        </section>

      </div>


      {/* QUICK ACTIONS */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-6">

        <h2 className="text-base font-semibold text-[#2B2622]">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-[#9B8E83]">
          Manage this customer's account.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(`/customers/${customer.id}/edit`)
            }
            className="flex items-center gap-2 rounded-xl border border-[#DCCFC3] px-4 py-2.5 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
          >
            <Pencil size={16} />
            Edit Customer
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#DCCFC3] px-4 py-2.5 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
          >
            <Star size={16} />
            {customer.vip ? "Remove VIP" : "Make VIP"}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#DCCFC3] px-4 py-2.5 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
          >
            {customer.status === "Active" ? (
              <>
                <UserX size={16} />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck size={16} />
                Activate
              </>
            )}
          </button>

        </div>

      </section>

    </div>
  );
};


/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F3EE]">
        <Icon size={18} className="text-[#8A6A1F]" />
      </div>

      <div>
        <p className="text-xs text-[#9B8E83]">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-[#2B2622]">
          {value}
        </p>
      </div>

    </div>
  );
};

export default CustomerDetails;