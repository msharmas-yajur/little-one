# The Experience Schema

`experience.schema.json` is the **capability-bounded declarative language** the
fixed engine (`assets/js/player.js`) renders — PRD 0003 milestone 3, the
substrate for generative UI done on our terms.

## Why it exists (the safety model)

Generated UI is safe here **not** because a reviewer reads every generated line,
but because of what the language *cannot say*. Every object in the schema is
`additionalProperties: false` over a **closed field vocabulary**, so there is no
way to write `onclick`, `url`, `script`, `fetch`, `style`, or a storage call —
those fields simply don't exist. A generator (the Gardener) can only fill in the
fields the schema defines. Generated UI is sandboxed by the grammar, not by
trust.

## Types today (v1)

Extracted from the mechanics already shipped:

- **story** → `pages[]`, each page exactly one of:
  - **plain page** — `sky`, `line`, `art`, `cue`
  - **flap page** — `flap: true`, `art`, `line`, `reveal`, `cue` (lift-the-flap)
  - **mirror page** — `mirror: true`, `line`, `reveal`, `cue` (on-device camera)
- **game** — `items[]` of `{art, label}`, optional `ask` template with a `{label}` slot

Closed enums: `sky`, `age_band`, `skills`. `art` is a string whose **existence**
in `assets/js/art.js` is checked by `lint.rb` (this schema checks shape; lint
checks the registry and content safety).

## Classes vs instances (the gate boundary)

- **Instance** = a new story/game that fits an existing type → the Gardener may
  generate it; the gate (`schema/validate.py`) must pass.
- **Class** = a new field, a new page/game type, or any schema edit → **human-gated**.
  This is enforced structurally: new content that isn't expressible in the
  current schema fails `validate.py`, so it cannot slip through as an instance.

## Run it

```
python schema/validate.py           # validate _data/*.yml against the schema
pip install jsonschema pyyaml       # deps (CI installs these)
```

Wired into both gates: `.github/workflows/gardener-lint.yml` (human PRs) and the
in-workflow gate in `.github/workflows/gardener.yml` (bot proposals).

## 3b — done

`player.js` is now a **pure schema-driven renderer**: a `PAGE_TYPES` registry
(`plain`/`flap`/`mirror`) with one `pageType(p)` discriminator replaced the
per-type conditionals. Adding a page type is one registry entry + its schema
branch. Verified behaviour-identical across all four experience types in-browser.
Next: the Gardener graduates (milestone 4) to propose a mechanic as a schema
branch + registry entry in a reviewed, capability-bounded PR.
