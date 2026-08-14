import rateLimit from "express-rate-limit";

/**
 * Global request throttle.
 *
 * WHY THE LIMIT WAS RAISED
 * ------------------------
 * It was 100 requests per 15 minutes across the ENTIRE API. That is a sensible
 * figure for a public internet-facing service and far too low here:
 *
 *   - this is a single-operator desktop app bound to loopback, so every
 *     request comes from the one person using it
 *   - a single dashboard load already makes a handful of calls, and any screen
 *     with a few widgets makes more
 *   - the endpoint sweep (scripts/sweep.cjs) is ~100 calls on its own, and
 *     running it twice started returning 429 for everything
 *
 * A shopkeeper billing customers all afternoon would have hit this and seen
 * the whole app stop responding, with a message about "too many requests"
 * that says nothing about what to do. That is a worse failure than the
 * problem the limiter was guarding against.
 *
 * The real control that IS needed is a tight limit on the LOGIN route
 * specifically, so a brute-force attempt is throttled without starving normal
 * use. That is S2-14 and is still open.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 2000,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});

export default limiter;
