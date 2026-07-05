---
title: The Gardener Loop
type: feature
status: built
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

**Status:** BUILT (2026-07-06, Opus session) — awaiting its first manual run.
Requires an Anthropic API key as a repo secret (added); ~$1–5 per manual run,
$0 otherwise.

**Where it lives in the repo:**
- `.github/workflows/gardener.yml` — the manual `workflow_dispatch` runner: computes
  context (coverage + past-PR fates), runs `anthropics/claude-code-action@v1` with
  the charter prompt (`--model claude-opus-4-8`, tools limited to Read/Grep/Glob/
  Write/Edit, `--json-schema` for the PR fields), then opens the PR from the
  `gardener/*` branch it produced.
- `.github/gardener/coverage.rb` — deterministic age_band × Galinsky-7 coverage
  matrix + biggest-gap picker (piped into the run as fact, per PRD open-Q2).
- `.github/gardener/lint.rb` — the content gate (schema, art keys, tag vocabulary,
  banned framing, PII); exits non-zero to block a merge.
- `.github/gardener/output-schema.json` — the structured PR fields the runner reads.
- `.github/workflows/gardener-lint.yml` — the required check on every PR to `main`:
  runs `lint.rb`, enforces a **changed-files allowlist** (gardener branches may
  only touch `_data/stories.yml`, `_data/wordgames.yml`, `knowledge-base/**`), and
  builds the site.

**First computed gap (confirms the PRD prediction):** `challenges` is the only
Galinsky skill with zero content; the coverage script points the Gardener at
`12-24m × challenges` as the default fill-a-gap target.

**One open convenience knob:** auto-opening the PR needs the repo setting "Allow
GitHub Actions to create and approve pull requests" enabled. If it's off, the run
still succeeds and prints a one-click compare link in its job summary (graceful
fallback) — the owner opens the PR with one click.
