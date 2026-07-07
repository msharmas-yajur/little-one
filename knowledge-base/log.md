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
- 2026-07-05 · SPECCED THE GARDENER LOOP (Option B / Tier-2, designed on Fable with
  owner). Decisions: manual workflow_dispatch only (cron after 3–4 trusted runs);
  runner = Claude Code headless GitHub Action; one-of-three charter (ingest raw/
  drop, fill biggest age_band×skills content gap, small KB tend); ONE PR per run,
  doing nothing is valid; automated lint gate (privacy grep, tag vocabulary, art
  keys, banned framing, build); owner merge/close fates are read by the next run
  (CLHF); charter-as-data at knowledge-base/GARDENER.md. Hard exclusions: no
  telemetry, no arc/engine edits, no issue/comment triggers (injection surface).
  New: raw/prds/0002-gardener-loop.md, GARDENER.md, wiki/features/gardener-loop.md.
- 2026-07-05 · Added docs/product-plan.html — a reviewer-facing HTML presentation
  of both PRDs (Adaptive Arc v1 = live; Gardener = planned), served on the site
  (not linked from the child-facing UI). Presents only already-public KB content.
- 2026-07-06 · BUILT THE GARDENER LOOP (Option B / Tier-2), on Opus. Verified the
  current runner: `anthropics/claude-code-action@v1` edits files, commits to a
  `gardener/*` branch, exposes `branch_name` + `structured_output`; the workflow
  opens the PR via `gh pr create`. Added `.github/workflows/gardener.yml`
  (manual workflow_dispatch only; `--model claude-opus-4-8`, tools = Read/Grep/
  Glob/Write/Edit, `--json-schema` for PR fields; injects computed context via
  git-excluded scratch files so nothing leaks into the diff), the required-check
  `.github/workflows/gardener-lint.yml` (runs lint.rb + a changed-files allowlist
  restricting gardener PRs to _data/stories.yml, _data/wordgames.yml, knowledge-
  base/** + a Jekyll build), and `.github/gardener/{coverage.rb,lint.rb,
  output-schema.json}`. coverage.rb + lint.rb verified locally (lint bites on
  bad tags/art/framing/PII/dup-id; coverage confirms `challenges` is the zero-
  content skill, so 12-24m×challenges is the default gap). Feature page → built.
  Not yet run (manual, ~$1–5/press). Auto-PR needs the repo "Actions may create
  PRs" toggle; falls back to a compare link if off.
- 2026-07-06 · GARDENER RUN (fill-gap): added story `try-try-again` ("Try, Try
  Again") to `_data/stories.yml` — the first content anywhere tagged skill
  `challenges`, which had zero content in the coverage matrix (biggest gap;
  age_band 12-24m). Five pages framed as a "just-right challenge" (chasing a
  rolled ball, reaching a high apple, a bird that tries and tries), with grown-up
  cues that let her struggle briefly and praise the effort over the outcome.
  Provenance: Galinsky life-skill #6 "Taking on Challenges"
  (`raw/research/books/mind-in-the-making.md`) as mapped in
  `wiki/concepts/seven-life-skills.md` (M11 "let her solve it"). Existing art keys
  only (ball/apple/bird/star); house style matched (couplet rhythm, curly-quote
  cues, no scold/fail framing). Ingest queue empty and KB consistent this run, so
  fill-gap was the highest-value option.
- 2026-07-06 · GARDENER (session-mode, no metered API call — executed by an
  interactive Claude session against the charter, not the paid Action). Filled the
  biggest post-merge gap: coverage showed `6-12m × communicating` empty (youngest
  band). Added one story `chatter-chatter` ("Chatter, Chatter") to
  `_data/stories.yml` — a serve-and-return sound game (woof/mew/quack/tweet) whose
  cues model the "make the sound, then wait for her turn" pause, tagged
  `age_band: [6-12m, 12-24m]`, `skills: [communicating, connections]`, citing
  `videos/thrive-by-five-molly-wright.md` (serve-and-return). Also refreshed the
  stale "Current stories" catalog on `wiki/features/storybook-player.md`. Gate
  (lint.rb + allowlist + build) run locally before the PR. Priority-1 ingest was
  checked first: all `raw/` files are already reflected in the wiki, so fill-a-gap
  was the highest-value action. Past-PR fates: #1 MERGED (the challenges story) —
  no closed idea to avoid.
- 2026-07-06 · TAP & FIND expansion + engine tweak (direct session build, not the
  Gardener — includes an engine edit). player.js: optional per-game `ask:` template
  ({label} slot), serialized via _layouts/child.html. New games in wordgames.yml:
  `who-says` (sounds game — "Who says woof?", companion to chatter-chatter) and
  `weather-and-sky` (uses the last unused art key, `rain`; pairs with splish-splash).
  All 17 art keys now appear in a game. Updated wiki/features/tap-and-find-game.md
  with the `ask:` mechanic and a 2-5y roadmap (colours / odd-one-out / opposites /
  first-letters / sorting / feelings — each needs new art or a new mechanic).
  Verified in-browser: "Who says quack?" renders the four animals correctly.
- 2026-07-06 · SPECCED THE GENERATIVE ARC (PRD 0003; designed with owner on Fable).
  Owner reframed privacy: the app is a digital replica of a physical book — the
  book never knows the child, the lap does ⇒ "generation is global,
  personalization is local"; the only hard line is child signals as generation
  INPUT (dyad profile never enters a prompt); privacy enforced at the data-flow
  boundary, not by restricting generation (privacy-model.md amended). Plan:
  engine becomes a fixed renderer of a capability-bounded experience SCHEMA
  (generative UI as data, sandboxed by what the language can say); graduated
  gates (classes human-gated, instances agent-gated + human post-audit by
  sampling); the reviewer agent = the REVIEW COUNCIL — an LLM-judge panel
  (llm-council + LLM-as-a-Judge patterns) whose constitution IS the KB: six
  rubric-anchored seats (Explorer/Gopnik, Skills/Galinsky, Voice/Kuhl+
  Byers-Heinlein, Tone/Faber&King, Guardian/house-counsel-with-lint-as-arm, and
  the owner-added LAP seat — the dyad's advocate) + a fixed Chairman; verdicts
  must cite KB principles; adversarial charters; deterministic floor immovable;
  calibration = CLHF on the judges (owner overturns become seat exemplars;
  agreement rate graduates classes). Sequencing: voice pipeline → council →
  schema v1 → Gardener graduates to mechanics-as-data → variant farms + local
  composition. Runtime generation and multi-model seats explicitly deferred.
  New: raw/prds/0003-generative-arc.md, COUNCIL.md, wiki/features/review-council.md.
  Build queued for an Opus session.
- 2026-07-06 · BUILT THE REVIEW COUNCIL (review-mode) — first milestone of PRD 0003,
  on Opus. `council/review.py`: six rubric-anchored seats (Explorer/Gopnik,
  Skills/Galinsky, Voice/Kuhl+Byers-Heinlein, Tone/Faber&King, Guardian, Lap) run
  in parallel + independently via the Anthropic SDK (claude-opus-4-8, adaptive
  thinking, structured-output json_schema per seat), each loading its KB
  constitution and required to cite principles; a fixed Chairman synthesizes; the
  publish/revise/escalate decision is computed DETERMINISTICALLY from the verdicts
  (decision_from — Guardian hold / any reject / seat error → escalate; any revise →
  revise; unanimous approve → publish). `.github/workflows/council.yml` (manual
  dispatch: review a story_id or game_id → job-summary report; exit 0/20/30 encodes
  the gate). Reordered ahead of the voice pipeline because voice is blocked on an
  owner TTS key while the council needs none (uses ANTHROPIC_API_KEY). Verified
  locally via --dry-run (prompt assembly + all seat sources resolve) and a
  decision-rule unit check. New: council/{review.py,README.md}, workflow, wiki
  status → review-mode built.
- 2026-07-06 · VOICE PROVIDER DECIDED: Sarvam AI (owner choice). API verified:
  POST https://api.sarvam.ai/text-to-speech, header api-subscription-key, model
  bulbul:v3, output mp3, en-IN + 10 Indic languages. Chosen over ElevenLabs for
  Indian-language-first coverage (matches the language pills; unlocks bilingual
  voice → bilingual-first-words). Needs SARVAM_API_KEY repo secret + a chosen
  speaker. Pipeline recorded in audio-music-and-voice.md (build-time render →
  static mp3 clips in assets/voice/ + manifest; device-TTS fallback; Council
  Voice Seat QAs the renders). PRD 0003 milestone 1 (voice) is now unblocked
  pending the key.
- 2026-07-06 · OWNER DECISION (telemetry granularity): aggregate cohort signals
  ONLY for the shared app; raw per-child never leaves the device; true per-child
  learning reserved for the future BYO-key tier. Sharpened privacy-model.md into
  the "three-line rule" (raw per-child stays local / only aggregate anonymized
  threshold-gated cohort signals leave, opt-in / per-child learning = family's own
  key+data). Principle now: generation is global, personalization is local, the
  feedback connecting them is anonymized + aggregate.
- 2026-07-06 · BUILT THE EXPERIENCE SCHEMA v1 (PRD 0003 milestone 3), on Opus.
  `schema/experience.schema.json` — capability-bounded declarative contract for
  the mechanics already shipped (story: plain/flap/mirror pages; game: items +
  optional ask). Safety = additionalProperties:false over a closed field
  vocabulary, so onclick/url/script/fetch/storage are unrepresentable; generated
  UI is sandboxed by grammar. `schema/validate.py` (jsonschema) enforces it and is
  wired into both gates (gardener-lint.yml + gardener.yml in-workflow Gate) as the
  Guardian's mechanical arm. Classes (new field/type/schema edit) are human-gated
  structurally (non-conforming content fails the validator). GARDENER.md bound to
  the schema (Gardener produces instances only). Verified: 6 stories + 5 games
  conform; poisoned onclick/off-enum page rejected. schema/ + council/ excluded
  from the Jekyll build. Next (3b): make player.js a pure schema-driven renderer.
- 2026-07-06 · MILESTONE 3b DONE — player.js is now a pure schema-driven renderer.
  Introduced a PAGE_TYPES registry (plain/flap/mirror) + a single pageType(p)
  discriminator, replacing the per-type conditionals scattered through renderPage
  / toggleFlap / the scene tap handler. Each entry = {hint, build(scene), invite,
  tap, onOpen?, onClose?}; a new page type is one registry entry + its schema
  branch. Behaviour byte-identical — verified in-browser (DOM assertions across
  plain/flap/mirror/game + a visual screenshot). Pure refactor, no new capability.
- 2026-07-06 · NEW MECHANIC via the schema-driven engine — `odd-one-out` game type.
  Added `which-is-different` (2-3y, critical-thinking — the first critical-thinking
  game AND first 2-3y content) as the schema-driven pattern intends: ONE schema
  branch (oddOneOutGame + anyGame oneOf in experience.schema.json) + ONE GAME_TYPES
  registry entry in player.js (mirrors PAGE_TYPES; find mode preserved byte-identical
  via a shared renderChoices helper) + content (mode: odd-one-out, groups: of art
  keys) + serialization (child.html mode/prompt/groups) + gate updates (lint.rb
  checks groups' art keys + prompt; validate.py validates games against anyGame).
  Verified in-browser: find game unchanged (score→1); odd-one-out renders 4 choices
  (3 majority + 1 outlier), "Which one is different?", odd tap scores. This is the
  concrete proof of milestone 3b and the reference for milestone 4 (Gardener
  proposing mechanics). No new art needed (reused existing 17 keys as groups).
- 2026-07-06 · BUILT THE MECHANIC LOOP (PRD 0003 milestone 4 — Gardener graduation),
  on Opus. The Gardener graduates from content (instances) to proposing a new
  experience MECHANIC (class): schema branch + additive PAGE_TYPES/GAME_TYPES
  renderer + serialization + example + log, as ONE human-gated PR. New:
  knowledge-base/MECHANIC.md (charter), schema/mechanic_lint.py (the JS CAPABILITY
  DENYLIST — bounds generated code the way additionalProperties:false bounds
  content: blocks fetch/XHR/WebSocket/storage/eval/import/external-URL/<script> +
  additive-and-small caps; verified against poisoned + benign diffs),
  .github/workflows/gardener-mechanic.yml (dispatch; mechanic/* branch; class-scoped
  gate = allowlist + mechanic_lint + node --check + lint.rb + validate.py + build),
  gardener-lint.yml extended for mechanic/* PRs, wiki/features/mechanic-loop.md.
  Safety: always human-gated (only opens PR); bounded allowlist FORBIDS editing
  the validators/charters/raw (can't weaken its own gate); Council pre-read on the
  example. Next: first live mechanic run.
- 2026-07-07 · MECHANIC RUN #1 (Gardener-graduated, human-gated PR) — new game
  TYPE `count` ("Count with me!"). The engine shows a small set (2–4) of ONE
  picture and asks "how many?"; tapping EACH one counts it aloud (one, two,
  three…) and cheers the total — early numeracy as a shared lap activity, with
  NO wrong tap (a repeat tap is a gentle no-op, never a penalty). A genuinely new
  interaction (tap-each-to-count vs the existing choose-one of `find`/
  `odd-one-out`) that unlocks a developmental door neither naming nor
  categorising reaches, and the first-ever `3-4y` content. Built the
  schema-driven way, mirroring the `odd-one-out` reference: ONE schema branch
  (`countGame` + added to the `anyGame` oneOf, with `count` bounded 2–4 to hold
  the proven 2x2 no-scroll footprint) + ONE `GAME_TYPES` registry entry in
  player.js (+ a `count` branch on the `gameMode` discriminator — minimal wiring;
  `find`/`odd-one-out` stay byte-identical) + serialization (`rounds` on the game
  object in child.html, mirroring `groups`) + one example (`count-with-me`,
  `_data/wordgames.yml`: rounds of 2–4 ducks/stars/apples/flowers/balls, tagged
  `age_band: [2-3y, 3-4y]`, `skills: [critical-thinking, focus]`). No new art —
  counts the existing nouns. Renderer composes existing engine primitives only
  ($/svgWrap/ART/shuffle/wobble/say/happy/confetti/telEngage/setTimeout/
  createElement) — no network, storage, code-eval, or external URL (mechanic_lint
  clean). Provenance: Galinsky life-skill #5 Critical Thinking + #1 Focus
  (`wiki/concepts/seven-life-skills.md` ← `raw/research/books/mind-in-the-making.md`);
  counting small sets together is emergent-numeracy play, kept no-fail per
  `wiki/concepts/design-principles.md`. Updated `wiki/features/tap-and-find-game.md`
  (three game types now; roadmap age-band note). Every existing experience
  byte-identical. Human-gated PR — owner to run the Review Council on the example
  before merge.
- 2026-07-07 · BUILT THE VOICE PIPELINE (PRD 0003 milestone 1), Sarvam AI. Default
  voice = anushka (owner pick). voice/render.py renders a bounded approved-phrase set
  (17 deterministic art-naming sentences + peek-a-boo + count words + preview greeting)
  per voice (anushka/vidya/manisha/arya) → assets/voice/<voice>/<slug>.mp3 (96 clips,
  2MB) + manifest _data/voices.json. player.js: say() is clip-first with device-voice
  fallback (partial coverage ok); sayArt() deterministic per word (one clip/picture).
  child.html embeds window.VOICE (base/voices/manifest) + serializes per-content voice.
  dyad.js: settings VOICE PICKER (Auto/Anushka/Vidya/Manisha/Arya + live preview,
  stored in lo.voice). PER-CONTENT voices: peekaboo=vidya, splish-splash=arya,
  who-says=manisha; precedence picked › content › anushka. Schema gained an optional
  `voice` field (capability bound made me add it). SARVAM_API_KEY stored as repo
  secret. Re-render workflow: gardener-voice.yml (dispatch → PR). Verified in-browser:
  tap plays the right clip per default/per-story/override; picker sets pref + previews.
- 2026-07-07 · VOICE VOICES SWAPPED to expressive Sarvam bulbul:v3 (owner: "more
  enthusiastic, Mary Poppins vibe, sweet/playful"). render.py now uses model
  bulbul:v3, pace 1.1, temperature 0.95. New voice set (v2 anushka/vidya/manisha/
  arya removed — they're v2-only): ritu (DEFAULT), kavya, priya, pooja, shreya.
  DEFAULT_VOICE in player.js is now data-driven (window.VOICE.voices[0]=ritu).
  Per-content reassigned: peekaboo=kavya, splish-splash=priya, who-says=pooja.
  Re-rendered 120 clips (24×5). Verified: default→ritu clip, per-content→priya,
  picker shows Ritu/Kavya/Priya/Pooja/Shreya. Note: temperature caps at 1 (docs
  said 2); anushka/vidya not valid in v3.
- 2026-07-07 · Story navigation redesigned (owner: the bottom text-arrows were
  hard for a child to read/find). Replaced the buried prev/next buttons with a
  richer, more discoverable model — all three approaches the owner picked:
  (1) SWIPE left/right on the picture to turn the page (real-book gesture,
  reuses the existing page-flip; a swipe is distinguished from a tap so tapping
  still says the word); (2) thumb-zone CHEVRONS at the card edges (‹ back, hidden
  on page 1; › next, → ♥ on the last page) that gently PULSE after the child taps
  the picture, tying the turn-cue into the reward loop; (3) a folded page-corner
  CURL at the bottom-right (tap to turn, hidden on the last page). Plus a
  "Read to me" mode: narrates each line in the warm voice and auto-advances,
  stopping at the end. Rendered all story lines as clips (57 phrases × 5 voices)
  so Read-to-me uses the Sarvam voice, not the device voice.
- 2026-07-07 · End-of-book celebration added (owner request): finishing a book
  now fires a longer, rolling confetti party (three waves, ~3.8s) + a warm spoken
  congratulation ("You finished the whole book! Hooray, little one!") in the
  story's own voice, then returns to the menu. New celebration clip rendered for
  all 5 voices; confetti refactored to a per-burst canvas with a wall-clock
  safety cleanup (bg-tab rAF throttling no longer leaks canvases). Verified
  in-browser: swipe/chevron/curl/heart states, tap-says-word without turning,
  read-mode narration, and the completion party + double-tap guard.
- 2026-07-07 · Read-to-me fix (owner: only the first page was read, the rest
  flipped through). Cause: auto-advance used a fixed ~2.2s length-estimate timer,
  so on first read-through the next line-clip hadn't finished downloading before
  the page flipped — pages 2+ appeared silent. Fix: say()/sayDevice() now take an
  onDone callback that fires on the audio's real 'ended'/'error'/utterance-end;
  narratePage advances only after the line is truly read (+ a 0.9s beat), with a
  generous safety fallback and a per-page guard against stale callbacks after a
  manual turn. Verified deterministically: with no completion signal the page
  holds; each page's clip is requested and read before advancing (1→2→3…).
- 2026-07-07 · Applause added alongside confetti (owner request): claps() spawns
  staggered 👏 that pop with a clap-pulse and float up. Book completion = two
  rounds (24 total) over the rolling confetti + voice; a game find = a small
  round (6). Respects reduced-motion; wall-clock safety cleanup.
- 2026-07-07 · Read-to-me hardening (owner: it read ~2 pages then stopped on the
  3rd, and occasionally skipped a page). Root cause: the HTML5 audio 'ended' event
  is unreliable on mobile — when it didn't fire, advance fell back to the long
  safety timer (felt "stopped"), and if the clip hadn't actually started, that
  page was silent (a "miss"). Verified all 32 lines across 6 stories DO have clips,
  so it wasn't missing content. Fix: say() now schedules completion off the clip's
  REAL duration (loadedmetadata → setTimeout(done, duration+0.3s)) in addition to
  'ended' — a reliable timer that no longer depends on the flaky event; whichever
  fires first wins (done is once()). The narratePage backstop was lengthened so a
  slow-loading clip is never flipped past prematurely. Verified: the chain marches
  1→2→3→4 driven purely by the duration path with 'ended' never firing.
- 2026-07-07 · Read-to-me robustness, take 2 (owner: it still stopped after the
  2nd page). Two real root causes, both now fixed: (1) MOBILE AUTOPLAY — the code
  created a brand-new Audio() per page; mobile browsers only keep the element
  unlocked during the tap gesture, so page 3's fresh element was blocked and the
  chain stalled. Now read-to-me REUSES one <audio> element (created once, unlocked
  on the first tap; only its .src changes per page). (2) EVENT RELIANCE — advance
  no longer depends on any audio event ('ended'/'loadedmetadata'). It runs on a
  plain timer that ALWAYS fires: the clip's real duration when metadata is known,
  otherwise a generous estimate — so the reading can never stop. say() reverted to
  simple fire-and-forget; clip resolution shared via clipFor(). Verified: with NO
  audio events fired at all, the chain marches 1→2→3→4 using exactly ONE reused
  audio element.
- 2026-07-08 · Neutral-referent sweep (closing the Council's first confirmed
  finding): ~115 gendered references reviewed across site + wiki; every
  child-referring "her/she" replaced with "the little one" / they-them. arc.yml
  fully rewritten (months retitled: "Let them explore", "Follow the lantern",
  "Cause and effect, in little hands", "Do it where they can see", "Let them
  solve it"); stories.yml 2 spoken lines + 16 cues; dyad/player UI strings;
  wiki pages updated to match. Judgment documented: animal pronouns kept (the
  rule protects the child; board-book convention). children.yml example note
  no longer suggests adding a real name. 2 changed lines re-rendered (10 clips
  in, 10 orphans pruned); schema + build green. Lesson for the future ledger:
  a confirmed Council finding should not wait two days for a fix.
- 2026-07-08 · PRD 0004 drafted — the Learning Ledger & the Librarian (owner
  direction after a Fable review session: "every organ, no circulation").
  Three feedback currencies (sovereign PR verdicts / Council verdicts /
  aggregate behavioral); an append-only ledger (knowledge-base/ledger/) as the
  repo's preference dataset; a third loop (the Librarian) that distills the
  ledger into a capped wiki/lessons/ included in every generation prompt —
  human-gated at every step, judges calibrated against owner decisions.
  Deferred until the ledger has entries: variant pools, telemetry transport
  (separate approval), BYO-key Tier C. Compiled wiki/features/learning-ledger.md;
  index updated. Also fixed the PRD template's gendered scaffold line
  (raw/prds/_TEMPLATE.md — infrastructure, not an owner source; noted here for
  transparency since raw/ is normally immutable).
- 2026-07-08 · PR #3 decided — THE LEDGER'S FIRST FULL CYCLE. Owner chose
  Council-first review; the Council ESCALATED (Guardian+Explorer reject, four
  seats revise; 5/6 converged on "quiz with a right answer"). Owner ruling:
  revise-then-merge. Revisions: prompt reframed to an invitation ("Let's count
  the {label} — together!"), per-round grown-up `cue` added (schema + renderer
  + five serve-and-return cues), skills retagged critical-thinking→connections.
  Owner class rulings: forward age-bands in scope; `count` mechanic approved.
  Both the Council report and the sovereign decision (with adopted AND
  rejected findings — calibration data) are recorded in knowledge-base/ledger/
  — arcs 1+2 of PRD 0004, seeded with a real event on day one.
- 2026-07-08 · Council transcript published for the teams (owner request): the
  complete first-escalation conversation — all six seat verdicts with citations
  and suggested fixes, the Chairman's synthesis, the key disagreements, and the
  owner's ruling (adopted vs overruled, with reasons) — as a readable sub-page
  docs/council-review-count-with-me.html, linked from the product plan's
  Review Council section. Verbatim from run 28868285280 with a transcript note
  (the run predates the referent sweep, so quoted principle lines keep the old
  phrasing).
- 2026-07-08 · PRD 0004 build (Fable session, owner-directed): the Librarian
  loop + ledger automation. (1) council.yml now commits every verdict to
  knowledge-base/ledger/council/ with parseable front-matter (review.py
  --ledger-out) — direct to main, justified as an append-only RECORD of an
  event, not a proposal. (2) New ledger-decision.yml records every closed PR
  as a sovereign-decision event (proposer by branch prefix, merged/closed,
  decider, files, and the owner's one-line why from a "Why:" PR comment).
  (3) LIBRARIAN.md charter (third loop: ledger → capped wiki/lessons/, ≤5
  pages/250 lines, provenance required, CONFIRMED vs HYPOTHESIS, calibration
  duty, never edits ledger/charters, PR-only) + librarian.yml (mirrors the
  Gardener pattern: in-workflow gate = allowlist + cap + referent/provenance
  lint). (4) Loop closed: gardener.yml and gardener-mechanic.yml prompts now
  read wiki/lessons/ as binding steers. (5) COUNCIL.md gained its first two
  calibration exemplars from the PR #3 ruling (owner-directed charter edit:
  forward age-bands are a note not a hold; YAML-vs-runtime scope humility).
  (6) Product plan: featured transcript band, PRD 0004 section, status rows.
- 2026-07-08 · Librarian shakedown (three live runs, each teaching something):
  run 1 — the gate CAUGHT ITS OWN AUTHOR: the distillation quoted pre-sweep
  ledger text and the referent lint blocked it before any PR (fix: charter +
  prompt now require paraphrase-never-quote). Run 2 — a valid 55-line
  distillation passed the full gate but was discarded because the session
  ended without .librarian-out.json (fix: gate-passed tracked changes now
  always open a PR; out.json only supplies title/body; max-turns 30→45).
  Runs 3-4 — instant API error (is_error, 1 turn, $0): the credit-exhaustion
  signature from 07-05. BLOCKED on account credits; everything else is built
  and pushed. First real lessons PR fires as soon as credits are added.
