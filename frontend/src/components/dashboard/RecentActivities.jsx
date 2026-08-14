import { Receipt, IndianRupee, Activity } from "lucide-react";

import { relativeTime } from "../../lib/format";

/**
 * From GET /dashboard -> data.recent_activities, which returns
 * { type, activity, created_at }.
 *
 * `type` is 'Bill' or 'Payment' (a UNION over both tables), so the icon is
 * chosen from that rather than stored per row.
 */
const iconFor = {
  Bill: Receipt,
  Payment: IndianRupee,
};

const RecentActivities = ({ activities, loading }) => {
  const rows = activities ?? [];

  return (
    <section className="min-w-0 rounded-2xl border border-[#E7DED3] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#2B2622]">Recent Activities</h2>
        <p className="mt-1 text-sm text-[#85786D]">What has happened lately</p>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="py-6 text-center text-sm text-[#9B8E83]">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#9B8E83]">No activity yet.</p>
        ) : (
          rows.map((item, index) => {
            const Icon = iconFor[item.type] ?? Activity;

            return (
              <div key={`${item.created_at}-${index}`} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EBD9] text-[#B8860B]">
                  <Icon size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#2B2622]">
                    {item.activity}
                  </p>

                  <p className="mt-0.5 text-xs text-[#9B8E83]">
                    {item.type} · {relativeTime(item.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RecentActivities;
