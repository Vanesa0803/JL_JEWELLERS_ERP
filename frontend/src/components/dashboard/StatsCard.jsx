const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
}) => {
  return (
    <div className="rounded-2xl border border-[#E7DED3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#85786D]">
            {title}
          </p>

          <p className="mt-3 truncate text-2xl font-semibold text-[#2B2622]">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-xs text-[#9B8E83]">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EBD9] text-[#B8860B]">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;