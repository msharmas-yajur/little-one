---
title: Encouraging Cheer Button
type: feature
status: built
sources: [raw/ideas/cheer-button.md]
related: [wiki/features/tap-and-find-game.md, wiki/features/storybook-player.md, wiki/concepts/design-principles.md, wiki/concepts/responsive-talk.md, wiki/concepts/the-12-month-arc.md]
updated: 2026-07-05
---

# Encouraging Cheer Button

**Intent.** A warm, friendly celebration when the little one gets something right —
and gentle cheering on "otherwise." The child's fun comes first; the grown-up's use
is a bonus.

## Shipped (first cut, 2026-07-05)
On a **correct** tap in the tap-and-find game, the site now plays a joyful
**celebration**: an original, dependency-free **confetti burst** (palette colours,
falls and fades) + the existing happy chime + a warm **reinforcing voice** that
names the find ("Yay! You found the apple!"). Wrong taps stay a kind nudge — no
scold, no fail. Implemented in `player.js` (`confetti()`, `say()`, `celebrate()`);
`prefers-reduced-motion` skips the confetti (voice + chime remain).

**Voice source note:** v1 uses the **browser's built-in speech (Web Speech API)** —
a real spoken voice with **no audio files and no third-party character** (legal,
on-brand, offline-friendly). This is the pragmatic first cut of the "reinforcing
voice"; the original-mascot + CC0/recorded-voice route below remains open.

## Future enhancements (still `idea`)
- A **pressable original mascot / cheer button** the child or grown-up can tap any
  time (cause-and-effect delight, agency) — the original ask.
- A **mute / volume toggle** for the voice (important once auto-voice is on).
- Optional **CC0 clips** or a **grown-up's own recorded voice** overriding the TTS.
- The original **"Little One" mascot** art to anchor the celebration.

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
