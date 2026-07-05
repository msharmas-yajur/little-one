---
title: Bilingual First Words
type: feature
status: idea
sources: [raw/research/famous-books.md, raw/research/age-1-baseline.md]
related: [wiki/features/storybook-player.md, wiki/concepts/the-12-month-arc.md, wiki/concepts/design-principles.md]
updated: 2026-07-05
---

# Bilingual First Words

**Intent.** Let a story or word name a few things in *two* languages on the same
page — English plus a home language — so the little one hears both. At age 1,
hearing a home language alongside English has strong developmental value, and
much of the world's best early-books tradition (notably Indian publishers) is
bilingual for exactly this reason. See `raw/research/famous-books.md`.

**What it does.** On a page, the picture is named in both languages, and the
grown-up cue prompts saying both aloud (e.g. show a dog → "dog" and the home-
language word, said warmly, twice). Works in the storybook player and could
extend to the tap-and-find game (announce the target in both).

**Why.** Fits the site's core (naming, repetition, warm shared reading) and the
Gopnik-based "rich language input" theme (arc Month 10). It also makes the site
more specifically *hers* — a quiet way to honour a home language.

**Design fit / constraints.**
- Stays a lap activity; grown-up says the words. No audio pronunciation needed
  at first (the grown-up is the voice) — avoids getting a language wrong.
- Original content only; no copyrighted book text.
- **Privacy:** choosing a home language is a preference, not identifying data,
  but keep it generic in the public repo (e.g. a `secondary_language` field), not
  tied to a named family.

**Acceptance sketch (to refine when specced).**
- A story page (or word item) can carry a second-language label alongside the
  first.
- The grown-up cue reminds them to say both.
- If unset, the page behaves exactly as today (single language) — fully
  backward-compatible.

**Open questions.**
- Data shape: add an optional `line2`/`label2` (and maybe `lang2` tag) to the
  existing `stories.yml` / `wordgames.yml` entries? Keep it optional so nothing
  breaks.
- Script/rendering: how to show a non-Latin script cleanly (font, size). Decide
  during spec.
- Scope first cut: probably a handful of first-words pages, not whole bilingual
  stories.

**Next step.** Promote to `status: specced` by writing a small data-shape
proposal, then implement in the site (`_data/*.yml` + `player.js` render + a
grown-up cue), then set `status: built` and log it.
