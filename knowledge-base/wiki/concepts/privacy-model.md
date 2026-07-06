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

> **Generation is global; personalization is local; the feedback that connects
> them is anonymized and aggregate.**
> Anything generated from the *published KB* (a public repo) is privacy-clean by
> construction. Personalization (which experience is served/composed) stays
> on-device with no LLM. The one place data flows *out* is a deliberately narrow
> channel — see the three-line rule below.

**The three-line rule (owner decision, 2026-07-06):**
1. **Raw per-child behavior never leaves the device.** The dyad profile — the
   per-child event trace — stays local, is never uploaded, and never enters a
   prompt. Unchanged hard line.
2. **Only aggregate, anonymized, threshold-gated *cohort* signals may leave**
   (opt-in), and only those feed dev-level generation — e.g. "at 12–18mo the
   `challenges` skill shows low completion." Never a raw per-child event stream,
   never an identifier. A child's interaction *sequence* is itself a fingerprint,
   so **per-child traces are out** for the shared app (they'd need differential
   privacy + explicit consent). Aggregation happens on-device; only cohort
   counts above a minimum-N threshold are emitted.
3. **True per-child learning lives in the family's own instance** (the
   bring-your-own-key tier): the family adds their own key, and per-child data
   stays with them — their device, their account, their key — never touching the
   shared app or the dev level.

**No LLM ever runs on the child's device.** LLM access exists only at the
*development* level (build-time generation from anonymized cohort signals + the
KB), and — in the future BYO-key tier — inside the *family's own* instance on the
*family's own* key. Privacy is enforced at the **data-flow boundary** (what
leaves the device / enters a prompt), not by restricting generative capability.
Profile portability, when wanted, goes through the **family's own platform
account** (iCloud/Google app-data — their custody); we never operate an identity
service.

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
