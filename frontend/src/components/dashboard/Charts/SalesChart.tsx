const SalesChart = () => {
  return (
    <div className="bg-white border border-[#E9DFD1] rounded-[28px] shadow-sm p-7 h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-[22px] font-semibold text-[#3C1414]">
            Sales Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Sales performance over the last 7 days
          </p>
        </div>

        <button className="px-5 py-2 rounded-xl border border-[#E9DFD1] text-[#3C1414] hover:bg-[#FAF7F2] transition">
          This Week ▼
        </button>

      </div>

      {/* Placeholder Chart */}

      <div className="h-[290px] rounded-2xl bg-gradient-to-b from-[#FFF8E6] to-white border border-dashed border-[#E5D8BE] flex items-center justify-center">

        <span className="text-gray-400 text-lg">
          Sales Chart (Coming Next)
        </span>

      </div>

    </div>
  );
};

export default SalesChart;