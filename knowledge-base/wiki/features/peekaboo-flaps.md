---
title: Peek-a-boo Flaps
type: feature
status: built
sources: [raw/ideas/book-animations.md, raw/research/videos/felt-flaps-peekaboo.md]
related: [wiki/features/storybook-player.md, wiki/features/tap-and-find-game.md, wiki/concepts/the-12-month-arc.md, wiki/concepts/design-principles.md]
updated: 2026-07-05
---

# Peek-a-boo Flaps

**Intent.** In *some* books, hide a character under an **original flap**. The page
asks "**Where's the [animal]?**"; tapping lifts the flap → the animal appears →
"**There she is!**" + the reinforcing voice names it. Recreates the Felt-Flaps
mechanic (`raw/research/videos/felt-flaps-peekaboo.md`) in our own art.

## Shipped (2026-07-05)
A dedicated **"Peek-a-boo!"** story exists (`_data/stories.yml`, id `peekaboo`):
four flap pages (duck, kitty, puppy, star) + the **mirror finale**. Data model:
optional `flap: true` (hides `art` under an original flap) and `reveal:` line, or
`mirror: true` for the finale; pages without them are unchanged. Player renders the
flap (original CSS panel), toggles it open/closed on tap (repeatable), and on reveal
plays chime + confetti + the soothing voice. Reduced-motion → instant reveal. The
**mirror finale** opens the front camera into a circle — **local only, never
recorded/uploaded**, stopped on page/screen change + `pagehide`; if the camera is
denied/unavailable it falls back to a gentle "Peek-a-boo — it's you! 💛". Verified
in-browser (flap open/close, reveal, mirror + fallback). Implemented in
`player.js`, `_layouts/child.html` (page-field injection), `assets/css/style.css`.

**Why.** Object permanence (gone → back), anticipation, repetition, naming, and the
joy of causing the reveal. Peek-a-boo → memory & trust (Molly Wright TED); fits arc
Month 2 (follow her focus) and the hide-and-find idea in `famous-books.md`.

## Proposed content model (backward-compatible)
- Add an optional `flap: <artKey>` (the hidden picture) and optional `flapAsk`
  (default "Where's the {word}?") to a **story page** in `_data/stories.yml`.
- If a page has `flap`, the player renders an **original flap shape** (SVG, art.js
  style) over the hidden art. Tap → the flap lifts/rotates open (Web Animations API)
  → hidden art revealed → happy chime + confetti-lite + voice "There's the {word}!".
- Pages without `flap` behave exactly as today.

## Design fit / constraints
- **Original art only** — our flap + animals, never the book's illustrations.
- **Forgiving** — no wrong answer; lifting is pure delight. Big tap target.
- **Reduced-motion** → flap reveals without the swing.
### Mirror finale — live front-camera reveal (owner idea, 2026-07)
Recreate the series' mirror finale for real: the **last flap** opens to the little
one's **own face**, shown live from the **front camera**, masked to just the
**mirror circle** area ("peek-a-boo, it's you!").

**Privacy — non-negotiable (this is a public site, a child's face):**
- **Local only.** The camera stream renders straight into an on-page `<video>`/
  canvas and is **never recorded, saved, uploaded, or transmitted** anywhere. No
  frames leave the device.
- **Permission-gated & opt-in.** `getUserMedia` prompts the grown-up; only starts on
  an explicit tap ("open the mirror"). Off by default.
- **Stop promptly.** Stop all camera tracks the moment the finale/story closes.
- **Graceful fallback.** If the camera is denied/unavailable (or the child config
  opts out), fall back to a gentle **original "peekaboo you!"** surprise — no
  camera. Never block the story on the camera.
- Consider a per-child `mirror: off` default so it's a deliberate choice, and never
  imply the image is stored (it isn't).

**Implementation sketch:** `navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}})`
→ stream into a `<video>` clipped to a circle (CSS `clip-path`/mask) sized to the
flap; mirror it horizontally (`transform:scaleX(-1)`) so it reads like a mirror;
`track.stop()` on close. HTTPS only (Pages is HTTPS ✓).

## Acceptance sketch
- A story page with `flap:` shows a closed flap + the "Where's …?" prompt.
- Tapping opens it with a gentle swing, reveals the animal, chime + voice name it.
- Re-tapping can close/re-open (repeatable peekaboo).
- Non-flap pages unchanged.

## Open questions
- Flap art: one generic flap shape, or themed per scene (leaf, blanket, door)?
- Which stories get flaps first (probably a new short "Where's …?" story).
- Reveal sound/among confetti — keep gentle, not a "correct/incorrect" framing.

## Next step
Promote to `built`: add the `flap` field + a couple of demo pages (or a new
"Where's the …?" story), original flap art in `art.js`, and the reveal logic +
animation in `player.js`.
