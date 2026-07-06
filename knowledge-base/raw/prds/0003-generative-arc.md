# PRD — The Generative Arc (generated experiences, gated by a Review Council)

**Status:** specced (designed with owner on Fable, 2026-07-06; build pending — Opus session)
**Date:** 2026-07-06
**No child names** (public repo). Assume: the little one is 1 year old today.
**Builds on:** `0001-adaptive-arc-v1.md` (the dyad model) and `0002-gardener-loop.md`
(the generation + human-gate loop, now live — PRs #1 and #2 merged).
**Pattern sources:** `raw/research/videos/copilotkit-self-improving-agents.md` (CLHF);
Karpathy's llm-council (https://github.com/karpathy/llm-council — 3-stage council:
parallel first opinions → anonymized cross-review → chairman synthesis);
LLM-as-a-Judge literature (https://en.wikipedia.org/wiki/LLM-as-a-Judge — judging
modes, documented biases, panel/rubric mitigations).

## Problem / intent

Today the app serves **static pre-generated experiences**: humans (or the
Gardener, one PR at a time) author content; every artifact is human-gated
pre-merge. That ceiling is the reviewer's reading speed. The owner's direction:

> Move from static pre-generated information to **generated information that is
> reviewed on the go and marked for human review post-generation** — enabled by
> a **reviewer agent within the knowledge base itself.**

Three generation planes exist already or are wanted now, with more coming:

| Plane | Artifact | Status |
|---|---|---|
| 1. Stories/content | YAML entries | **live** (Gardener PRs #1, #2 merged) |
| 2. UI / mechanics | experience-schema entries | this PRD |
| 3. Voice | audio renders of approved text | this PRD |
| 4. Music | theme parameters → arrangements | future (themes already data) |

## The reframed privacy principle (owner decision, 2026-07-06)

The app is a **digital replica of a physical book**. A physical book never
knows the child — the *lap* does. Children in our age band can't even write
their name in a book; ownership lives in the home, not in the object.
Accordingly:

> **Generation is global; personalization is local.**
> Anything generated **from the published knowledge base** (a public repo) is
> privacy-clean *by construction* — no matter how generative the pipeline gets.
> The one hard line that remains: **child signals are never generation input.**
> The dyad profile stays on-device and only *selects and parameterizes* among
> generated experiences. It chooses from the shelf; it never phones the
> publisher.

Corollaries:
- Generative capability must NOT be restricted on privacy grounds; privacy is
  enforced at the **data-flow boundary** (what enters a prompt), not by
  limiting what can be generated.
- Future sync of the local profile happens through the **family's own platform
  account** (iCloud / Google app-data): their account, their custody. We never
  operate an identity service. (Today's export/import is the manual version.)

## Architecture

### A. The experience schema (generative UI, done our way)
The engine (`player.js`) becomes a **fixed renderer of a declarative,
capability-bounded experience schema**. `stories.yml` already *is* a proto
version (`flap:`, `mirror:`, `ask:` each describe an interaction). We extract
today's mechanics (story page, flap, mirror, find-with-ask) into schema v1,
then let the Gardener propose **new mechanics as data**, not code.

**Why this is the safety model:** the schema cannot express "make a network
call" or "write storage" — generated UI is sandboxed **by what the language can
say**, not by hoping a reviewer catches a bad line of code. (CopilotKit's AG-UI
streams runtime components from a live agent; we compile reviewed KB → schema →
fixed renderer. Same generative-UI idea, inverted for a static, child-facing
site.)

### B. Graduated gates (classes vs instances)
- **A class** = a new mechanic, a schema extension, a new voice, a new story
  template. **Human-gated pre-merge, always** (Council gives an advisory
  pre-read). Code and schema changes are classes by definition.
- **An instance** = a story variant within an approved template, a voice render
  of approved text, a music arrangement of an approved theme. Gate: deterministic
  lint → **Review Council** → publish → **human post-audit** (100% of flagged
  items, 100% of first-instance-of-a-class, N% random sample — N starts high
  and falls as council↔owner agreement is demonstrated).
- Healthcare mapping: committee pre-approves the *protocol/formulary* (class);
  the order-entry system auto-checks each *order* (instance); retrospective
  audit samples the charts. The council ledger = committee minutes.

### C. The Review Council (the reviewer agent, as an LLM judge panel)
Charter: `knowledge-base/COUNCIL.md` (charter-as-data, beside GARDENER.md).

**The key design move: the KB is the council's constitution.** A seat is not a
persona impersonating a researcher; it is a **rubric-anchored judge** bound to
specific KB pages, required to cite the principle that passes or fails. Seats
are named for the principle, citing the body of work (living researchers; no
implied endorsement).

| Seat | Question it asks | Constitution (KB) |
|---|---|---|
| Explorer's Seat *(after Gopnik)* | Open-ended exploration or carpenter drilling? | `gopnik-foundation.md`, Gopnik book notes |
| Skills Seat *(after Galinsky)* | Is the skill tag honest — does it exercise what it claims? | `seven-life-skills.md`, mind-in-the-making |
| Voice Seat *(after Kuhl, Byers-Heinlein)* | Grown-up still the language mechanism? Serve-and-return? Bilingual claims honest? | `responsive-talk.md`, `bilingual-early-years.md` |
| Tone Seat *(after Faber & King)* | Descriptive not judging; feelings first; never scolds/tests | how-to-talk note, `responsive-talk.md` |
| Guardian Seat *(house counsel)* | PII, fail states, schema capability bounds, age red-lines. **Strictest; deterministic where possible** (lint.rb is its mechanical arm) | `privacy-model.md`, `design-principles.md`, `CLAUDE.md` |
| **Lap Seat** *(house wisdom; owner-added)* | Readable aloud at 9pm by a tired grown-up with a squirming one-year-old? Does it serve the *dyad*, not just the child? | `design-principles.md`, `responsive-talk.md`, the arc |

Plus a **fixed Chairman** (stable synthesis voice; keeps the ledger readable).

**Two modes** (adapted from llm-council):
- **Review mode** (one artifact): all seats review **in parallel and
  independently** (no seat sees another's verdict — independence makes
  disagreement informative). Structured verdict per seat:
  `{verdict: approve|revise|reject, cited_principles[], concerns[], suggested_revisions[]}`.
  Chairman synthesizes → decision rule: unanimous approve ⇒ publish (for
  instance classes) · any reject or Guardian non-pass ⇒ human · revise ⇒ ONE
  bounce back to the Gardener with notes, then human.
- **Selection mode** (variant farms; pick best-of-N): anonymized comparative
  ranking with the position-bias fix from the literature — judge in **both
  orders, count only consistent wins**. Built after review mode is trusted.

**Bias mitigations (from the LLM-as-a-Judge literature, recorded honestly):**
- Verbosity/formatting bias → rubric-anchored structured verdicts, never "which
  reads better".
- Position bias → both-orders rule in selection mode.
- Self-preference ("LLM narcissism") → our biggest exposure: Gardener and
  council share one model family in CI. Mitigations, staged: adversarial
  charters ("find reasons to reject"; approval = absence of found objections);
  the deterministic floor (lint + schema bounds) never moves; **multi-model
  seats later** for the highest-blast-radius class (PoLL finding: diverse
  panels beat a single big judge) — needs additional API keys, owner decision.
- Judges are unreliable on objective correctness (JudgeBench) → our rubrics are
  principled-conformance checks, not truth-finding; the Guardian's objective
  checks stay deterministic.

**Calibration loop (CLHF applied to the judges):** every human post-audit
overturn becomes a **few-shot exemplar in the offending seat's charter**. The
council learns the owner's editorial judgment; seat↔owner **agreement rate is
the trust metric** that graduates a class from human-gated to council-gated —
the same trust-graduation pattern as the Gardener's manual→cron path.

**Ledger:** every verdict is logged in the KB (auditable; append-only).

### D. Voice pipeline (milestone 1, the proof of instance-gating)
A voice clip is a **mechanical transform of text a human already approved** —
the cleanest possible instance class, and the forcing function (nobody should
pre-listen to hundreds of clips).

- Claude collects/authors the line+cue script set (already-gated text).
- **One-time neural TTS render** (provider TBD — needs an owner key), a single
  warm voice ID reused across the 5-year journey → **static clips** shipped
  with the site; device-TTS remains the fallback.
- Council role: a mechanical Voice-QA check (says the text? artifacts?
  loudness?) + spot-render human audits.
- The family-recorded alternative stays recorded (`audio-music-and-voice.md`);
  a hybrid (recorded cheers/goodnights over TTS narration) remains open.

## Sequencing (decided)

1. **Voice pipeline** — first instance class end-to-end.
2. **Review Council** — COUNCIL.md + review workflow; first duties: voice QA +
   second-opinioning Gardener PRs (advisory).
3. **Experience schema v1** — extract existing mechanics; engine = pure
   renderer; no new capability (proving refactor).
4. **Gardener graduates** — charter gains option (4): propose ONE new mechanic
   *in the schema* (a class → human-gated with council pre-read). First
   candidate: the odd-one-out round from the 2–5y games roadmap.
5. **Variant farms + local composition** — Gardener generates instance pools;
   the on-device dyad engine composes the arc from the pool. The "infinite
   book" feel with zero runtime model calls.

**Explicitly deferred:** runtime generation (would need a backend + the council
in the request path; only if the council earns it, and never with dyad signals
as input). Multi-model council seats (needs keys). Selection mode ships after
review mode.

## Hard lines (kept, restated)

- The dyad profile **never** leaves the device and **never** enters a prompt.
- No runtime LLM calls on the child-facing site.
- Deterministic lints are the floor — no LLM opinion replaces them.
- Schema **extensions** are classes: human-gated, always.
- Council charters, seat rubrics, and the ledger live in the KB — versioned,
  PR-gated, auditable.

## Acceptance sketch (checkable by a non-developer)

- Tapping a picture plays a **warm, consistent voice** (same voice everywhere),
  not the robotic device voice; airplane mode still works (clips are local).
- A generated story variant appears on the site with a council report in the
  KB ledger — approved seats, citations, chairman synthesis — and was never
  individually pre-read by the owner.
- The owner can overturn any published instance; the overturn appears in the
  offending seat's charter as a calibration example, and the seat's agreement
  metric updates.
- A proposed new mechanic arrives as a schema PR with six seat verdicts
  attached; it cannot merge without the owner.
- Nothing in any prompt, log, or artifact contains child data. `grep` proves it.

## Open questions (for the build session)

1. TTS provider + voice selection + key custody (repo secret, like the
   Gardener's).
2. Post-audit sampling rate N and its decay schedule.
3. Council runtime: subagents in one Claude Code session vs separate Action
   steps (cost/latency vs isolation).
4. When (if) to add multi-model seats for mechanic reviews — extra keys.
5. Family-account sync (iCloud/Google app-data) — separate small PRD when
   wanted.

---
Compiled → `wiki/features/review-council.md`. Charter: `knowledge-base/COUNCIL.md`.
Amends: `wiki/concepts/privacy-model.md` (generation-global/personalization-local),
`wiki/concepts/adaptive-arc.md` §self-learning (tier-2 grows planes 2–4).
