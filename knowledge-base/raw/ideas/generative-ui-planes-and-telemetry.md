# Generative UI — two planes, telemetry-fed generation, BYO-key future

> Owner direction, transcribed 2026-07-06 (raw source — to be ingested into
> PRD 0003 + privacy-model once the open decision below is made).

## The direction

Generative UI is needed in **two ways**:

1. **Build-time plane** — while *creating* the storybooks, before they are merged
   into the app. (This is the Gardener generating content + UI mechanics as
   reviewed PRs, gated by the Council.)
2. **Runtime plane** — while the app is *being used*. **Still NO LLM access at
   the app level.** So runtime "generative UI" = the app locally *composing*
   experiences from the pre-generated, reviewed pool (the dyad engine), not a
   model call on the device.

## The loop that connects them

Each child's version of the app emits **anonymised telemetry** → ingested at the
**development level** → an LLM session (like this one) enhances the app from what
children actually engage with (new stories, new tasks) → reviewed (Council) →
merged → richer pool → the runtime plane composes new experiences. 

- **Hard line held:** *no LLM at the app level* (the child's device). LLM access
  exists **only at the development level** of the app.
- **Generation is global (dev level); personalisation is local (runtime); the
  feedback that connects them is anonymised telemetry.**

## Future — bring-your-own-key (Tier C)

Later, give end users the ability to add **their own keys**; their own version of
the app can **learn and grow with the child** — a per-family instance where the
runtime-LLM line may be crossed on the family's own key and their own data.

## OPEN TENSION (flagged by the session — decision needed before ingest)

This **revises the current hard line** in `wiki/concepts/privacy-model.md` and
`raw/prds/0003-generative-arc.md`: *"child signals are never generation input…
the profile never leaves the device… it never phones the publisher."* Telemetry
leaving the device to feed generation contradicts that as written.

Proposed reconciliation (to confirm):
- **Raw per-child behavioural data (the dyad profile) still never leaves the
  device.** Unchanged.
- **Only aggregate, anonymised, threshold-gated *cohort* signals may leave**
  (opt-in) and feed dev-level generation — never a raw per-child event stream,
  never an identifier. ("Anonymised *per child*" traces are re-identification-
  risky and would need differential privacy + explicit consent.)
- **True per-child learning that needs raw data → Tier C (BYO-key)**, where the
  data stays with the family on their own key.

**Decision needed:** telemetry granularity for the shared app —
(a) aggregate-cohort-only [safest, recommended], (b) per-child anonymised with
differential privacy + consent, or (c) defer per-child learning entirely to the
BYO-key tier.

## Healthcare resonance
Aggregate/anonymised outcome data → protocol/registry improvement, vs identifiable
per-patient data staying local — the same governance line the project rehearses.
