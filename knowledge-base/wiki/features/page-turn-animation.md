---
title: Page-Turn Animation
type: feature
status: built
sources: [raw/ideas/book-animations.md, raw/research/videos/felt-flaps-peekaboo.md]
related: [wiki/features/storybook-player.md, wiki/concepts/design-principles.md]
updated: 2026-07-05
---

# Page-Turn Animation

**Intent.** Advancing/going back in a story should feel like **turning a board-book
page**, not an instant swap — adds ritual and gentle pacing.

## Shipped (first cut, 2026-07-05)
Turning the page now plays a soft two-phase **flip** on the scene: the current
picture rotates edge-on (out), the new page is rendered at the hidden midpoint, then
it rotates back in — direction depends on next vs. back. Web Animations API (no
library); a `turning` guard prevents overlap on fast taps. `prefers-reduced-motion`
→ instant swap (no flip). Implemented in `player.js` (`turnPage()` wrapping
`nextPage`/`prevPage`).

## Design fit
- Gentle, quick (~short), never blocks; forgiving on rapid taps.
- Reduced-motion respected. Original, dependency-free.

## Possible polish (future)
- A subtle page-curl/shadow for more realism.
- Sync the read-aloud line transition with the flip.
