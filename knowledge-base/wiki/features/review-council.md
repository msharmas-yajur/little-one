---
title: The Review Council
type: feature
status: specced
sources: [raw/prds/0003-generative-arc.md, raw/research/videos/copilotkit-self-improving-agents.md]
related: [wiki/features/gardener-loop.md, wiki/concepts/adaptive-arc.md, wiki/concepts/privacy-model.md]
updated: 2026-07-06
---

# The Review Council

The reviewer agent for the **Generative Arc** (PRD 0003): an LLM-judge **panel**
that gates generated *instances* (story variants, voice renders, arrangements)
so the human can move from gatekeeper-of-everything to approver-of-*classes* +
auditor-of-samples. Adapted from Karpathy's llm-council (parallel opinions →
chairman synthesis) and the LLM-as-a-Judge literature (rubric anchoring,
position-swap, panel diversity), with one move that makes it ours:

**The KB is the council's constitution.** Seats don't roleplay experts — each
seat is a rubric-anchored judge bound to specific KB pages (which already
compile Gopnik, Galinsky, Kuhl/Byers-Heinlein, Faber & King with sources) and
must **cite the principle that passes or fails**. Six seats: Explorer ·
Skills · Voice · Tone · Guardian (strictest; lint.rb is its mechanical arm) ·
**Lap** (the dyad's advocate — "readable aloud at 9pm by a tired grown-up?"),
plus a fixed Chairman. Charter: `knowledge-base/COUNCIL.md` (charter-as-data).

**Decision rule:** unanimous approve → publish (instances only) · any reject or
Guardian hold → owner · revise → one bounce, then owner. All verdicts logged in
a KB ledger (committee minutes, in the healthcare rehearsal).

**Calibration = CLHF on the judges:** owner post-audit overturns become
few-shot exemplars in the offending seat's charter; seat↔owner agreement rate
is the trust metric that graduates a class from human-gated to council-gated.

**Known exposure, recorded honestly:** all seats share one model family in CI →
self-preference risk; mitigated by adversarial charters, the immovable
deterministic floor, and (later, owner decision) multi-model seats for
mechanic reviews.

**Status:** review-mode BUILT (2026-07-06, Opus). `council/review.py` +
`.github/workflows/council.yml` (manual dispatch; review a story/game by id →
job-summary report). Six seats run in parallel via the Anthropic SDK
(`claude-opus-4-8`, structured outputs); the publish/revise/escalate decision
is computed deterministically from the verdicts (the LLM never overrides the
gate). Voice built first in the PRD order, but the voice pipeline is blocked on
an owner TTS key, so the council (which needs no new key — uses the existing
`ANTHROPIC_API_KEY`) was built first; its immediate duty is advisory
second-opinions on Gardener proposals. NEXT: selection mode (best-of-N),
CLHF calibration (owner overturns → seat exemplars), committed KB ledger,
then wiring the council into the generation pipelines as the instance-gate.
