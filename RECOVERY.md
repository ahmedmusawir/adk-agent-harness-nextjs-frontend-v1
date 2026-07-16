# Recovery State

Active: **BIM-001 — "Prove the Wire" (Backend Integration Module)**
Date: 2026-07-16
Status: **NOT STARTED — oriented, awaiting Coordinator go for Stage A (Recon).**

Branch: `main`

---

## 3-second summary

- **Run 001 (FFM) is DONE and on `main`.** The Next.js frontend-first phase shipped:
  ChatGPT-style UI, 121 tests / 20 suites passing, `tsc --noEmit` clean, `npm run build`
  clean (21 routes), all four services mocked behind a Phase-2-clean swap interface.
- **BIM-001 is the new active module** — the backend mirror of the FFM. Mission: connect
  the Next.js chat domain to the live Python ADK wrapper on Cloud Run via new server-side
  route handlers, behind a mode flag, with mock mode preserved one env flip away.
- Nothing in BIM-001 has been executed yet. We are at the very front of **Stage A**.

## Current working tree (uncommitted on `main`)

- `_SKILLS/` — new (contains the `stark-recon` skill that powers Stage A)
- `agent_docs/CURRENT_APP/BIM001/` — new (the BIM-001 module folder + manager CLAUDE.md)
- `agent_docs/CURRENT_APP/README.md` — new
- `supabase/CLAUDE.md` — new
- `CLAUDE.md` — modified

## BIM-001 structure (two hard-gated stages — NEVER both in one session)

```
STAGE A — RECON (read-only)          STAGE B — IMPLEMENTATION (code)
run stark-recon skill + addendum ─▶  STOP ─▶ Architect verdict ─▶ Tony authorizes ─▶ build
```

- **Manager file (read first):** `agent_docs/CURRENT_APP/BIM001/CLAUDE.md`
- **Stage A mission:** `agent_docs/CURRENT_APP/BIM001/STAGE_A_RECON_MISSION.md`
- **Stage A engine:** `_SKILLS/stark-recon-skill-v1.1/stark-recon/` (read its CLAUDE.md
  then SKILL.md; six phases, five evidence labels, disk wins, Surprises section mandatory)
- **Stage B files (do NOT open until authorized):** `STAGE_B_MODULE_BRIEF.md`,
  `STAGE_B_DATA_CONTRACT_AMENDMENT.md`

## Stage A — what it allows (from manager Standing Rulings)

1. Read-only git only: `status --porcelain`, current branch, HEAD short-SHA (before+after).
2. Exactly ONE network call: `GET {ADK_WRAPPER_URL}/health` — URL supplied by Coordinator
   in-session, never committed. No POSTs (they create sessions and cost money).
3. Machine-state change: dependency install only (`npm ci` preferred) so baseline runs.
4. Recon report → `agent_docs/recon/` per skill Output Contract, + a 3-line pointer file in
   `agent_docs/CURRENT_APP/BIM001/` naming the report path and recommended verdict.

## Suggested next operator step

- Coordinator (Tony) types the launch line, then supplies the wrapper URL when asked:
  > "Claudy — read `agent_docs/CURRENT_APP/BIM001/CLAUDE.md` and begin Stage A."
- Claudy announces scope in ONE message (skill phases + addendum sections + baseline
  commands + request for wrapper URL), gets the nod, runs recon, writes the report, prints
  headline + recommended verdict, updates the session log, and **STOPS**. No Stage B.

## Stage B entry conditions (all four, no exceptions)

1. Stage A report on file
2. Architect's binding verdict = GO (or AMEND with amendments applied)
3. Coordinator ruled on conflict D1 (sentinel `session_id` type — see Amendment §A1.4)
4. Coordinator says, in plain words, "Stage B is authorized"

---

_Superseded the 2026-05-29 Run-001 recovery snapshot. Run 001 is complete and merged; this
file now tracks BIM-001._
