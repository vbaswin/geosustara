# Buying geosustara.com and putting the site on it

Written for India, September 2026. Prices move — treat every figure as "about this much,
check before you pay".

---

## The short answer

| | Choice | Roughly |
|---|---|---|
| **Domain** | An Indian registrar — [Hostinger](https://www.hostinger.in) or [BigRock](https://www.bigrock.in). INR, GST invoice, and your RuPay / domestic debit card works. | **₹420 year 1, ~₹1,400/yr after** |
| **Hosting** | [Cloudflare Pages](https://pages.cloudflare.com) — free tier, commercial use explicitly allowed, unlimited bandwidth, six Indian edge locations. **No payment method required at all.** | **₹0** |
| **DNS** | Cloudflare free plan — point the registrar's nameservers at it | **₹0** |
| **Email** | [Zoho Mail](https://www.zoho.com/mail/) free plan — `info@geosustara.com` on your own domain, 5 users. Indian company, pays in INR if you ever upgrade. | **₹0** |
| | | **≈ ₹1,400 / year after year one** |

**If you hold a Visa or Mastercard credit card with international payments enabled**, buy the
domain from [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) instead —
it sells at cost with no renewal markup (~₹1,000/yr flat, forever) and free WHOIS privacy.
That saves a few hundred rupees a year and puts everything in one dashboard. Read
[Paying for it from India](#paying-for-it-from-india) first — this is the one step where
Indian cards commonly fail.

**Move off GitHub Pages.** It is not wrong, but Cloudflare Pages is better on every axis
that matters here, for the same price. Reasons in [Hosting](#hosting) below.

---

## Paying for it from India

**Hosting costs nothing and needs no card.** Cloudflare Pages, Cloudflare DNS and Zoho Mail's
free plan are all sign-up-and-go. The *only* thing in this whole document you have to pay for
is the domain name.

That matters, because paying a foreign company from India is where this usually goes wrong:

| Card | Works on Cloudflare / Namecheap (USD) | Works on Hostinger / BigRock (INR) |
|---|---|---|
| **RuPay debit (SBI or any bank)** | **No.** RuPay is a domestic network. Cloudflare's accepted networks are Visa, Mastercard, Amex, Discover and UnionPay — RuPay is not among them, and a standard RuPay card cannot transact on foreign sites at all. | **Yes** |
| RuPay *Global* (co-badged Discover / JCB / Diners) | Sometimes. Depends on the co-badge and on your bank enabling international use. Not worth gambling a domain on. | Yes |
| SBI / other Visa or Mastercard **debit** | Often, but you must enable international usage in YONO or the bank's app first, and many Indian debit cards still fail 3DS on foreign merchants. | Yes |
| Visa / Mastercard **credit** | Yes, reliably. Enable international transactions first. | Yes |

Two more things that bite people here:

- **Forex markup.** An international card charge carries roughly 3.5% markup plus GST on that
  markup. On a ₹1,000 domain it is trivial; it is just not zero.
- **No GST input credit.** A foreign registrar gives you a USD receipt, not a GST invoice. For
  an LLP that can claim input credit, an Indian registrar's invoice is worth having — which
  on a ₹1,400 domain is a small amount, but it is also one less thing your accountant asks
  about.
- **Auto-renew breaks.** RBI's rules on recurring card mandates silently kill auto-renewal on
  some foreign sites. Set a calendar reminder 45 days before expiry regardless of where you
  buy. A lapsed domain is the most expensive mistake in this document.

### Decided: Hostinger, paying yearly

Aswin's card is a **Visa debit card**, so Cloudflare Registrar is genuinely payable — it is
not ruled out the way a RuPay card would be. It was still not chosen. The reasoning, so
nobody re-opens it:

Paying **yearly** means repeating a USD charge on an Indian debit card every year. That
needs international usage left enabled, it can fail 3DS on any given attempt, and RBI's
recurring-mandate rules break foreign renewals without warning. A renewal that fails
quietly is how you lose a domain that is printed on a brochure. An INR charge on an Indian
card simply works, every year, and comes with a GST invoice.

Cloudflare is cheaper — at-cost, about ₹900/year flat, against Hostinger's ₹420 then
~₹1,400. Over five years that is roughly **₹200/year**. Not worth the annual failure mode.

**Buying multi-year upfront would flip this** — one transaction instead of ten removes the
risk, and Cloudflare sells terms up to 10 years. That was declined; yearly it is.

**The registrar does not affect the website at all.** Cloudflare DNS, CDN, SSL and Pages
hosting are free wherever the domain was bought — you point the nameservers once. No
visitor or client can see who the registrar is. Transferring to Cloudflare later is easy if
the renewal price ever stops making sense.

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

**Start from the card in your wallet** — see
[Paying for it from India](#paying-for-it-from-india). A RuPay debit card rules Cloudflare and
Namecheap out entirely, and that is a fine reason to buy in rupees instead. The five-year
difference between the two routes is about ₹1,000; a failed transaction at 11pm is worth more
than that in irritation.

**Hostinger or BigRock** if you are paying with an Indian card: INR billing, a GST invoice you
can claim, and support in Indian hours. You pay a few hundred rupees a year more and you will
be upsold hard at checkout — decline everything except the domain and WHOIS privacy.

**Cloudflare Registrar** if you have a Visa or Mastercard credit card with international
payments enabled. It sells domains at exactly what it pays the registry, adds nothing at
renewal, includes WHOIS privacy free, and puts the domain in the same dashboard as the
hosting. This is what most developers pick in 2026 and there is no catch — Cloudflare makes
its money elsewhere.

Three real caveats to the Cloudflare route:

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

**Paying in rupees (recommended — works with a RuPay or any domestic card):** at
<https://www.hostinger.in> or <https://www.bigrock.in>, search `geosustara.com` and buy it.
Turn WHOIS privacy **on**. Decline the bundled hosting, website builder, SSL certificate,
email and "SEO tools" — you need none of them.

**Paying in USD with a Visa/Mastercard credit card:** at <https://dash.cloudflare.com> →
**Domain Registration → Register Domains** → search `geosustara.com` → buy. WHOIS privacy is
on by default and free, and the price never rises at renewal.

### 1b. Put DNS on Cloudflare (10 minutes — skip if you bought at Cloudflare)

Create a free Cloudflare account, **Add a site**, enter `geosustara.com`, choose the **Free**
plan. Cloudflare gives you two nameservers; set those as the nameservers at your registrar,
replacing whatever is there. Propagation takes minutes to a few hours.

This step is what lets the rest of this guide work identically whichever registrar you used.

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

1. Sign up on the **Forever Free** plan — 5 users, 5 GB each, your own domain:
   <https://workplace.zoho.in/signup?type=org&plan=free>. Do *not* start from the pricing
   page: it shows only the paid cards (₹59–₹399/user/month) and the free tier is a
   separate block below them. `zoho.in` is the Indian data centre, where it is offered.
2. Verify the domain by adding the TXT record Zoho gives you, in Cloudflare DNS.
3. Add Zoho's **MX records** in Cloudflare DNS (proxy **off** — orange cloud grey — for MX).
4. Add the **SPF** and **DKIM** records Zoho provides. Skipping these is why business mail
   lands in Spam.
5. Create `info@geosustara.com` (and personal addresses if you want).
6. Update `contact.email` in `src/_data/site.json`, rebuild, redeploy.

Zoho is an Indian company with Indian data centres, and the free plan genuinely stays free.
Its one real limitation: no IMAP/POP/ActiveSync on the free tier, so you use the web app or
the Zoho Mail phone app rather than Outlook, Apple Mail or the Gmail app.

**Decided: stay on the free plan.** The Zoho Mail app covers Android, iPhone, Windows, Mac,
Linux and any browser, so the free tier is not a web-only compromise — you simply open
Zoho's app instead of Gmail's. Only that.

If it grates later, **Mail Lite is ₹59/user/month billed annually** (₹708/year plus 18% GST,
about **₹835/year** for one mailbox) and switching is a toggle — same address, same mail, no
migration. Buy one user rather than five: each mailbox carries up to 30 aliases free, so
`info@`, `sales@` and `enquiry@` share one inbox and one licence.
Paid settings: `imappro.zoho.com` 993 SSL, `smtppro.zoho.com` 465 SSL / 587 TLS.

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

| | Year 1 | Years 2–5 each | 5-year total | Card needed |
|---|---|---|---|---|
| Hostinger domain + Cloudflare Pages + Zoho free | ₹420 | ₹1,400 | **₹6,020** | RuPay / any Indian card |
| Cloudflare domain + Cloudflare Pages + Zoho free | ₹1,000 | ₹1,000 | **₹5,000** | Visa/MC, international enabled |
| GoDaddy domain (3-yr ₹1 offer) + Cloudflare Pages | ₹1 | ₹2,300 | **₹9,200** | Any Indian card |
| Indian shared hosting bundle (domain + hosting + email) | ₹3,500 | ₹4,500 | **₹21,500** | Any Indian card |
| Any domain + Vercel Pro | ₹22,000 | ₹22,400 | **₹111,600** | Visa/MC |

The first two differ by about ₹1,000 across five years. That is not enough to agonise over —
pick whichever you can actually pay for without a failed transaction.

Email adds **₹0** — the Zoho free plan is the decision. Add ~₹835/year only if you later
want IMAP (Outlook, Apple Mail, the Gmail app) on a single Mail Lite mailbox.

---

## Why Cloudflare, and when you should not

**It is not a small company taking a chance on you.** Cloudflare sits in front of a very large
share of the internet. The free tier is not a loss-leader trial that expires — it exists
because serving static files costs them almost nothing and the free tier feeds their paid
business. It has worked this way for over a decade.

**The case for it here**

- The free tier permits commercial use *in writing*. Most "free hosting" does not.
- Unlimited bandwidth. No throttle, no surprise bill, ever.
- Six Indian edge locations, so pages load from Mumbai or Chennai rather than Singapore.
  For a Kerala audience this shows up in Core Web Vitals, which feed into ranking.
- Free SSL, free DDoS protection, and DNS that is among the fastest in the world.
- It builds from your GitHub repository automatically, exactly as the current GitHub Actions
  workflow does.
- It reads the `_headers` file in this repo, so the security and caching rules actually apply.
  On GitHub Pages they are silently discarded.

**The honest case against it**

1. **Support is a ticket and a forum, not a phone number.** On the free plan there is no
   Indian phone support and nobody who speaks Malayalam. If DNS breaks the night before a
   client meeting, you are reading documentation or calling your developer. An Indian shared
   host gives you a number to ring. If nobody in the firm is comfortable with a technical
   dashboard, that is worth real money.
2. **The dashboard assumes you know what an A record is.** Hostinger's panel holds your hand;
   Cloudflare's does not.
3. **Concentration risk.** If you register the domain at Cloudflare *and* run DNS *and*
   hosting there, an account suspension — rare, but it happens over billing disputes and
   automated abuse flags — takes all three at once. Buying the domain from an Indian registrar
   and using Cloudflare only for DNS and hosting splits that risk for free. It is one reason
   the recommendation above is arranged that way.
4. **A Cloudflare-registered domain is locked to Cloudflare nameservers.** You cannot move its
   DNS elsewhere without transferring the domain out. Not a problem if you are staying, but
   know it before you buy.
5. **No email hosting.** You need Zoho or similar regardless — but so it is with every option
   in this document except a bundled Indian hosting plan.
6. **When Cloudflare has an outage it is global and newsworthy.** They are rare and usually
   short. The honest comparison is against a single shared server in one Indian data centre,
   which has materially worse uptime and no status page anyone watches.
7. **No GST invoice, no INR.** Only relevant if you pay them anything — and in the
   recommended arrangement you do not.

**When I would tell you to use a bundled Indian host instead**

If you want one company, one bill in rupees, one GST invoice and one phone number covering
domain, hosting and email — and you would rather pay ~₹3,000–4,000 a year than ever touch a
DNS record — then take a Hostinger or BigRock plan and upload the contents of `_site/` to it.
The site will be slower and the security headers need setting up by hand, but it will work,
and "I can phone someone" is a legitimate requirement, not a mistake. Just do not let them
sell you WordPress; this site does not need it.

---

## Things you do *not* need, whatever anyone sells you

- **An SSL certificate.** Free and automatic on every host listed here.
- **cPanel, shared hosting or a VPS.** There is no server-side code to run.
- **A website builder subscription.** The site already exists, in this repository.
- **"SEO packages"** sold at checkout. The technical SEO is already in the code; what remains
  is a Google Business Profile, consistent details, and publishing.
- **Premium DNS.** Cloudflare's free DNS is among the fastest in the world.
