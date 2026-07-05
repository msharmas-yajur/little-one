# CLAUDE.md — Knowledge Base Schema & Operating Rules

> This file governs how any LLM session (Claude Code web/CLI, or a chat session
> with file access) works with this knowledge base. Read it first, every time,
> before ingesting, querying, or editing anything here.

This is a **Karpathy-style LLM wiki** for the *Little One* project — a growing,
per-child first-storybook website (a shared lap activity for a grown-up and a
very young child). The knowledge base is where ideas, intent, and specs
accumulate so the website can be enhanced through conversation against a stable
source of truth, rather than through scattered one-off chats.

---

## The founding fact (applies everywhere, always)

**The little one is 1 year old today.** All content, specs, and reasoning assume
that starting point and a developmental arc forward from it. Reproduce this
assumption in any new page you write.

**No names. Ever.** This repo is public. Never write a real child's name, a
family member's name, birthdate, location, or any identifying detail into any
file. Refer only to "the little one," "the grown-up," "a second child," etc.
If a source handed to you contains a name, strip it during ingestion and note
`[name removed]`. Treat this as a hard rule, not a preference.

---

## The three layers

1. **`raw/`** — Immutable source material *you* provide. Ideas, PRDs, research
   notes, feedback from using the site with the little one. **The LLM reads
   these but never edits or deletes them.** Subfolders:
   - `raw/ideas/`     — loose ideas, feature wishes, observations
   - `raw/prds/`      — product requirement docs for specific features
   - `raw/research/`  — developmental-science notes, references, rationale
2. **`wiki/`** — LLM-generated, LLM-owned synthesis. Compiled specs, concept
   pages, feature pages, cross-references. **The LLM writes and maintains this
   entirely.** Subfolders:
   - `wiki/features/` — one page per feature (compiled from raw + decisions)
   - `wiki/concepts/` — durable concepts (design principles, the arc, safety)
3. **This schema (`CLAUDE.md`)** — the rules. Rarely changes.

Plus two navigation files the LLM keeps current:
- **`index.md`** — the catalog: every page, one line each, grouped by layer.
- **`log.md`**   — append-only timeline: what was ingested/changed and when.

---

## The three operations

### Ingest
> "Read `raw/ideas/<file>` and integrate it into the wiki."

Steps: read the raw source → strip any names → identify which wiki feature/
concept pages it affects → update or create those pages → add cross-links →
update `index.md` → append a line to `log.md`. Never modify the raw file.

### Query
> "What have we decided about the grown-up card?"

Answer from the **wiki** (the compiled pages), not by re-reading all of raw.
If the wiki doesn't cover it, say so, then optionally check raw and offer to
compile a new page. Good answers can be filed back as wiki pages.

### Lint
> "Run a lint pass."

Check, in order: (1) any real names or identifying details anywhere → **flag
loudly, highest priority**; (2) contradictions between pages; (3) orphan pages
(nothing links in); (4) concepts mentioned but missing their own page; (5) wiki
claims that don't trace to a raw source; (6) stale references to site files that
no longer exist. Produce a short report. Don't auto-fix names silently — surface
them.

---

## How wiki pages must be structured

Every `wiki/` page starts with YAML frontmatter, then the body:

```
---
title: <page title>
type: feature | concept
status: idea | drafted | specced | built | archived
sources: [raw/ideas/foo.md, raw/prds/bar.md]   # provenance — where this came from
related: [wiki/features/other.md]               # cross-links
updated: YYYY-MM-DD
---
```

Body conventions:
- State the **intent** (what problem for the little one or the grown-up).
- State the **decision(s)** made, and *why* (link the rationale).
- For features, include an **acceptance sketch**: what "done" looks like on the
  site, in plain language a non-developer can check.
- Keep pages **short**. Simplify aggressively — a large KB rots. One idea per
  page; link rather than repeat.
- Every claim that comes from developmental science should link to a
  `raw/research/` note, so it's traceable (guards against baked-in errors).

---

## Relationship to the website

The website is the rest of this repo (Jekyll site: `_data/`, `_layouts/`,
`assets/`, etc.). The knowledge base is the *thinking* behind it; the site is the
*build*. A typical loop:

1. You drop an idea or PRD into `raw/`.
2. A session ingests it → compiles/updates a `wiki/features/` page.
3. When a feature page reaches `status: specced`, a session implements it in the
   actual site files (`_data/arc.yml`, `_layouts/`, etc.), then sets the page to
   `status: built` and logs it.

The website's own design rules (a lap activity; a forgiving, no-fail game; the
arc is a practice for the ADULT not a curriculum for the child; original art
only; no names) are recorded in `wiki/concepts/` and must be preserved by any
implementation work.

---

## Safety & tone guardrails (carry into every spec)

- Everything targets a **1-year-old used together with a grown-up**. Nothing
  designed for solo/unsupervised child screen use.
- Developmental claims should reflect mainstream science (the project leans on
  Alison Gopnik). When unsure, mark it as an assumption and suggest the
  grown-up confirm anything child-specific with a pediatrician.
- This KB gives the general picture; it is not personalized medical or
  developmental advice for a specific child.
