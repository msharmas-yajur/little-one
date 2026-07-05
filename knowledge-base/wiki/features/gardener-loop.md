---
title: The Gardener Loop
type: feature
status: specced
sources: [raw/prds/0002-gardener-loop.md, raw/research/videos/copilotkit-self-improving-agents.md]
related: [wiki/concepts/adaptive-arc.md, wiki/concepts/book-foundations.md, wiki/concepts/privacy-model.md]
updated: 2026-07-05
---

# The Gardener Loop

The project's **Tier-2 self-learning loop**: a manually-triggered, build-time
Claude session (Claude Code headless in a GitHub Action) that reads the KB,
proposes **one improvement per run as a pull request**, and learns from the
owner's merge/close decisions (CLHF — the engine never changes, the data does).

**Decided (2026-07-05):** manual `workflow_dispatch` only (cron after 3–4 trusted
runs) · one-of-three charter: ingest a `raw/` drop / fill the biggest
age_band × Galinsky-7 content gap / small KB tend · doing nothing is valid ·
automated lint gate on every PR (privacy grep, tag vocabulary, art keys exist,
banned framing, build passes) · owner merge is the human gate · rejection fates
are read by the next run · charter lives at `knowledge-base/GARDENER.md`
(versioned, itself PR-gated).

**Hard exclusions:** no telemetry input; no arc/policy or engine edits; no
issue/comment triggers (prompt-injection surface); owner observations enter only
as owner-committed `raw/ideas/` notes.

**Why it matters beyond the app:** it rehearses protocol-driven workflow change —
guidance update → reviewed diff with provenance → conformance lint → audit
trail/rollback. See the PRD's healthcare mapping.

**Status:** specced; build queued for an Opus session (task #8). Requires an
Anthropic API key as a repo secret; ~$1–5 per manual run, $0 otherwise.
