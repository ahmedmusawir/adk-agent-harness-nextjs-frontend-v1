# Changelog

## 2026-07-17 09:08 UTC — [CC] Claude Code

- **Updated:** `agent_docs/CURRENT_APP/BIM001/RETROSPECTIVE.md` — finalized at module close: all gates green, field notes (Grammarly hydration false alarm, cold-backend 500 vs sentinel, session_id fallback), 4 candidate lessons proposed
- **Updated:** `session_2026-07-17.md`, `RECOVERY.md` — BIM-001 CLOSED per Coordinator confirmation
- **Reason:** Coordinator confirmed all manual gates (G3–G6, G8) green — BIM-001 close-out directive

## 2026-07-16 13:27 UTC — [CC] Claude Code

- **Created:** `src/app/api/agent/run/route.ts`, `src/app/api/agent/history/route.ts` — BIM-001 thin proxy routes to the ADK wrapper
- **Updated:** `src/services/chatService.ts` — live mode behind `NEXT_PUBLIC_CHAT_MODE` (mock default intact); BACKEND_SWAP_NOTES rewritten to the route-handler seam + D1(b) sentinel
- **Updated:** `.env.example` — added `ADK_WRAPPER_URL` (placeholder) and `NEXT_PUBLIC_CHAT_MODE=mock`
- **Reason:** BIM-001 "Prove the Wire" — approved implementation plan (`agent_docs/RESPONSES/response_2026-07-16_191653_bim001-implementation-plan.md`)
