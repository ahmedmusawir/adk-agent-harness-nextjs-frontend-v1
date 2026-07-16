# CLAUDE.md — BIM-001 (Prove the Wire)

> **You are reading the manager file for BIM-001.** Read this FIRST. It tells you the mission, the stages, the sequence, the files, the skill to use, and where to stop. Everything you need lives in this folder or is pointed to from here.

---

## What a BIM Is

A **Backend Integration Module** — the backend mirror of an FFM. An FFM builds UI against mocked services; a BIM replaces mock service bodies with real backend calls without touching a single component. Self-contained folder, staged execution, hard gates, retrospective. This is the factory's FIRST BIM — execute it cleanly and it becomes the worked example for the BIM Playbook.

## Mission (one sentence)

Connect the Next.js frontend's chat domain to the live Python ADK wrapper on Cloud Run — through new server-side route handlers, behind a mode flag, with mock mode preserved one env flip away.

## Roles

- **Tony (Coordinator):** approves stage transitions, supplies the wrapper URL, rules on flagged conflicts, merges. The only human. The only merger.
- **Jarvis (Architect):** authored this module; issues the binding verdict between stages; QAs your plan.
- **Claudy (Engineer — YOU):** execute the stages exactly as written. Log problems, never freelance fixes.

## The Two Stages (hard gate between them)

```
STAGE A — RECON (read-only)          STAGE B — IMPLEMENTATION (code)
read STAGE_A_RECON_MISSION.md   ──▶  STOP ──▶ Architect verdict ──▶ Tony authorizes ──▶ read STAGE_B files, Plan Mode
run stark-recon skill + addendum          (GO / AMEND / BLOCK)                            then build
```

**You NEVER start Stage B in the same session as Stage A, and never without the Coordinator explicitly saying "Stage B is authorized."** If you finish Stage A and feel momentum — that feeling is the enemy. Stop.

## Folder Contents & Reading Order

| Order | File | What it is | Read when |
|---|---|---|---|
| 1 | `CLAUDE.md` | This file — the manager | Always first |
| 2 | `STAGE_A_RECON_MISSION.md` | Recon payload: assumption checklist A1–A12, baseline run, wrapper health check, verdict semantics | Stage A |
| 3 | `STAGE_A_QA_RUBRIC.md` | How the Architect grades the recon report (the seven checks + binding-verdict rules) | Architect at QA; Claudy may read to know the standard |
| 4 | `STAGE_B_MODULE_BRIEF.md` | Implementation scope lock: what to build, forbidden zones, hard gates G1–G10 | Stage B only, after authorization |
| 5 | `STAGE_B_DATA_CONTRACT_AMENDMENT.md` | Wire shapes, the route-handler seam, the known sentinel conflict | Stage B only, after authorization |

During Stage A, files 3–4 are your **CLAIM SOURCE** — the assumptions you verify against disk. You read them as claims to test, not as orders to execute.

## Skill Dependency (Stage A engine)

Stage A runs the **stark-recon** skill at `_SKILLS/stark-recon-skill-v1.1/stark-recon/` — read its `CLAUDE.md` first, then its `SKILL.md`, and follow it exactly: six phases, five evidence labels (EVIDENCE / INFERENCE / CLAIM / GAP / QUESTION), disk wins, Surprises section mandatory, report written to file per its Output Contract. `STAGE_A_RECON_MISSION.md` is the mission *addendum* riding on that engine — the skill's own Operator Override Protocol sanctions this.

## Standing Operator Rulings (recorded here so you don't have to ask)

1. **Read-only git allowed in Stage A:** `git status --porcelain`, current branch, HEAD short-SHA — captured before and after, for the read-only integrity attestation. NO other git operations, ever. (Operator override of the skill's no-git rule, granted for BIM recon runs, 2026-07-15.)
2. **Network calls in Stage A:** exactly ONE — `GET {ADK_WRAPPER_URL}/health`. The URL comes from the Coordinator in-session; it is never committed. No POSTs — they create sessions and cost money.
3. **Machine-state change in Stage A:** dependency install only (`npm ci` preferred), so the baseline suite can run.
4. **Paths:** this module lives at `agent_docs/CURRENT_APP/BIM001/`. The recon report goes where the skill's Output Contract says (`agent_docs/recon/`), plus a 3-line pointer file HERE naming the report path and recommended verdict.

## Stage A — Launch Procedure

1. Read this file, then `STAGE_A_RECON_MISSION.md`, then the skill's `CLAUDE.md` + `SKILL.md`
2. Announce scope in ONE message: skill phases + addendum sections + intended baseline commands + request the wrapper URL
3. On the Coordinator's nod: execute, assemble ONE report, write it to file, write the pointer file, print the 3–5 line headline + recommended verdict (GO / AMEND / BLOCK)
4. Update the repo session log per root CLAUDE.md protocol
5. **STOP.** Hand off. The Architect issues the binding verdict.

## Stage B — Entry Conditions (all four, no exceptions)

1. Stage A report exists on file
2. Architect's binding verdict is GO (or AMEND with amendments applied to the Stage B files)
3. Coordinator has ruled on conflict D1 (the sentinel `session_id` type — options in the Amendment §A1.4)
4. Coordinator has said, in plain words, "Stage B is authorized"
Then: read files 3–4 as ORDERS, enter **Plan Mode**, present your plan (file list, sentinel recommendation, test plan mapped to gates, manual verification script for the Coordinator), and build only after plan approval.

## Definition of Done (whole module)

Stage A: report + verdict delivered. Stage B: gates G1–G10 green, full regression suite green, one commit per concern, changelog + session log updated, retrospective written to `RETROSPECTIVES/RUN_001_LESSONS.md` in this folder — what fought back, not just what worked. Then the module closes and BIM-002 authoring may begin.

---

**Operator launch line (Tony, this is all you type):**
> *"Claudy — read `agent_docs/CURRENT_APP/BIM001/CLAUDE.md` and begin Stage A."*

**Version 1.0** · 2026-07-15 · Supersedes the BIM-000/BIM-001 two-module split (Coordinator decision: one self-contained module, FFM-style). Recon content formerly "BIM-000" is now Stage A of this module.
