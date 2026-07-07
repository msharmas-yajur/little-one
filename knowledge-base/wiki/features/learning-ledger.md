---
title: The Learning Ledger & the Librarian
type: feature
status: drafted
sources: [raw/prds/0004-learning-ledger.md, raw/ideas/generative-ui-planes-and-telemetry.md, raw/videos/copilotkit-self-improving-agents.md]
related: [wiki/concepts/adaptive-arc.md, wiki/features/gardener-loop.md, wiki/features/mechanic-loop.md, wiki/features/review-council.md, wiki/concepts/privacy-model.md]
updated: 2026-07-08
---

# The Learning Ledger & the Librarian

**Intent.** Close the loop. The system has every organ of a learning system
(generate → gate → deploy → observe) and no circulation: Council verdicts die
in `/tmp`, the owner's merge/reject decisions are unrecorded preference
labels, on-device engagement never reaches authorship, and `log.md` is a
diary nobody compiles into lessons. PRD 0004 adds the missing arcs.

**The frame.** Weights never change; "learning" = changing what the frozen
model reads (content, wiki, charters, prompts). The gradient signal is human
decisions; every weight-update is a human-approved git commit — auditable,
diffable, reversible.

**Decisions (from PRD 0004):**
- **Three feedback currencies:** sovereign verdicts (PR merge/reject/edit —
  strongest), judged verdicts (Council seats — medium), behavioral aggregate
  (cohort counts only — weakest per-event, highest volume).
- **The Ledger** (`knowledge-base/ledger/{council,decisions,signals}/`):
  append-only structured events; the repo's preference dataset. Council
  reports get committed, not discarded; every PR decision gets a record with
  a one-line *why* captured at decision time.
- **The Librarian** — a third loop, sibling to Gardener/Mechanic, deliberately
  separate (a generator grading its own homework is reward hacking in
  miniature). It distills the ledger into a *capped* `wiki/lessons/` set;
  every Gardener/Mechanic prompt includes the lessons. Librarian PRs get the
  strictest gate (Council pre-read) because lessons steer all future
  generation.
- **Judge calibration:** with both currencies in one ledger, "when the
  Guardian says reject, what does the owner do?" becomes a query; divergence
  is a rubric bug fixed by a human-gated PR to `COUNCIL.md`.
- **Privacy by construction:** currencies 1–2 contain no child data (they are
  decisions about content). Currency 3 crosses only as aggregate cohort
  counts, opt-in, per the three-line rule in PRD 0003.

**Build order:** ledger arcs 1+2 first (persist Council reports; record PR
outcomes — PR #3's decision is the first entry) → Librarian → calibration →
signals last. **Explicitly deferred** until the ledger has real entries:
variant pools, aggregate-telemetry transport (separate approval), BYO-key
Tier C.

**Acceptance sketch.** After a Council run, its report is a committed file
under `ledger/council/`. After a PR decision, a `ledger/decisions/` file
records outcome + why. `wiki/lessons/` exists, stays under its cap, cites
ledger events, and demonstrably rides along in generation prompts.

**Open questions.** Currency-3 transport (leaning manual export-blob first);
decision-capture ergonomics (the why must be near-zero friction); lessons cap
tuning; whether the Librarian also lints stale lessons (probably yes).
