import BillsTable from "../../components/billing/BillsTable";

/**
 * Finalised bills.
 *
 * Note this is bill_status, not payment_status: a bill can be Completed as a
 * document while its payment is still Pending or Partial. The Payment column
 * shows that separately.
 */
const CompletedBills = () => (
  <BillsTable
    status="Completed"
    title="Completed Bills"
    subtitle="Finalised invoices. Payment may still be outstanding."
    emptyMessage="No completed bills yet."
  />
);

export default CompletedBills;
