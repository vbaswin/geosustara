# Buying geosustara.com and putting the site on it

Written for India, September 2026. Prices move — treat every figure as "about this much,
check before you pay".

---

## The short answer

| | Choice | Roughly |
|---|---|---|
| **Domain** | [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) — sold at cost, no first-year trick, free WHOIS privacy | **₹950–1,050 / year** |
| **Hosting** | [Cloudflare Pages](https://pages.cloudflare.com) — free tier, commercial use explicitly allowed, unlimited bandwidth, six Indian edge locations | **₹0** |
| **Email** | [Zoho Mail](https://www.zoho.com/mail/) free plan — `info@geosustara.com` on your own domain, 5 users | **₹0** |
| | | **≈ ₹1,000 / year, all in** |

If paying in USD is a nuisance, swap the registrar for **Hostinger** or **BigRock** (INR
billing, GST invoice) and keep everything else. That is the second-best answer and costs
roughly the same in year one, more on renewal.

**Move off GitHub Pages.** It is not wrong, but Cloudflare Pages is better on every axis
that matters here, for the same price. Reasons in [Hosting](#hosting) below.

---

## Domain

### What you are actually buying

A domain is a yearly rental from the registry (Verisign owns `.com`), resold by registrars.
The registry price for `.com` is about **$10.50/year**; everything above that is the
registrar's margin. That single fact explains the whole market.

### The trap to avoid

The headline price is the *first year*. The price that matters is the **renewal**, because
you will pay it every year for as long as the business exists.

| Registrar | First year | Renewal | Notes |
|---|---|---|---|
| **Cloudflare** | ~$10.4 (₹950) | **same, forever** | At cost. No upsells. Free WHOIS privacy. |
| **Namecheap** | ~₹700 | ~₹1,400–1,600 | Free WHOIS privacy. US company, USD billing, no GST invoice. |
| **Hostinger** | ~₹420 | ~₹1,300–1,500 | INR + GST invoice. Free privacy. |
| **BigRock** | ~₹1 – ₹859 | ~₹1,400–1,800 | Indian (Newfold/Endurance). INR + GST. Privacy usually chargeable. |
| **GoDaddy** | ₹1 with a 3-year plan | **₹2,000–2,500** | Heaviest upsells, privacy charged separately. Not recommended. |

GoDaddy's ₹1 offer costs more over five years than Cloudflare's "expensive" flat price. Run
the arithmetic over five years, not one, on any offer you are shown.

### So which one

**Cloudflare Registrar, if you can pay by card in USD.** It sells domains at exactly what it
pays the registry, adds nothing at renewal, includes WHOIS privacy free, and puts the domain
in the same dashboard as the hosting. This is what most developers pick in 2026 and there is
no catch — Cloudflare makes its money elsewhere.

Three real caveats:

1. **A Cloudflare-registered domain must use Cloudflare's nameservers.** You cannot point its
   DNS at another provider without transferring the domain out. Since the plan is to host on
   Cloudflare Pages and run DNS there anyway, this costs you nothing — but know it before you
   buy, because it is the one thing you cannot change later.
2. **Cloudflare does not currently offer `.in`.** If you also want `geosustara.in` (worth
   ~₹700/yr as a defensive registration so nobody else takes it), buy that from an Indian
   registrar. Check the TLD list at purchase time; it does change.
3. **Indian cards and international auto-renew.** RBI's rules on recurring card mandates
   break auto-renewal on some foreign sites without warning. Whatever you choose, put a
   **calendar reminder 45 days before expiry** and keep the card current. A lapsed domain is
   the single most expensive mistake in this whole document — recovering one after it drops
   can cost lakhs, or be impossible.

**Hostinger or BigRock, if you want an INR invoice with GST** you can claim, and a support
number in Indian hours. Perfectly fine. You pay a few hundred rupees a year more and you will
be upsold at checkout — decline everything except the domain and WHOIS privacy.

Whoever you buy from, you can still use Cloudflare for DNS and hosting. Registrar and host do
not have to be the same company, and there is no penalty for splitting them.

### At checkout, anywhere

- Buy **`geosustara.com`**. Consider `geosustara.in` too.
- **Turn on WHOIS / domain privacy.** Without it your name, address, phone and email are in a
  public database that spammers scrape within hours.
- **Turn on auto-renew**, and *also* set the calendar reminder.
- **Decline** the bundled hosting, website builder, "SEO tools", email hosting and SSL
  certificate. You need none of them. SSL is free and automatic on every host below.
- Register for **2 years** if the option is there. Not for SEO — that myth is dead — but
  because it removes one renewal you could miss.

---

## Hosting

The site is a folder of static HTML, CSS, images and JavaScript. It needs no PHP, no database
and no server. That makes hosting almost free, and makes most of the "web hosting India"
advertising irrelevant to you — shared cPanel hosting at ₹200/month is built for WordPress and
buys you nothing here.

### The realistic options

| | Free for a business site? | India edge | Custom headers | Notes |
|---|---|---|---|---|
| **Cloudflare Pages** | **Yes, explicitly** | 6 Indian PoPs | Yes (`_headers`) | Unlimited bandwidth. 500 builds/month. |
| **Netlify** | Yes | Yes | Yes (`_headers`) | 100 GB/month, 300 build minutes. |
| **GitHub Pages** (current) | Grey area, fine for a brochure site | Via Fastly, no India PoP guarantee | **No** | 1 GB site, 100 GB/month soft cap, apex needs 4 A records. |
| **Vercel** | **No — Hobby is personal, non-commercial** | Yes | Yes (`vercel.json`) | Needs Pro at **$20/month ≈ ₹1,800/month** for a company site. |
| Indian shared hosting | ~₹2,000–4,000/year | Yes | Yes | You would be paying for a database you do not have. |

Two of those rows decide it:

- **Vercel's free tier is not licensed for this.** Vercel's own fair-use terms limit the Hobby
  plan to personal, non-commercial use, and explicitly count "advertising a product or
  service" as commercial. A consultancy's lead-generating website is commercial. It would
  have to be Pro at roughly ₹21,000/year — for a site that Cloudflare will serve for nothing.
  (`vercel.json` stays in the repo; it costs nothing and keeps the option open.)
- **Cloudflare Pages' free tier says commercial use is allowed**, in writing, with unlimited
  bandwidth and no credit card.

### Why leave GitHub Pages

It is working, and it is free, so this is an upgrade rather than a rescue:

1. **No custom headers.** The security headers this project defines (`HSTS`,
   `X-Content-Type-Options`, `Referrer-Policy`, long cache lifetimes on assets) are simply
   dropped on GitHub Pages — it has no mechanism for them. On Cloudflare Pages the
   `_headers` file in this repo applies them automatically.
2. **Apex domains need four A records** pointed at GitHub's IP addresses, maintained by hand
   if GitHub ever changes them. Cloudflare resolves the apex to the host automatically.
3. **India latency.** Cloudflare has PoPs in Mumbai, Chennai, Delhi, Bengaluru, Hyderabad and
   Kolkata. Your audience is in Kerala; this is measurable in Core Web Vitals, which feed
   into ranking.
4. **Limits.** 1 GB repository, 100 GB/month soft bandwidth cap, 10 builds/hour. You will not
   hit these soon, but there is no reason to keep them.
5. **GitHub's own terms** discourage using Pages "to run your online business". A brochure
   site is not an e-commerce site and this is not a real risk today — but it is a term you
   are relying on someone's lenient reading of, and you do not have to.

Keep the repository on GitHub either way. Cloudflare Pages builds directly from it, exactly
as GitHub Actions does now.

---

## Doing it — the recommended path

### 1. Buy the domain (15 minutes)

At <https://dash.cloudflare.com> → **Domain Registration → Register Domains** → search
`geosustara.com` → buy. WHOIS privacy is on by default and free.

*(If you bought elsewhere: create a free Cloudflare account, **Add a site**, enter
`geosustara.com`, choose the **Free** plan, and change the nameservers at your registrar to
the two Cloudflare gives you. Propagation takes minutes to a few hours.)*

### 2. Connect the site (10 minutes)

In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
authorise GitHub → pick `vbaswin/geosustara`, then set:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Node version (env var `NODE_VERSION`) | `22` |

Leave `NOINDEX` **unset** for the production project — the site must be indexable. Do not set
`SITE_URL` or `PATH_PREFIX` either; both default correctly to `https://geosustara.com`.

Deploy. You get a `*.pages.dev` URL. Check it works.

### 3. Point the domain at it (5 minutes)

Pages project → **Custom domains → Set up a domain** → `geosustara.com`. Add
`www.geosustara.com` as a second custom domain. Cloudflare writes the DNS records itself.

Then decide which one is canonical. This site's `site.json` says `https://geosustara.com`
(no `www`), so redirect `www` to the apex: **Rules → Redirect Rules → Create**, matching
hostname `www.geosustara.com`, dynamic redirect to
`concat("https://geosustara.com", http.request.uri.path)`, status **301**, preserve query
string. One canonical hostname matters — two live hostnames serving identical pages split
your ranking signals.

HTTPS is issued automatically within a few minutes. Turn on **Always Use HTTPS** under SSL/TLS
→ Edge Certificates, and set SSL/TLS mode to **Full (strict)**.

### 4. Retire the GitHub Pages copy

Once the domain serves the site, either delete `.github/workflows/pages.yml`, or leave it —
it builds with `NOINDEX=1`, so the `github.io` copy is kept out of Google and cannot compete
with the real domain. Leaving it is a free staging environment. If you delete it, also turn
Pages off in the repository settings so the old URL stops resolving.

### 5. Business email (20 minutes)

`geosustara@gmail.com` on a company brochure costs you credibility with exactly the clients
you want — government bodies, industrial buyers, institutions. Once you own the domain:

1. <https://www.zoho.com/mail/> → **Free Forever** plan (5 users, 5 GB each, your own domain).
2. Verify the domain by adding the TXT record Zoho gives you, in Cloudflare DNS.
3. Add Zoho's **MX records** in Cloudflare DNS (proxy **off** — orange cloud grey — for MX).
4. Add the **SPF** and **DKIM** records Zoho provides. Skipping these is why business mail
   lands in Spam.
5. Create `info@geosustara.com` (and personal addresses if you want).
6. Update `contact.email` in `src/_data/site.json`, rebuild, redeploy.

Zoho is an Indian company with Indian data centres, and the free plan genuinely stays free.
Its one real limitation: no IMAP/POP on the free tier, so you use the web app or the Zoho
Mail phone app rather than Outlook. Mail Lite is about ₹90/user/month if you need IMAP.

Keep the Gmail address working and forward it — old brochures will be in circulation for
years.

### 6. After launch

- [ ] [Google Search Console](https://search.google.com/search-console) — verify
      `geosustara.com` (the DNS TXT method is easiest when DNS is at Cloudflare) and submit
      `https://geosustara.com/sitemap.xml`.
- [ ] [Google Business Profile](https://business.google.com) — create it with **exactly** the
      name, address and phone number used on this site. Inconsistent details across the web
      are the most common cause of weak local ranking. This is the single highest-return
      action for a Thiruvananthapuram-based consultancy.
- [ ] [Bing Webmaster Tools](https://www.bing.com/webmasters) — import from Search Console.
- [ ] Replace the approximate `map` coordinates in `site.json` with the exact office location.
- [ ] Wire up the enquiry form — see **Turning on the enquiry form** in the README.
- [ ] Run <https://pagespeed.web.dev> against the live URL.

---

## Costs, five years, honestly

| | Year 1 | Years 2–5 each | 5-year total |
|---|---|---|---|
| Cloudflare domain + Cloudflare Pages + Zoho free | ₹1,000 | ₹1,000 | **₹5,000** |
| Hostinger domain + Cloudflare Pages + Zoho free | ₹420 | ₹1,400 | **₹6,020** |
| GoDaddy domain (3-yr ₹1 offer) + Cloudflare Pages | ₹1 | ₹2,300 | **₹9,200** |
| Any domain + Vercel Pro | ₹22,000 | ₹22,400 | **₹111,600** |
| Indian shared hosting bundle | ₹3,500 | ₹4,500 | **₹21,500** |

Add ~₹5,400/year only if you later need Zoho Mail Lite for IMAP across 5 users.

---

## Things you do *not* need, whatever anyone sells you

- **An SSL certificate.** Free and automatic on every host listed here.
- **cPanel, shared hosting or a VPS.** There is no server-side code to run.
- **A website builder subscription.** The site already exists, in this repository.
- **"SEO packages"** sold at checkout. The technical SEO is already in the code; what remains
  is a Google Business Profile, consistent details, and publishing.
- **Premium DNS.** Cloudflare's free DNS is among the fastest in the world.
