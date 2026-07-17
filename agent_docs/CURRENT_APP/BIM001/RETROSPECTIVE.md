# BIM-001 — RETROSPECTIVE (Engineer)

> Written by Claudy at module completion per manager Definition of Done — the one
> sanctioned Engineer write into this folder. 2026-07-16.

## What shipped

Two thin proxy routes (`/api/agent/run` 90s + `maxDuration=90`, `/api/agent/history` 30s),
chatService live mode behind `NEXT_PUBLIC_CHAT_MODE` (fail-safe mock default), D1(b)
sentinel, 23 new tests. Green board: 23 suites / 144 tests, tsc clean, build clean
(23 routes), G9 grep clean. Four BIM-001-tagged commits (`aa2ff05`, `ca8a915`,
`4aee9ac`, + docs commit). G4/G5/G6 remain for the Coordinator's manual pass.

## What fought back

1. **Plan-mode write lock vs Response Logging Protocol.** The harness's plan mode
   restricts writes to its own plan file; I treated that as an exemption and displayed
   the plan before logging it to `agent_docs/RESPONSES/`. The Operator caught it with
   the recovery cue. **Candidate lesson for `agent_docs/LESSONS/`:** a mechanical write
   lock defers a protocol write — it never cancels it; log the artifact the instant
   write tools return.
2. **Sentinel wording vs type, round two.** Even with D1 ruled, the wrapper response
   itself could omit `session_id` at runtime (types don't survive the wire). Resolved
   with one nullish chain (`data.session_id ?? input.session_id ?? ''`) — same D1(b)
   spirit, zero type changes. Worth folding into the DATA_CONTRACT §1.5 wording in a
   future amendment so it's ruled, not inferred.
3. **Nothing else.** The recon-first pipeline earned its keep: every file landed where
   Stage A said it would, no mid-build surprises, existing 121 tests never flickered.

## What the recon bought

Zero exploratory dead-ends during the build. The seam was confirmed greenfield
(`grep` for the env vars: no hits), the Jest node-env route-test pattern was already
proven by `superadmin-add-user.test.ts`, and the D1/AM-1/AM-2 rulings meant zero
mid-wave decision stalls.

## Candidate lessons flagged for `agent_docs/LESSONS/`

- L-candidate: "Write locks defer protocol writes, never cancel them" (see #1).
- L-candidate: "Wire-shape defaults belong in the contract, not the implementation" (see #2).

## Phase B pointer

The port target is exactly as recorded in Amendment §A1.6: wrapper's `create_session`,
the 404→create→retry-once loop, reversed-event parsing. Route handler signatures are
frozen; only their internals change. The live chatService tests double as the Phase B
regression harness — they mock at fetch level and never knew there was a wrapper.
