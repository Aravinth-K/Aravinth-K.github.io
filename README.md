# Site Guide

Everything you need to know about updating your site at akulanthaivelu.com.

## Running locally

```bash
export PATH="/opt/homebrew/opt/ruby/bin:$HOME/.gem/ruby/4.0.0/bin:$PATH"
export GEM_HOME="$HOME/.gem/ruby/4.0.0"
bundle exec jekyll serve
```

Then open http://localhost:4000. Changes auto-reload.

You can put those `export` lines in your `~/.zshrc` so you don't have to type them every time.

## The writing reference

`/writing-reference/` is an unlisted page (nothing links to it, it's not in the feed or sitemap) with a live demo of the spool system and the post syntax — open it while writing. The source is `_pages/writing-reference.md`.

## Creating a new post

Create a file in `_posts/` named `YYYY-MM-DD-your-title.md`. The date and slug in the filename determine the URL.

Every post starts with **front matter** between `---` fences:

```markdown
---
layout: post
title: "Your post title"
date: 2026-03-26
description: A short summary shown in listings
tags: [maths, physics]
---

Your content here in **markdown**.

Inline maths: $e^{i\pi} + 1 = 0$

Display maths:

$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
```

### Front matter options

| Field         | Required? | What it does                              |
|---------------|-----------|-------------------------------------------|
| `layout`      | yes       | Always `post`                             |
| `title`       | yes       | Post title                                |
| `date`        | yes       | Publication date (YYYY-MM-DD)             |
| `description` | no        | Short summary for listings                |
| `tags`        | no        | List of tags, e.g. `[maths, geometry]`    |
| `series`      | no        | Series name (see below)                   |
| `series_order`| no        | Position in the series (1, 2, 3...)       |
| `interactive` | no        | Set `true` to load Three.js for 3D viz    |
| `enable_math` | no        | Math is on by default; set `false` to disable |

## Adding images

1. Put image files in `assets/img/`
2. Reference them in your post:

```markdown
![Description of the image](/assets/img/my-image.jpg)
```

For more control (sizing, captions), use raw HTML:

```html
<figure>
  <img src="/assets/img/my-image.jpg" alt="Description" style="max-width: 500px;">
  <figcaption>Caption text here.</figcaption>
</figure>
```

## Using the spool system

Spools let you hide detail (proofs, derivations, tangents) behind a clickable trigger. The detail unfolds inline beneath the trigger, hanging from a knotted thread, and you can nest spools for deeper levels. Escape folds the most recent spool back up.

In your markdown, write:

```html
<div class="spool" data-title="Proof of Theorem 1">
<div class="spool-content" markdown="1">

Your detailed content here. **Markdown** and $\LaTeX$ work inside.

You can nest another spool for even deeper detail:

<div class="spool" data-title="Supporting lemma">
<div class="spool-content" markdown="1">

Deeper content here...

</div>
</div>

</div>
</div>
```

**Important notes:**
- The `markdown="1"` attribute on `spool-content` is essential — it tells kramdown to process the markdown inside the HTML div.
- Leave blank lines between the `<div>` tags and your markdown content.
- You can nest as deep as you like. Each level opens a new column further right.

## Creating a series

A series links posts into a coherent ordered sequence, visualised as a spanning tree on the `/series/` page.

1. Add `series` and `series_order` to each post's front matter:

```yaml
---
layout: post
title: "Foundations"
series: "Random geometry"
series_order: 1
---
```

```yaml
---
layout: post
title: "Path integrals"
series: "Random geometry"
series_order: 2
---
```

2. For branching trees (not just linear sequences), add `series_parent`:

```yaml
---
layout: post
title: "2D quantum gravity"
series: "Random geometry"
series_order: 3
series_parent: "foundations"  # slug of the parent post
---
```

Without `series_parent`, all posts hang directly off the series root.

Posts in a series automatically show prev/next navigation.

## Adding PDFs to the library

1. Drop PDF files into `assets/pdf/`
2. They appear automatically on the `/library/` page
3. Filenames are used as display names (dashes and underscores become spaces)

That's it. No configuration needed.

## Deploying

Push to the `master` branch. The GitHub Action at `.github/workflows/deploy.yml` builds the site and deploys it automatically.

```bash
git add -A
git commit -m "your message"
git push
```

The site usually updates within a couple of minutes.

## Theme & colour palettes

The site has light ("warm paper") and dark ("lamplight") themes, and a set of swappable **colour palettes**. Visitors get their OS theme by default and can flip the lamp toggle in the header; the swatch button beside it opens the palette picker. Both choices persist in `localStorage`.

**All colours live in one file: `_data/palettes.yml`.** Each entry defines a named palette with a full light and dark set of tokens; from that single file the build generates the CSS, the picker menu, and the browser-chrome tint. Nothing else needs editing.

- **Try a palette**: use the picker in the header, or open any page with `?palette=indigo` (etc.) — handy for comparing side by side in two windows.
- **Add a palette**: copy an existing entry in `_data/palettes.yml`, rename it, change the values. It appears in the picker automatically.
- **Retire a palette**: delete its entry. (Visitors who had it stored fall back to the default.)
- **Choose the winner**: move it to the top of the file — the first entry is the site default, used before JavaScript runs and for the no-JS dark fallback. (Current winner: **Deep Sans**.)
- **Hide the picker**: `show_palette_picker: false` in `_config.yml` (currently off). Everyone gets the default palette and stored choices are ignored; `?palette=name` still previews one for a single page load. Flip to true to bring the picker back.
- Palette-independent details (paper grain, shadows) live in `_sass/_variables.scss`.

Current palettes: **Ember** (warm cream & coral thread), **Indigo** (cool bone & ultramarine, copper counterpoint), **Moss** (sage & fern, madder counterpoint), **Mulberry** (blush & orchid, teal counterpoint), **Kappa** (research-plot steel blue and navy printed on warm ivory, green counterpoint, crimson selection — drawn from `returns_kv0.5.png`), **Deep** (the same figure's full triad on true white: crimson links, steel-blue threads, green surface), **Deep Sans** (Deep with Lato for body text too — colours aliased from Deep so they never drift), **Lab** (after Thinking Machines Lab: pure-white monochrome memo, grotesque headings, grey underlined links), **Log** (after Lil'Log: white page, quiet greys, one brick-coral accent), **Sumi** (monochrome ink with a vermilion seal).

A palette may also override the typefaces with an optional `fonts:` key — Lab swaps the display serif for Archivo, and Kappa and Log use Lato headings (chosen over its sibling Carlito, whose Calibri softness read as anonymous at display sizes). Faces a palette names must be loaded in `_includes/head.html`.

## Customising

| What                | Where                                          |
|---------------------|------------------------------------------------|
| Site title & URL    | `_config.yml`                                  |
| Colour palettes (all of them) | `_data/palettes.yml`                 |
| Typography          | `_sass/_variables.scss` (fonts load in `_includes/head.html`) |
| Page layout, hero, footer, 404 | `_sass/_layout.scss`                |
| Nav links           | `_includes/header.html`                        |
| Show/hide Series    | `show_series` in `_config.yml`                 |
| Footer text         | `_includes/footer.html`                        |
| About page          | `_pages/about.md`                              |
| Theme toggle, palette picker, reading progress | `assets/js/site.js` |

## File structure at a glance

```
_data/palettes.yml → all colour palettes (the single source of truth)
_posts/          → blog posts (markdown)
_pages/          → standalone pages (about, blog listing, library, series)
_layouts/        → HTML templates
_includes/       → reusable HTML fragments (head, header, footer)
_sass/           → stylesheets (SCSS)
assets/
  css/           → compiled CSS entry point
  js/            → JavaScript (site chrome, spool, surface viz, series tree)
  img/           → images
  pdf/           → PDFs for the library
_config.yml      → site configuration
Gemfile          → Ruby dependencies
```
