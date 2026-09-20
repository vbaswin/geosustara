# Launch plan and handover — geosustara.com

*Written 20 September 2026. Start here if you are picking this up after a break, or if
someone new — person or assistant — is working on the site.*

Three documents cover everything:

| | |
|---|---|
| **This file** | What state the site is in, what happens next, and in what order |
| [`DOMAIN-AND-HOSTING.md`](DOMAIN-AND-HOSTING.md) | Registrars, hosts, payment from India, DNS, business email — the detail behind steps 1–3 and 6 |
| [`../README.md`](../README.md) | How the site is built and how to edit it |

---

## 1. Where things stand

**The site is finished and deployed to a preview URL. It is not on the real domain yet,
and the domain has not been bought.**

- **Repository:** `vbaswin/geosustara`, branch `main`
- **Preview:** <https://vbaswin.github.io/geosustara/> — built by GitHub Actions on every
  push. It carries `NOINDEX`, so Google will never index it and it can never compete with
  geosustara.com. Safe to share with anyone.
- **Production domain (planned):** `https://geosustara.com` — already set as `url` in
  `src/_data/site.json`, so nothing needs editing when you buy it.

### Pages that exist

```
/                                                  home
/services/                                         index of six services
/services/environmental-compliance-consulting/
/services/environmental-impact-assessment-ec/
/services/gis-remote-sensing-mapping/
/services/water-wastewater-solid-waste-management/
/services/sustainability-eco-solutions/
/services/training-research-technical-support/
/about/                                            incl. vision, who we serve, approach
/contact/                                          incl. enquiry form and locator map
/contact/thank-you/                                noindex, excluded from the sitemap
/privacy/
/insights/                                         3 articles
/404.html
```

### What was done on 19–20 September 2026

The site was rebuilt around the company brochure and the real logo. Seven commits:

```
eed9709  fix: drop the enquiry `replyTo` setting — it was dead and misleading
739d2e6  feat: draw the contact map once as an SVG and drop Leaflet entirely
068bc81  fix: replace the basemap — CARTO now watermarks tiles "API KEY REQUIRED"
8ea6311  fix: version /assets/ URLs so an immutable cache cannot serve a stale site
a21a26c  fix: stop the enquiry form showing every validation error on page load
44356a5  docs: make the hosting guide answer the question "which card do I have?"
c03b6f6  feat: rebuild the site around the company brochure and the real logo
```

In summary:

- **Brand.** The header mark, favicons and app icons are generated from the company's own
  GS monogram (`.tooling/brand/logo-master.png`). The palette moved from teal to the
  logo's greens.
- **Services went from five to six.** Environmental Impact Assessment & Clearance is new
  and is the most valuable keyword set this firm has; pollution control became Water,
  Wastewater & Solid Waste Management and absorbed STP design, reactor design, solid waste
  facilities, pool water and CADD.
- **New brochure content:** the "why us" narrative, the eight-item expertise grid, "who we
  serve" by sector, and the brochure straplines. Vision statement replaced with the
  brochure's.
- **Enquiry form completed** — validation, consent, honeypots, a thank-you page, WhatsApp
  throughout, and provider-agnostic delivery. Still needs a provider key (step 7 below).
- **Contact map** is now a drawn SVG with no runtime dependency at all.
- **SEO**: structured data, a fixed passthrough bug that had been 404-ing the logo URL
  Google reads, and keyword-carrying headings.

---

## 2. The plan, in order

The ordering matters in two places: the Business Profile is slow, so it starts early; and
Zoho needs DNS, so it comes after Cloudflare.

### Step 1 — Buy the domain

**Decision already made:** an Indian registrar if you are paying with a RuPay or domestic
debit card, Cloudflare Registrar if you have a Visa/Mastercard **credit** card with
international payments enabled. The five-year difference is about ₹1,000 — not worth a
failed transaction over.

- **Hostinger** or **BigRock** — INR, GST invoice, RuPay works. ~₹420 first year,
  ~₹1,400/year after.
- **Cloudflare Registrar** — ~₹1,000/year flat forever, free WHOIS privacy, but USD only
  and **RuPay does not work there** (Cloudflare takes Visa, Mastercard, Amex, Discover,
  UnionPay).

At checkout, anywhere:

- Register **`geosustara.com`**. Consider `geosustara.in` too, ~₹700/yr, so nobody else
  takes it.
- Registrant must be **the LLP** — company name, the Pappanamcode address, and a
  Geosustara email. Not a personal name, and never an agency's account.
- **WHOIS privacy on.**
- **Decline** bundled hosting, website builder, SSL, email and "SEO tools". You need none
  of them.
- Auto-renew on **and** a calendar reminder 45 days before expiry. RBI's recurring-mandate
  rules silently break auto-renew on foreign sites. A lapsed domain is the most expensive
  mistake available here.

### Step 2 — Start the Google Business Profile *now*

Do not wait for the website. Verification is usually a postcard to Pappanamcode and takes
one to two weeks — it is the slowest item in this document, and the one that most affects
whether the phone rings. The website URL can be added later.

Details in step 8. Start it the same day you buy the domain.

### Step 3 — DNS at Cloudflare

Free account, **Add a site**, `geosustara.com`, **Free** plan. Cloudflare gives you two
nameservers; set those at the registrar. Minutes to a few hours to propagate.

*(Skip if you bought at Cloudflare — the domain is already there, and its DNS cannot be
moved elsewhere without transferring the domain out.)*

### Step 4 — Deploy to Cloudflare Pages

Free, commercial use explicitly permitted, unlimited bandwidth, six Indian edge locations.
No payment method required at any point.

Dashboard → **Workers & Pages → Create → Pages → Connect to Git** → `vbaswin/geosustara`:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Environment variable | `NODE_VERSION` = `22` |

**Leave `NOINDEX`, `SITE_URL` and `PATH_PREFIX` unset** on the production project. All
three default correctly. Setting `NOINDEX` here would keep the real site out of Google
entirely.

### Step 5 — Point the domain at it

Pages project → **Custom domains** → add `geosustara.com`, then `www.geosustara.com`.
Cloudflare writes the DNS records itself.

Then make one of them canonical. The site declares `https://geosustara.com` (no `www`), so
redirect `www` to the apex: **Rules → Redirect Rules → Create**, hostname
`www.geosustara.com`, dynamic redirect to
`concat("https://geosustara.com", http.request.uri.path)`, status **301**, preserve query
string.

Two live hostnames serving identical pages split your ranking signals. Pick one.

Finally: SSL/TLS → **Full (strict)**, and turn on **Always Use HTTPS**.

### Step 6 — Business email on the domain

`geosustara@gmail.com` on a brochure aimed at government bodies and industrial buyers costs
you credibility with exactly the clients you want.

[Zoho Mail](https://www.zoho.com/mail/) **Free Forever** — 5 users, 5 GB each, your own
domain, no card. Indian company, Indian data centres.

1. Verify the domain with the TXT record Zoho gives you, added in Cloudflare DNS.
2. Add Zoho's **MX** records. Proxy **off** (grey cloud, not orange) for MX.
3. Add the **SPF** and **DKIM** records. Skipping these is why business mail lands in Spam.
4. Create `info@geosustara.com`.

Limitation: the free tier has no IMAP/POP, so you use the Zoho web app or phone app rather
than Outlook. Mail Lite is ~₹90/user/month if you need IMAP.

**Keep `geosustara@gmail.com` alive and forwarding.** It is printed on the brochure, those
will circulate for years, and it is the Google account that owns the Business Profile.

### Step 7 — Connect the enquiry form

Five minutes, and until it is done the form can only open the visitor's own mail app.

1. <https://web3forms.com> → enter the address you want enquiries to reach → *Create Access
   Key*. The key arrives by email.
2. Put it in `src/_data/site.json`:

   ```json
   "enquiry": {
     "provider": "web3forms",
     "accessKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "endpoint": null,
     "subject": "New consultation enquiry — geosustara.com"
   }
   ```

3. Rebuild, push, then **send a real test enquiry from the live site** and check the inbox,
   including Spam.

The key is public by design — it identifies the destination inbox, it does not authorise
anything — so committing it is fine. If you prefer otherwise, set `FORM_ACCESS_KEY` and
`FORM_PROVIDER` as environment variables in Cloudflare Pages instead.

**Which inbox enquiries land in is a property of the key, not of `site.json`.** To move
them to `info@geosustara.com`, create a new key for that address. Changing `contact.email`
only changes what the page displays.

### Step 8 — Google Business Profile, in full

Started at step 2; finish it here. **It is free. There is no paid tier.**

This is the listing that puts you on Google Maps and in the *local pack* — the box of three
businesses with a map that appears above the ordinary results when someone searches with
local intent. On a phone it fills the screen. **Your website cannot appear there. Only a
Business Profile can.** For a local service business this matters more than anything else
in this document.

Create it at <https://business.google.com> on **geosustara@gmail.com** — an account the LLP
controls.

Use these values **character for character**, matching the website exactly. Google
cross-references name, address and phone wherever it finds them to decide whether it
believes you are a real business at that address; every inconsistency dilutes the signal.

| Field | Value |
|---|---|
| Name | `Geosustara Enviro Services LLP` |
| Address | `Perekonam, Pappanamcode, Thiruvananthapuram, Kerala 695018` |
| Phone | `+91 62824 62332` (primary; the second number goes in the secondary field) |
| Website | `https://geosustara.com` |
| Primary category | Environmental Consultant |

Then: add the six services, photos (logo, office, field and survey work), and hours. If you
work from a home office, set it as a **service-area business** — you keep the profile and
the street address stays hidden.

**Ask your first few clients for a review** once you have delivered. For a compliance
consultancy, reviews are worth more than anything on the website — a factory owner or a
government officer choosing a consultant is buying trust. Five genuine reviews puts you
ahead of most competitors in this niche in Thiruvananthapuram.

### Step 9 — Search Console

<https://search.google.com/search-console> — verify `geosustara.com` (the DNS TXT method is
easiest once DNS is at Cloudflare) and submit `https://geosustara.com/sitemap.xml`.

What it gives you: the actual search queries people used to reach you, with impressions,
clicks and average position. It is the only honest source of keyword data for your own
site, and it tells you what to write next. Also alerts you when something breaks.

Ten minutes to set up, then a look once a month.

### Step 10 — Bing Webmaster Tools

<https://www.bing.com/webmasters> — imports everything from Search Console in about two
minutes. Small traffic, but free.

### Step 11 — Housekeeping after launch

- [ ] Run `npm run brand` once — the social-share card (`og-default.jpg`, shown when the
      site is shared on WhatsApp or LinkedIn) still has the old placeholder mark and teal
      palette baked in. It is the one asset that needs `sharp` to regenerate.
- [ ] `npm run licenses:report` — `LICENSES-THIRD-PARTY.csv` still lists Leaflet, which was
      removed.
- [ ] Decide what to do with the GitHub Pages workflow. Leaving it is free and gives you a
      permanent `NOINDEX` staging copy. Deleting `.github/workflows/pages.yml` and turning
      Pages off in repository settings retires the old URL.
- [ ] Run <https://pagespeed.web.dev> against the live URL.
- [ ] Get listed in Indian industry and local directories using **identical** contact
      details.
- [ ] Test the structured data with the
      [Rich Results Test](https://search.google.com/test/rich-results) — the FAQ blocks on
      the service pages are what can earn expanded results.
- [ ] Publish an article every few weeks. Technical SEO makes a site *eligible* to rank;
      content and consistency are what actually move it.

---

## 3. What all of this costs

**The domain is the only thing anyone has to pay for.**

| | Cost |
|---|---|
| Domain | **₹420–1,400 / year** |
| Cloudflare Pages hosting | ₹0 |
| Cloudflare DNS | ₹0 |
| SSL certificate | ₹0 |
| Zoho Mail, 5 users on your domain | ₹0 |
| Web3Forms enquiry delivery | ₹0 |
| Google Search Console | ₹0 |
| Google Business Profile | ₹0 |

Google Ads is a separate product and will be pushed hard inside the Business Profile
dashboard — *"get 3× more calls"*. It is optional and unnecessary for appearing on Maps.

### What not to pay for

Once a Business Profile exists for an Indian company, the calls start. The script:

- *"Calling from Google — your listing will be deleted unless you verify."*
- *"We can get your business verified for ₹2,000."*
- *"We'll put you at number one on Google."*

**None of these are Google.** Google does not cold-call asking for money. There are
automated verification calls, but they never request payment.

1. **Never pay anyone to verify.** Verification is free.
2. **Never share the verification code** with anyone who calls.
3. **Never let an agency create the profile on their own Google account** — if you part
   ways, they own the listing and you start from zero.

Agencies also charge ₹5,000–25,000 to "create your Google listing". It is a free
twenty-minute job.

---

## 4. Open questions — only you can answer these

1. **Is `+91 94469 93196` still a live number?** The site used to list it. It appears
   nowhere on the brochure, so it was replaced with the two numbers the brochure does
   carry. If it is still in use, add it back to `contact.phones` in `src/_data/site.json`.
2. **Should the map pin be the exact office?** It is currently the Pappanamcode locality
   centroid from OpenStreetMap — deliberately approximate. To pin the building: put your
   own lat/lng in `site.map` and run `python .tooling/build-locator-map.py`. Use the same
   point on the Business Profile.
3. **Which address should receive enquiries** — `geosustara@gmail.com` or
   `info@geosustara.com`? It decides which address you create the Web3Forms key for.
4. **Service page copy.** The six service pages elaborate on the brochure's bullet points,
   describing what each type of work involves in practice. That is expansion of your
   documents, not invention — but you know the business. Read `src/_data/services.json` and
   correct anything that does not match how you actually work.

---

## 5. Changing things later

Almost everything is in two data files. All copy traces back to
`content/company-source.md` and `content/brochure-source.md`; do not add claims that are in
neither.

| To change | Edit |
|---|---|
| Phone numbers | `site.json` → `contact.phones[]` — updates header, footer, mobile menu, contact, thank-you, privacy and the structured data |
| WhatsApp number | `site.json` → `contact.whatsapp` |
| Email shown on the site | `site.json` → `contact.email` |
| Where enquiries are delivered | the Web3Forms key, **not** `site.json` — see step 7 |
| Address | `site.json` → `contact.*` — and update the Business Profile to match exactly |
| A service's words, bullets, FAQs | `services.json` |
| Add a seventh service | copy a block in `services.json`; add it to `expertise[]` in `site.json` if it should appear in the capability grid |
| The map | `site.map` in `site.json`, then re-run `.tooling/build-locator-map.py` |
| The logo | replace `.tooling/brand/logo-master.png`, then `npm run brand` |
| A new article | drop a Markdown file in `src/insights/posts/` — it appears on `/insights/`, the home page, the sitemap and the RSS feed automatically |

### Commands

```bash
npm run dev      # local dev server with live reload, http://localhost:8080
npm run build    # production build into _site/
npm run verify   # run after every build — SEO, structured data, links, required files
npm run brand    # regenerate icons + the Open Graph card from the logo
python .tooling/build-locator-map.py   # redraw the contact-page map
```

`npm run verify` is the one to remember. It catches missing files, broken links, invalid
structured data and over-long titles before anyone else sees them.

---

## 6. Things that are easy to break by accident

Each of these was a real bug found and fixed on 19–20 September. They are all invisible
until something is already wrong.

- **`?v=` on asset URLs.** `/assets/*` is served `max-age=31536000, immutable`, and
  `site.css` / `main.js` have no fingerprint in their filenames. The layout appends a
  content hash so a changed file is a different URL. **Remove the versioning and returning
  visitors keep a year-old stylesheet**, with the browser refusing even to revalidate.
- **`[hidden]{display:none!important}`** near the top of `site.css`. The `hidden` attribute
  is only a browser default, so any rule setting `display` beats it. Without this line the
  enquiry form shows every validation error on page load.
- **PNG passthrough** in `eleventy.config.js`. It was missing, which silently 404-ed
  `/assets/img/logo.png` — the URL the Organization structured data points Google at.
- **The contact map is a static SVG on purpose.** It used Leaflet against CARTO's free
  basemap until CARTO began requiring an API key and started serving tiles stamped
  "API KEY REQUIRED". Any free tile service can do that. Do not reintroduce a live tile
  dependency for a decorative, locality-level pin.
- **`NOINDEX`** must stay set on every preview deployment and must **never** be set on
  production. Both mistakes are silent.
- **One canonical hostname.** `www` must 301 to the apex, or the ranking signal splits.

---

## 7. Why the hosting choices are what they are

Short version, in case someone proposes changing them:

- **Vercel's free Hobby plan is licensed for personal, non-commercial use only**, and
  Vercel counts "advertising a product or service" as commercial. A consultancy's
  lead-generating site needs Pro, about ₹21,000/year. `vercel.json` stays in the repo
  because it costs nothing and keeps the option open.
- **Cloudflare Pages' free tier permits commercial use in writing**, with unlimited
  bandwidth and no card.
- **GitHub Pages silently discards custom headers.** The security and caching rules in
  `_headers` simply do not apply there. Apex domains also need four hand-maintained A
  records.
- **Splitting registrar and host is deliberate.** If the domain, DNS and hosting all sit in
  one account, a suspension takes all three at once.

The full comparison, with five-year costs and the case against Cloudflare, is in
[`DOMAIN-AND-HOSTING.md`](DOMAIN-AND-HOSTING.md).

---

## 8. An honest expectation

Technical SEO makes a site *eligible* to rank. It does not rank it. Competitive national
terms — "EIA consultant India" — take content depth, other sites linking to you, and months
of consistency.

Local terms are a different matter. "EIA consultant Trivandrum", "STP design Thiruvananthapuram",
"environmental consultant Kerala" — those should move within weeks, and a verified Business
Profile with a few genuine reviews will do more for them than any further change to this
website.
