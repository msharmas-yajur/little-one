# PRD 0004 — The Learning Ledger & the Librarian

**Status:** drafted
**Date:** 2026-07-08
**No names** (public repo). Assume: the little one is 1 year old today.
**Depends on:** PRD 0002 (Gardener), PRD 0003 (Generative Arc: Council, schema, Mechanic).

## Problem / intent

The project now has every organ of a learning system and none of its
circulation. The Gardener and Mechanic generate; four gates judge (schema,
lint, Council, human PR review); the site deploys; the dyad tier observes
richly on-device. But the signals never travel:

- Council verdicts are written to `/tmp` and a CI artifact — then nothing ever
  reads a past verdict again. The best evaluator in the system is an amnesiac.
- The owner's merge / reject / edit decisions on PRs — the single
  highest-value human signal — are visible only as raw git history that no
  loop consumes.
- On-device engagement never reaches authorship. The app adapts locally; the
  Gardener writes stories into the void.
- `log.md` is an append-only diary, which is correct as raw material — but
  nobody compiles it into lessons, and a diary is not a curriculum.

The intent of this PRD: close the loop. Make the system *provably* better at
its job over time — with a human decision gating every single step of the
learning, and the existing three-line privacy rule fully intact.

## The frame (why this is CLHF)

The model weights never change here. "Learning" means changing what the frozen
model **reads**: the `_data/*.yml` content, the KB wiki, the charters, the
prompts. The learnable substrate is the context; the gradient signal is human
decisions; every "weight update" is a git commit a human approved. That makes
the learning auditable, diffable, and reversible — properties weight-space
learning cannot offer. (Karpathy-style in-context learning, applied to a
repo instead of a context window.)

## What it does

### 1. Three feedback currencies

| Currency | Signal | Strength | Volume | Where it comes from |
|---|---|---|---|---|
| **Sovereign verdicts** | owner merges / rejects / edits a PR | strongest | low | GitHub PR outcomes |
| **Judged verdicts** | Council seat votes + citations | medium | medium | `council/review.py` runs |
| **Behavioral aggregate** | cohort counts only (e.g. "flap pages replay 2.1× vs plain") | weakest per-event | high | opt-in dyad exports, aggregated |

### 2. The Ledger — `knowledge-base/ledger/`

Append-only, structured, one file per event. The repo's preference dataset.

```
ledger/
  council/   YYYY-MM-DD-<artifact-id>.md      (full report + per-seat verdicts)
  decisions/ YYYY-MM-DD-pr<N>.md              (sovereign verdict record)
  signals/   YYYY-MM-<cohort-batch>.md        (aggregate behavioral, later)
```

A **decision event** records: what was proposed (PR id, artifact ids, loop
that proposed it), what each gate said (schema / lint / Council decision),
what the human did (merged / rejected / edited-then-merged), and one line of
*why* — captured at decision time, because the why evaporates within days.

A **council event** is simply the report `review.py` already produces,
committed into the repo instead of dying in `/tmp` — plus a front-matter
header (artifact id, decision, seat votes) so it is greppable/parsable.

### 3. The Librarian — the third loop

A sibling of the Gardener and the Mechanic, with the narrowest possible job:

> Read the ledger since your last run. Distill what changed into
> `wiki/lessons/` — a small, bounded set of pages ("what we have learned about
> what works") — and open a PR.

- Lessons pages are capped (say, 5 pages / ~200 lines total) so the compiled
  memory cannot bloat; the Librarian must *consolidate*, not accumulate.
- Every lesson must cite its ledger events (provenance, same rule as the wiki).
- **Every Gardener and Mechanic prompt then includes `wiki/lessons/`.** This
  single arc is what closes the loop: human feedback → ledger → lessons →
  next generation.
- The Librarian's PRs get the **strictest** gate, not the loosest: Council
  pre-read required, because lessons steer all future generation — they are
  the most powerful text in the system.
- The Librarian never edits the ledger (append-only, same as raw/) and never
  edits charters. It compiles; it does not legislate.

### 4. Judge calibration (once both currencies exist)

With council events and decision events in the same ledger, calibration
becomes a query: *"When the Guardian says reject, what does the owner do?"*
If a seat's verdicts diverge consistently from sovereign verdicts, that is a
rubric bug — fixed by a human-gated PR against `COUNCIL.md`. The judges get
judged, on exactly the same evidence trail.

## Why (rationale)

- **Gopnik, systemically applied:** the project's own founding stance — the
  gardener tends the soil rather than carving the plant — applied to the
  software itself. We do not retrain the model (carve the plant); we enrich
  what it grows in (the context) and gate what takes root (human PRs).
- **The dyad tier already proves the pattern.** On-device: observe → score →
  reorder, with ask-first as the human gate. This PRD repeats that exact
  pattern one level up, at the authorship layer, with git as the substrate.
- **Privacy is preserved by construction.** Currencies 1–2 involve no child
  data at all (they are decisions about *content*). Currency 3 crosses the
  boundary only as aggregate cohort counts, opt-in, per the three-line rule
  (PRD 0003): raw per-child never leaves; aggregate opt-in may; per-child
  learning only ever via BYO-key.

## Acceptance sketch

Checkable by a non-developer, in order of delivery:

1. **Ledger, arcs 1+2 (build first):** after a Council run, its report is a
   committed file under `knowledge-base/ledger/council/`. After a PR is
   merged or closed, a decision file exists under `ledger/decisions/`
   recording the outcome and the one-line why. PR #3's decision is the first
   entry.
2. **Librarian:** a `wiki/lessons/` directory exists, is under its size cap,
   every claim cites ledger events, and the newest Gardener/Mechanic PR
   description shows the lessons were in its prompt context.
3. **Calibration:** a lessons page (or COUNCIL.md appendix) shows, per seat,
   agreement with sovereign verdicts — updated by the Librarian each run.
4. **Signals (last):** an aggregate cohort file appears under
   `ledger/signals/` only after the opt-in transport design is separately
   approved (see open questions).

## Explicitly deferred (decided 2026-07-08)

Deferred **until the ledger has real entries** — a Librarian with an empty
ledger is ceremony:

- Variant pools / A-B experience structure (attribution for Currency 3).
- Aggregate-telemetry transport (the only genuinely new privacy surface —
  design slowly, approve separately).
- BYO-key Tier C (per-child learning at the family's own choice and cost).

## Open questions

1. **Currency-3 transport:** manual export-blob the grown-up deliberately
   shares vs. a tiny opt-in beacon? (Leaning manual-first: it is the most
   honest consent mechanism and needs zero infrastructure.)
2. **Decision-capture ergonomics:** the one-line why must be near-zero
   friction or it will not happen. A PR-close workflow that opens a templated
   ledger commit? A `gh` alias?
3. **Lessons cap tuning:** 5 pages / 200 lines is a guess. The right cap is
   whatever keeps the whole of `wiki/lessons/` comfortably inside every
   generation prompt.
4. **Does the Librarian also lint?** (Stale lessons whose ledger evidence has
   been superseded.) Probably yes, same run.

---
To turn this into a spec: in a Claude session, "Ingest raw/prds/0004 into the
wiki." It will compile a wiki/features/ page and cross-link it.
