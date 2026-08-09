import { useMemo, useState } from "react";

import {
  Banknote,
  CreditCard,
  IndianRupee,
  Search,
  Smartphone,
  WalletCards,
  ChevronDown,
  Eye,
  Plus,
} from "lucide-react";

const paymentData = [
  {
    id: "PAY-00021",
    invoice: "INV-00124",
    customer: "Rahul Sharma",
    date: "08 Aug 2026",
    amount: 50000,
    method: "UPI",
    status: "Completed",
  },
  {
    id: "PAY-00020",
    invoice: "INV-00123",
    customer: "Priya Singh",
    date: "08 Aug 2026",
    amount: 85000,
    method: "Cash",
    status: "Completed",
  },
  {
    id: "PAY-00019",
    invoice: "INV-00122",
    customer: "Amit Kumar",
    date: "07 Aug 2026",
    amount: 25000,
    method: "Card",
    status: "Partial",
  },
  {
    id: "PAY-00018",
    invoice: "INV-00121",
    customer: "Neha Verma",
    date: "07 Aug 2026",
    amount: 112000,
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "PAY-00017",
    invoice: "INV-00120",
    customer: "Karan Mehta",
    date: "06 Aug 2026",
    amount: 35000,
    method: "Cash",
    status: "Pending",
  },
];

const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getMethodIcon = (method) => {
  if (method === "Cash") return Banknote;
  if (method === "Card") return CreditCard;
  if (method === "UPI") return Smartphone;
  if (method === "Bank Transfer") return WalletCards;

  return IndianRupee;
};

const Payments = () => {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const filteredPayments = useMemo(() => {
    return paymentData.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(search.toLowerCase()) ||
        payment.invoice.toLowerCase().includes(search.toLowerCase()) ||
        payment.customer.toLowerCase().includes(search.toLowerCase());

      const matchesMethod =
        methodFilter === "All Methods" ||
        payment.method === methodFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        payment.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [search, methodFilter, statusFilter]);

  const totalReceived = paymentData
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = paymentData
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const todayPayments = paymentData
    .filter((payment) => payment.date === "08 Aug 2026")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Payments
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Track received payments and manage customer payment records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPaymentForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Received"
          value={formatCurrency(totalReceived)}
          subtitle="Completed payments"
          icon={IndianRupee}
        />

        <SummaryCard
          title="Pending Payments"
          value={formatCurrency(pendingAmount)}
          subtitle="Awaiting payment"
          icon={WalletCards}
        />

        <SummaryCard
          title="Today's Payments"
          value={formatCurrency(todayPayments)}
          subtitle="Payments received today"
          icon={Banknote}
        />

        <SummaryCard
          title="Total Transactions"
          value={paymentData.length}
          subtitle="Payment records"
          icon={CreditCard}
        />

      </div>

      {/* ================= PAYMENT METHOD OVERVIEW ================= */}
      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="text-base font-semibold text-[#2B2622]">
            Payment Methods
          </h2>

          <p className="mt-1 text-xs text-[#9B8E83]">
            Overview of the different payment methods used.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <MethodCard
            icon={Banknote}
            title="Cash"
            value="₹1,20,000"
          />

          <MethodCard
            icon={Smartphone}
            title="UPI"
            value="₹50,000"
          />

          <MethodCard
            icon={CreditCard}
            title="Card"
            value="₹25,000"
          />

          <MethodCard
            icon={WalletCards}
            title="Bank Transfer"
            value="₹1,12,000"
          />

        </div>
      </section>

      {/* ================= PAYMENT HISTORY ================= */}
      <section className="rounded-2xl border border-[#E7DED3] bg-white">

        {/* Header */}
        <div className="border-b border-[#E7DED3] p-5 sm:p-6">

          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#2B2622]">
              Payment History
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Search and manage recorded customer payments.
            </p>
          </div>

          {/* Filters */}
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_180px]">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payment, invoice or customer..."
                className="h-11 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] pl-11 pr-4 text-sm text-[#2B2622] outline-none transition placeholder:text-[#A4978D] focus:border-[#B8860B] focus:bg-white"
              />
            </div>

            {/* Method */}
            <div className="relative">
              <select
                value={methodFilter}
                onChange={(event) => setMethodFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-4 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
              >
                <option>All Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#DED4CA] bg-white px-4 pr-10 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Partial</option>
                <option>Pending</option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B8E83]"
              />
            </div>

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] border-collapse">

            <thead>
              <tr className="border-b border-[#E7DED3] bg-[#FCFAF8] text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Payment ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Invoice
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Amount
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Method
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

              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="flex flex-col items-center justify-center py-14 text-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3EE]">
                        <Search
                          size={21}
                          className="text-[#8A6A1F]"
                        />
                      </div>

                      <p className="text-sm font-medium text-[#665C54]">
                        No payments found
                      </p>

                      <p className="mt-1 text-xs text-[#9B8E83]">
                        Try changing your search or filters.
                      </p>

                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const MethodIcon = getMethodIcon(payment.method);

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                    >

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#6F3E32]">
                          {payment.id}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-[#2B2622]">
                          {payment.invoice}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-[#4B423C]">
                          {payment.customer}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-[#85786D]">
                          {payment.date}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#2B2622]">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <MethodIcon
                            size={16}
                            className="text-[#8A6A1F]"
                          />

                          <span className="text-sm text-[#4B423C]">
                            {payment.method}
                          </span>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={payment.status} />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>
      </section>

      {/* ================= RECORD PAYMENT MODAL ================= */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-lg font-semibold text-[#2B2622]">
                  Record Payment
                </h2>

                <p className="mt-1 text-xs text-[#9B8E83]">
                  Record a payment received from a customer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="text-xl text-[#85786D] hover:text-[#2B2622]"
              >
                ×
              </button>

            </div>

            <div className="space-y-4">

              <InputField
                label="Invoice Number"
                placeholder="e.g. INV-00125"
              />

              <InputField
                label="Amount"
                placeholder="₹ 0.00"
                type="number"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4B423C]">
                  Payment Method
                </label>

                <select
                  className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-4 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Mixed Payment</option>
                </select>
              </div>

              <InputField
                label="Remarks"
                placeholder="Optional remarks..."
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="rounded-xl border border-[#DCCFC3] px-5 py-2.5 text-sm font-medium text-[#6F3E32] hover:bg-[#F7F3EE]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="rounded-xl bg-[#6F3E32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5D332A]"
              >
                Save Payment
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

/* ================= SUMMARY CARD ================= */

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

/* ================= METHOD CARD ================= */

const MethodCard = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div className="rounded-xl border border-[#E7DED3] bg-[#FCFAF8] p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F3EE]">
          <Icon
            size={19}
            className="text-[#6F3E32]"
          />
        </div>

        <div>
          <p className="text-xs text-[#9B8E83]">
            {title}
          </p>

          <p className="mt-1 text-sm font-semibold text-[#2B2622]">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
};

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }) => {

  const styles = {
    Completed:
      "bg-[#EAF4EC] text-[#397047]",

    Partial:
      "bg-[#FFF5DE] text-[#96701A]",

    Pending:
      "bg-[#F8ECE9] text-[#8B3E32]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-[#F7F3EE] text-[#85786D]"
      }`}
    >
      {status}
    </span>
  );
};

/* ================= INPUT ================= */

const InputField = ({
  label,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#4B423C]">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-4 text-sm text-[#2B2622] outline-none placeholder:text-[#A4978D] focus:border-[#B8860B]"
      />
    </div>
  );
};

export default Payments;