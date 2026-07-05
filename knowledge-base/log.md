# Log — Little One Knowledge Base

Append-only. Newest at the bottom. Each entry: date · what happened.

---

- 2026-07-05 · Knowledge base initialized (Karpathy LLM-wiki pattern). Three
  layers scaffolded: `raw/`, `wiki/`, `CLAUDE.md` schema. Founding fact set:
  the little one is 1 year old today; no names in this public repo.
- 2026-07-05 · Seeded wiki from existing build. Compiled concept pages
  (design-principles, gopnik-foundation, the-12-month-arc, privacy-model) and
  feature pages (storybook-player, tap-and-find-game, grown-up-card,
  companion-guide, per-child-structure) — all reflecting what's already built
  in the site + the arc update. Added research notes (gopnik-notes,
  age-1-baseline).
- 2026-07-05 · TODO for next session: this is a seed. Add real ideas/PRDs into
  `raw/` and ingest them. Run a first `lint` pass to confirm no names slipped in.
- 2026-07-05 · Added four foundational books as raw sources (web-researched, sourced):
  `raw/research/books/{scientist-in-the-crib, gardener-and-the-carpenter,
  mind-in-the-making, how-to-talk-little-kids}.md`. Ingested them into three new
  wiki concept pages: `book-foundations.md`, `seven-life-skills.md` (Galinsky's 7
  mapped to arc months), `responsive-talk.md` (talk toolkit). Updated
  `gopnik-foundation.md` provenance + `index.md` catalog.
- 2026-07-05 · Tone/ordering change (owner request): (1) reframed the site + KB away
  from "experiment/scientist" language to a shared *learning experience* — "the
  child as explorer"; Month 1 retitled "Let her explore." Touched `_data/arc.yml`,
  `_data/stories.yml`, `companion.html`, and the KB concept/research pages.
  (2) Child-first ordering: on the child page the grown-up card now renders BELOW
  the little one's stories/games (`_layouts/child.html`).
