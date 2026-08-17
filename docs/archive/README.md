# Archive — historical records

**You do not need anything in this folder to work on the project.**

These are records of work that is finished. They are kept because they explain
*why* things are the way they are, not what to do next.

Start at **[START-HERE.md](../../START-HERE.md)** instead.

| File | What it is | Why it's here |
|---|---|---|
| `MERGE_PLAN.md` | The plan for merging six branches into one codebase | The merge is done. The four decisions it settled are summarised in START-HERE |
| `MERGE_LOG.md` | Per-module record of that merge, with the endpoint results proving each one | An audit trail of completed work, ~1,650 lines |
| `FEATURE_STATUS_AUDIT.md` | Code-verified feature status, **as of 2026-08-13** | **Out of date — see the warning below** |

## Warning about `FEATURE_STATUS_AUDIT.md`

It is a **snapshot from 2026-08-13**, before the merge completed. It has not been
updated since, and several things it reports as broken are fixed:

- It lists the JWT signing bug (`B4`) as a live problem. It is fixed.
- It reports `.env` committed with live credentials as current state.
- Its **📦 Stranded** category means "real code, only on an unmerged branch."
  Those branches are merged now, so nothing is stranded any more.

Reading it as current status will send you after bugs that no longer exist.

For what is actually true today, use
**[START-HERE.md](../../START-HERE.md)** and
**[REMEDIATION_BACKLOG.md](../../REMEDIATION_BACKLOG.md)** — the backlog is
maintained and was re-baselined on 2026-08-17.
