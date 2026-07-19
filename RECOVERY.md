# Recovery State

Last action: **BIM-003 Engineer side COMPLETE — green board + ACCEPTANCE_SPEC** —
2026-07-19 18:42. Agent roster is manifest-driven: `config/agents.manifest.json`
(2 bundles, 5 agents, env-var NAMES only) + validated loader `src/config/manifest.ts`;
routes 400 unknown-agent / 500 naming-the-var; sidebar renders labels; `AgentName`
union retired. Board: baseline 28/197 → **29 suites / 213 green**, tsc clean, build
clean. M-G1 grep proof empty. Zero git/cloud.

Pending: **Coordinator** —
1. ⚠️ Env migration BEFORE live testing: `.env.local` rename `ADK_BUNDLE_URL` →
   `ADK_BUNDLE_URL_V1`.
2. Manual gates via `agent_docs/CURRENT_APP/BIM003/ACCEPTANCE_SPEC.md` §3 (four-line
   test, dual-bundle, error surfaces, loud-failure, mock flip).
3. Commits BIM-003a/b/c/d (file lists in
   `agent_docs/RESPONSES/response_2026-07-19_184207_bim003-execution-result.md`).
4. QA bug report for FIX-002/FEAT-001 still incoming — sequence it vs BIM-003 commits
   as you see fit (BIM-003 overlap: chatStore one line + route tests only).

Earlier today (committed in `f03f08c`): FIX-002 + FEAT-001 engineer-complete; their
RETROSPECTIVEs + module closes await the QA report. BIM002 lesson rulings L-a…L-d and
F04 (ADK semantics) still open.

--- (prior state below) ---

Last action: **FEAT-001 Engineer side COMPLETE — green board** — 2026-07-19 17:29.
Read-aloud rebuilt to spec through the new v2-seed `src/utils/speech.ts` (cleaned
prose, "Code block skipped." announcements, single-owner cancel semantics, unmount
cancel). Drift recorded: message-copy + code-copy already existed on disk (brief said
decorative); input-copy ruled SKIP. Board: **28 suites / 197 tests green**, tsc clean,
build clean. Field note: Tailwind content scanner vs regex char classes (build-only
failure, fixed). Commits FEAT-001a/b + manual script:
`agent_docs/RESPONSES/response_2026-07-19_172910_feat001-execution-result.md`.

ALSO awaiting Coordinator (from earlier today): **FIX-002** manual gates X1–X5 +
commits FIX-002a/b/c (`response_2026-07-19_141545_fix002-execution-result.md`).
FEAT-001 and FIX-002 files have ZERO overlap — stage independently.

Prior context: FIX-002 close-out below.

--- 

Earlier: **FIX-002 Engineer side COMPLETE — green board** — 2026-07-19 14:15.
QA triple-fix done: F01 selection persists (`partialize` + `selectedAgent`), F02
"Loading conversation…" state on history fetches, F03 sentinel reads "Agent Service".
Baseline 25/174 → **26 suites / 180 green**, tsc clean, build clean. X6: exactly 2
pre-existing test files touched at sanctioned pins. Zero git/cloud by Engineer.

Pending: **Coordinator** — manual gates X1–X5 (script in
`agent_docs/RESPONSES/response_2026-07-19_141545_fix002-execution-result.md`), then
commits FIX-002a/b/c + docs (file lists in the same artifact). RETROSPECTIVE.md at
module close. Also still open: lesson rulings L-a…L-d (BIM-002), F04 (deferred, ADK
semantics), N11-evening docs commit if not yet made.

--- (prior state below) ---

Last action: **BIM-002 Engineer side COMPLETE — green board** — 2026-07-18 17:20. The
wrapper's brains are ported: both agent routes now speak native ADK api_server protocol
via `src/app/api/agent/_lib/adk.ts` (session bootstrap, not-found→create→retry-once,
reversed-event response selection per FLAG-1 `content.role === "model"`, history
normalization). `ADK_WRAPPER_URL` fully retired from code + `.env.example` (R1);
`ADK_BUNDLE_URL` is the one server-only var. Board: baseline 24/149 → **25 suites /
174 tests green**, tsc clean, build clean, N9 advisory grep clean. Zero git/cloud ops
by Engineer.

**BIM-002 CLOSED 2026-07-18 19:52 (pending N11 ceremony).** Coordinator + Stark QA
confirmed all gates green: N4 · N5 · N6 (supplied-id creation adjudicated spec-correct
per A2.3) · **N7 OUTCOME A** — the T0 native probe returned events, convicting the
wrapper's /get_history as the root cause of the lifetime empty-history defect;
reload-history fixed free by the port · N8 · N3 · N9. jest.config deviation RATIFIED
(QA factory lesson: config files conditionally writable when reported).
RETROSPECTIVE.md written (4 lesson candidates PROPOSED, not written). QA findings
F01–F03 routed to future FIX-002; F04 deferred pending ADK semantics.

**N11 CEREMONY COMPLETE — 2026-07-18 evening (Coordinator-confirmed).** The wrapper's
Cloud Run service is paused and the system runs without it. The wrapper is formally
retired with honors. **BIM-002 is fully CLOSED.**

Pending: **Coordinator** —
1. Docs commit if not yet made (file list in session log 19:52 entry).
2. Rulings on lesson candidates L-a…L-d (filenames proposed in BIM002/RETROSPECTIVE.md).

Next step: FIX-002 authoring (F01–F03) when the Architect picks it up. Carried items:
F04 (ADK semantics), merge-precedence revisit when profileService goes real, R2 public
endpoints tracked.

---

## 3-second summary

- BIM-001 CLOSED · FIX-001 CLOSED · **BIM-002 CLOSED (ceremony pending)** — UI →
  routes → ADK bundle, no middleman; wrapper convicted post-mortem on the history bug.
- Board: 25 suites / 174 tests, tsc clean, build clean. Docs commit + N11 = Coordinator.
- Only known breakage: `npm run lint` (pre-existing B1, out of scope).
