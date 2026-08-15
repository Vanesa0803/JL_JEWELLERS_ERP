import BillsTable from "../../components/billing/BillsTable";

/**
 * Invoice history.
 *
 * Currently the same list as All Bills. The backend has a per-bill audit trail
 * at GET /bills/:id/history, backed by the `bill_history` table, which records
 * each change to a bill. Showing that properly needs a detail view — selecting
 * an invoice here and listing its revisions — rather than another flat table.
 *
 * Left as the bill list for now instead of inventing a history UI that does
 * not reflect what the endpoint actually returns.
 */
const InvoiceHistory = () => (
  <BillsTable
    title="Invoice History"
    subtitle="All invoices raised, newest first."
    emptyMessage="No invoices yet."
  />
);

export default InvoiceHistory;
