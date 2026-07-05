---
title: Grown-up Practice Card
type: feature
status: built
sources: [raw/research/gopnik-notes.md]
related: [wiki/concepts/the-12-month-arc.md, wiki/features/companion-guide.md]
updated: 2026-07-05
---

# Grown-up Practice Card

On each child's page, a calm collapsible card shows the current month's practice
(from the arc). Deliberately styled as adult-facing, distinct from the child's
bright play surfaces.

- Source of truth: `_data/arc.yml`; current month from `_data/children.yml`
  `month:` field. Rendered in `_layouts/child.html`.
- Shows: month title, the `onsite` prompt, the stance, the invitations
  (do + watch), and a link to the full `/companion/` guide.

**Acceptance:** child page shows "For the grown-up · Month N" card; expands to
stance + invitations; "Read the fuller guide" opens `/companion/`. Bumping
`month:` changes which card shows.
