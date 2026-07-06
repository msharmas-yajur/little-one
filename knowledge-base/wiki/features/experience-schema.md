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

**Next (3b):** make `player.js` a pure schema-driven renderer (type→renderer
registry) so adding a type is a data + one-function change — done with full
in-browser regression testing of every existing experience.
