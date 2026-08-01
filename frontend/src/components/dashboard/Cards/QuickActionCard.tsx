const actions = [
  "Create Invoice",
  "Add Customer",
  "Add Item",
  "New Order",
  "Add Payment",
  "View Reports",
];

const QuickActionCard = () => {
  return (
    <div className="bg-white border border-[#E9DFD1] rounded-[28px] shadow-sm p-7 h-[420px]">

      <h2 className="text-[22px] font-semibold text-[#3C1414] mb-8">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((action) => (
          <button
            key={action}
            className="h-24 rounded-2xl border border-[#E9DFD1] hover:border-[#D4AF37] hover:bg-[#FFF9EC] transition-all text-[#3C1414] font-medium"
          >
            {action}
          </button>
        ))}

      </div>

    </div>
  );
};

export default QuickActionCard;