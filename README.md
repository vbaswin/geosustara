# Geosustara Enviro Services LLP — website

Static website for **geosustara.com**. Built with [Eleventy](https://www.11ty.dev/); the output in
`_site/` is plain HTML, CSS, JS and images that will run on any web host.

---

## Quick start

Node.js lives **inside this project** at `.tooling/node`. Nothing was installed system-wide, so
you must put it on the PATH for the current terminal session before running any command.

**PowerShell**

```powershell
$env:PATH = "$PWD\.tooling\node;$env:PATH"
npm run dev
```

Then open <http://localhost:8080>. The site rebuilds as you edit.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with live reload |
| `npm run build` | Production build into `_site/` (minified HTML) |
| `npm run serve` | Serve an already-built `_site/` on port 8080 |
| `npm run images` | Regenerate responsive images from `src/assets/img/raw/` |
| `npm run licenses:report` | Rewrite `LICENSES-THIRD-PARTY.csv` |
| `node .tooling/verify.mjs` | **Run after every build** — validates SEO tags, structured data, headings, and every internal link |
| `node .tooling/build-brand.mjs` | Regenerate favicons, PWA icons and the Open Graph card |

> To remove the toolchain entirely, delete `.tooling/` and `node_modules/`. Nothing else on the
> machine is touched.

---

## Deploying

### Vercel (recommended — connects straight to the GitHub repo)

`vercel.json` is committed, so the build settings are read automatically. No CLI needed.

1. Go to <https://vercel.com/new> and sign in **with GitHub**.
2. Import `vbaswin/geosustara`. Vercel picks up from `vercel.json`:
   install `npm ci`, build `npm run build`, output `_site`.
3. Before the first deploy, open **Environment Variables** and add:

   | Name | Value | Why |
   |---|---|---|
   | `NOINDEX` | `1` | Keeps the temporary `*.vercel.app` URL out of Google, so it never competes with geosustara.com later |

4. Deploy. You get a shareable `https://<project>.vercel.app` URL in about a minute.
5. *Optional, after the first deploy:* add `SITE_URL` set to that `.vercel.app` address and
   redeploy. Canonical tags, the sitemap, the RSS feed and the structured data will then point at
   the URL people are actually visiting instead of geosustara.com.

**When you go live on the real domain:** add `geosustara.com` under Settings → Domains, then
**delete both `NOINDEX` and `SITE_URL`** and redeploy. The site falls back to the production URL
in `site.json` and becomes indexable. Forgetting to remove `NOINDEX` means Google never indexes
the site at all, so this step matters.

Every push to `main` redeploys automatically. Pull requests get their own preview URL.

### GitHub Pages

`.github/workflows/pages.yml` builds the site with Eleventy and publishes it. **One setting has
to be changed by hand, once:**

> Repository **Settings → Pages → Build and deployment → Source**, change
> **"Deploy from a branch"** to **"GitHub Actions"**.

Until that is done, GitHub ignores the workflow and runs its own Jekyll build against the source
instead, which fails with `Liquid syntax error: Unknown tag 'from'` — Jekyll cannot parse the
Nunjucks templates this site is written in. Nothing in the repository can override that setting.

The workflow sets `PATH_PREFIX` and `SITE_URL` from the Pages configuration automatically, so the
site works at `https://<user>.github.io/<repo>/` without any edit. It also sets `NOINDEX=1`, which
keeps the github.io copy out of search results so it never competes with geosustara.com. If Pages
ever becomes the production host, remove that line from the workflow.

### Any other host

Run `npm run build` and upload the **contents of `_site/`** to your web root. Works on Netlify,
Cloudflare Pages or ordinary cPanel/shared hosting. For Netlify or Cloudflare Pages, set build
command `npm run build` and publish directory `_site`.

### Environment variables

All three are optional and unset by default.

| Variable | Effect |
|---|---|
| `SITE_URL` | Overrides the canonical base URL from `site.json`. Use on preview deployments. |
| `NOINDEX` | Set to `1` to add `noindex,nofollow` to every page and serve a `Disallow: /` robots.txt. |
| `PATH_PREFIX` | Sub-directory the site is served from, e.g. `/geosustara/`. Defaults to `/`. Only needed when the site is not at the domain root. |

Internal links go through Eleventy's `url` filter and absolute URLs through the `absUrl` filter,
so `PATH_PREFIX` is the only thing that needs setting — no template edits. Note that the two are
not combined: `absUrl` applies the prefix itself, so `x | url | absUrl(siteUrl)` would apply it
twice.

**Three things to configure at the host:**

1. **HTTPS** — required. Most hosts issue a free certificate automatically.
2. **Pick one canonical hostname.** The site declares `https://geosustara.com` (no `www`).
   Redirect `www.geosustara.com` → `geosustara.com` with a 301, or change `url` in
   `src/_data/site.json` if you prefer `www`. Serving both without a redirect splits your
   ranking signals across two addresses.
3. **404 page** — point the host's not-found handler at `/404.html`.

---

## Editing content

Almost everything lives in two data files.

### Contact details, navigation, vision/mission — `src/_data/site.json`

Change the phone number here and it updates in the header, footer, every service page, the mobile
menu, and the structured data Google reads. There is no second place to edit.

### Services — `src/_data/services.json`

Each entry generates a full page at `/services/<slug>/` plus its cards on the home, services and
contact pages, its footer link, and its `Service` structured data. To add a sixth service, copy an
existing block and change the fields. Nothing else needs touching.

| Field | Purpose |
|---|---|
| `slug` | URL segment. Changing it changes the page address — set up a redirect if the page is already indexed. |
| `metaTitle` | Search-result title. **Keep under ~48 characters** — " \| Geosustara" is appended. |
| `metaDescription` | Search-result snippet. **Keep under 155 characters.** |
| `bullets` | The list from your source document, shown on cards and as "What we deliver". |
| `detail` | The long-form sections on the service page. |
| `faqs` | Rendered as an accordion **and** emitted as FAQ structured data, which can earn expanded search results. |

### The "on this page" bar

Long pages show a slim sticky bar under the header that lists the page's sections and highlights
the one you're reading. It appears once you scroll past the hero.

- **Home, About and service pages** declare their sections in front matter:

  ```yaml
  sections:
    - { id: services, label: Services }
    - { id: approach, label: Approach }
  ```

  The `id` must match an element `id` on the page.

- **Articles build it automatically** from their `<h2>` headings — nothing to configure. That
  behaviour comes from `autoToc: true` in `src/insights/posts/posts.json`.

- Pages that declare neither simply don't render the bar.

The top navigation deliberately stays a *page* navigation and marks the current page with
`aria-current`. Section tracking is this bar's job, which is why the two never conflict.

### Insights articles

Add a Markdown file to `src/insights/posts/`. Copy the front matter from an existing article:

```yaml
---
title: "Your headline"
description: "Search snippet, under 155 characters."
category: "GIS & Geospatial"     # or Compliance, Sustainability
date: 2026-09-15
image: card-gis                   # card-gis | card-comp | card-sust
imageAlt: "Description of the image for screen readers."
readingTime: 6
---
```

The article appears automatically on `/insights/`, on the home page, in `sitemap.xml` and in the
RSS feed. **Publishing regularly is the single biggest thing you can do for search rankings** —
technical setup alone plateaus.

---

## Turning on the enquiry form

The form currently tells visitors to phone or email, because a static site cannot receive form
submissions by itself. To activate it:

1. Create a free account at [Formspree](https://formspree.io) (or [Web3Forms](https://web3forms.com)).
2. Create a form; copy the endpoint URL.
3. Put it in `src/_data/site.json`:

   ```json
   "formEndpoint": "https://formspree.io/f/xxxxxxxx",
   ```

4. Rebuild. Submissions will arrive at **geosustara@gmail.com**.

The form already has a honeypot field for spam, browser validation, and inline success/error
messages — no other change is needed.

---

## Before and after launch — SEO checklist

The code side is done: structured data, sitemap, canonicals, Open Graph, semantic markup and
performance. These remaining items are account actions only you can perform, and they matter more
than any further code change.

- [ ] Verify the domain in [Google Search Console](https://search.google.com/search-console) and
      submit `https://geosustara.com/sitemap.xml`
- [ ] Create a [Google Business Profile](https://business.google.com) with **exactly** the address,
      phone and name used on this site — inconsistent details across the web actively hurt local
      ranking. Set the precise map pin there.
- [ ] Do the same on Bing Webmaster Tools
- [ ] Update `map` in `site.json` with your exact coordinates (right-click your building in Google
      Maps → copy lat/lng) and raise `zoom` to 16. It is currently neighbourhood-level.
- [ ] Get listed in relevant Indian industry and local directories, using identical contact details
- [ ] Publish an article every few weeks
- [ ] Re-run [PageSpeed Insights](https://pagespeed.web.dev) against the live URL after launch

**An honest expectation:** technical SEO makes a site *eligible* to rank. Actually ranking for
competitive national terms takes content depth, other sites linking to you, and months of
consistency. Local Thiruvananthapuram and Kerala terms should move much faster.

---

## What is placeholder, and what is real

**Real** — every word of copy derives from your source document, plus the address, phone and email
you supplied.

**Not present, because you have not supplied it** — and deliberately not invented:

- Year founded, team size, staff names or photographs
- Client names, logos, testimonials, case studies
- Certifications, accreditations, empanelments, registration numbers
- Project counts, statistics, awards
- Pricing
- Social media links

Send me any of these and they can be added. Please do not have someone else add invented versions:
false credentials on a compliance consultancy's website are a genuine liability.

**One thing worth your review:** the service pages elaborate on your bullet points — describing what
each type of work involves in practice. This is expansion of your document, not invention, but you
know the business and I do not. Please read `src/_data/services.json` and correct anything that
does not match how you actually work.

---

## Licensing

Everything here is clear for commercial use on a paid domain.

| Asset | Source | Licence |
|---|---|---|
| Photography | NASA / USGS Earth-observation imagery | Public domain |
| Fonts | Space Grotesk, Inter, IBM Plex Mono (Google Fonts) | SIL Open Font License |
| GSAP | greensock.com | Standard "no charge" licence — explicitly permits commercial sites where visitors are not charged |
| Lenis | darkroom.engineering | MIT |
| Leaflet | leafletjs.com | BSD-2-Clause |
| Map tiles | OpenStreetMap / CARTO | ODbL, attributed on the map |
| Logo, icons, all graphics | Drawn for this project | Yours |

`LICENSES-THIRD-PARTY.csv` is the full register of all 267 packages, including build-time tools
that never reach a visitor's browser. Regenerate it with `npm run licenses:report`.

**No stock photography and no licensed typefaces are used anywhere**, which was a requirement.

> **Map tiles:** CARTO's basemaps are free at low volume. If traffic grows, move to a paid tile
> plan or swap in an OpenStreetMap embed — see `src/assets/js/main.js`, the `#map` block.

---

## How it is put together

```
src/
├── _data/           site.json + services.json  ← edit content here
├── _includes/
│   ├── layouts/     base, page, post
│   └── partials/    header, footer, icons, structured data, contact form
├── assets/
│   ├── css/         one hand-written stylesheet, no framework
│   ├── js/          one file, guards for elements that may not exist
│   ├── img/         generated responsive images (raw/ holds the originals)
│   └── vendor/      GSAP, Lenis, Leaflet — served from your own domain
├── insights/posts/  Markdown articles
├── services/        detail.njk generates all five service pages
└── root/            favicon, manifest, icons — copied to the web root
```

**Performance choices that should not be undone:**

- Image colour treatment is baked in at build time, not applied as a CSS `filter`. Do not re-add a
  filter to the hero — it would double-apply and cost a compositor pass on the largest element.
- The hero `srcset` intentionally stops at 1440w. It sits under a dark scrim with a sub-pixel blur
  already baked in, so a 1920 variant is invisible but 70% heavier on the metric Google measures.
- Leaflet loads only when the map nears the viewport. That is worth 144 KB on every page view.
- All animation is disabled under `prefers-reduced-motion`, and every element still reaches its
  final state. Append `?motion=1` to any URL to preview the animation regardless.
