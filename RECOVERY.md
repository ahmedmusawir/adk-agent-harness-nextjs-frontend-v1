# Recovery State

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

Pending: **Coordinator** —
1. Docs commit (file list in session log 19:52 / on-screen close-out message).
2. **N11 ceremony:** pause the wrapper's Cloud Run service → one more live message →
   wrapper formally retired with honors.
3. Rulings on lesson candidates L-a…L-d (filenames proposed in BIM002/RETROSPECTIVE.md).

Next step: FIX-002 authoring (F01–F03) when the Architect picks it up. Carried items:
F04 (ADK semantics), merge-precedence revisit when profileService goes real, R2 public
endpoints tracked.

---

## 3-second summary

- BIM-001 CLOSED · FIX-001 CLOSED · **BIM-002 CLOSED (ceremony pending)** — UI →
  routes → ADK bundle, no middleman; wrapper convicted post-mortem on the history bug.
- Board: 25 suites / 174 tests, tsc clean, build clean. Docs commit + N11 = Coordinator.
- Only known breakage: `npm run lint` (pre-existing B1, out of scope).
