# Cyberize Agentic Automation

**A Next.js harness for operating, configuring, and conversing with a multi-agent fleet through a human-in-the-loop UI.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/Jest-232%20passing%20%2F%2031%20suites-C21325?logo=jest&logoColor=white)](#verify-the-build)
[![Supabase](https://img.shields.io/badge/Supabase-auth%20%2B%20roles-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

---

## Why This Exists

The original ADK harness ran through a Streamlit frontend deployed in Google Cloud. This project replaces that with a modern, maintainable Next.js application that can grow from a personal R&D harness into a production-grade operator console.

The core architectural decision is a **mode-flagged service seam**: every external integration point (chat, history, agent instructions) is wired behind a `NEXT_PUBLIC_CHAT_MODE=live` flag. In `mock` mode the UI runs deterministically against seeded fixtures, so features can be developed and demonstrated without a live backend. In `live` mode the same components call internal Next.js API routes that speak directly to an ADK bundle and Google Cloud Storage. The components never change when the backend swaps.

Hand-built end to end; developed and maintained through the App Factory, an AI-augmented delivery methodology.

---

## Screenshots

| | |
|---|---|
| ![Home page with role-aware quick-launch tiles](https://res.cloudinary.com/dyb0qa58h/image/upload/v1785505503/ADK%20NEXTJS%20FRONTEND/Screenshot_from_2026-07-27_09-44-01_dzb2sg.png) | ![Mission Control per-agent instruction editor](https://res.cloudinary.com/dyb0qa58h/image/upload/v1785505504/ADK%20NEXTJS%20FRONTEND/Screenshot_from_2026-07-27_09-49-51_cfabmw.png) |
| *Home page signed in as an admin, showing role-aware quick-launch tiles for Chat, Mission Control, Admin Portal, and Profile.* | *Mission Control lets admins read and edit per-agent instructions for every agent declared in the manifest.* |
| ![Chat with the product agent returning a markdown table](https://res.cloudinary.com/dyb0qa58h/image/upload/v1785505504/ADK%20NEXTJS%20FRONTEND/Screenshot_from_2026-07-27_09-59-54_tutcqi.png) | ![Chat with the GHL CRM agent returning a contact table](https://res.cloudinary.com/dyb0qa58h/image/upload/v1785505504/ADK%20NEXTJS%20FRONTEND/Screenshot_from_2026-07-27_10-16-51_bog9ti.png) |
| *Chat with the product agent, returning a markdown table with product names, prices, and descriptions.* | *Chat with the GHL CRM agent, returning a markdown contact table from a CRM integration.* |

---

## What's Inside

- **Manifest-driven agent roster** — `config/agents.manifest.json` is the single source of truth for bundles and agents; `src/config/manifest.ts` validates it at module load and drives the sidebar, route guards, and bundle resolution.
- **Mode-flagged chat service** — `src/services/chatService.ts` swaps between deterministic mock responses and live ADK `api_server` calls via `NEXT_PUBLIC_CHAT_MODE=live`, without touching any component.
- **Native ADK connector** — `/api/agent/run` resolves the bundle env var from the manifest and talks directly to the ADK bundle's `api_server`; the retired Python wrapper path is gone.
- **Multi-session chat with cross-agent retention** — Zustand stores only the agent→session bookmark in `localStorage`; message content reloads per agent from history so each agent keeps its own thread.
- **Mission Control instruction editor** — `/mission-control` reads and writes per-agent instructions through `/api/agent/instructions`; live mode persists to Google Cloud Storage with backup-before-write enforced server-side.
- **Role-gated portal shell** — Supabase SSR plus server-side role resolution against a `user_roles` table guards the `(cyberize)`, `(admin)`, `(members)`, and `(superadmin)` route groups.
- **Read-aloud and message actions** — each chat message supports copy and spoken playback, including code-block and table handling.

---

## Stage / Status

This is a **local R&D harness** — not deployed. It is structured as a Frontend-First Module: auth and role enforcement are real; the ADK backend connection and GCS instruction store are wired behind the `mock/live` mode flag so the UI can be developed and demonstrated without a live backend.

---

## Quickstart

Requires **Node.js 24** (managed via `.nvmrc` or your version manager) and a Supabase project for auth.

```bash
git clone https://github.com/ahmedmusawir/adk-agent-harness-nextjs-frontend-v1.git
cd adk-agent-harness-nextjs-frontend-v1

npm install

cp .env.example .env.local
# Fill in your Supabase URL, publishable key, site URL, and (for live mode) bundle/GCS values.
```

Start the dev server:

```bash
npm run dev
```

### Verify the build

> The production build needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to prerender the `/demo` page. Set any non-empty values in `.env.local` before running `npm run build`.

```bash
npm run build      # → 24 routes generated
npx tsc --noEmit   # → clean
npm test           # → 31 suites / 232 tests passed
```

---

Built by **[Ahmed Musawir](https://github.com/ahmedmusawir)** — Software Architect & AI Engineer — through the App Factory, an AI-augmented delivery methodology.
