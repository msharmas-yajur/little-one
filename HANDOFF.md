# HANDOFF — "Little One" storybook site

A Jekyll site for a growing, per-child first storybook. Used as a **lap activity**:
a grown-up reads aloud and the little one taps along. Built to grow over years —
content is separated from code so new stories, games, and children are added by
editing data files, not the engine.

This file is the context handoff for continuing work in Claude Code. The full
scaffold already exists (delivered as `little-one-site.zip`); unzip it into the
repo root before starting.

---

## Current state (already done, already validated)

- Full Jekyll scaffold built and structurally verified.
- All `_data/*.yml` parse cleanly (YAML validated).
- Liquid → `window.CHILD` JS injection produces **valid JavaScript** (node --check passed).
- Engine files `art.js` / `player.js` pass syntax checks.
- Every `art:` key referenced in content exists in the art library (17 pictures).
- `new-child.sh` tested end-to-end (adds a child page from the registry).
- **NOT yet done:** the actual `jekyll build` (the prior environment blocked
  RubyGems). First real build happens locally or via the GitHub Actions workflow.
- **NOT yet done:** git init, GitHub repo creation, first push, Pages enablement.

---

## Project structure

```
little-one/
├── _config.yml              # Jekyll config (baseurl currently "")
├── Gemfile                  # jekyll ~> 4.3
├── index.html               # HOME: lists all children from the registry
├── new-child.sh             # regenerates a page per child in the registry
├── README.md                # end-user maintenance guide
├── .github/workflows/pages.yml   # build + deploy to GitHub Pages on push to main
├── _data/
│   ├── stories.yml          # ← shared stories (EDIT THIS to add stories)
│   ├── wordgames.yml        # ← shared tap-&-find games
│   └── children.yml         # ← per-child registry (name/colour/which content)
├── _layouts/
│   ├── default.html         # base HTML shell
│   └── child.html           # resolves a child's content, injects window.CHILD
├── children/
│   └── little-one.html      # one stub page per child (front matter only)
└── assets/
    ├── css/style.css        # all styling
    └── js/
        ├── art.js           # SVG art library (17 keys)
        └── player.js        # interactivity engine (story player + game)
```

## How the content system works

- **Stories** and **word games** live in `_data/stories.yml` and
  `_data/wordgames.yml` as shared sets, each with an `id`.
- **`_data/children.yml`** is the registry. Each child block picks which content
  they see via `stories:` / `games:` (either the string `all`, or a list of ids).
  It also holds `colour`, `greeting`, and a private `notes:` field (never rendered).
- **`_layouts/child.html`** resolves the child's selected content from the shared
  data and emits it as `window.CHILD = {...}`. Then `art.js` + `player.js` render
  the interactive menu, story player, and game.
- **Adding a child** = add a block to `children.yml`, run `bash new-child.sh`,
  commit. The script creates `children/<id>.html`.

### Art keys available
`sun moon star bird dog cat fish duck butterfly flower tree cloud rain apple ball boat car`

### Scene colours (story `sky:`)
`morning day garden night rain`

---

## Design/behaviour rules to preserve

- This is a **shared lap activity**, not solo screen use. Keep the grown-up
  `cue:` prompts on story pages. Keep the "for grown-ups" note on the home page.
- The game must stay **forgiving**: wrong taps nudge/wobble, never scold, never
  end the game. No timers, no scores that can be "lost," no fail states.
- Big tap targets, soft chime sounds (Web Audio, no asset files), gentle motion,
  and `prefers-reduced-motion` respected. Don't regress these.
- Art is original SVG. Do not add copyrighted characters or third-party images.

---

## Tasks to pick up in Claude Code

1. **Initialize and publish**
   - `git init`, commit the scaffold, create a GitHub repo, push to `main`.
   - **Recommend a PRIVATE repo** — this will hold grandchildren's real names and
     personal notes. Decide with the owner whether Pages should serve publicly
     (private repo + Pages needs a paid GitHub plan) or stay fully private/local.
   - Enable **Settings → Pages → Source → GitHub Actions**.
   - If the repo is `little-one` (not `<user>.github.io`), set
     `baseurl: "/little-one"` in `_config.yml`. If root/custom domain, leave `""`.

2. **First local build sanity check**
   - `bundle install && bundle exec jekyll serve`
   - Verify: home lists the child; the child page shows story + game menus; a
     story turns pages and the hero art taps/wobbles; the game asks "find the X"
     and rewards the right tap. Check on a narrow (phone) viewport too.

3. **Privacy option (discuss with owner)**
   - Consider keeping real names out of public URLs: use a neutral `id` in
     `children.yml` (e.g. `child-a`) while the displayed `name` stays personal,
     so the URL is `/child-a/` not `/real-name/`.

4. **Content backlog (as the owner gives feedback)**
   - Add the child's real name into a story line (owner requested this idea).
   - Optional: real animal sounds on tap (woof/quack) — currently soft chimes.
   - New stories/word sets for older age stages as she grows.

---

## Owner context

- Owner is comfortable with GitHub, pnpm/React/TS stacks, self-hosted CI. Jekyll
  chosen deliberately for content/code separation and native GitHub Pages support.
- The interactive parts are intentionally vanilla JS (no build step) so they just
  work when Jekyll serves them.
- Iteration loop the owner wants: they observe what delights each child → describe
  it → get a ready-to-paste YAML block → commit → Pages redeploys.

---

## Suggested first prompt in Claude Code

> I've unzipped the Little One Jekyll site into this repo. Read HANDOFF.md, then
> help me: (1) do a local `jekyll serve` sanity check and fix anything that
> breaks, (2) set up a private GitHub repo and the Pages Actions workflow, and
> (3) advise on keeping the children's real names out of public URLs. Preserve the
> design rules in the handoff (lap activity, forgiving game, original art).
## UPDATE — 12-month grown-up arc added

The site now includes a **Gopnik-based 12-month practice for the grown-up**
(not a curriculum for the child). New pieces:

- `_data/arc.yml` — 12 monthly themes. Each: `stance`, `why`, `story`/`game`
  links, `onsite` (short prompt), and `invitations` (each a `do:` + `watch:`).
- `companion.html` → served at `/companion/`, auto-built from `arc.yml`.
- `_data/children.yml` now has a `month:` field per child (1–12) controlling
  which "For the grown-up" card shows on their page.
- `_layouts/child.html` renders that card (a `<details>` block) above the menus.
- New story `things-that-fall` added to `stories.yml` (Month 1's story).
- Companion Word doc generated by `gen-companion.js` (not in the site build;
  it's a separate deliverable). Regenerate if `arc.yml` changes.

**Validated:** all 4 data files parse; all 12 months link to real stories/games;
child `month:` pointers resolve; template Liquid/HTML tags balanced. Still not
run: the real `jekyll build` (sandbox blocked RubyGems) — first build is local
or via Actions.

**Design rule to preserve:** the arc is a practice for the ADULT. Never turn the
monthly themes into pass/fail tasks for the child, add scores, or make the child
"complete" a month. The child just plays; the grown-up practises.

**Extra task:** when moving to a new month, bump `month:` in `children.yml` and
push. When editing `arc.yml`, offer to regenerate the companion .docx to match.
