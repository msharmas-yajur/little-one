# Log — Little One Knowledge Base

Append-only. Newest at the bottom. Each entry: date · what happened.

---

- 2026-07-05 · Knowledge base initialized (Karpathy LLM-wiki pattern). Three
  layers scaffolded: `raw/`, `wiki/`, `CLAUDE.md` schema. Founding fact set:
  the little one is 1 year old today; no names in this public repo.
- 2026-07-05 · Seeded wiki from existing build. Compiled concept pages
  (design-principles, gopnik-foundation, the-12-month-arc, privacy-model) and
  feature pages (storybook-player, tap-and-find-game, grown-up-card,
  companion-guide, per-child-structure) — all reflecting what's already built
  in the site + the arc update. Added research notes (gopnik-notes,
  age-1-baseline).
- 2026-07-05 · TODO for next session: this is a seed. Add real ideas/PRDs into
  `raw/` and ingest them. Run a first `lint` pass to confirm no names slipped in.
- 2026-07-05 · Added four foundational books as raw sources (web-researched, sourced):
  `raw/research/books/{scientist-in-the-crib, gardener-and-the-carpenter,
  mind-in-the-making, how-to-talk-little-kids}.md`. Ingested them into three new
  wiki concept pages: `book-foundations.md`, `seven-life-skills.md` (Galinsky's 7
  mapped to arc months), `responsive-talk.md` (talk toolkit). Updated
  `gopnik-foundation.md` provenance + `index.md` catalog.
- 2026-07-05 · Tone/ordering change (owner request): (1) reframed the site + KB away
  from "experiment/scientist" language to a shared *learning experience* — "the
  child as explorer"; Month 1 retitled "Let her explore." Touched `_data/arc.yml`,
  `_data/stories.yml`, `companion.html`, and the KB concept/research pages.
  (2) Child-first ordering: on the child page the grown-up card now renders BELOW
  the little one's stories/games (`_layouts/child.html`).
- 2026-07-05 · Ingested `raw/research/famous-books.md` (famous 1–2yo books across
  the world: global classics, UK, Japan, India, novelty; + original story-theme
  ideas). Compiled new feature page `wiki/features/bilingual-first-words.md`
  (status: idea) — highest-value new idea surfaced. Updated `index.md`. Noted
  existing backlog item (animal sounds on tap) already on the storybook-player
  page. Copyright note: reproduce none of the referenced books; write originals.
- 2026-07-05 · Ingested owner idea `raw/ideas/cheer-button.md` → compiled
  `wiki/features/encouraging-cheer-button.md` (status: idea): a warm cheer button
  the child or grown-up can press. Decision recorded: NOT famous cartoon voices
  (copyright/trademark/publicity + breaks original-only rule) — instead an original
  mascot with original Web-Audio jingles / verified CC0 sounds. Stays forgiving
  (no scold, no fail). Updated `index.md`.
- 2026-07-05 · Built first cut of the celebration (owner request): correct game
  taps now trigger an original confetti burst + happy chime + a reinforcing spoken
  voice (Web Speech API — no files, no third-party character) that names the find.
  Reduced-motion skips confetti. `wiki/features/encouraging-cheer-button.md` →
  status: built (mascot button / mute / CC0 voice remain future). Also enlarged the
  tap-and-find shapes (`.choice svg` 78%→92%) so the pictures fill the boxes.
- 2026-07-05 · Fixed story-player bugs reported on mobile: (a) art animated only
  once — the CSS class-restart trick doesn't reflow SVG; replaced with the Web
  Animations API so it re-animates every tap; (b) no sound on phones — the
  AudioContext starts suspended; now `resume()`d on first gesture + per tone;
  (c) unreliable SVG tap target + no CTA — moved the tap handler to the persistent
  `.scene` div (whole picture is a big tap target), added a "👆 Tap the picture!"
  hint and a spoken word on tap. Touched `player.js`, `_layouts/child.html`,
  `style.css`. See `wiki/features/storybook-player.md`.
- 2026-07-05 · Added video source `raw/research/videos/thrive-by-five-molly-wright.md`
  (Molly Wright TED, "How Every Child Can Thrive by Five" — serve-and-return:
  connect, talk, play; the five things; games→skills). Cross-linked from
  `responsive-talk.md`; updated `index.md`.
- 2026-07-05 · Added video source `raw/research/videos/felt-flaps-peekaboo.md`
  (Felt Flaps "Where's Mrs Cat?" board book) as reference for board-book feels.
  Ingested owner idea `raw/ideas/book-animations.md` → two feature pages:
  `page-turn-animation.md` (BUILT: soft two-phase flip on page navigation, Web
  Animations API, reduced-motion falls back to instant) and `peekaboo-flaps.md`
  (SPECCED: lift-the-flap "Where's …?" reveal; original art only). Peekaboo mirror
  finale idea (owner): live FRONT-CAMERA mirror in the circle — recorded in the
  spec with hard privacy rules (local only, never recorded/uploaded, permission-
  gated, graceful fallback).
- 2026-07-05 · Voice change (owner request): the reinforcing voice now prefers a
  pleasant/soothing FEMALE English voice where the device offers one (rate 0.9,
  pitch 1.15). Available voices depend on the device/OS. `player.js` (`pickVoice`).
- 2026-07-05 · Built peek-a-boo (owner request). New "Peek-a-boo!" story (id
  peekaboo): 4 flap pages + mirror finale. Data model: optional `flap`/`reveal`/
  `mirror` on story pages (backward-compatible); child.html now injects them into
  window.CHILD. Player: flap open/close on tap (repeatable), reveal = chime +
  confetti + soothing voice; mirror finale opens the front camera in a circle
  (LOCAL ONLY, never recorded/uploaded, stopped on nav/screen/pagehide, graceful
  fallback). `wiki/features/peekaboo-flaps.md` → status: built. Verified in-browser.
- 2026-07-05 · Built generative background music (owner request): gentle pentatonic
  Web-Audio notes (no files), low volume, ducks under the voice, OFF by default,
  🎵/🔇 toggle (persists in localStorage). `wiki/features/audio-music-and-voice.md`.
  Recorded the VOICE architecture decision: Claude has no TTS and CopilotKit needs a
  backend (site is static) — so author scripts with Claude + render once with a
  neural TTS (e.g. ElevenLabs) at build time into static clips, one voice ID reused
  across the 5-year journey; family-recording is the private alternative. Needs an
  API key or a recording decision from the owner.
- 2026-07-05 · FORMALIZED THE ADAPTIVE ARC (owner discussion, two rounds).
  New concept `wiki/concepts/adaptive-arc.md` (status: specced): three loops
  (evidence/cohort/dyad), layered architecture, four decided pillars —
  passive-first signals + noticing prompts (pediatrician pattern); autonomy as a
  lifecycle (discovery→calibration→partnership, explore-then-exploit); DYAD model
  (parent+child, dual culture/language tracks, LOCAL-FIRST — child data never
  leaves the device); Galinsky-7 as taxonomy, never a report card. Self-learning
  = heuristics in the data layer, 3 tiers (on-device real-time; build-time
  human-gated PRs; evidence ingestion). Hard line: no runtime LLM calls / no
  unreviewed generated content on the child-facing site.
- 2026-07-05 · New PRD `raw/prds/0001-adaptive-arc-v1.md` (specced): content
  tagging (age band + Galinsky-7 + lang/culture), local dyad profile w/
  export-import, silent telemetry, discovery phase, noticing prompts, minimal
  partnership (menu ordering, ask-first mode). Out of scope + open questions
  recorded.
- 2026-07-05 · New research: `raw/research/bilingual-early-years.md` (sourced —
  Byers-Heinlein/Lew-Williams/Kuhl: infants separate languages early; milestones
  on schedule; live exposure quantity/quality drives outcomes; code-mixing normal
  but cues should model clean alternation; social gating → the app is never the
  language teacher). New video source
  `videos/copilotkit-self-improving-agents.md` (CLHF / in-context learning:
  the engine stays fixed, the context/data it reads changes — validates the
  KB-as-mutable-memory architecture; adopt the pattern, not the library).
- 2026-07-05 · BUILT Adaptive Arc v1 (PRD 0001, all six milestones, committed
  per-milestone). Live on the site: (1) content tagged with age_band + Galinsky-7
  skills, injected with stable ids into window.CHILD; (2) local-first dyad profile
  `assets/js/dyad.js` — NO name, NO network (audited: zero fetch/XHR/beacon;
  localStorage only), setup modal + ⚙ grown-ups settings with export/import;
  (3) silent telemetry in player.js (no-ops without a profile); (4) discovery-phase
  menu ordering that rotates the leading skill domain per session (nothing hidden);
  (5) calibration transition (14d + 6 sessions) + non-blocking "noticing prompt"
  cards (≤1/session, ≤2/week; ❤️ boosts, 🌱 rests); (6) partnership adaptive
  ordering + ask-first autonomy dial (neutral order until the grown-up approves the
  week's emphasis). Verified in-browser end-to-end on the served build. Privacy
  hard-line held throughout: child data never leaves the device. NEXT: Option B —
  the Tier-2 build-time self-learning PR loop.
- 2026-07-05 · Pre-Option-B enhancements (owner requests), all live:
  (a) MOBILE FULLSCREEN — PWA manifest (display:fullscreen), original Pillow-drawn
  app icons (192/512 + apple-touch), apple/mobile web-app-capable + theme-color +
  viewport-fit=cover meta, safe-area insets, best-effort Fullscreen API on first
  touch. Add-to-home-screen → true fullscreen.
  (b) NO-SCROLL age-friendly layout — the game "find X" page can never scroll
  (#gameScreen height:100dvh + overflow:hidden; 2x2 grid capped by min(width,
  height)); the story scene is capped so its Turn-the-page button stays visible.
  Verified at a real 390x620 phone viewport via a same-origin iframe harness
  (scrollHeight == viewport for both).
  (c) PLAYFUL MUSIC + per-story themes (see audio-music-and-voice.md).
  (d) AUTO-GUIDED "NEXT" — the child page leads with a big "Next for {name}" hero
  that opens the next PENDING story (dyad.nextUp uses the completes telemetry;
  all-done → least-recently-seen re-visit); the menu becomes "Or choose". This is
  the app creating the next step for the child, not a bare menu.
- 2026-07-05 · Two more owner UX fixes (live): (1) story picture taps now speak a
  SIMPLE SENTENCE ("Look, the sun!" / "Can you say sun?" — dialogic-reading style)
  instead of a bare word (player.js sayArt). (2) Music reworked again to UPBEAT/
  bouncy per "Wheels on the Bus" — an oom-pah (bass on beat + triad off-beat),
  major key, faster tempos, per-story themes kept.
