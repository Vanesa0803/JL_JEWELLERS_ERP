import BillsTable from "../../components/billing/BillsTable";

/**
 * Bills still being prepared.
 *
 * Every bill starts here — bill.service.js creates with bill_status 'Draft' —
 * so this is where a half-finished sale waits.
 */
const DraftBills = () => (
  <BillsTable
    status="Draft"
    title="Draft Bills"
    subtitle="Bills that have not been completed yet."
    emptyMessage="No draft bills."
  />
);

export default DraftBills;
