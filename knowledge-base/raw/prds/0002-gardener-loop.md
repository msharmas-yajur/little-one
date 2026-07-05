# PRD — The Gardener Loop (Tier-2 build-time self-learning)

**Status:** specced (design decided with owner, 2026-07-05; build pending — Opus session)
**Date:** 2026-07-05
**No names** (public repo). Assume: the little one is 1 year old today.
**Concept:** `wiki/concepts/adaptive-arc.md` §Self-learning, tier 2. Pattern source:
`raw/research/videos/copilotkit-self-improving-agents.md` (CLHF / in-context learning).

## Problem / intent
The site improves only when a human session works on it. The Gardener makes
improvement a *standing process*: a scheduled (v1: manually triggered) Claude
session that reads the knowledge base, proposes **one** reviewed improvement as a
pull request, and learns from the owner's accept/reject decisions. It is also the
project's deliberate rehearsal of protocol-driven workflow change
(guidance-as-data → reviewed diff → audit trail).

## What it does (v1, all decided)

1. **Trigger:** `workflow_dispatch` (manual button) ONLY. No cron until the owner
   has trusted 3–4 runs. Never triggered by issues/comments/PRs — external text
   is a prompt-injection surface; the loop reads owner-committed files only.
2. **Runner:** Claude Code headless via the official GitHub Action, governed by a
   charter file in the repo (`knowledge-base/GARDENER.md`). Auth: repo secret
   (`ANTHROPIC_API_KEY`, or Claude-subscription OAuth token if supported —
   verify at build time). Budget/turn caps set in the workflow.
3. **Gather (deterministic, repo-only):**
   - the KB (CLAUDE.md rules, GARDENER.md charter, raw/, wiki/, log.md)
   - `_data/*.yml` → the coverage matrix (age_band × Galinsky-7). Known first
     gap: no `challenges`-tagged content exists at all.
   - its own past PRs: titles + merged/closed fate (**the learning signal**).
4. **Reason — the one-of-three charter:** pick the highest-value ONE of
   (a) ingest an un-ingested `raw/` drop into the wiki;
   (b) fill the biggest content gap with ONE new tagged story/game;
   (c) a KB lint/consistency fix.
   **Doing nothing is a valid outcome** — log why, open no PR.
5. **Produce:** one branch → one PR. PR body must contain: rationale citing KB
   sources · provenance block (which inputs led to this) · self-checked lint
   summary · a proposed `log.md` entry in the same diff.
6. **Automated lint (CI job on the PR):** privacy grep (names/emails/DOB) ·
   YAML schema (unique ids; art keys exist in art.js; skills ∈ the 7; age_band ∈
   the 5 bands) · banned framing (experiment/scientist, scolding language) ·
   Jekyll build passes. Red lint = the PR cannot be merged.
7. **Human gate:** owner merges (deploy) or closes (recorded rejection). The next
   run reads that fate — closed proposals teach it what not to repeat (CLHF).

## Hard exclusions (v1)
- No telemetry input, ever — dyad data never leaves the device; owner
  observations enter only as owner-committed `raw/ideas/` notes.
- No `_data/arc.yml` / policy edits — content first, policy later (staged
  change-control, as in clinical practice).
- No engine (JS) changes. Data and KB only.
- No issue/comment triggers or inputs (injection surface).

## Why (rationale)
- **Learning lives in the data layer** — engine fixed, context changes (CLHF).
- **Rejection path is first-class** — a gate whose judgment isn't captured
  teaches nothing.
- **Charter-as-data** — the Gardener's own instructions are versioned and
  PR-gated; changing the process uses the process.
- **Healthcare rehearsal:** guideline update = reviewed diff with provenance,
  conformance lint, one change per PR, empty-run-is-valid, git audit/rollback.

## Costs & requirements (honest)
First component with per-run cost and a secret. Manual-only ⇒ $0 until pressed;
~$1–5 per pass expected. Requires an Anthropic API key (or subscription OAuth
token) as a **repo secret** — never in the repo itself.

## Acceptance sketch (checkable by a non-developer)
- A "Run Gardener" button exists under the repo's Actions tab; nothing runs
  without pressing it.
- Pressing it yields, within minutes, either ONE pull request (readable
  rationale, sources, provenance, passing checks) or a run log saying why
  nothing was proposed.
- A PR that tries to add a name, an unknown art key, or an off-vocabulary tag
  shows a failing check and cannot be merged.
- Closing a PR without merging leaves a trace the next run demonstrably reads
  (its next PR body references past fates).
- Nothing on the live site changes until a PR is merged.

## Out of scope (recorded)
Cron cadence · arc/policy edits · owner-note export flow from the app ·
reading PR review comments (v1 reads only merged/closed fate) · multi-PR runs.

## Open questions (for the build session)
1. Exact action + auth flavor (API key vs subscription OAuth) — verify current
   support at build time.
2. Where the coverage matrix is computed: tiny script in the workflow (deterministic,
   testable) vs. computed by Claude in-session. Lean: script, passed in as context.
3. Lint job: same workflow or a required-status separate workflow on `pull_request`.

---
Compiled → `wiki/features/gardener-loop.md`. Charter: `knowledge-base/GARDENER.md`.
