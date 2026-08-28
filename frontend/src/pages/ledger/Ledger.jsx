import { useEffect, useState } from "react";
import { Search, BookOpen } from "lucide-react";

import {
  getCustomerLedger,
  getSupplierLedger,
  getOutstandingBalance,
  getSupplierOutstandingBalance,
} from "../../services/ledger.service";

const Ledger = () => {
  const [ledgerType, setLedgerType] = useState("Customer");
  const [partyId, setPartyId] = useState("");

  const [entries, setEntries] = useState([]);
  const [outstanding, setOutstanding] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPayload = (response) => {
    // Works with normal Axios response
    // and also with an already-unwrapped response.
    return response?.data ?? response;
  };

  const fetchLedger = async () => {
    if (!partyId) {
      setEntries([]);
      setOutstanding(null);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOutstanding(null);

      let ledgerResponse;
      let balanceResponse;

      // =========================
      // CUSTOMER
      // =========================

      if (ledgerType === "Customer") {
        ledgerResponse = await getCustomerLedger(partyId);

        balanceResponse = await getOutstandingBalance(partyId);
      }

      // =========================
      // SUPPLIER
      // =========================

      else {
        ledgerResponse = await getSupplierLedger(partyId);

        balanceResponse =
          await getSupplierOutstandingBalance(partyId);
      }

      // =========================
      // LEDGER RESPONSE
      // =========================

      const ledgerPayload = getPayload(ledgerResponse);

      let ledgerEntries = [];

      if (Array.isArray(ledgerPayload)) {
        ledgerEntries = ledgerPayload;
      } else if (Array.isArray(ledgerPayload?.data)) {
        ledgerEntries = ledgerPayload.data;
      } else if (Array.isArray(ledgerPayload?.entries)) {
        ledgerEntries = ledgerPayload.entries;
      } else if (Array.isArray(ledgerPayload?.ledger)) {
        ledgerEntries = ledgerPayload.ledger;
      }

      console.log("Ledger API response:", ledgerResponse);
      console.log("Ledger entries:", ledgerEntries);

      setEntries(ledgerEntries);

      // =========================
      // OUTSTANDING BALANCE
      // =========================

      const balancePayload = getPayload(balanceResponse);

      const balanceData =
        balancePayload?.data ?? balancePayload;

      console.log(
        "Outstanding balance response:",
        balanceResponse
      );

      setOutstanding(
        balanceData?.outstanding_balance ??
          balanceData?.balance ??
          0
      );
    } catch (err) {
      console.error("Failed to fetch ledger:", err);

      setEntries([]);
      setOutstanding(null);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load ledger."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [ledgerType, partyId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const handleLedgerTypeChange = (e) => {
    setLedgerType(e.target.value);
    setPartyId("");
    setEntries([]);
    setOutstanding(null);
    setError("");
  };

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div>
        <h1 className="text-2xl font-semibold text-[#2B2622]">
          Ledgers
        </h1>

        <p className="mt-1 text-sm text-[#85786D]">
          View customer and supplier ledger transactions.
        </p>
      </div>

      {/* =========================
          CONTROLS
      ========================= */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <div className="grid gap-4 md:grid-cols-3">

          {/* Ledger Type */}

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#665C54]">
              Ledger Type
            </label>

            <select
              value={ledgerType}
              onChange={handleLedgerTypeChange}
              className="h-11 w-full rounded-xl border border-[#DED4CA] bg-white px-4 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
            >
              <option value="Customer">
                Customer Ledger
              </option>

              <option value="Supplier">
                Supplier Ledger
              </option>
            </select>
          </div>

          {/* Party ID */}

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#665C54]">
              {ledgerType} ID
            </label>

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8E83]"
              />

              <input
                type="number"
                min="1"
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                placeholder={`Enter ${ledgerType.toLowerCase()} ID`}
                className="h-11 w-full rounded-xl border border-[#DED4CA] bg-[#FCFAF8] pl-10 pr-4 text-sm text-[#2B2622] outline-none focus:border-[#B8860B]"
              />

            </div>
          </div>

          {/* Outstanding */}

          <div className="rounded-xl bg-[#F7F3EE] px-4 py-3">

            <p className="text-xs text-[#85786D]">
              Outstanding Balance
            </p>

            <p className="mt-1 text-lg font-semibold text-[#6F3E32]">
              {outstanding !== null
                ? formatCurrency(outstanding)
                : "—"}
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="rounded-xl border border-[#E7C8C2] bg-[#FDF3F1] px-4 py-3 text-sm text-[#8B3E32]">
          {error}
        </div>
      )}

      {/* =========================
          LEDGER TABLE
      ========================= */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white">

        {/* Table Header */}

        <div className="border-b border-[#E7DED3] p-5 sm:p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
              <BookOpen
                size={20}
                className="text-[#8A6A1F]"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#2B2622]">
                {ledgerType} Ledger
              </h2>

              <p className="mt-1 text-xs text-[#9B8E83]">
                Transaction history and balances
              </p>
            </div>

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-[#E7DED3] bg-[#FCFAF8] text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Description
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Debit
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Credit
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#85786D]">
                  Balance
                </th>

              </tr>
            </thead>

            <tbody>

              {/* Loading */}

              {loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-14 text-center text-sm text-[#85786D]"
                  >
                    Loading ledger...
                  </td>
                </tr>
              )}

              {/* No ID */}

              {!loading && !partyId && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-14 text-center"
                  >

                    <BookOpen
                      size={30}
                      className="mx-auto mb-3 text-[#B8AA9E]"
                    />

                    <p className="text-sm font-medium text-[#665C54]">
                      Enter a {ledgerType.toLowerCase()} ID
                    </p>

                    <p className="mt-1 text-xs text-[#9B8E83]">
                      Ledger transactions will appear here.
                    </p>

                  </td>
                </tr>
              )}

              {/* No Entries */}

              {!loading &&
                partyId &&
                entries.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-14 text-center text-sm text-[#85786D]"
                    >
                      No ledger entries found.
                    </td>
                  </tr>
                )}

              {/* Entries */}

              {!loading &&
                entries.length > 0 &&
                entries.map((entry, index) => (

                  <tr
                    key={
                      entry.ledger_id ||
                      entry.id ||
                      `ledger-${index}`
                    }
                    className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                  >

                    {/* DATE */}

                    <td className="px-5 py-4 text-sm text-[#4B423C]">
                      {formatDate(
                        entry.created_at ||
                          entry.transaction_date
                      )}
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-5 py-4">

                      <p className="text-sm font-medium text-[#2B2622]">
                        {entry.remarks ||
                          entry.description ||
                          entry.particulars ||
                          entry.transaction_type ||
                          "Transaction"}
                      </p>

                      {entry.bill_id && (
                        <p className="mt-1 text-xs text-[#9B8E83]">
                          Bill #{entry.bill_id}
                        </p>
                      )}

                    </td>

                    {/* DEBIT */}

                    <td className="px-5 py-4 text-sm text-[#8B3E32]">
                      {Number(entry.debit || 0) > 0
                        ? formatCurrency(entry.debit)
                        : "—"}
                    </td>

                    {/* CREDIT */}

                    <td className="px-5 py-4 text-sm text-[#397047]">
                      {Number(entry.credit || 0) > 0
                        ? formatCurrency(entry.credit)
                        : "—"}
                    </td>

                    {/* BALANCE */}

                    <td className="px-5 py-4 text-sm font-semibold text-[#2B2622]">
                      {entry.balance !== null &&
                      entry.balance !== undefined
                        ? formatCurrency(entry.balance)
                        : "—"}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
};

export default Ledger;