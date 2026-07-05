---
title: Storybook Player
type: feature
status: built
sources: []
related: [wiki/concepts/design-principles.md]
updated: 2026-07-05
---

# Storybook Player

Tap-along story reader. The grown-up reads each line aloud; the child taps the
big picture, which wobbles and makes a soft sound.

- Data: stories in `_data/stories.yml` (id, title, age, pages). Each page:
  `sky` (scene colour), `line` (read aloud), `art` (picture key), `cue` (a
  prompt *for the grown-up*, e.g. "try a soft woof").
- Engine: `assets/js/player.js` renders pages; art from `assets/js/art.js`.
- Current stories: little-ones-day, splish-splash, things-that-fall, try-try-again,
  peekaboo, chatter-chatter.

**Acceptance:** open a child page → pick a story → pages turn, the hero picture
taps and wobbles with a gentle sound, the grown-up cue shows, last page reads
"The end."

Ideas backlog: real animal sounds on tap (currently soft chimes); inserting the
child's spoken name into a line (do without storing the name in the repo).
