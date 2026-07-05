---
title: Tap & Find Game
type: feature
status: built
sources: [raw/research/gopnik-notes.md]
related: [wiki/concepts/design-principles.md]
updated: 2026-07-05
---

# Tap & Find Game

A forgiving "can you find the puppy?" word game. Four picture choices; the right
tap cheers and moves on; wrong taps nudge and let her try again.

- Data: `_data/wordgames.yml` (themed sets of items: `art` + `label`).
- Current sets: animal-friends, out-in-the-world, things-i-know.
- **No fail state** (see design-principles): never scold, never end, no timer.

**Acceptance:** open a game → it asks for one item → tapping the right picture
cheers and advances; tapping a wrong one wobbles gently and the round continues.
