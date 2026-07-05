---
title: Design Principles
type: concept
status: built
sources: [raw/research/gopnik-notes.md]
related: [wiki/features/tap-and-find-game.md, wiki/concepts/the-12-month-arc.md]
updated: 2026-07-05
---

# Design Principles

The non-negotiable rules. Any feature or implementation must preserve these.

- **A shared lap activity, not solo screen use.** The site is designed to be
  used *together* — grown-up reading aloud, child tapping along. Not something
  handed to a 1-year-old alone. Keep the "for the grown-up" framing visible.
- **The game is forgiving — no fail states.** Wrong taps nudge/wobble, never
  scold, never end the game. No timers, no losable scores. Success = engagement.
- **The arc is a practice for the ADULT, not a curriculum for the child.** The
  child just plays and responds; the grown-up practises a monthly stance. Never
  add pass/fail tasks, completion gates, or scores *for the child*.
- **Original art only.** Simple original SVG shapes. No copyrighted characters
  or third-party media.
- **No names / privacy first.** See `privacy-model.md`.
- **Quality floor.** Responsive to phone; big tap targets; gentle motion;
  `prefers-reduced-motion` respected; soft (non-jarring) sounds.

Why these hold: at age 1, warm responsive interaction and self-directed play
drive learning far more than any "training." The design serves the relationship,
not the device.
