# Little One

A gentle, growing first storybook for the little ones — meant to be used
**together**, on a lap, with a grown-up reading aloud and the child tapping along.

It's built to grow: as each child grows and you notice what delights them, you
add pages and word-games, and each child gets their own space that becomes more
specific over time.

---

## How it's put together

You almost never touch the code. Everything you'll change lives in three plain
text files:

| File | What it holds |
|------|----------------|
| `_data/stories.yml` | The stories — one block each, with pages to read and tap |
| `_data/wordgames.yml` | The "tap & find" word games |
| `_data/children.yml` | Each child: name, colour, and which stories/games they see |

The `assets/js/` files are the engine (art + player). Leave them be unless you
want to add a brand-new kind of picture.

---

## Everyday tasks

### Add a story
Open `_data/stories.yml`, copy an existing block, give it a new `id` and title,
and write the pages. Each page is a line to read, a picture (`art:`), a scene
colour (`sky:`), and a `cue:` — a little reminder for *you*, the grown-up.
Commit and push. The site rebuilds itself.

### Add a word game
Same idea in `_data/wordgames.yml`. List the things to find, each with an `art:`
key and the word to say (`label:`).

### Add a new grandchild
1. Open `_data/children.yml` and copy a child block. Give a new `id`, `name`,
   and `colour`. Choose their `stories` and `games` (use `all` to share
   everything, or list specific ids).
2. Run `bash new-child.sh` to create their page.
3. Commit and push.

### Make it specific to one child
In their block in `_data/children.yml`, list only the story/game ids you want
them to see, and use the `notes:` field to jot what they respond to and what to
add next. Those notes stay private — they never appear on the site.

### Add a new picture
Open `assets/js/art.js`, add a new key with a small SVG drawn on a 100×100
canvas, then use that key in a story or game.

---

## Available pictures (art keys)

sun · moon · star · bird · dog · cat · fish · duck · butterfly ·
flower · tree · cloud · rain · apple · ball · boat · car

## Scene colours (sky)

morning · day · garden · night · rain

---

## Publishing (GitHub Pages)

1. Create a new GitHub repository and push this folder to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source → GitHub Actions.**
3. Every push to `main` rebuilds and republishes automatically (via
   `.github/workflows/pages.yml`).

If the repo is `little-one`, the site lives at
`https://<your-username>.github.io/little-one/`.
To serve from the repo root instead (a `<username>.github.io` repo or a custom
domain), set `baseurl: ""` in `_config.yml` — it already is.

## Running it on your own machine (optional)

```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```

---

Made to be read slowly, in your own voice. 💛
