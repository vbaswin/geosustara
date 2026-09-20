# Post-purchase runbook — geosustara.com

*Written 20 September 2026. Open this the moment the domain is bought, and work straight
down it. Tick the boxes as you go.*

This is the **executable** document. [`LAUNCH-PLAN.md`](LAUNCH-PLAN.md) explains *why* each
choice was made and what state the project is in; this file is what you keep open in a
second window while you are actually clicking. Where the two overlap, the values here are
the ones to copy.

**Total hands-on time: about two hours**, spread across two days. The only thing you
genuinely wait on is a postcard from Google.

---

## The two constraints that set the order

**1. The Google Business Profile is the slowest item.** Verification is usually a postcard
to Pappanamcode — one to two weeks. It is also the highest-impact item for a local
consultancy, because it is what puts you on Maps and in the *local pack*. So it starts on
day one, in parallel, even though the website is not live yet.

**2. Everything else depends on DNS being at Cloudflare.** Pages cannot attach the domain
until Cloudflare controls DNS, and Zoho cannot verify the domain or receive mail until you
can add records there. So Cloudflare DNS comes before both.

Do not reorder these.

---

# Day 1 — about an hour of work

## Step 1 — Start the Google Business Profile *(15 min, then wait 1–2 weeks)*

- [ ] Go to <https://business.google.com>, signed in as **geosustara@gmail.com** — an
      account the LLP controls, never a personal or agency account.
- [ ] Enter these **character for character**, matching the website exactly:

| Field | Value |
|---|---|
| Name | `Geosustara Enviro Services LLP` |
| Address | `Perekonam, Pappanamcode, Thiruvananthapuram, Kerala 695018` |
| Phone | `+91 62824 62332` |
| Primary category | Environmental Consultant |

- [ ] Leave **Website blank** for now — you will add it at Step 7.
- [ ] Request verification, then **stop and move on.**

Google cross-references these strings wherever it finds them to decide whether it believes
you are a real business at that address. A comma out of place dilutes the signal.

> If you work from a home office, set it as a **service-area business** — you keep the
> profile and the street address stays hidden.

## Step 2 — Create the Cloudflare account *(10 min)*

- [ ] Sign up free at <https://dash.cloudflare.com>. **No payment method, at any point.**
- [ ] **Add a site** → `geosustara.com` → select the **Free** plan.
- [ ] Cloudflare scans existing DNS (there will be almost nothing — Hostinger parking
      records). Nothing there is worth keeping.
- [ ] Copy the **two nameservers** it gives you, e.g. `ana.ns.cloudflare.com` and
      `bob.ns.cloudflare.com`. They are unique to your account.

## Step 3 — Point the nameservers at Cloudflare *(5 min)*

In Hostinger hPanel:

- [ ] **Domains → geosustara.com → DNS / Nameservers → Change nameservers**
- [ ] Choose **Use custom nameservers**
- [ ] Paste Cloudflare's two, replacing Hostinger's. Save.

**This is the switch that hands DNS control to Cloudflare.** From here every DNS record —
website, email, verification — is added in the Cloudflare dashboard, *not* Hostinger's.
Hostinger remains only the registrar: the billing relationship and the annual renewal.

## Step 4 — Wait for propagation *(minutes to a few hours)*

- [ ] Wait for the email from Cloudflare: *"Cloudflare is now protecting your site."*
- [ ] Confirm the domain shows **Active** in the Cloudflare dashboard.

Usually under an hour, occasionally up to 24. **Do not start Step 5 until it says Active** —
everything downstream will fail confusingly if DNS has not moved.

---

# Day 1 or 2 — once DNS is Active

## Step 5 — Deploy to Cloudflare Pages *(15 min)*

- [ ] Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
- [ ] Authorise GitHub, select `vbaswin/geosustara`
- [ ] Set the build configuration:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Environment variable | `NODE_VERSION` = `22` |

- [ ] **Leave `NOINDEX`, `SITE_URL` and `PATH_PREFIX` unset.**
- [ ] Wait for the first build (1–3 min), then open the `*.pages.dev` URL and confirm the
      site renders before attaching your domain.

> ⚠️ `NOINDEX` exists for the GitHub Pages preview copy. Setting it on the production
> project would keep the real site out of Google **entirely**, and you would not notice for
> weeks. All three variables default correctly — leave them alone.

## Step 6 — Attach the domain *(10 min)*

- [ ] Pages project → **Custom domains** → add `geosustara.com`
- [ ] Add `www.geosustara.com`

Cloudflare writes the DNS records itself. Do not create them by hand.

- [ ] Redirect `www` to the apex: **Rules → Redirect Rules → Create**
      - Hostname equals `www.geosustara.com`
      - Dynamic redirect to: `concat("https://geosustara.com", http.request.uri.path)`
      - Status **301**, **preserve query string**

The site declares `https://geosustara.com` (no `www`) as canonical. Two hostnames serving
identical pages splits your ranking signals between them — Google treats them as competing
copies. Pick one, redirect the other.

## Step 7 — Lock down HTTPS *(2 min)*

- [ ] **SSL/TLS → Full (strict)**
- [ ] Turn on **Always Use HTTPS**

Full (strict) validates the origin's certificate rather than trusting any certificate. With
Pages as the origin this always works, and it closes the gap plain "Full" leaves open.

**✅ The site is now live on `https://geosustara.com`.**

- [ ] Go back to the Business Profile and add the website URL.

---

# Day 2 — email, form, search

## Step 8 — Zoho Mail *(20–30 min)*

- [ ] Sign up on the **Forever Free** plan using the direct link:

      https://workplace.zoho.in/signup?type=org&plan=free

> Do **not** start from Zoho's pricing page. It shows only paid cards (₹59–₹399/user/month)
> and the free tier sits in a separate block below them, which is easy to miss entirely.

Then add four DNS records in **Cloudflare → DNS → Records**:

- [ ] **TXT — domain verification.** Zoho gives a value like
      `zoho-verification=zb14567890.zmverify.zoho.in`. Add it, then click verify in Zoho.

- [ ] **MX — where mail is delivered.** Three records; the priorities matter:

| Priority | Server |
|---|---|
| 10 | `mx.zoho.in` |
| 20 | `mx2.zoho.in` |
| 50 | `mx3.zoho.in` |

- [ ] **SPF** — TXT on the root: `v=spf1 include:zoho.in ~all`
- [ ] **DKIM** — TXT on the name `zoho._domainkey`, value generated by Zoho

> **Use whatever values Zoho shows you during setup** if they differ from these. The `.in`
> throughout is because you are on Zoho's Indian data centre, which is where the free plan
> is offered. Guides showing `.com` values are for a different data centre and will not work.

- [ ] **Do not skip SPF and DKIM.** They are the difference between an enquiry landing in a
      government officer's inbox and landing in their spam folder. This is the most common
      way business email quietly fails.

- [ ] Create the **`info@geosustara.com`** mailbox. The free plan gives you five — add
      personal addresses if you want them.
- [ ] Install the Zoho Mail app: phone (Android/iOS) and desktop (Windows/Mac/Linux), or
      just use the browser.
- [ ] **Test both directions** — send from `info@` out to Gmail, and from Gmail in to
      `info@`. Check the spam folder on both.

## Step 9 — Put the address on the site *(5 min)*

- [ ] Update `contact.email` in `src/_data/site.json`
- [ ] Commit and push to `main`

Cloudflare Pages rebuilds automatically on every push to `main`. That is the deploy
mechanism from now on — there is nothing to upload manually, ever.

## Step 10 — Turn on the enquiry form *(5 min)*

Until this is done the form can only open the visitor's own mail app, which most people
abandon.

- [ ] <https://web3forms.com> → enter `info@geosustara.com` → **Create Access Key**
- [ ] The key arrives by email. Put it in `src/_data/site.json`:

```json
"enquiry": {
  "provider": "web3forms",
  "accessKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "endpoint": null,
  "subject": "New consultation enquiry — geosustara.com"
}
```

- [ ] Push, then **send a real test enquiry from the live site** and confirm it arrives —
      checking spam.

The key is public by design: it identifies the destination inbox and authorises nothing, so
committing it is fine.

## Step 11 — Search Console and Bing *(15 min)*

- [ ] <https://search.google.com/search-console> — verify `geosustara.com` using the **DNS
      TXT method** (easiest now that DNS is at Cloudflare)
- [ ] Submit `https://geosustara.com/sitemap.xml`
- [ ] <https://www.bing.com/webmasters> — imports everything from Search Console in about
      two minutes

Search Console is the only honest source of keyword data for your own site: the actual
queries people used to reach you, with impressions, clicks and average position. It also
alerts you when something breaks. Ten minutes now, then a look once a month.

---

# Dependency map

| When | Step | Blocked by |
|---|---|---|
| Day 1 | Business Profile | — *(slowest, start first)* |
| Day 1 | Cloudflare account + add site | — |
| Day 1 | Nameservers at Hostinger | Cloudflare site added |
| Day 1 | *Propagation wait* | — |
| Day 1–2 | Pages deploy | DNS **Active** |
| Day 1–2 | Custom domain + `www` redirect | Pages deployed |
| Day 1–2 | SSL Full (strict) | Domain attached |
| Day 2 | Zoho Mail | DNS **Active** |
| Day 2 | Email on site + enquiry form | Mailbox exists |
| Day 2 | Search Console + Bing | Site live |

---

# When something does not work

| Symptom | Cause | Fix |
|---|---|---|
| Cloudflare never goes Active | Nameservers not saved, or typo | Re-check both in hPanel; they must be the exact pair Cloudflare issued |
| Custom domain stuck "pending" | DNS not Active yet | Wait for Step 4 to finish |
| Site live but Google never indexes it | `NOINDEX` set on the Pages project | Remove the variable, redeploy |
| Mail not arriving | MX missing, wrong priority, or wrong data centre | Confirm `.in` servers and 10/20/50 |
| Sent mail lands in spam | SPF or DKIM missing | Both are required, not optional |
| `www` and apex both resolve | Redirect rule missing | Step 6 |
| Enquiry form silent | Access key missing or wrong | Step 10, then send a real test |

---

# After launch

- [ ] Run `npm run brand` once — the WhatsApp/LinkedIn share card (`og-default.jpg`) still
      has the old placeholder mark and teal palette baked in
- [ ] Run `npm run licenses:report` — `LICENSES-THIRD-PARTY.csv` still lists Leaflet, which
      was removed
- [ ] Decide what to do with the GitHub Pages workflow — leaving it is free and gives a
      permanent `NOINDEX` staging copy; deleting `.github/workflows/pages.yml` retires it
- [ ] Run <https://pagespeed.web.dev> against the live URL
- [ ] Test the [Rich Results Test](https://search.google.com/test/rich-results) — the FAQ
      blocks on service pages are what can earn expanded results
- [ ] Replace the approximate `map` coordinates in `site.json` with the exact office location
- [ ] When the postcard arrives, finish the Business Profile: six services, photos (logo,
      office, field and survey work), hours
- [ ] **Ask your first few clients for reviews.** For a compliance consultancy these
      outrank anything on the website — a factory owner or government officer choosing a
      consultant is buying trust. Five genuine reviews puts you ahead of most competitors
      in this niche in Thiruvananthapuram.

---

# 🔴 Calendar reminder — early August 2027

**Domain renewal, ~₹1,789** (₹1,499 + ICANN + 18% GST). The ₹899 you paid was promotional.

A one-year term has exactly one failure mode: it lapses while nobody is looking. Auto-renew
is a safety net, not a guarantee — it fails silently when a card is reissued or expires.

That reminder is also the moment to compare **Cloudflare Registrar at ~₹1,100/year**.
Transferring takes about ten minutes, and with no promo lock-in left it is a genuine
~₹690/year saving. See [`DOMAIN-AND-HOSTING.md`](DOMAIN-AND-HOSTING.md) for the reasoning.
