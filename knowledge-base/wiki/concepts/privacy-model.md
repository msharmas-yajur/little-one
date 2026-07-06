---
title: Privacy Model
type: concept
status: drafted
sources: [raw/prds/0003-generative-arc.md]
related: [wiki/features/per-child-structure.md, wiki/features/review-council.md]
updated: 2026-07-06
---

# Privacy Model

The repo is public, so identity is kept out of it by design.

## The governing principle (owner decision, 2026-07-06 — PRD 0003)

The app is a **digital replica of a physical book**: the book never knows the
child — the *lap* does. Therefore:

> **Generation is global; personalization is local.**
> Anything generated from the *published KB* (a public repo) is privacy-clean
> by construction, no matter how generative the pipeline becomes. The one hard
> line: **child signals are never generation input.** The on-device dyad
> profile only *selects and parameterizes* among generated experiences — it
> chooses from the shelf; it never phones the publisher.

Privacy is enforced at the **data-flow boundary** (what enters a prompt/leaves
the device), not by restricting generative capability. Future profile sync, if
wanted, goes through the **family's own platform account** (iCloud/Google
app-data — their custody); we never operate an identity service.

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
