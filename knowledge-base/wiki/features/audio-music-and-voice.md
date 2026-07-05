---
title: Audio — Background Music & Voice
type: feature
status: built
sources: [raw/ideas/cheer-button.md]
related: [wiki/features/encouraging-cheer-button.md, wiki/concepts/responsive-talk.md, wiki/concepts/design-principles.md]
updated: 2026-07-05
---

# Audio — Background Music & Voice

## Background music — BUILT (2026-07-05; reworked to be playful + per-story)
Web-Audio background music — **no files**. v1 was single random pentatonic notes;
owner feedback ("notes one-by-one", then "more upbeat like Wheels on the Bus") →
rebuilt as a bouncy **oom-pah** sequencer: bass "oom" on the beat + a soft triad
"pah" off-beat, under a singable melody; major key (clean triads), upbeat tempos
(124–146 bpm). **Per-story THEMES** (root/scale/tempo/timbre/pattern):
little-ones-day = bright morning, splish-splash = bouncy watery, things-that-fall =
tumbling playful, peekaboo = sneaky-then-a-peek; menu/games use a gentle default.
`musicSetTheme(name, restart)` switches at scene changes. Still **off by default**,
low volume, **ducks under the voice**, 🎵/🔇 toggle persisted in `localStorage`,
starts on first tap. `player.js`.

## Voice — decided approach (roadmap)
The current reinforcing voice uses the browser's built-in speech (Web Speech API),
which sounds **robotic** with no emotional range. Target: a warm, joyful,
parentese voice that carries the little one through the **5-year journey**.

**Architecture decision (why not the obvious tools):**
- **Claude has no text-to-speech.** The Claude API is text/vision only. Claude can
  *author* age-adapted scripts; it cannot *speak* them.
- **CopilotKit is the wrong layer** (it builds in-app AI copilots and needs a
  backend) and our site is **static** (GitHub Pages, no server) — so any *runtime*
  TTS/LLM call would leak an API key and send data out per tap.
- Therefore: do it at **build/authoring time**, ship **static audio**.

**The plan (delivers a warm, consistent, age-adaptive voice with no backend):**
1. **Claude authors** the staged phrase/script library (12-month arc words &
   cheers → toddler → preschool), reviewed and committed.
2. **Neural TTS (e.g. ElevenLabs) renders** those scripts **once** with a single
   chosen voice (pick the accent/intonation) → committed as small static clips.
   The **same voice ID** is reused across all 5 years for consistency.
3. Player plays the matching clip; falls back to the device voice if a clip is
   missing.

**Alternative:** a family member records the phrase list (most personal, fully
private, free) — see `encouraging-cheer-button.md`.

**Needs from owner:** an ElevenLabs (or similar) API key for the build-time render,
OR a decision to record the family voice. A fully real-time, conversational voice
was considered and set aside: it needs a backend + streaming TTS + mic, real
cost/safety review, and is overkill for this age (warm consistent narration wins).

## Still open
- A **voice mute** (now that taps also speak) — quick add alongside the music toggle.
