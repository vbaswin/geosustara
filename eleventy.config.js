const { minify } = require('html-minifier-terser');
const { DateTime } = require('luxon');
const crypto = require('node:crypto');
const fs = require('node:fs');
const nodePath = require('node:path');

// Sub-directory the site is served from. Root ("/") on Vercel and on the production domain;
// "/geosustara/" on a GitHub Pages project site, where the repo name becomes a path segment.
// Set PATH_PREFIX at build time — every internal link goes through Eleventy's `url` filter,
// so nothing else needs to know about it.
function normalisePrefix(value) {
  const trimmed = String(value || '/').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}
const PATH_PREFIX = normalisePrefix(process.env.PATH_PREFIX);

// Prepend the path prefix to a root-relative path. Idempotent, so a value that already
// carries the prefix is returned unchanged.
function withPrefix(p) {
  const s = String(p == null ? '/' : p);
  if (PATH_PREFIX === '/' || !s.startsWith('/') || s.startsWith(PATH_PREFIX)) return s;
  return PATH_PREFIX.replace(/\/$/, '') + s;
}

module.exports = function (eleventyConfig) {
  // ---- passthrough: assets are copied verbatim -------------------------------
  eleventyConfig.addPassthroughCopy({ 'src/assets/css': 'assets/css' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/js': 'assets/js' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/vendor': 'assets/vendor' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img/*.webp': 'assets/img' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img/*.avif': 'assets/img' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img/*.jpg': 'assets/img' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img/*.svg': 'assets/img' });
  // PNG was missing here, which silently broke /assets/img/logo.png — the URL the
  // Organization structured data points Google at. The brand mark is a PNG too.
  eleventyConfig.addPassthroughCopy({ 'src/assets/img/*.png': 'assets/img' });
  eleventyConfig.addPassthroughCopy({ 'src/root': '/' });

  eleventyConfig.setServerOptions({ port: 8080, showAllHosts: false });

  eleventyConfig.addGlobalData('buildYear', () => new Date().getFullYear());
  eleventyConfig.addGlobalData('buildDate', () => new Date().toISOString());

  // Canonical base URL. Defaults to the production domain in site.json, but any host can
  // override it — set SITE_URL on a preview deployment so canonicals, the sitemap, the RSS
  // feed and the structured data all point at the URL people are actually visiting.
  eleventyConfig.addGlobalData('siteUrl', () => {
    const configured = require('./src/_data/site.json').url;
    const override = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
    return override || configured;
  });

  // Set NOINDEX=1 on preview deployments so a temporary URL never competes with the real
  // domain in search results.
  eleventyConfig.addGlobalData('noindex', () =>
    ['1', 'true', 'yes'].includes(String(process.env.NOINDEX || '').toLowerCase())
  );

  // ---- enquiry form wiring ---------------------------------------------------
  // Resolves the form provider once, at build time, so the template and main.js never
  // have to know which service is behind it. Environment variables win over site.json,
  // which lets the credential stay out of the repository if that is preferred.
  //
  //   FORM_PROVIDER   web3forms | formspree | formsubmit | custom
  //   FORM_ACCESS_KEY Web3Forms access key (public by design — it identifies the
  //                   destination inbox, it does not authorise anything)
  //   FORM_ENDPOINT   full POST URL, for formspree / formsubmit / custom
  //
  // `active` is what the template branches on. When it is false the form degrades to a
  // phone / WhatsApp / email prompt rather than silently swallowing enquiries.
  eleventyConfig.addGlobalData('enquiry', () => {
    const cfg = require('./src/_data/site.json').enquiry || {};
    const pick = (env, key) => String(process.env[env] || cfg[key] || '').trim();
    const provider = pick('FORM_PROVIDER', 'provider').toLowerCase();
    const accessKey = pick('FORM_ACCESS_KEY', 'accessKey');
    let endpoint = pick('FORM_ENDPOINT', 'endpoint');

    if (provider === 'web3forms' && !endpoint) endpoint = 'https://api.web3forms.com/submit';
    const active = Boolean(endpoint) && (provider !== 'web3forms' || Boolean(accessKey));

    return {
      provider,
      endpoint: active ? endpoint : '',
      accessKey: provider === 'web3forms' ? accessKey : '',
      subject: cfg.subject || 'New enquiry',
      replyTo: cfg.replyTo || '',
      active,
    };
  });

  // Absolute URL of the home page, prefix included. Structured data and the Atom feed need
  // a real URL to build @ids from, and `siteUrl` alone is the bare origin.
  eleventyConfig.addGlobalData('homeUrl', function () {
    const configured = require('./src/_data/site.json').url;
    const override = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
    return new URL(PATH_PREFIX, override || configured).toString();
  });

  // ---- collections -----------------------------------------------------------
  eleventyConfig.addCollection('insights', (c) =>
    c.getFilteredByGlob('src/insights/posts/*.md').sort((a, b) => b.date - a.date)
  );

  // ---- filters ---------------------------------------------------------------
  eleventyConfig.addFilter('dateISO', (d) =>
    DateTime.fromJSDate(new Date(d), { zone: 'utc' }).toISO()
  );
  eleventyConfig.addFilter('dateYMD', (d) =>
    DateTime.fromJSDate(new Date(d), { zone: 'utc' }).toFormat('yyyy-LL-dd')
  );
  eleventyConfig.addFilter('dateReadable', (d) =>
    DateTime.fromJSDate(new Date(d), { zone: 'utc' }).toFormat('d LLLL yyyy')
  );
  eleventyConfig.addFilter('limit', (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter('where', (arr, key, value) =>
    (arr || []).filter((i) => i[key] === value)
  );
  eleventyConfig.addFilter('reject', (arr, key, value) =>
    (arr || []).filter((i) => i[key] !== value)
  );
  // Absolute URL for canonical / Open Graph / sitemap entries. The path prefix is applied
  // here, so callers pass a plain site-root path and never pipe through `url` as well —
  // `x | url | absUrl(siteUrl)` would prefix it twice.
  eleventyConfig.addFilter('absUrl', (path, base) =>
    new URL(withPrefix(path || '/'), base).toString()
  );
  // Strip HTML for meta descriptions and feed summaries.
  eleventyConfig.addFilter('plain', (html) =>
    String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  );
  eleventyConfig.addFilter('truncate', (s, n) => {
    s = String(s || '');
    return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)) + '…';
  });
  eleventyConfig.addFilter('jsonld', (obj) =>
    JSON.stringify(obj, null, 0).replace(/</g, '\\u003c')
  );

  // Content hash for an asset, appended by the layout as `?v=`.
  //
  // site.css and main.js are served from /assets/, which vercel.json and _headers both mark
  // `max-age=31536000, immutable` — and their filenames carry no fingerprint. Without this,
  // a visitor who has been to the site once keeps the old CSS and JavaScript for up to a
  // year after a deploy, and `immutable` means the browser will not even revalidate. A
  // changed file produces a different URL, which makes the long lifetime correct rather
  // than dangerous.
  //
  // Cached on mtime so `--serve` picks up edits without restarting.
  const hashes = new Map();
  eleventyConfig.addFilter('assetVersion', (sitePath) => {
    const file = nodePath.join('src', String(sitePath).replace(/^\//, ''));
    let mtime;
    try {
      mtime = fs.statSync(file).mtimeMs;
    } catch {
      return 'missing'; // never throw during a build over a stale reference
    }
    const hit = hashes.get(file);
    if (hit && hit.mtime === mtime) return hit.hash;
    const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
    hashes.set(file, { mtime, hash });
    return hash;
  });

  // ---- production HTML minification -----------------------------------------
  // Kept off during `--serve` so the dev output stays readable and rebuilds stay fast.
  eleventyConfig.addTransform('minify', async function (content) {
    if (process.env.ELEVENTY_RUN_MODE !== 'build') return content;
    if (!(this.page.outputPath || '').endsWith('.html')) return content;
    return minify(content, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      useShortDoctype: true,
      removeRedundantAttributes: true,
      sortAttributes: true,
      sortClassName: true,
    });
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    templateFormats: ['njk', 'md', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    pathPrefix: PATH_PREFIX,
  };
};
