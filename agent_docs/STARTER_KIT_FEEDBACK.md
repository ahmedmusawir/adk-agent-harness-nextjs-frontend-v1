# Starter Kit Feedback

> Findings discovered while bootstrapping a new project on top of Stark SaaS Starter v0.4.1.
> Each entry is something to consider fixing at the **kit baseline** so future projects don't repeat the work.
> Written during Cyberize Agentic Automation conversion (Run 001), 2026-05-27.

---

## 🧠 Agent Lessons (Read Before Starting Work)

> These are behavioral rules learned from real mistakes during Factory runs. Read them BEFORE Phase 0 Discovery. They save time and trust.

### Lesson 1 — Framework conventions: code-on-disk + framework docs > stale kit docs

**Rule:** When the kit's documentation references a framework file/function name that doesn't match the on-disk code, check the framework's current docs FIRST. Don't diagnose it as a misnaming bug.

**Why (Run 001):** I read `STARTER_PROJECT_OVERVIEW.md` line 26 saying `src/middleware.ts`, found `src/proxy.ts` on disk, and proposed renaming as a "critical bug." Wrong — Next.js 16 renamed the convention (`middleware` → `proxy`). The kit was correct; the doc was stale relative to the kit's actual Next.js 16 baseline. Had to revert mid-Phase-0.5 and rewrite the feedback note.

**How to apply:** For ANY doc-vs-code discrepancy involving framework conventions (file names, export names, folder structures), open the framework's official docs for the in-use version before declaring a bug or proposing a rename. Kit overview docs can lag the actual baseline by a major framework version.

---

### Lesson 2 — The kit's auth is complete; don't wrap it in a service

**Rule:** Do NOT author `src/services/authService.ts` as a wrapper around the kit's existing auth stack. UI components consume the kit's auth primitives directly: `useAuthStore`, `src/utils/supabase/client.ts`, `/api/auth/*` routes, `protectPage` guard.

**Why (Run 001):** The Factory module's DATA_CONTRACT §2.1 prescribed an `authService` with `signIn/signOut/getCurrentUser`. I drafted a Phase 2 plan to author it as a wrapper. Tony pushed back as I was about to write the file — the kit already has complete tested auth (Supabase SSR + RBAC + RLS + DB trigger + three working portals). A service wrapper would be pure indirection without abstraction value. The DATA_CONTRACT spec was generic; it didn't know how complete the kit's auth would be.

**How to apply:** Before authoring any service the DATA_CONTRACT prescribes — especially auth-adjacent — check what the kit already provides as wired infrastructure. If the kit provides it: components consume the kit's primitives directly. Service layer is reserved for what the kit does NOT provide (chat, agent profiles, agent instructions, domain operations). On this kit, treat DATA_CONTRACT §2.1 (`authService`) as satisfied by kit infrastructure.

---

## 🟡 Doc Drift: `STARTER_PROJECT_OVERVIEW.md` Calls Middleware `middleware.ts`, But Next.js 16 Renamed It

**Symptom:** `STARTER_PROJECT_OVERVIEW.md` line 26 says: *"`src/middleware.ts` — calls `updateSession(request)` on every request"*. The actual file in the kit is `src/proxy.ts`. Reading the doc first, then the kit, I diagnosed this as a misnaming bug and proposed renaming `proxy.ts` → `middleware.ts`. **I was wrong.**

**What's actually going on:** Next.js 16 renamed the convention. Build output confirms:

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
   Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
```

So `proxy.ts` is the **correct modern convention** for Next.js 16. The kit is right. The doc is stale relative to the kit's actual Next.js 16 baseline.

**Fix at kit source:**
- Update `STARTER_PROJECT_OVERVIEW.md` line 26 to reference `src/proxy.ts` (the function `proxy`) instead of `src/middleware.ts` (`middleware`).
- Add a one-line note that Next.js 16+ uses `proxy.ts`; pre-v16 used `middleware.ts`.

**Lesson recorded for the agent:** When a doc and the code diverge, read the framework docs before assuming the code is wrong. The kit is closer to source-of-truth than the overview doc when it comes to framework conventions.

---

## 🟡 `tsconfig.json` Doesn't Exclude `agent_docs/**`

**Symptom:** `npm run build` fails type-check because `agent_docs/CURRENT_APP/.../skills/stark-frontend-first/templates/mock-data.template.ts` has TODO-comment imports (`import type { /* TODO */ } from '@/types'`) that don't resolve. The build trips on them because the kit's tsconfig includes everything matching `**/*.ts` and only excludes `node_modules`.

**Why this matters:** `agent_docs/` is documentation, factory module templates, and skill scaffolds — never application source. Including it in the TypeScript compile sweep means template files (with intentional TODO placeholders) become build blockers.

**Fix at kit source:** Add `"agent_docs/**"` to the `exclude` array in `tsconfig.json`. One-line change. Already applied in this project; should be in the kit baseline.

---

## 🟡 No `.env.example`, Build Fails On First Try Without Manual Setup

**Symptom:** Running `npm run build` on a fresh checkout fails during static-page generation:

```
Error occurred prerendering page "/demo"
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

The kit has no `.env.example` or `.env.local.template` file. A new project agent has no signal about which env vars must be set, what they're named, or what shape values take.

**Fix at kit source:** Ship a `.env.example` at the repo root listing all required variables with placeholder values and brief comments. The kit actually references four env vars (verified via grep of `src/`):

- `NEXT_PUBLIC_SUPABASE_URL` — project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — browser-exposed key (Supabase's new naming for the anon key)
- `SUPABASE_SECRET_KEY` — server-side service-role key (Supabase's new naming for the service_role key)
- `NEXT_PUBLIC_SITE_URL` — site URL for auth redirects

Note the kit uses Supabase's **newer key naming convention** (`PUBLISHABLE_KEY` / `SECRET_KEY`) rather than the older `ANON_KEY` / `SERVICE_ROLE_KEY`. The `.env.example` should match what the code actually reads.

The kit's working rules should also instruct: "Step 1 of project setup is `cp .env.example .env.local` and fill values."

**Already applied in this project:** `.env.example` created at repo root during Run 001.

---

## 🟡 Bootstrap Residue Problem

**Symptom:** This repo is the Stark SaaS Starter kit, but it carries leftovers from a previous QR/posts project that was built on top of it. Files contaminating the baseline:

- `package.json` `"name": "qr-next13-supabase-v1"` — should be generic / per-project
- `src/services/{postServices, jsonsrvPostServices}.ts`
- `src/store/{useJsonsrvPostStore, usePostStore}.ts`
- `src/types/posts.ts`
- `src/components/{posts, jsonsrv}/`
- `src/components/admin/AdminBookingList.tsx`, `src/components/members/MemberEventList.tsx`
- `src/app/(admin)/{admin-booking, users}/`, `src/app/(members)/booking/`
- `src/app/api/auth/ghl/` (GoHighLevel integration from prior project)
- `src/utils/jsonSrv/`
- `RECOVERY.md` containing closed-project state on project handoff

**Root cause:** The kit was used to build a prior project, then the same directory was handed off as the seed for a new project. There's no clean "extract the kit" step.

**Fix at process source (recommended workflow):**
1. **Keep one pristine `stark-saas-starter` repo** (e.g., as a git template repo or template branch). Never build a project directly inside it.
2. **For each new project:** clone the pristine starter to a new directory, then customize. The pristine repo stays clean.
3. **Add to `STARTER_PROJECT_OVERVIEW.md`:** a "Starting a New Project" section with these steps:
   - Rename `package.json` `"name"` to project slug
   - Reset `RECOVERY.md` to a fresh state
   - Drop new project module into `agent_docs/CURRENT_APP/`
   - Update the bridge pointer in root `CLAUDE.md` (Active Project Module section)
   - Confirm `agent_docs/SESSIONS/` is empty (or archive prior)

---

## 🟡 RECOVERY.md Lifecycle Gap

**Symptom:** On session start, `RECOVERY.md` contained "Last action: Session close-out... PROJECT COMPLETE. NEW PROJECT — this project is closed." This is the prior project's terminal state. A fresh project on this seed has no signal that `RECOVERY.md` is stale.

**Fix at kit source:**
- Document a **project-end protocol** in the kit: when a project ships, archive `RECOVERY.md` (e.g., move to `agent_docs/COMPLETED_APPS/<project>/RECOVERY_FINAL.md`) and reset the project root file to a clean placeholder template.
- Or ship the kit with a placeholder `RECOVERY.md` that explicitly says "No active project. Begin Phase 0 of the active module."

---

## 🟡 `agent_docs/SESSIONS/` Bootstrap Gap

**Symptom:** Kit's working rules say *"Read latest file in agent_docs/SESSIONS/ — full session history"*. But on a fresh project, the folder is empty and there is no latest file. The agent's recovery instruction has no anchor.

**Fix at kit source:**
- Either pre-seed `agent_docs/SESSIONS/` with a "SESSION_TEMPLATE.md" placeholder that documents the file format and explicitly says "no prior sessions yet — this is Session 1 territory"
- Or update the kit's working rules to say "if SESSIONS/ is empty, this is a fresh project; skip this step."

---

## 🟡 Missing Dependencies for Common UX Patterns

**Symptom:** Most new projects need at least one of: markdown rendering, toast notifications, syntax-highlighted code blocks, safe HTML rendering. The kit doesn't ship any of these.

**Currently missing from `package.json`:**
- `react-markdown` + `remark-gfm` (markdown bodies, tables — needed for any content-display app: docs, blog, chat, comments)
- `react-syntax-highlighter` (code blocks)
- `html-react-parser` (the doctrine-mandated alternative to `dangerouslySetInnerHTML`)
- `sonner` (the Shadcn toast lib; kit has `@radix-ui/react-toast` but the Shadcn `sonner` is the more common pick)

**Fix at kit source:**
- Add these as default dependencies, OR
- Ship a `npm run install:markdown` script that adds them on demand, OR
- Document a "common add-ons" section in `STARTER_PROJECT_OVERVIEW.md`

The dual cost of not having them: each project repeats the install and the integration boilerplate (custom renderers, syntax-highlighter theme picks, etc.).

---

## 🟡 Doctrine Drift: Vitest vs Jest

**Symptom:** Module-level doctrine (e.g., the Factory's project CLAUDE.md template) defaults to Vitest, but the kit reality is Jest 30 with `ts-jest`, `@types/jest`, `jest-environment-jsdom` and an existing 81-test suite. New projects following the doctrine literally would either:
- Try to install Vitest, conflict with Jest, and break the existing suite
- Or quietly switch to Jest without documenting why, drifting from doctrine

**Fix at doctrine source:**
- Update the Factory module template (`agent_docs/CURRENT_APP/<module>/_project/CLAUDE.md`) to reference Jest as the standard, with a "swap to Vitest only if the project requires it" note.
- Or, if Vitest is genuinely preferred, plan a kit migration with the test suite ported.

---

## 🟡 Login Page Branding Is Per-Project

**Symptom:** Every new project will want to rebrand `/auth` (e.g., "Mission Control Login" for Cyberize, something else for the next app). Currently this means editing `src/components/auth/{AuthTabs, LoginForm, RegisterForm}.tsx` directly per project, which forks the kit's code.

**Fix at kit source:**
- Parameterize the title and tagline via a config file (`src/config/auth-branding.ts` or env vars).
- Or document the per-project branding override pattern: "create `src/app/(auth)/auth/page.tsx` to wrap AuthTabs with project-specific branding instead of editing AuthTabs directly."

---

## 🟢 Things That Already Work Well

For balance — these don't need fixing, they're working:

- The three-portal scaffolding (`(superadmin)`, `(admin)`, `(members)`) is a clean foundation
- `protectPage` + role enum + DB trigger pattern is well-thought-out
- Two-file page pattern (`page.tsx` wrapping `PageContent.tsx`) scales well
- Three Supabase clients (`server`, `admin`, `client`) with explicit RLS-respecting vs bypassing roles is sound
- The 81-test baseline is a strong canary for regressions
- The `STARTER_PROJECT_OVERVIEW.md` doc is excellent — explicit, opinionated, names landmines

---

## Recommended Priority Order for Kit Patches

1. **`.env.example` + setup instructions** — currently every new project hits a cryptic build failure on first try. One file fixes onboarding for every future project.
2. **Pristine starter repo + clone workflow** — biggest leverage; eliminates residue contamination entirely.
3. **`tsconfig.json` exclude `agent_docs/**`** — one-line change; otherwise build fails on factory module template files.
4. **Update `STARTER_PROJECT_OVERVIEW.md` line 26** — say `proxy.ts` (Next.js 16), not `middleware.ts`. Add a parenthetical noting the rename.
5. **RECOVERY.md lifecycle** — small fix, big clarity win.
6. **Common dependencies (markdown stack)** — small effort, saves time every project that does any content rendering.
7. **Doctrine alignment on Jest** — clarifies one ambiguity in the Factory module template.
8. **Login branding parameterization** — quality of life, lower urgency.

---

## Process Note

This file accumulates findings. When a kit-level fix lands, mark the entry **RESOLVED** with a date and the commit/PR reference. Future projects read this file during their own Phase 0 to confirm whether each issue still applies.

🥄 *Stark Industries — Continuous Improvement Of The Factory Itself.*
