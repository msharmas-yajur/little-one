---
title: The Mechanic Loop (Gardener graduation)
type: feature
status: built
sources: [raw/prds/0003-generative-arc.md]
related: [wiki/features/gardener-loop.md, wiki/features/experience-schema.md, wiki/features/review-council.md]
updated: 2026-07-06
---

# The Mechanic Loop (Gardener graduation)

PRD 0003 milestone 4. The Gardener graduates from proposing **content** (instances)
to proposing a new **experience mechanic** (a class): a new experience TYPE + the
code to render it, as ONE **human-gated** pull request. Charter:
`knowledge-base/MECHANIC.md`.

**A mechanic = 5 parts in one PR:** a new `oneOf` branch in
`schema/experience.schema.json` · an additive `PAGE_TYPES`/`GAME_TYPES` entry in
`assets/js/player.js` · any `_layouts/child.html` serialization · ONE example
content instance · a `log.md` entry. Worked reference: the `odd-one-out` game.

**Why it's safe (the escalation is bounded):**
- **Always human-gated** — the Mechanic only *opens* the PR; the owner merges.
- **JS capability denylist** (`schema/mechanic_lint.py`) — the equivalent of
  `additionalProperties:false` for generated *code*: it scans the added lines to
  `player.js`/`child.html` for forbidden capabilities (fetch/XHR/WebSocket/
  storage/eval/import/external-URL/`<script>`) and enforces additive-and-small.
  A hit fails the gate → no PR. This preserves the spine: no runtime LLM on the
  device, nothing leaves the device.
- **Bounded allowlist** — the Mechanic may touch the schema contract, the engine
  renderer, the layout, content, and wiki/log/index — but **not its own
  validators, the charters, or `raw/`** (it can't weaken its own gate).
- **The full content gate too** — `lint.rb` + `validate.py` + `node --check` +
  Jekyll build. And a **Council pre-read** on the example content before merge.

**Where it lives:** `.github/workflows/gardener-mechanic.yml` (manual dispatch;
`mechanic/*` branch; the class-scoped gate) + the same gate on `mechanic/*` PRs in
`gardener-lint.yml`. Manual only, ~$1–2/run, $0 idle.

**Status:** built. The denylist is verified (blocks fetch/URL/storage; passes
benign DOM primitives). NEXT: the first live mechanic run (human-gated PR).
