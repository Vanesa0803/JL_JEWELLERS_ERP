const SalesOverviewSection = () => {
  return (
    <section className="mt-10 grid grid-cols-3 gap-6">

      {/* Left */}

      <div className="col-span-2 rounded-2xl bg-white border border-[#E8DFD2] p-6 shadow-sm h-[420px]">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold text-[#3C1414]">
              Sales Overview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Revenue analytics for the last 30 days
            </p>

          </div>

          <button className="rounded-xl border border-[#E8DFD2] px-4 py-2 text-sm hover:bg-[#F8F6F2]">
            Monthly
          </button>

        </div>

        {/* Chart Placeholder */}

        <div className="mt-8 flex h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-[#E8DFD2]">

          <p className="text-gray-400">
            Sales Chart will come here
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="rounded-2xl bg-white border border-[#E8DFD2] p-6 shadow-sm h-[420px]">

        <h2 className="text-xl font-semibold text-[#3C1414]">
          Recent Bills
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest billing activity
        </p>

        <div className="mt-8 flex h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-[#E8DFD2]">

          <p className="text-gray-400">
            Bills Table
          </p>

        </div>

      </div>

    </section>
  );
};

export default SalesOverviewSection;