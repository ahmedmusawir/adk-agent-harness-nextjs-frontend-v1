# Showcase README — Phase 0 Plan

**Skill:** `stark-showcase-readme` · Phase 0 — Orient  
**Repo:** `adk-agent-harness-nextjs-frontend-v1`  
**Remote:** `https://github.com/ahmedmusawir/adk-agent-harness-nextjs-frontend-v1.git`

---

## Observed

- **Repo class:** Lab / harness — with FFM/staged signals. It is a Next.js frontend that replaces a Streamlit ADK harness; has a mock/live chat mode swap point (`NEXT_PUBLIC_CHAT_MODE=mock`), auth via Supabase, and ADK bundle integration.
- **Stack (from `package.json`):**
  - Next.js `^16.2.1`, React `^19.2.4`, React DOM `^19.2.4`
  - TypeScript `^5`, Tailwind CSS `^3.4.1`
  - State: Zustand `^4.5.4`
  - UI: Radix primitives + Tailwind merge + `lucide-react`
  - Auth/DB: `@supabase/ssr`, `@supabase/supabase-js`
  - AI/Cloud: `@google-cloud/storage`, ADK bundle endpoints
  - Payments: `stripe`
  - Testing: Jest `^30.0.5`, `@testing-library/react`, `@playwright/test`
- **Tree state:** Clean working tree. Last commit `9acd264 skill added`; prior commits carry BIM-002 through BIM-005 work.
- **Existing README:** 3-line stub. No badges, no screenshots, no quickstart, no architecture.
- **Content classes present:**
  - **Factory internals tracked:** `agent_docs/` (APP_FACTORY, CURRENT_APP, LESSONS, RECON, RESPONSES, SESSIONS), `_SKILLS/`, `.claude/skills/`, `RECOVERY.md`, `session_*.md`, `CLAUDE.md`, `WINDSURF.md`, `BACKEND_SWAP_NOTES.md`, `CHANGELOG.md`.
  - **No `docs/` app docs directory.**
  - **No `logs/` or `temp/` directories.**
- **Fence state:** `.gitignore` covers node_modules, Next.js output, `.env*.local`, debug logs, Vercel, TypeScript build info. It does **not** cover `agent_docs/`, `_SKILLS/`, `_design/`, `session_*.md`, `RECOVERY.md`, or `.claude/`.
- **`.env.example`:** Mostly word-style placeholders (`your-project.supabase.co`, `your-instructions-bucket`). Contains `sb_publishable_...` and `sb_secret_...` which are prefix + ellipsis — not the recommended `YOUR_KEY_HERE` word form.

---

## Intended

Per `decision-trees/flow-selection.md`, the tracked factory internals select the **CLEAN-ROOM FLOW**. The current repo is not safe to showcase as-is because lab material is in the shippable set.

**Phases (clean-room variant):**

1. **Phase 0 — Orient** (this artifact). Present plan; await approval.
2. **Phase 1 — Sweep** the current tree using `references/SWEEP_CHECKLIST.md`, label findings with evidence discipline, triage severity, and report. Because factory internals are already tracked, the sweep is expected to surface at least one 🔴 BLOCKER-class finding.
3. **Stop gate #1** — operator decisions on remediation scope.
4. **Clean-room preparation** (if approved): prepare a carve-out tree containing only application code, config, tests, and sanitized `docs/` (if any). Factory internals stay out. Rebuild `.env.example` with word-style placeholders and a new `.gitignore` fence.
5. **Phase 2 — Facts** on the clean tree: run typecheck, test suite, build, audit, and architecture inventory.
6. **Phase 3 — Assets** — request screenshots, diagrams, video URLs, one-liner, and story context.
7. **Stop gate #2** — assets confirmed or explicit build-without-assets instruction.
8. **Phase 4 — Build** README from `templates/README_FACTORY_TEMPLATE.md`, render in chat for review, then write.
9. **Handoff** with `READY FOR COMMIT: [file list]` and copy-paste git command block.

**What I will touch:** Only `README.md`, `.gitignore`, and `.env.example` in the clean-room tree — plus the sweep report artifact.

**What I will not touch:** Application code, routes, services, store logic, dependencies. No git write commands. No deployment.

---

## Unknown

1. Is the GitHub repo currently **public or private**? (Affects whether the clean-room recommendation is mandatory or precautionary.)
2. Is this code **yours to showcase** without client constraints?
3. Is the app **live, staged, or retired**? Affects badges and tense.
4. Any **specific claims** you want made or avoided?
5. Do you want to preserve the **existing stub README** content, or fully replace it?
6. Do you have **screenshots, diagrams, or a walkthrough video**? If not, I will build without them.
7. Are you willing to execute the **clean-room steps** (rotate, rename/privatize old repo, create fresh repo, commit)?

---

## Risks

- **🔴 BLOCKER — Factory internals tracked in the shippable set.** `agent_docs/`, `_SKILLS/`, `.claude/skills/`, `RECOVERY.md`, `session_*.md`, `CLAUDE.md`, etc. are not application code; they are factory/lab material. Per the Two-Repo Rule, this is a clean-room trigger.
- **🟠 HIGH — `.gitignore` does not fence lab material.** Even after deleting/ignoring, if the repo is public the history already exposes it (Album Lesson).
- **🟡 JUDGMENT — `.env.example` placeholders use `...` not word-style placeholders.** Easy to fix, but currently not doctrine-clean.
- **🟡 JUDGMENT — README is a stub.** Safe but unimpressive; replacing it is the point of the skill.

---

**Awaiting your APPROVED before proceeding.**
