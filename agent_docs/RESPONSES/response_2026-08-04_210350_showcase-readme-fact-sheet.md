# Fact Sheet — `adk-agent-harness-nextjs-frontend-v1`

**Date:** 2026-08-04 21:03 UTC · **Branch:** `main` · **Skill phase:** 2 (Facts) + 3 (Assets answered)

---

## Verified numbers

| Check | Command | Result |
|---|---|---|
| **Next.js version** | `npm run build` header | 16.2.6 (installed; package.json declares `^16.2.1`) |
| **React version** | `package.json` | 19.2.4 |
| **TypeScript version** | `package.json` | ^5 |
| **Tailwind CSS version** | `package.json` | 3.4.1 |
| **Build (with env)** | `NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=… NEXT_PUBLIC_SITE_URL=… npm run build` | ✅ pass, 24 routes generated |
| **Build (cold clone)** | `npm run build` without `.env.local` | ❌ fails at `/demo` prerender — requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| **Typecheck** | `npx tsc --noEmit` | ✅ clean (no output, exit 0) |
| **Tests** | `npm test -- --silent` | ✅ 31 suites / 232 tests passed |
| **Production audit** | `npm audit --omit=dev` | 10 advisories (5 moderate, 5 high) — badge omitted per operator decision |
| **Total audit** | `npm audit` | 13 advisories (1 low, 5 moderate, 7 high) |

## Route structure (from `find src/app` + build output)

- **App Router pages:** 15 (`/`, `/auth`, `/chat`, `/mission-control`, `/demo`, `/error`, `/template`, `/admin-portal`, `/admin-portal/add-member`, `/admin-portal/edit/[id]`, `/members-portal`, `/members-portal/profile`, `/superadmin-portal`, `/superadmin-portal/add-user`, `/superadmin-portal/edit/[id]`)
- **API routes:** 8 (`/api/agent/run`, `/api/agent/history`, `/api/agent/instructions`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/signup`, `/api/auth/confirm`, `/api/auth/superadmin-add-user`)
- **Build reports:** 24 total routes including `_not-found`

## Architecture map (read from code)

- **Frontend:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS + Radix UI primitives, `lucide-react` icons.
- **State:** Zustand (`useChatStore`) for chat UI state; `persist` middleware stores only the agent→session bookmark and selected agent in `localStorage` (message content is in-memory only).
- **Auth:** Supabase SSR + server-side role resolution against a `user_roles` table. Layout-level `protectPage` guards route groups `(cyberize)`, `(admin)`, `(members)`, `(superadmin)`.
- **Agent roster:** `config/agents.manifest.json` is the single source of truth; `src/config/manifest.ts` validates it at module load. Six agents across two bundles (v1 remote, v2-local harness).
- **Chat seam:** `src/services/chatService.ts` is mode-flagged via `NEXT_PUBLIC_CHAT_MODE=live`. Mock mode returns deterministic agent-voiced responses; live mode posts to `/api/agent/run`, which resolves the bundle env var and calls the ADK bundle's `api_server` directly (native connector).
- **History seam:** `chatService.getHistory` fetches per-agent session history from `/api/agent/history` in live mode.
- **Mission Control seam:** `src/services/instructionsService.ts` is mode-flagged. Live mode reads/writes per-agent instructions via `/api/agent/instructions`, which uses Google Cloud Storage with ADC credentials and enforces backup-before-write.
- **No Next.js middleware file.** Auth guards are layout-level server checks.

## Docs inventory

- No `docs/` directory exists in the repo.
- Application context lives in `agent_docs/` (factory internal; stays in tree per operator decision, not linked in README).

## Assets (operator-supplied)

- **4 Cloudinary screenshots** in exact order, rendered as a 2-column table.
- **No architecture diagram.**
- **No walkthrough video.**
- **Status:** local development / not deployed (filled from disk: `.env.example` default `http://localhost:3000`, no production URL in code).
- **Ownership:** operator's personal/Cyberize R&D; no client constraints.
- **Claims to avoid:** never describe the system as autonomous; it is a human-in-the-loop harness.

## Screenshot contents (vision-verified)

1. **09:44:01** — Public home page while signed in as `admin1@email.com`: hero "Cyberize Agentic Automation", status pill "All systems operational", Quick Launch tiles for Chat, Mission Control, Admin Portal, Profile.
2. **09:49:51** — Mission Control agent instruction editor: sidebar lists all six agents; main panel shows per-agent instruction textareas for `greeting_agent` and `calc_agent`.
3. **09:59:54** — Chat with `product_agent`: user asks for a product list; assistant returns a markdown table of DockBloxx products with prices and descriptions.
4. **10:16:51** — Chat with `ghl_mcp_agent`: assistant returns a markdown table of CRM contacts with names, emails, phones, and tags. **⚠️ Review flag:** this screenshot contains names, email addresses, and phone numbers that appear to be production-like; verify these are acceptable to publish.

## Unverifiable / deferred

- None from this phase; all numbers were earned this session.
