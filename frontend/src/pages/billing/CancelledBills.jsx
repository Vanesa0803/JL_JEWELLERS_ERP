import BillsTable from "../../components/billing/BillsTable";

/**
 * Cancelled bills.
 *
 * Cancelling is not deleting: the invoice stays on record with its status
 * changed, which is what an accountant expects — a cancelled invoice number
 * must not silently vanish from the sequence.
 *
 * Cancelling a completed bill requires the financial PIN
 * (verifyFinancialPin on PUT /bills/:id/cancel).
 */
const CancelledBills = () => (
  <BillsTable
    status="Cancelled"
    title="Cancelled Bills"
    subtitle="Invoices that were cancelled. They remain on record."
    emptyMessage="No cancelled bills."
  />
);

export default CancelledBills;
