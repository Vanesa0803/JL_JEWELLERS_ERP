import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Receipt,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getFinanceDashboard } from "../../services/finance.service";

const Finance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFinance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFinanceDashboard();

      setData(response?.data?.data ?? response?.data ?? null);
    } catch (err) {
      console.error("Failed to load finance dashboard:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load finance data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-[#85786D]">
          Loading finance data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-[#2B2622]">
          Finance
        </h1>

        <div className="rounded-xl border border-[#E7C8C2] bg-[#FDF3F1] px-4 py-3 text-sm text-[#8B3E32]">
          {error}
        </div>

        <button
          onClick={fetchFinance}
          className="flex items-center gap-2 rounded-xl bg-[#2B2622] px-4 py-2 text-sm text-white"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const profitLoss = data?.profit_loss || {};
  const cashFlow = data?.cash_flow || {};
  const breakdown = data?.cash_flow_breakdown || {};
  const bankAccounts = Array.isArray(data?.bank_accounts)
    ? data.bank_accounts
    : [];
  const payables = Array.isArray(data?.outstanding_payables)
    ? data.outstanding_payables
    : [];

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Finance
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Financial overview and business cash position.
          </p>
        </div>

        <button
          onClick={fetchFinance}
          className="flex items-center gap-2 rounded-xl border border-[#DED4CA] bg-white px-4 py-2 text-sm text-[#4B423C] hover:bg-[#FCFAF8]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* PROFIT / LOSS */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-[#E7DED3] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
              <TrendingUp size={19} className="text-[#397047]" />
            </div>

            <div>
              <p className="text-xs text-[#85786D]">
                Total Income
              </p>

              <p className="mt-1 text-xl font-semibold text-[#2B2622]">
                {formatCurrency(profitLoss.total_income)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7DED3] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
              <TrendingDown size={19} className="text-[#8B3E32]" />
            </div>

            <div>
              <p className="text-xs text-[#85786D]">
                Total Expense
              </p>

              <p className="mt-1 text-xl font-semibold text-[#2B2622]">
                {formatCurrency(profitLoss.total_expense)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7DED3] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
              <Wallet size={19} className="text-[#8A6A1F]" />
            </div>

            <div>
              <p className="text-xs text-[#85786D]">
                Net Profit
              </p>

              <p className="mt-1 text-xl font-semibold text-[#2B2622]">
                {formatCurrency(profitLoss.net_profit)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* CASH FLOW */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <div className="mb-5">
          <h2 className="text-base font-semibold text-[#2B2622]">
            Cash Flow
          </h2>

          <p className="mt-1 text-xs text-[#9B8E83]">
            Cash inflow and outflow from the backend financial records.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-[#F7F3EE] p-4">
            <p className="text-xs text-[#85786D]">
              Cash In
            </p>

            <p className="mt-1 text-lg font-semibold text-[#397047]">
              {formatCurrency(cashFlow.cash_in)}
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F3EE] p-4">
            <p className="text-xs text-[#85786D]">
              Cash Out
            </p>

            <p className="mt-1 text-lg font-semibold text-[#8B3E32]">
              {formatCurrency(cashFlow.cash_out)}
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F3EE] p-4">
            <p className="text-xs text-[#85786D]">
              Net Cash Flow
            </p>

            <p className="mt-1 text-lg font-semibold text-[#2B2622]">
              {formatCurrency(cashFlow.net_cash_flow)}
            </p>
          </div>

        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-xl border border-[#F0E9E2] p-3">
            <p className="text-xs text-[#85786D]">Bill Payments</p>
            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              {formatCurrency(breakdown.bill_payments)}
            </p>
          </div>

          <div className="rounded-xl border border-[#F0E9E2] p-3">
            <p className="text-xs text-[#85786D]">Advance Payments</p>
            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              {formatCurrency(breakdown.advance_payments)}
            </p>
          </div>

          <div className="rounded-xl border border-[#F0E9E2] p-3">
            <p className="text-xs text-[#85786D]">Manual Income</p>
            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              {formatCurrency(breakdown.manual_income)}
            </p>
          </div>

          <div className="rounded-xl border border-[#F0E9E2] p-3">
            <p className="text-xs text-[#85786D]">Expenses</p>
            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              {formatCurrency(breakdown.expenses)}
            </p>
          </div>

          <div className="rounded-xl border border-[#F0E9E2] p-3">
            <p className="text-xs text-[#85786D]">Refunds</p>
            <p className="mt-1 text-sm font-semibold text-[#2B2622]">
              {formatCurrency(breakdown.refunds)}
            </p>
          </div>

        </div>

      </section>

      {/* BANK ACCOUNTS + PAYABLES */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* BANK ACCOUNTS */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white">

          <div className="border-b border-[#E7DED3] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
                <Building2 size={19} className="text-[#8A6A1F]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#2B2622]">
                  Bank Accounts
                </h2>

                <p className="text-xs text-[#9B8E83]">
                  Accounts provided by the backend.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#F0E9E2]">

            {bankAccounts.length === 0 ? (
              <p className="p-5 text-sm text-[#85786D]">
                No bank account data available.
              </p>
            ) : (
              bankAccounts.map((account, index) => (
                <div
                  key={
                    account.bank_account_id ||
                    account.account_id ||
                    index
                  }
                  className="p-5"
                >
                  <p className="text-sm font-medium text-[#2B2622]">
                    {account.account_name ||
                      account.bank_name ||
                      account.name ||
                      "Bank Account"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#2B2622]">
                    {formatCurrency(
                      account.balance ??
                        account.current_balance ??
                        0
                    )}
                  </p>
                </div>
              ))
            )}

          </div>

        </section>

        {/* PAYABLES */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white">

          <div className="border-b border-[#E7DED3] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
                <AlertCircle size={19} className="text-[#8B3E32]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#2B2622]">
                  Outstanding Payables
                </h2>

                <p className="text-xs text-[#9B8E83]">
                  Pending supplier obligations.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#F0E9E2]">

            {payables.length === 0 ? (
              <p className="p-5 text-sm text-[#85786D]">
                No outstanding payable data available.
              </p>
            ) : (
              payables.map((item, index) => (
                <div
                  key={
                    item.supplier_id ||
                    item.id ||
                    index
                  }
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="text-sm font-medium text-[#2B2622]">
                      {item.supplier_name ||
                        item.name ||
                        "Supplier"}
                    </p>

                    {item.supplier_id && (
                      <p className="mt-1 text-xs text-[#9B8E83]">
                        Supplier #{item.supplier_id}
                      </p>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-[#8B3E32]">
                    {formatCurrency(
                      item.outstanding_balance ??
                        item.balance ??
                        item.amount ??
                        0
                    )}
                  </p>
                </div>
              ))
            )}

          </div>

        </section>

      </div>

      {/* GST */}

      <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EE]">
            <Receipt size={19} className="text-[#8A6A1F]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#2B2622]">
              GST Summary
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              GST information returned by the Finance API.
            </p>
          </div>
        </div>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-[#FCFAF8] p-4 text-xs text-[#665C54]">
          {JSON.stringify(data?.gst_summary ?? {}, null, 2)}
        </pre>

      </section>

    </div>
  );
};

export default Finance;
