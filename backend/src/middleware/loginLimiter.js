import rateLimit from "express-rate-limit";

/**
 * Rate limit for the login route only (S2-14).
 *
 * The global limiter is sized for a shop using the app all day — 2000 requests
 * per 15 minutes — which is exactly the wrong shape for password guessing. A
 * single budget shared between "loading the dashboard" and "trying passwords"
 * cannot be tight enough for one without breaking the other. Hence a second,
 * much smaller budget on the one route that matters.
 *
 * 10 failed attempts, then a 5 MINUTE cool-off.
 *
 * The window is deliberately short. Once the limiter trips it blocks the
 * CORRECT password too — it cannot tell a locked-out attacker from the owner
 * finally typing it right. On a shop till that means a quarter of an hour
 * unable to bill anyone, which is a worse outcome than the attack being
 * prevented: the API is bound to loopback, so guessing passwords requires
 * already being sat at the machine.
 *
 * Five minutes still caps guessing at ~120 an hour, which defeats brute force
 * against any real password, while a genuine mistype costs a coffee break
 * rather than an afternoon.
 *
 * `skipSuccessfulRequests` means only FAILED logins count. Signing in and out
 * repeatedly during a normal day never trips it; only wrong passwords do.
 *
 * Note the IP is nearly always 127.0.0.1 here, since the API is bound to
 * loopback and used by one person. This matters if the API is ever exposed —
 * and it is cheap now, rather than something to remember later.
 */
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many failed sign-in attempts. Please wait 5 minutes and try again.",
  },
});

export default loginLimiter;
