---
title: Tap & Find Game
type: feature
status: built
sources: [raw/research/gopnik-notes.md, raw/research/videos/thrive-by-five-molly-wright.md]
related: [wiki/concepts/design-principles.md, wiki/features/storybook-player.md]
updated: 2026-07-06
---

# Tap & Find Game

A forgiving "can you find the puppy?" word game. Up to four picture choices; the
right tap cheers and moves on; wrong taps nudge and invite another try.

- Data: `_data/wordgames.yml` (themed sets of items: `art` + `label`).
- Current sets: animal-friends, out-in-the-world, things-i-know, **who-says**,
  **weather-and-sky**, **which-is-different**, **count-with-me**.
- **Three game TYPES now** (schema-driven): `find` (default — name → picture),
  **`odd-one-out`** (`mode: odd-one-out`, `groups:` of art keys → "which one is
  different?"), and **`count`** (`mode: count`, `rounds:` of `{art,label,count}`
  → "how many? tap each one"). The engine dispatches via a `GAME_TYPES`
  registry (mirrors `PAGE_TYPES`); a new game mechanic is one schema branch +
  one registry entry, per `schema/experience.schema.json`.
- **`count` (early numeracy, 2026-07-07)**: the engine shows a small set (2–4)
  of ONE picture; tapping EACH one counts it aloud (one, two, three…) and cheers
  the total. A shared lap activity — the grown-up counts along. No wrong tap: a
  repeat tap is a gentle no-op, never a penalty (see design-principles). First
  counting mechanic and the first-ever `3-4y` content (`count-with-me`, tagged
  `critical-thinking, focus`). No new art — counts the existing nouns.
- **No fail state** (see design-principles): never scold, never end, no timer.
- **Optional `ask:` template** (added 2026-07-06): a set may pose its own
  question with a `{label}` slot, e.g. `ask: "Who says {label}?"`. Default is
  the classic `"Can you find {label}?"`. The `who-says` sounds set uses this so
  the grown-up makes the sound and the little one finds who made it — the game
  companion to the story `chatter-chatter` (serve-and-return / naming games →
  vocabulary + attention, per thrive-by-five). Serialized to the client via
  `_layouts/child.html`.

**Acceptance:** open a game → it asks for one item → tapping the right picture
cheers and advances; tapping a wrong one wobbles gently and the round continues.

## Skill reach & a constraint (why the sets look alike)
Every current set is a **naming** game (`communicating, focus, connections`),
because "find the named one" is inherently a naming mechanic, and the art is a
**fixed set of 17 concrete nouns** in `assets/js/art.js` (an engine file). New
categories (colours, shapes, body, feelings, opposites) need **new artwork**;
broader skills (`critical-thinking`, `perspective`, `challenges`) need a **new
mechanic**, not just a new noun list.

## Roadmap — games for 2–5y (the older bands)
The older bands are opening up: `2-3y` now has `which-is-different` +
`count-with-me`, and `3-4y` has its first content (`count-with-me`); `4-5y` is
still empty. Each older-band game idea below needs either new art or a new
mechanic — an owner decision, not a quick data add:

| Idea | Age | Skill it adds | Needs |
|---|---|---|---|
| **Colours** ("find the *red* one") | 2-3y | focus, communicating | new art: the same object in several colours (or coloured swatches) |
| ~~**Which is different?** (odd-one-out)~~ **BUILT 2026-07-06** — `which-is-different` (2-3y, critical-thinking): the first critical-thinking game and first 2-3y content, added the schema-driven way (`mode: odd-one-out` + `GAME_TYPES` registry entry). | 2-3y+ | critical-thinking | ✅ done |
| **Big & small / opposites** | 2-3y+ | critical-thinking, perspective | art at two sizes, or opposite-pairs art (up/down, day/night) |
| **First sounds / letters** ("what starts with *b*?") | 3-4y+ | communicating | letter art + a phonics prompt template |
| **Sorting** ("put the animals together") | 3-4y+ | critical-thinking, self-directed | new drag/group mechanic (bigger engine change) |
| **Feelings faces** ("find *happy*") | 2-4y | perspective | new face art (happy/sad/cross/sleepy) — pairs with the "acknowledge feelings" talk toolkit |

**Recommendation for the first older-band step:** *Colours* or *Feelings faces*
— both reuse the existing forgiving find mechanic (low engine risk) and only
need a small, self-contained batch of new art. *Which is different?* is the best
first **critical-thinking** game but needs a new round type. Decide art-first
(colours/feelings) vs mechanic-first (odd-one-out) before building.
