---
title: The Adaptive Arc (self-learning framework)
type: concept
status: specced
sources: [raw/prds/0001-adaptive-arc-v1.md, raw/research/bilingual-early-years.md, raw/research/videos/copilotkit-self-improving-agents.md, raw/research/books/mind-in-the-making.md, raw/research/gopnik-notes.md]
related: [wiki/concepts/the-12-month-arc.md, wiki/concepts/seven-life-skills.md, wiki/concepts/privacy-model.md, wiki/concepts/book-foundations.md, wiki/features/bilingual-first-words.md]
updated: 2026-07-05
---

# The Adaptive Arc

The framework for making Little One a **self-learning system**: content and
pacing adapt to each child (6 months → 5 years), to each family's languages and
culture, and to the current state of developmental science — while the engine
itself stays simple and auditable. Decided with the owner, 2026-07-05.

## Three loops, three speeds

Adaptation is three separate loops that must never be blended into one blob:

| Loop | What changes | Speed | Healthcare analogy |
|---|---|---|---|
| **Evidence** | What research/scholars say is best practice | months–years | Clinical guideline updates |
| **Cohort** | Content for an age band, language, culture, geography | weeks–months | Regionally localized care pathways |
| **Child (dyad)** | What *this* child responds to; their pace and interests | days–weeks | The individual care plan |

## Layered architecture

```
EVIDENCE (knowledge-base/)  — sourced, versioned guidance w/ effective dates
   ↓ compiled by Claude + human review
POLICY (rules-as-data)      — "stage X + signal Y → offer content tagged Z"
   ↓
CONTENT LIBRARY (tagged)    — stories/games tagged: age band, skill domain,
   ↓ selected by               language, culture, evidence refs
DYAD MODEL (local-first)    — this parent+child pair, on their device only
   ↓
DELIVERY (the player)       — what the little one sees today
```

Any layer can change without rewriting the others. The KB already *is* the
evidence layer; `_data/arc.yml` is already guidance-compiled-into-servable-data.

## The four pillars (decided)

### 1. Signals: passive-first, prompt-later
Telemetry accumulates silently (repeats, re-taps, completions/abandonments,
flap re-opens, session rhythm). When the system forms a **hypothesis**, it asks
the grown-up a one-tap **noticing prompt** at a natural pause ("She's opened
Animal Friends six times this week — loving the animals? ❤️ / 🌱 too early / 🤷").
Pediatrician pattern: continuous quiet observation, punctuated reporting.
- The prompt labels the telemetry *and* trains the adult to notice (it is
  itself a parenting practice — consistent with the arc being for the adult).
- **Rule: never ask what you can't act on.** Every prompt must change something
  downstream.
- Cadence v1: max one per session, max two per week, session-end only.

### 2. Autonomy: a lifecycle, not a setting (explore → exploit)
| Phase | When | Behavior |
|---|---|---|
| **Discovery** | first ~2 weeks | Autonomous. Serves deliberate variety across skill domains (seeded from the age-appropriate arc month + one story/game per domain, shuffled) to delight and to gather baseline signals. No prompts. |
| **Calibration** | ~weeks 3–4 | Noticing prompts begin; heuristics firm up; system starts *recommending*. |
| **Partnership** | ongoing | Weekly lightweight "arc review" for the adult ("leaning into naming games — keep going / try something else?") + a persistent autonomy dial. |

Discovery doubles as the cold-start solution. Each dyad's journey diverges from
there — genuinely unique, not age-bucketed.

### 3. The DYAD model (not just a child model)
Both child and adult are learning. The unit of personalization is the
**parent+child pair**: child signals *plus* light adult-engagement signals
(opens the companion? lingers on cues? answers prompts?). A cue-reading dyad
gets different scaffolding than a cue-skipping one.
- Carries up to **two culture/language tracks** (mixed-tradition households) —
  see `raw/research/bilingual-early-years.md`. The app is never the language
  teacher (Kuhl's social gating): the grown-up speaking is the mechanism; cues
  model clean alternation ("dog… kutta!"), never blended sentences.
- **Privacy: local-first is a hard rule.** The dyad model lives in the family's
  browser (localStorage/IndexedDB) with export/import for device moves. No
  child data ever enters the public repo or leaves the device. (COPPA/GDPR-K
  posture by construction.)

### 4. Galinsky's 7 as taxonomy — never a report card
All content is tagged with primary skill domain(s); telemetry and hearts accrue
per domain; Discovery samples across all seven; recommendations reason in
domain terms. But **no per-skill progress meters scoring the child** — sparse
noisy signals + a graded baby = the carpenter's dashboard. Adult-facing surface
shows **"moments noticed"** ("the little one anticipated the peek-a-boo reveal — that's
memory and trust building"), never scores.

## Self-learning: heuristics, not ML — in three tiers
"Self-learning" = **the engine stays fixed; the data it reads changes.** Same
principle as in-context learning from feedback (see
`videos/copilotkit-self-improving-agents.md`): learning lives in the
knowledge/context layer, not in model weights.

1. **On-device, real-time (automated):** interpretable counters/rules adjust
   the served arc locally. Explainable by design ("more naming games because
   Animal Friends was repeated 6× this week").
2. **Build-time, human-gated (the slow loop):** owner observations + opt-in
   exported feedback + content gaps → Claude distills into KB/policy/content
   updates delivered as **pull requests**; PR review is the safety gate. Can be
   driven by a scheduled job.
3. **Evidence ingestion:** new research → sourced KB notes → recompiled
   guidance with provenance, version, effective date. A guidance change is a
   **data diff, not a code rewrite** — the transferable lesson for
   protocol-driven healthcare workflows.

**Hard line:** no runtime LLM calls and no unreviewed generated content on the
child-facing site.

## Guardrails carried from the design principles
Lap activity, forgiving (no fail states), original art, no names in the repo,
child-first ordering, "learning experience" language (no experiment/scientist
framing), and: the adaptive system serves the *gardener* — it tends the
environment, it does not target-train the child.

## Status
Framework decided; **v1 built and shipped 2026-07-05** (`raw/prds/0001-adaptive-arc-v1.md`).
Live pieces: content tagging (age band + Galinsky-7), local-first dyad profile
(`assets/js/dyad.js`) with setup + export/import, silent telemetry, discovery-phase
domain-rotating menu ordering, calibration + noticing prompts, partnership adaptive
ordering + ask-first autonomy dial. **Not yet built:** weekly arc-review card,
dual-language serving, and the Tier-2 build-time PR loop (Option B — next).
