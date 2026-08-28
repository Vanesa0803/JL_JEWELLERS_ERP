import { useState } from "react";

import CreateBill from "./CreateBill";
import AllBills from "./AllBills";
import DraftBills from "./DraftBills";
import CompletedBills from "./CompletedBills";
import CancelledBills from "./CancelledBills";
import InvoiceHistory from "./InvoiceHistory";

const billingTabs = [
  {
    id: "create",
    label: "Create New Bill",
  },
  {
    id: "all",
    label: "All Bills",
  },
  {
    id: "drafts",
    label: "Draft Bills",
  },
  {
    id: "completed",
    label: "Completed Bills",
  },
  {
    id: "cancelled",
    label: "Cancelled Bills",
  },
  {
    id: "history",
    label: "Invoice History",
  },
];

const Billing = () => {
  const [activeTab, setActiveTab] = useState("create");

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateBill />;

      case "all":
        return <AllBills />;

      case "drafts":
        return <DraftBills />;

      case "completed":
        return <CompletedBills />;

      case "cancelled":
        return <CancelledBills />;

      case "history":
        return <InvoiceHistory />;

      default:
        return <CreateBill />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#2B2622]">
          Billing
        </h2>

        <p className="mt-1 text-sm text-[#85786D]">
          Create, manage and track customer invoices.
        </p>
      </div>

      {/* Billing Navigation */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-[#E7DED3] bg-white p-2">

          {billingTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-[#6F3E32] text-white shadow-sm"
                      : "text-[#665C54] hover:bg-[#F7F3EE] hover:text-[#6F3E32]"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}

        </div>
      </div>

      {/* Content */}
      {renderContent()}

    </div>
  );
};

export default Billing;