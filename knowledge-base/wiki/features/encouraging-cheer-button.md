---
title: Encouraging Cheer Button
type: feature
status: idea
sources: [raw/ideas/cheer-button.md]
related: [wiki/features/tap-and-find-game.md, wiki/features/storybook-player.md, wiki/concepts/design-principles.md, wiki/concepts/responsive-talk.md, wiki/concepts/the-12-month-arc.md]
updated: 2026-07-05
---

# Encouraging Cheer Button

**Intent.** A warm, friendly button that calls out encouragement to the little one
— celebrating when she gets something right, and gently cheering her on
"otherwise." Pressable by the **child** (press → happy sound = cause-and-effect
delight and agency) or the **grown-up** (a reward moment). The child's fun comes
first; the grown-up's use is a bonus.

## The voice source (decided)
**An original mascot with original / CC0 sounds — not famous cartoon voices.**
Famous character voices are copyrighted/trademarked and can't go on a public kids'
site, and they break the project's original-only rule. Instead:
- Invent an original **"Little One" mascot** (original SVG, `art.js` style).
- First cut: **original Web-Audio jingles** (extends the existing `tone()` engine —
  zero audio files, fully owned).
- Optional later: **CC0 / public-domain** clips (verified license, kept tiny) or a
  **grown-up's own recorded voice** (stored locally, never committed).

## Behaviour
- A big, friendly **cheer button / mascot** the child or grown-up can tap any time
  → plays one of several short, warm cheers (varied so it stays fresh) + a gentle
  wobble/pop (reuse existing `.wobble` / `.pop` animations).
- In the **tap-and-find game**: a correct tap auto-cheers (extends today's "happy"
  chime); a wrong tap gives a kind "keep trying" sound — **never a scold, no fail
  state, no score lost** (preserves the forgiving-game rule).

## Design fit / constraints
- **Forgiving.** "Otherwise" is always kind. No negative or losing sounds.
- **Lap activity.** Big tap target; works with the grown-up alongside.
- **Gentle audio.** Soft volume; a simple **mute toggle**; honour existing calm
  sound design and `prefers-reduced-motion` (mute animation, keep it optional).
- **Original only.** Mascot is original SVG; sounds are original or verified CC0.
- **No asset bloat.** Prefer synthesized Web-Audio jingles; any files stay small
  with provenance/license noted in the repo.

## Acceptance sketch (to refine when specced)
- Tapping the mascot/cheer button plays a warm, varied encouragement + animation.
- Correct game taps cheer; wrong taps nudge kindly — game never ends or scolds.
- A mute control silences sound; with sound off, everything still works visually.
- Backward-compatible: if new sounds are unavailable, it falls back to today's
  chimes.

## Open questions
- **Sound tech first cut:** original Web-Audio jingles (recommended, no files) vs.
  CC0 clips vs. original recorded voice lines — start with Web-Audio.
- **Mascot:** which original character, and does it get a name/personality? (Could
  grow from existing art — e.g. a friendly star or sun.)
- **Placement:** game screen only, or also the story screen / a persistent button?
- **Variety:** how many cheer lines before repetition feels stale.

## Next step
Promote to `status: specced` with a small proposal: add an original mascot art key
+ a `cheer()` in `player.js` (randomised gentle sound + animation), wire it to the
correct/incorrect game events and a new button, add a mute toggle. Then implement,
set `status: built`, and log it.
