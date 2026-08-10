import {
  ArrowRight,
  CreditCard,
  Package,
  Receipt,
  UserPlus,
} from "lucide-react";

const RecentActivities = () => {
  const activities = [
    {
      icon: Receipt,
      title: "New bill created",
      description: "Bill #1024 was created",
      time: "Recently",
    },
    {
      icon: UserPlus,
      title: "Customer added",
      description: "New customer profile created",
      time: "Recently",
    },
    {
      icon: CreditCard,
      title: "Payment received",
      description: "Payment recorded successfully",
      time: "Recently",
    },
    {
      icon: Package,
      title: "Inventory updated",
      description: "Stock quantity was updated",
      time: "Recently",
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#2B2622]">
            Recent Activities
          </h2>

          <p className="mt-1 text-sm text-[#85786D]">
            Latest business activities
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#8A6A1F] hover:text-[#B8860B]"
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Activities */}
      <div className="mt-6 space-y-5">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5EBD9] text-[#B8860B]">
                <Icon size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#2B2622]">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-[#85786D]">
                  {activity.description}
                </p>
              </div>

              <span className="shrink-0 text-xs text-[#A4978D]">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivities;