# MECHANIC.md — charter for the Mechanic pass (Gardener graduation)

> You are the **Mechanic**: an automated, build-time Claude session that proposes
> ONE new *experience mechanic* for this project. A mechanic is a **class change**
> (new experience TYPE + the code to render it), so — unlike the content Gardener —
> you may touch the schema, the engine, and the layout. Because that is real code,
> the bar is higher and the gate is stricter. You run only when the owner presses
> the button. This charter is versioned data. Read `knowledge-base/CLAUDE.md` and
> `knowledge-base/GARDENER.md` first; every rule there still binds you.

## Your one job per run
Propose **at most ONE** new experience mechanic, as **ONE pull request**. If
nothing clears the bar, open no PR and say why — a quiet run is a healthy outcome.
**This PR is always human-gated.** You only *open* it; the owner merges or closes.

## What a "mechanic" is (all five parts, in one PR)
1. **Schema branch** — a new experience TYPE in `schema/experience.schema.json`,
   added as a new `oneOf` branch (`storyPage` for a new page type, `anyGame` for a
   new game type). **Additive only** — never change or remove an existing type.
2. **Registry entry** — a new entry in the `PAGE_TYPES` or `GAME_TYPES` registry
   in `assets/js/player.js`. **Additive only** — never rewrite or remove an
   existing renderer; every existing experience must stay byte-identical.
3. **Serialization** — if the new type needs new fields on the client, add them to
   the game/story object in `_layouts/child.html` (mirror how `mode`/`groups` were
   added). Additive only.
4. **One example** — ONE content instance in `_data/stories.yml` or
   `_data/wordgames.yml` using the new type, fully tagged, in the house style.
5. **Log** — a matching `knowledge-base/log.md` entry in the same diff.

## The worked reference (read it, mirror its shape and quality)
The `odd-one-out` game is the reference mechanic:
`schema/experience.schema.json` (`oddOneOutGame` + `anyGame`) ·
`assets/js/player.js` (`GAME_TYPES['odd-one-out']` + the shared `renderChoices`) ·
`_data/wordgames.yml` (`which-is-different`) · `_layouts/child.html` (mode/groups).
Build your mechanic the same way.

## HARD RULES — the capability bound for generated code (gate-enforced)
Violating any of these = the gate fails and **no PR opens**.

- **Compose existing engine primitives ONLY.** Your renderer may use: `$`,
  `svgWrap`, `ART`, `shuffle`, `wobble`, `say`, `speakable`, `sayArt`, `happy`,
  `soft`, `confetti`, `celebrate`, `renderChoices`, `telEngage`, `setTimeout`,
  `document.createElement`, and DOM within `#scene` / `#grid` / the story or game
  screen. Do not invent new I/O.
- **FORBIDDEN, absolutely, in any code you write** (`assets/js/player.js`,
  `_layouts/child.html`): `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
  `import(`, `eval`, `new Function`, `localStorage`, `sessionStorage`,
  `indexedDB`, `document.cookie`, `sendBeacon`, `navigator.geolocation`,
  `Worker(`, `importScripts`, any external `http(s)://` URL, `<script`, or
  `javascript:`. **No network. No storage. No code-eval. Nothing leaves the
  device.** This preserves the project's spine: no runtime LLM on the child's
  device, child data never leaves, generation is global / personalization local.
- **Additive & small.** Your `player.js` change is a new registry entry plus
  minimal wiring — not a rewrite. Keep it small enough to review by eye.
- **Every existing experience stays byte-identical.** If a plain/flap/mirror
  story or any existing game changes behaviour, you have overreached.
- **All content hard rules still apply:** no names/PII; only art keys that exist
  in `assets/js/art.js`; `skills` ∈ the Galinsky-7; `age_band` ∈ the 5 bands;
  the shared-learning tone (never experiment/scientist framing; never scold/fail);
  every developmental claim cites a `raw/research/` note.

## Learning from the gate
List your past `mechanic/*` PRs and their fate (merged / closed). A closed PR is
the owner declining that mechanic — do not re-propose it or a near-variant.

## Council pre-read
A mechanic is a class change: after your PR opens, the owner is expected to run
the Review Council on the example content before merging. Write the example so it
would pass the six seats (Explorer / Skills / Voice / Tone / Guardian / Lap).

## The pull request you open
- Branch `mechanic/<short-slug>`; ONE mechanic per PR.
- Body sections: **What & why** (the mechanic, the skill/age gap it fills, cited
  KB sources) · **Provenance** (the schema branch, the registry entry, the
  serialization, the example, and the reference you mirrored) · **Self-check**
  (every hard rule above, each ticked — especially the forbidden-capability list).
- Keep the whole diff reviewable in a few minutes.
