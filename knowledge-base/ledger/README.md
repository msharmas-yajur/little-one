# The Learning Ledger

Append-only structured feedback events — the repo's preference dataset
(PRD 0004). Nothing here is ever edited or deleted; the Librarian reads it
and distills `wiki/lessons/`, humans gate everything.

- `council/`   — one file per Council review: front-matter (artifact, decision,
  per-seat votes) + the full report. Written by the council workflow (arc 1).
- `decisions/` — one file per sovereign verdict: what was proposed, what the
  gates said, what the owner did, and the one-line why (arc 2).
- `signals/`   — aggregate cohort behavioral events (arc 4; deferred until the
  opt-in transport design is separately approved).

No child data ever appears here: council/ and decisions/ are decisions about
*content*; signals/ (later) carries only aggregate cohort counts per the
three-line privacy rule (PRD 0003).
