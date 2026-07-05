---
title: Privacy Model
type: concept
status: drafted
sources: []
related: [wiki/features/per-child-structure.md]
updated: 2026-07-05
---

# Privacy Model

The repo is public, so identity is kept out of it by design.

- **The founding fact carries no identity:** "the little one is 1 year old
  today." No name, birthdate, or location anywhere.
- **Neutral URL ids, personal display names (kept minimal).** In the site's
  per-child structure, the URL comes from a neutral id (e.g. `child-a` →
  `/child-a/`), while the on-page display name is set separately. Even display
  names should avoid real full names in a public repo — use a first name only if
  at all, or a gentle placeholder.
- **`notes:` are personal — reconsider in public.** The per-child `notes:` field
  holds observations about the child. In a public repo, keep these generic, or
  move sensitive observations to a private location, or make the repo private.
- **Ingestion strips names.** Any raw source containing a name gets the name
  removed during ingest, marked `[name removed]`.

Open decision for the owner: keep the repo public (with this discipline) vs.
make it private (simplest guarantee). Flag on every lint pass.
