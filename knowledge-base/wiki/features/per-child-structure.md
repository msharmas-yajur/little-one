---
title: Per-Child Structure
type: feature
status: built
sources: []
related: [wiki/concepts/privacy-model.md]
updated: 2026-07-05
---

# Per-Child Structure

The site supports multiple children from one shared content set, so it becomes
specific to each child over time.

- Registry: `_data/children.yml` — one block per child (id, name, colour,
  greeting, which stories/games via `all` or ids, `month:` pointer, `notes:`).
- Pages: a Jekyll collection `_children/` with permalink `/:name/`; the file's
  `name:` front matter sets the URL. `new-child.sh` scaffolds a page per child.
- **Privacy (see privacy-model):** use a **neutral id** for the URL; keep any
  real name out of the public repo; keep `notes:` generic or private.

**Acceptance:** home lists each child; each child page shows their content and
current-month card; adding a child = add a block + run `new-child.sh`.
