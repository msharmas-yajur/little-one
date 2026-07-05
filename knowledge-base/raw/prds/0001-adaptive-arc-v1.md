# PRD — Adaptive Arc v1 (dyad model, telemetry, discovery phase, noticing prompts)

**Status:** BUILT & shipped 2026-07-05 (all six milestones; verified in-browser)
**Date:** 2026-07-05
**No names** (public repo). Assume: the little one is 1 year old today.
**Compiled concept:** `wiki/concepts/adaptive-arc.md` (read it first — this PRD
is the v1 implementation slice of that framework).

## Problem / intent
The site currently serves the same content to every child of every age. Children
6mo–5yr learn differently by age *and* individually; families differ in language,
culture, tradition. v1 makes the served experience begin adapting to **this
dyad** (parent+child pair) — privately, on-device, with the grown-up in the loop
— and lays the data foundations every later version builds on.

## What it does (v1 scope)

### 1. Content tagging (the vocabulary everything else uses)
Extend `_data/stories.yml` / `_data/wordgames.yml` entries with optional:
- `age_band:` e.g. `6-12m | 12-24m | 2-3y | 3-4y | 4-5y` (list allowed)
- `skills:` list from Galinsky's 7 (`focus`, `perspective`, `communicating`,
  `connections`, `critical-thinking`, `challenges`, `self-directed`)
- `lang:` / `culture:` optional tags for bilingual/cultural content
- `evidence:` optional pointer to a KB research note
Untagged content behaves exactly as today (backward-compatible).

### 2. Dyad profile (local-first)
A small JSON object in `localStorage` (v1; IndexedDB when it outgrows it):
```json
{
  "v": 1,
  "child": { "birthMonth": "YYYY-MM", "languages": ["en", "hi"], "cultures": ["...", "..."] },
  "phase": "discovery | calibration | partnership",
  "startedAt": "YYYY-MM-DD",
  "autonomy": "auto | ask-first",
  "signals": { "<contentId>": { "opens": 0, "completes": 0, "taps": 0, "repeats": 0, "hearts": 0, "tooEarly": 0, "lastSeen": "…" } },
  "domains": { "communicating": { "exposure": 0, "engagement": 0 }, "...": {} },
  "adult":   { "companionOpens": 0, "cueDwells": 0, "promptsAnswered": 0, "promptsSkipped": 0 },
  "prompts": { "lastShown": "…", "shownThisWeek": 0, "answered": [] }
}
```
- Set up once by the grown-up (birth month + languages/cultures; no name — the
  display name stays in `children.yml` as today).
- **Export/import** buttons (JSON file download/upload) for device moves, day one.
- **HARD RULE:** this object never leaves the device; nothing is committed,
  posted, or fetched with it.

### 3. Telemetry (passive, silent)
Instrument the player to increment counters on: story/game open, completion,
abandonment, hero-art taps, flap re-opens, repeats within a session, session
length bucket. Every event also credits the content's tagged `skills` domains
(`exposure` on serve, `engagement` on interaction). No timestamps finer than
day. No UI.

### 4. Discovery phase (weeks 1–2)
On first run (no profile → grown-up setup → `phase: discovery`):
- Serve the age-appropriate arc month's linked content **plus one story/game per
  skill domain**, shuffled across sessions, aiming to cover all 7 domains.
- No prompts, no recommendations. Menu ordering does the serving (adaptive
  ordering of the existing menu — nothing is hidden in v1).

### 5. Calibration + noticing prompts (week 3+)
- Transition when `startedAt + 14 days` **and** ≥ N sessions (N=6 default).
- **Noticing prompt:** one-tap card at session end, only when a hypothesis
  exists (e.g. `repeats ≥ 4 in 7 days` or a domain's engagement ≫ others):
  "She keeps coming back to {title} — is she loving it? ❤️ / 🌱 too early / 🤷"
  → writes `hearts`/`tooEarly` back to the profile.
- Cadence guard: ≤ 1/session, ≤ 2/week. Never blocks; skippable.
- **Rule: never ask what you can't act on** — every prompt maps to a serving
  change (boost/rest the content, rebalance domains).

### 6. Partnership (v1 minimal)
- Menu gains a gentle "for {display name} right now" ordering: hearts & high
  engagement first, `tooEarly` content rested, under-exposed domains surfaced.
- `autonomy: ask-first` mode: instead of silently reordering, a small line for
  the adult — "Try more naming games this week?" [ok / not now].
- The weekly arc-review card and dual-language content selection are **v2**
  (need the bilingual content model built first).

## Why (rationale)
- Explore-then-exploit solves cold start (owner decision; `adaptive-arc.md` §2).
- Passive-first + noticing prompts = pediatrician reporting pattern (§1).
- Dyad not child: both are learning (§3); adult signals shape scaffolding.
- Galinsky-7 = taxonomy for selection, never a report card (§4;
  `seven-life-skills.md`).
- Local-first privacy: `privacy-model.md` + COPPA/GDPR-K posture.
- Heuristics, not ML: sparse noisy signals; explainability is the feature.

## Acceptance sketch (checkable by a non-developer)
- First visit: a simple grown-up setup asks birth month + language(s); nothing
  asks for a name.
- For two weeks the menu clearly rotates variety (different domains represented
  day to day).
- After ~2 weeks and several sessions, a gentle one-tap question appears at the
  end of a session — at most a couple per week.
- After answering ❤️ on a story, it appears near the top of the menu; after 🌱,
  it rests for a while. With `ask-first` on, the app asks before changing.
- Airplane mode: everything above still works. DevTools → Network shows zero
  requests carrying profile data. Export produces a JSON file; import on
  another device restores the same experience.
- Existing behavior unchanged for a visitor who skips setup (no profile = the
  site as it is today).

## Out of scope for v1 (recorded so they're not lost)
Weekly arc-review card · dual-language serving logic · generated-content PR
pipeline (tier-2 loop) · multi-child profiles on one device · IndexedDB
migration · any backend.

## Open questions
1. Where does grown-up setup live — first visit modal vs. a "grown-ups" page?
2. Session definition for counters (30 min inactivity boundary?).
3. Should `tooEarly` auto-resurface content after ~6-8 weeks (age growth)?
4. Do we keep serving purely by menu *ordering* in v1 (nothing hidden), or is
   gentle hiding acceptable? (Owner instinct earlier: child-first, forgiving —
   suggests ordering-only.)

---
To turn this into a spec: in a Claude session, "Ingest raw/prds/0001 into the
wiki." Compiled → `wiki/concepts/adaptive-arc.md` (done 2026-07-05).
