# Changelog

## 2026-07-18 10:14 UTC — [CC] Claude Code

- **Updated:** `agent_docs/CURRENT_APP/FIX001/RETROSPECTIVE.md` — finalized: FIX-001 CLOSED, disposition PASS; reload-transcript display BLOCKED-UPSTREAM (wrapper /get_history latent v1 defect) → transfers to BIM-002 gate N7
- **Created:** `agent_docs/RESPONSES/response_2026-07-18_161419_fix001-final-disposition.md` — full ruling record
- **Updated:** `RECOVERY.md`, `session_2026-07-18.md` — FIX-001 CLOSED per Architect final disposition on Coordinator evidence
- **Reason:** FIX-001 final disposition directive (2026-07-18)

## 2026-07-18 07:13 UTC — [CC] Claude Code

- **Updated:** `src/store/chatStore.ts` — FIX-001: persist-wrapped (key `adk-session-map`, partialize → `agentSessions` only, SSR-safe); message content never persisted
- **Updated:** `src/app/(cyberize)/chat/ChatPageContent.tsx` — mount effect merges fetched ∪ persisted sessions (persisted wins per-key while profileService is mocked — Architect defect amendment 08:42 UTC; revisit when profileService goes real) instead of blind replace
- **Created:** `src/__tests__/chat/chatStore.persist.test.ts` — F4/F5 gates: round-trip, partialize fence, hydration, corrupt-degrade, SSR guard
- **Reason:** FIX-001 (Session Pointer Persistence) — kills the BIM-001 G6 reload bug; approved plan + Architect rulings (persist-wrap ACCEPTED, mount-merge ACCEPTED)

## 2026-07-17 09:08 UTC — [CC] Claude Code

- **Updated:** `agent_docs/CURRENT_APP/BIM001/RETROSPECTIVE.md` — finalized at module close: all gates green, field notes (Grammarly hydration false alarm, cold-backend 500 vs sentinel, session_id fallback), 4 candidate lessons proposed
- **Updated:** `session_2026-07-17.md`, `RECOVERY.md` — BIM-001 CLOSED per Coordinator confirmation
- **Reason:** Coordinator confirmed all manual gates (G3–G6, G8) green — BIM-001 close-out directive

## 2026-07-16 13:27 UTC — [CC] Claude Code

- **Created:** `src/app/api/agent/run/route.ts`, `src/app/api/agent/history/route.ts` — BIM-001 thin proxy routes to the ADK wrapper
- **Updated:** `src/services/chatService.ts` — live mode behind `NEXT_PUBLIC_CHAT_MODE` (mock default intact); BACKEND_SWAP_NOTES rewritten to the route-handler seam + D1(b) sentinel
- **Updated:** `.env.example` — added `ADK_WRAPPER_URL` (placeholder) and `NEXT_PUBLIC_CHAT_MODE=mock`
- **Reason:** BIM-001 "Prove the Wire" — approved implementation plan (`agent_docs/RESPONSES/response_2026-07-16_191653_bim001-implementation-plan.md`)
