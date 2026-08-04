# Sweep Report — `adk-agent-harness-nextjs-frontend-v1`

**Date:** 2026-08-04 20:52 UTC · **Branch:** `main` · **Repo class:** Lab / harness with FFM/staged signals
**Method:** read-only grep + file inspection. No files modified, no git commands run.
**Swept set:** `git ls-files` (364 files) ∪ `git ls-files -o --exclude-standard` (1 file: this report's plan artifact) = **365 shippable files**. Tree is fully committed; no large untracked set to warn about.

---

## VERDICT: 🔴 BLOCKED

The repo cannot be showcased from its current state. The dominant issue is not a secret, but **proprietary factory/lab material is tracked in the shippable set** — `agent_docs/`, `_SKILLS/`, `.claude/skills/`, session logs, recovery files, and internal playbooks. Per the Two-Repo Rule and `decision-trees/finding-severity.md`, this is a 🔴 BLOCKER. A `.gitignore` update would only stop future tracking; the material is already in git history and must be carved out via the clean-room path if the repo is or will become public.

Secondary findings: the stub README is a placeholder (🟡 JUDGMENT), and the production dependency audit shows **10 vulnerabilities** (5 moderate, 5 high) — out of scope for a README mission but noted for separate triage.

---

| # | Class | Result |
|---|-------|--------|
| 1 | Credentials | 🟢 CLEAN — no live secrets in app code; `.env.example` is template-only but uses `...` placeholders, not word-style |
| 2 | People | 🟢 CLEAN — no real client/staff names found; demo seeds use fictional names and `.example` domains |
| 3 | Real data | 🟢 CLEAN — no committed logs, fixtures with real records, or PHI identifiers |
| 4 | Factory internals | 🔴 BLOCKER — 100+ tracked files of factory/lab material |
| 5 | Infrastructure | 🟢 CLEAN — no hardcoded project IDs, service accounts, or staging hostnames in app code |
| 6 | Fossils | 🟢 CLEAN — no `-org`/`.bak`/`-old` files or stray temp dirs beyond `.git/logs` |
| 7 | Stale claims | 🟡 JUDGMENT — README is a stub; `package.json` version is `0.1.0`; no other obvious doc drift |

---

## 🔴 BLOCKER — Factory internals tracked in shippable set

**EVIDENCE:**
- `agent_docs/` — tracked, 100+ files including `APP_FACTORY/` playbooks, `CURRENT_APP/BIM000/` through `BIM005/` module briefs and acceptance specs, `LESSONS/`, `RECON/` reports, `RESPONSES/`, `SESSIONS/`, `STARTER_KIT_FEEDBACK.md`, `VERIFICATION_PHASE_5.md`, and design screenshots.
- `_SKILLS/` — tracked, including `stark-recon-skill-v1.1/` and `stark-showcase-readme-skill/` (the skill currently being run).
- `.claude/skills/` — tracked, including `frontend-design/`, `skill-creator/`, and `stark-frontend-first/`.
- `CLAUDE.md`, `RECOVERY.md`, `WINDSURF.md`, `BACKEND_SWAP_NOTES.md`, `CHANGELOG.md`, `session_2026-07-16.md` through `session_2026-08-04.md`.
- `config/agents.manifest.json` — tracked; this is app configuration, not factory internal, and ships.

**Blast radius:** Publishing this tree exposes the operator's internal methodology, build module numbering, QA gates, acceptance criteria, recon artifacts, and design references. Even if the repo is currently private, a future public flip or a profile link share makes all of it searchable. The Two-Repo Rule exists because factory material written for the lab is not application code written for the app.

**Time budget:** Hours, not minutes. The fix is not a delete commit; it is a clean-room carve-out.

**Recommendation (operator executes):**
1. Decide whether the repo is intended to be public. If yes, follow `references/CLEAN_ROOM_FLOW.md`.
2. Rotate any credential that has ever touched the history (none found in current tree, but verify before clean-room).
3. Rename the existing repo to `{name}-legacy`, make it private.
4. Create a fresh repo under the original name.
5. Agent will prepare a carve-out tree: `src/`, `public/`, `config/`, tests, package manifest, lockfile, framework configs, and a rebuilt `.gitignore` + `.env.example`. Factory directories stay in the private lab repo.
6. Re-run the full sweep on the fresh tree before README build.

> ⚠️ **Album Lesson:** Untracking these files with a new `.gitignore` does not remove them from git history. If the repo has been public or will be, a scrub commit is insufficient; the clean-room path (fresh history) is required.

---

## 🟡 JUDGMENT — `.env.example` placeholders not word-style

**EVIDENCE:** `.env.example:20-26`

The file uses `sb_publishable_...` and `sb_secret_...` (prefix + ellipsis). Per `CLAUDE.md` §4 Placeholders Must Not Cosplay, these match scanner regexes for Supabase keys and can block the operator's own push even though they are obviously fake. They should be `sb_publishable_YOUR_KEY_HERE` and `sb_secret_YOUR_SECRET_KEY_HERE`.

**Recommendation:** Rebuild `.env.example` during clean-room prep with word-style placeholders only.

---

## 🟡 JUDGMENT — Stub README and branding persona in demo seeds

**EVIDENCE:**
- `README.md:1-3` — 3-line stub.
- `src/mocks/data/instructions.ts:24`, `src/mocks/data/messages.ts:43`, `src/mocks/responses.ts:66` — demo seeds reference "Mr. Stark" / "JARVIS" / "sir" as a persona voice. These are fictional, internally consistent, and do not identify a real person. The README can honestly describe them as demo voice/persona if desired, or they can be neutralized in the clean-room.
- `src/components/global/Navbar.tsx:80` and siblings reference `alt="Stark SaaS Starter"` for a logo asset — this is a kit/starter-brand remnant, not a real person.

**Recommendation:** Replace README entirely in Phase 4. Demo persona is operator's call; neutralizing it is optional unless you want the README to downplay the Stark theme.

---

## 🟢 CLEAN — Credentials

- **No `.env*` files tracked except `.env.example`.**
- **No hardcoded keys in `src/`, `config/`, or `next.config.js`.** Searched patterns:
  - `sk_live|sk_test|pk_live|pk_test|whsec_|rk_live`
  - `sb_secret|sb_publishable|service_role`
  - `AIza...`, JWT shapes, GitHub/Slack tokens, `-----BEGIN ... PRIVATE KEY-----`
  - Assignment literals for `api_key`, `secret`, `token`, `password`, `credential`
- **`src/utils/supabase/admin.ts`** reads `SUPABASE_SECRET_KEY` from `process.env` and is server-side only — correct pattern. **INFERENCE:** the service-role key is env-driven, not committed.
- **`package-lock.json` integrity hashes** were inspected; they are npm lockfile hashes, not secrets.
- **`.env.example`** is template-only but see JUDGMENT above on placeholder style.

## 🟢 CLEAN — People

- Searched `src/` and `config/` for real names, email domains, and operator branding.
- Demo seeds use fictional names (`Alex Mercer`, `Jordan Lee`, `Priya Patel`, `Marcus Chen`, `Rico`) and `*.example.com` emails.
- No client names, staff names, or internal mailboxes found.
- `Tony Stark` appears only in test fixtures and mock persona — fictional, not a real person claim.

## 🟢 CLEAN — Real data

- No `logs/`, `uploads/`, `temp/`, or `test-results/` directories in the shippable set (`.git/logs` is git internal, not project data).
- No committed fixtures with real addresses, phones, financial identifiers, or PHI.
- No registry-checkable identifiers (NPI, SSN, MRN, etc.).

## 🟢 CLEAN — Infrastructure coordinates

- No GCP/AWS project IDs or numbers, service account emails, Secret Manager names, Cloud Run URLs, or staging hostnames found in app code or configs.
- `.env.example` uses placeholder domains: `your-project.supabase.co`, `localhost:3000`, `your-instructions-bucket`.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SITE_URL` are env-driven; test setup uses `example.supabase.co`.

## 🟢 CLEAN — Fossils

- No `*-org*`, `*.bak`, `*-old*`, `*.copy.*`, or `*.orig` files found.
- No dead scripts or stray JSON dumps.
- `public/next.svg` and `public/vercel.svg` are Next.js/Vercel default assets; not a security issue, but they may be replaced with real app assets in Phase 3.

## 🟢 CLEAN — Stale claims (mostly)

- `package.json` version is `0.1.0` — accurate for a lab/harness. README should not claim a higher version.
- `CHANGELOG.md` appears to record module history internally; it is part of the factory material that will not ship.
- No audit-clean claims found in docs.

---

## Out of scope — flagged, not fixed

These are not README-mission fixes, but the operator should know about them.

1. **Auth architecture: `src/utils/supabase/admin.ts` service-role usage**
   - **EVIDENCE:** `src/utils/supabase/admin.ts:14-28`
   - The admin client bypasses RLS. It is env-driven and server-side only, which is correct as far as the current tree shows. A separate security review should verify that no client component or route imports it by accident.

2. **Dependency vulnerabilities**
   - **EVIDENCE:** `npm audit --omit=dev` → **10 vulnerabilities (5 moderate, 5 high)**
   - Moderate/high advisories in `@google-cloud/storage`, `brace-expansion`, `cross-spawn`, `gaxios`, `micromatch`, `path-to-regexp`, `retry-request`, `teeny-request`, `uuid`. README should not claim "0 vulnerabilities" without first running `npm audit fix`. This is a separate maintenance task.

3. **`npm run lint` pre-existing failure (B1)**
   - Noted in `RECOVERY.md` as out of scope. README should not claim a clean lint run.

---

## Decisions needed from operator

1. **Clean-room or not?** — If this repo will be public, a clean-room rebuild is required because factory internals are in history. If it will stay private forever, we can proceed with an in-place README rewrite + `.gitignore` fence for future protection. **Recommendation:** clean-room if any chance of public use.

2. **Keep or neutralize the Stark/JARVIS demo persona?** — It is fictional and consistent, but it ties the public README to a specific fictional universe. **Recommendation:** keep if it matches your public brand; otherwise neutralize in mock seeds.

3. **Dependency vulnerabilities** — README cannot honestly print a clean-security badge. **Recommendation:** scope a separate maintenance pass, or omit the badge and note "audit pending".

4. **Assets for README** — Do you have screenshots, an architecture diagram, or a walkthrough video? If yes, provide URLs/layout. If no, I will build a text/README-only README.

5. **Status for badges** — Is the app live, staged, or retired? What URL (if any) should the README point to?

6. **Ownership/constraints** — Is this entirely yours to showcase? Any client names or constraints that must not appear?

---

## Command block (operator executes — Rule Zero)

```bash
# PREP: ensure .env.example is the only env-shaped file
ls -la | grep -iE "\.env"
git ls-files | grep -iE "\.env"

# IF proceeding with clean-room, the agent will prepare the commands for:
#   1. Rename old repo to adk-agent-harness-nextjs-frontend-v1-legacy and make it private
#   2. Create fresh repo github.com/ahmedmusawir/adk-agent-harness-nextjs-frontend-v1
#   3. Copy carve-out tree, add .gitignore fence, write rebuilt .env.example
#   4. Single initial commit + push
# Do not run these until the clean-room tree is verified.
```

> ⚠️ **History warning:** If this repo has ever been public, forks/clones/caches may already hold the factory material. Rotation (if any credential existed) + clean-room is the only mitigation; deleting files from the current tree does not un-publish history.

---

**STOPPED. Awaiting operator decisions. No files modified, no git commands run.**
