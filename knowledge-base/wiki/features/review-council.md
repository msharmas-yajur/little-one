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

**Status:** specced. Build order per PRD 0003: voice pipeline first, council
second (first duties: voice QA + advisory second-opinions on Gardener PRs),
then experience-schema v1, then the Gardener's graduation to proposing
mechanics-as-data.
