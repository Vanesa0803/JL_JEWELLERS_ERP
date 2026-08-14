-- =====================================================================
--  Migration 2026-08-13_07
--  Table for invalidated login tokens
-- =====================================================================
--
--  WHY
--  ---
--  POST /auth/logout failed with:
--      Table 'jl_jewellers_erp.blacklisted_tokens' doesn't exist
--
--  The logout endpoint records the token so it cannot be reused:
--
--      INSERT IGNORE INTO blacklisted_tokens (token) VALUES (?)
--
--  That is the right idea. A JWT is valid until it expires — the server does
--  not "forget" it — so without a list of revoked tokens, logging out only
--  clears the browser's copy. Anyone who had already captured the token could
--  keep using it for the rest of the day (expiry is 1d). The table was simply
--  never created.
--
--  NOT YET ENFORCED
--  ----------------
--  Adding the table makes logout succeed, but nothing checks the list yet.
--  middleware/auth.js verifies the signature and expiry only. Until it also
--  checks this table, a logged-out token still works. Tracked as S2-20.
--
--  This migration is deliberately the smaller half: it stops logout erroring
--  and starts recording revocations, so the check can be added later without
--  a gap in the data. Wiring the check into the middleware is a code change
--  and belongs with the auth work, not with a merge.
--
--  HOUSEKEEPING
--  ------------
--  Rows are only useful until the token would have expired anyway. A periodic
--  cleanup keeps the table small:
--
--      DELETE FROM blacklisted_tokens WHERE created_at < NOW() - INTERVAL 2 DAY;
--
--  SAFETY
--  ------
--  Creates a new table only. Nothing existing is touched. Re-runnable.
--
--  TO APPLY
--  --------
--    mysql -u root -p jl_jewellers_erp < database/migrations/2026-08-13_07_blacklisted_tokens.sql
-- =====================================================================

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
    blacklist_id INT NOT NULL AUTO_INCREMENT,
    -- A JWT is well over 255 characters once it carries a payload.
    token        VARCHAR(512) NOT NULL,
    created_at   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blacklist_id),
    -- INSERT IGNORE in the logout handler relies on this being unique.
    UNIQUE KEY uq_blacklisted_token (token),
    KEY idx_blacklisted_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
