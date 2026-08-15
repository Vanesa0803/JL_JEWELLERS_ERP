import BillsTable from "../../components/billing/BillsTable";

/**
 * Every bill, whatever its status.
 *
 * The table itself lives in components/billing/BillsTable.jsx and is shared
 * with the Draft, Completed, Cancelled and History screens — those five pages
 * were previously five copies of the same markup.
 */
const AllBills = () => (
  <BillsTable
    title="All Bills"
    subtitle="Search, view and manage customer invoices."
    emptyMessage="No bills have been raised yet."
  />
);

export default AllBills;
