/**
 * Display formatting.
 *
 * Indian conventions throughout, because that is where the shop is: rupees
 * with lakh/crore grouping (1,20,000 — not 120,000) and day-month-year dates.
 */

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const rupeesWithPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const plain = new Intl.NumberFormat("en-IN");

/**
 * Money, for display.
 *
 * The API returns DECIMAL columns as strings ("51500.00"), which is correct of
 * it — floating point should not be anywhere near a currency value. So this
 * accepts strings as well as numbers.
 */
export const money = (value, { paise = false } = {}) => {
  const amount = typeof value === "string" ? Number(value) : value;

  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—";
  }

  return paise ? rupeesWithPaise.format(amount) : rupees.format(amount);
};

/** A count, grouped Indian-style. */
export const count = (value) => {
  const n = typeof value === "string" ? Number(value) : value;
  return n === null || n === undefined || Number.isNaN(n) ? "—" : plain.format(n);
};

/** 14 Aug 2026 */
export const shortDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** "just now", "20 minutes ago", "3 days ago" — for activity feeds. */
export const relativeTime = (value) => {
  if (!value) return "";

  const then = new Date(value);
  if (Number.isNaN(then.getTime())) return "";

  const seconds = Math.round((Date.now() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const steps = [
    { limit: 3600, unit: "minute", per: 60 },
    { limit: 86400, unit: "hour", per: 3600 },
    { limit: 2592000, unit: "day", per: 86400 },
    { limit: 31536000, unit: "month", per: 2592000 },
  ];

  for (const step of steps) {
    if (seconds < step.limit) {
      const n = Math.floor(seconds / step.per);
      return `${n} ${step.unit}${n === 1 ? "" : "s"} ago`;
    }
  }

  const years = Math.floor(seconds / 31536000);
  return `${years} year${years === 1 ? "" : "s"} ago`;
};
