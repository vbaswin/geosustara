/**
 * Build verification — runs over every generated HTML file in _site.
 * Checks structured data parses, SEO tags exist and are sane, headings are
 * well-formed, and every internal link and asset reference actually resolves.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

const SITE = path.resolve('_site');
const problems = [];
const warnings = [];
let pages = 0;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else out.push(p);
  }
  return out;
}

const all = await walk(SITE);
const htmlFiles = all.filter(f => f.endsWith('.html'));

const resolves = (ref) => {
  if (!ref || /^(https?:|mailto:|tel:|data:|#)/i.test(ref)) return true;
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return true;
  const abs = path.join(SITE, clean);
  if (existsSync(abs)) {
    return true;
  }
  if (existsSync(path.join(abs, 'index.html'))) return true;
  return false;
};

for (const file of htmlFiles) {
  pages++;
  const rel = '/' + path.relative(SITE, file).replace(/\\/g, '/');
  const html = await readFile(file, 'utf8');
  const P = (m) => problems.push(`${rel}: ${m}`);
  const W = (m) => warnings.push(`${rel}: ${m}`);

  // ---- structured data ----
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) P('no JSON-LD block');
  for (const [, body] of ld) {
    try {
      const parsed = JSON.parse(body);
      const graph = parsed['@graph'] || [parsed];
      const types = graph.flatMap(n => [].concat(n['@type'] || []));
      if (!types.length) P('JSON-LD has no @type');
    } catch (e) {
      P(`JSON-LD does not parse — ${e.message}`);
    }
  }

  // ---- title / description / canonical ----
  // Measure the decoded title — "&amp;" is one character to a reader and to Google.
  const decode = (s) => String(s || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
  const rawTitle = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const title = decode(rawTitle);
  if (!title) P('missing <title>');
  else if (/&amp;amp;|&amp;quot;/.test(rawTitle)) P(`double-escaped entity in title: ${rawTitle}`);
  else if (title.length > 62) W(`title ${title.length} chars (>62): ${title}`);

  // The minifier sorts attributes, so never assume attribute order when matching tags.
  const attrOf = (tag, name) => (tag.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];
  const tagWith = (el, name, value) =>
    [...html.matchAll(new RegExp(`<${el}\\b[^>]*>`, 'g'))]
      .map(m => m[0])
      .find(t => attrOf(t, name) === value);

  const descTag = tagWith('meta', 'name', 'description');
  const desc = descTag && attrOf(descTag, 'content');
  if (!desc) P('missing meta description');
  else if (desc.length > 165) W(`meta description ${desc.length} chars (>165)`);
  else if (desc.length < 70) W(`meta description only ${desc.length} chars`);

  const canonTag = tagWith('link', 'rel', 'canonical');
  if (!canonTag) P('missing canonical');
  else if (!(attrOf(canonTag, 'href') || '').startsWith('https://')) P('canonical is not absolute https');

  if (!tagWith('meta', 'property', 'og:image')) P('missing og:image');
  if (!tagWith('meta', 'property', 'og:title')) P('missing og:title');

  // ---- headings ----
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  const is404 = rel.endsWith('404.html');
  if (h1s === 0 && !is404) P('no <h1>');
  if (h1s > 1) P(`${h1s} <h1> elements (must be 1)`);

  // ---- lang ----
  if (!/<html lang="[^"]+"/.test(html)) P('missing lang on <html>');

  // ---- images ----
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    if (!/\balt=/.test(tag)) P(`img without alt: ${src || tag.slice(0, 60)}`);
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) W(`img without width/height (CLS risk): ${src}`);
    if (src && !resolves(src)) P(`img src 404: ${src}`);
  }
  for (const m of html.matchAll(/<source\b[^>]*srcset="([^"]+)"/g)) {
    for (const cand of m[1].split(',')) {
      const u = cand.trim().split(/\s+/)[0];
      if (u && !resolves(u)) P(`srcset 404: ${u}`);
    }
  }

  // ---- inline SVG sizing ----
  // An SVG with a viewBox but no intrinsic size falls back to 300x150 and stretches
  // inside a flex parent. Anything not sized by a known CSS rule must carry width/height.
  const SIZED_BY_CSS = ['hero-mesh', 'bx-ico', 'vmi', 'topo-band', 'lc-vis', 'brand'];
  for (const m of html.matchAll(/<svg\b[^>]*>/g)) {
    const tag = m[0];
    if (/\bwidth=/.test(tag) && /\bheight=/.test(tag)) continue;
    const cls = (tag.match(/\bclass="([^"]*)"/) || [])[1] || '';
    if (SIZED_BY_CSS.some(c => cls.includes(c))) continue;
    // Lifecycle + topo-band SVGs are sized by their parent selector, not their own class.
    if (/viewBox="0 0 400 400"|viewBox="0 0 1440 180"|viewBox="0 0 400 300"/.test(tag)) continue;
    P(`inline <svg> with no width/height (renders 300x150): ${tag.slice(0, 90)}`);
  }

  // ---- links & assets ----
  for (const m of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('/') && !resolves(href)) P(`href 404: ${href}`);
  }
  for (const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    if (m[1].startsWith('/') && !resolves(m[1])) P(`script 404: ${m[1]}`);
  }
}

// ---- required root files ----
for (const f of ['sitemap.xml', 'robots.txt', 'favicon.svg', 'site.webmanifest',
                 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
                 'insights/feed.xml', '404.html', 'assets/img/og-default.jpg']) {
  if (!existsSync(path.join(SITE, f))) problems.push(`missing required file: /${f}`);
}

// ---- sitemap sanity ----
const sm = await readFile(path.join(SITE, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const indexablePaths = htmlFiles
  .filter(f => !f.endsWith('404.html'))
  .map(f => '/' + path.relative(SITE, f).replace(/\\/g, '/').replace(/index\.html$/, ''));
const locPaths = locs.map(l => new URL(l).pathname);
for (const p of indexablePaths) {
  if (!locPaths.includes(p)) problems.push(`page missing from sitemap: ${p}`);
}
for (const p of locPaths) {
  if (!indexablePaths.includes(p)) problems.push(`sitemap lists a page that was not built: ${p}`);
}
for (const l of locs) {
  if (!l.startsWith('https://')) problems.push(`sitemap loc not absolute https: ${l}`);
}

// ---- total weight ----
let bytes = 0;
for (const f of all) bytes += (await stat(f)).size;

console.log(`\nPages checked : ${pages}`);
console.log(`Sitemap URLs  : ${locs.length}`);
console.log(`Total _site   : ${(bytes / 1024 / 1024).toFixed(2)} MB`);

if (warnings.length) {
  console.log(`\n── WARNINGS (${warnings.length}) ──`);
  warnings.forEach(w => console.log('  ! ' + w));
}
if (problems.length) {
  console.log(`\n── PROBLEMS (${problems.length}) ──`);
  problems.forEach(p => console.log('  X ' + p));
  process.exit(1);
}
console.log('\nAll checks passed.');
