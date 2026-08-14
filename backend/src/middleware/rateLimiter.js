import rateLimit from "express-rate-limit";

/**
 * Global request throttle.
 *
 * NOTE: this is applied to the whole API. The login route still has no
 * limiter of its own, so a brute-force attempt gets the same 100-requests
 * budget as everything else combined — see S2-14 in REMEDIATION_BACKLOG.md.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 100,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});

export default limiter;
