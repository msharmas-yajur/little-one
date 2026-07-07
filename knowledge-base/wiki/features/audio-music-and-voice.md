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

## Voice — BUILT (2026-07-07): Sarvam clips + picker + per-content voices
**Shipped:** the reinforcing voice now prefers a pre-rendered **Sarvam** clip for the
active voice and falls back to the device voice for anything unrendered (partial
coverage is fine and grows). `voice/render.py` renders a bounded phrase set (the
deterministic art-naming sentences + peek-a-boo + count words + a preview greeting)
once per voice into `assets/voice/<voice>/<slug>.mp3`; the manifest `_data/voices.json`
is embedded by child.html as `window.VOICE` (no fetch). `say()` in player.js is
clip-first; `sayArt()` is deterministic per word so each picture has one clip.
**Settings voice picker** (dyad.js): Auto (per story) · Anushka (default) · Vidya ·
Manisha · Arya, with a live preview; stored in `lo.voice`. **Per-content voices:** a
story/game may carry `voice:` (e.g. peekaboo=vidya, splish-splash=arya, who-says=
manisha). Precedence: picked voice › content voice › anushka. Re-render in CI via
`.github/workflows/gardener-voice.yml` (opens a PR). Bilingual voice (en-IN + home
language on the same page) is the natural next step — Sarvam covers 10 Indic languages.

The original device-only reinforcing voice (Web Speech API) sounds **robotic**. Target: a warm, joyful,
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

**Provider chosen (2026-07-06): Sarvam AI** (`POST https://api.sarvam.ai/text-to-speech`,
auth header `api-subscription-key`, model `bulbul:v3`, 30+ voices, `pace`,
`output_audio_codec: mp3`, ~2500 char/req). Chosen over ElevenLabs because Sarvam
is **Indian-language-first**: `target_language_code` covers en-IN (warm
Indian-accent English) plus hi-IN, bn-IN, gu-IN, kn-IN, ml-IN, mr-IN, od-IN,
pa-IN, ta-IN, te-IN — matching the app's language pills and, crucially,
**unlocking bilingual voice** (the same line rendered in English AND the home
language → ties into `bilingual-first-words.md`). Not covered by Sarvam: Spanish,
Mandarin, Arabic, French, Urdu — those keep the device-TTS fallback.

**Needs from owner:** a **`SARVAM_API_KEY`** as a GitHub repo secret (like the
Gardener/Council use `ANTHROPIC_API_KEY`), and a chosen `speaker` (one warm voice
reused across the 5-year journey). A fully real-time, conversational voice was
considered and set aside: it needs a backend + streaming TTS + mic, real
cost/safety review, and is overkill for this age (warm consistent narration wins).

**Pipeline (build-time, static clips):** a render script collects the
already-approved `line:`/`cue:` strings, calls Sarvam once per unique string
(en-IN, chosen speaker) → decodes the base64 mp3 → commits small clips under
`assets/voice/` with a hash→file manifest; the player plays the matching clip on
tap and falls back to the current Web Speech device voice when a clip is missing.
The Review Council's Voice Seat QAs renders (says the text? artifacts? loudness?).

## Still open
- A **voice mute** (now that taps also speak) — quick add alongside the music toggle.
