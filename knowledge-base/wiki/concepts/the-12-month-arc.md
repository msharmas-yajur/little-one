---
title: The 12-Month Arc
type: concept
status: built
sources: [raw/research/gopnik-notes.md]
related: [wiki/features/grown-up-card.md, wiki/features/companion-guide.md, wiki/concepts/gopnik-foundation.md]
updated: 2026-07-05
---

# The 12-Month Arc

A year of monthly **practices for the grown-up**, starting from the little one
at age 1. Not a curriculum for the child.

Structure (lives in `_data/arc.yml`):
- 12 months, each = one adult **stance** (e.g. Month 1 "Let the experiment run").
- Each month carries: `stance`, `why` (plain-language science), `story`/`game`
  links, an `onsite` short prompt, and `invitations` (each a `do:` = what the
  grown-up sets up, and a `watch:` = what the child's learning looks like).
- A child's current month is a single `month:` pointer in `_data/children.yml`;
  bump it to advance.

Sequence tracks the second year loosely (experiment → attention → cause/effect →
imitation → open-ended play → conversational pause → feelings → pretend →
choices → rich language → problem-solving → the gardener's long view), but the
guide says explicitly: follow the real child, not the calendar. Repeating a
month is fine.

One source of truth: both the on-site grown-up card and the `/companion/` page
render from `_data/arc.yml`. Do not hardcode month text in templates.
