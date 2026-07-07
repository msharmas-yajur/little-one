---
title: The Experience Schema
type: feature
status: built
sources: [raw/prds/0003-generative-arc.md]
related: [wiki/features/gardener-loop.md, wiki/features/review-council.md, wiki/features/storybook-player.md, wiki/features/tap-and-find-game.md]
updated: 2026-07-06
---

# The Experience Schema

PRD 0003 milestone 3 (v1 built 2026-07-06). `schema/experience.schema.json` is
the **capability-bounded declarative contract** the fixed engine renders — the
substrate that makes generative UI safe *by grammar* rather than by trust.

**Safety model:** every object is `additionalProperties: false` over a closed
field vocabulary, so the language cannot express `onclick`/`url`/`script`/
`fetch`/storage — those fields don't exist. A generator can only fill in defined
fields; generated UI is sandboxed by what the schema can *say* (CopilotKit's
AG-UI idea inverted: reviewed contract → fixed renderer, not a live agent
streaming components at runtime).

**Types v1** (extracted from shipped mechanics): `story` with plain / flap /
mirror pages; `game` with `{art,label}` items + optional `ask` template. Closed
enums for `sky`, `age_band`, `skills`; `art` existence checked by `lint.rb`.

**Classes vs instances (the gate boundary):** an instance (new story/game fitting
an existing type) is Gardener-generable and must pass `schema/validate.py`; a
class (new field / new type / any schema edit) is **human-gated** — enforced
structurally, since non-conforming content fails the validator and can't pass as
an instance. `validate.py` is the Guardian Seat's mechanical arm and runs in both
gates (`gardener-lint.yml`, in-workflow gate in `gardener.yml`). The Gardener
charter (`GARDENER.md`) now binds the Gardener to the schema.

**Verified:** current library (6 stories + 5 games) conforms; a poisoned page
carrying `onclick`/`fetch` or an off-enum `sky` is rejected (the capability bound
bites).

**3b DONE (2026-07-06):** `player.js` is now a pure schema-driven renderer.
A `PAGE_TYPES` registry (`plain`/`flap`/`mirror`) with a single `pageType(p)`
discriminator replaced the per-type conditionals scattered through `renderPage`,
`toggleFlap`, and the scene tap handler — each entry is `{hint, build, invite,
tap, onOpen?, onClose?}`, so a new page type is one registry entry (+ its schema
branch), not scattered edits. The Tap & Find game is already a single declarative
type (`newRound` reads items + `ask`). Behaviour is byte-identical — verified
in-browser across all four types (plain tap → say word; flap → lift/reveal +
confetti; mirror → camera + `flap-mirror`; game → `ask` prompt + choices) via
DOM assertions + a visual check.

**First new mechanic added the schema-driven way (2026-07-06):** the `odd-one-out` game type (`which-is-different` — 'which one is different?', 2-3y, critical-thinking) was added as **one schema branch + one `GAME_TYPES` registry entry + content** — no bespoke engine surgery. Games now have a `GAME_TYPES` registry mirroring `PAGE_TYPES`. This is the concrete proof of the milestone-3b payoff and the reference a graduated Gardener (milestone 4) will emulate.

This is the engine-half of the generative-UI substrate: the Gardener (once
graduated, milestone 4) proposes a new mechanic as a **schema branch + registry
entry** in one reviewed PR; the capability bound (`additionalProperties:false`)
and the Council gate it, and the fixed renderer picks it up.
