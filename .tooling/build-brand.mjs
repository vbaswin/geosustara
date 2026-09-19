/**
 * Brand assets — favicons, PWA icons, the header mark and the Open Graph card.
 *
 * Everything derives from ONE source of truth: .tooling/brand/logo-master.png, which is the
 * company's GS monogram with the white brochure background keyed out and the artwork
 * trimmed to its bounding box. Nothing here is licence-encumbered.
 *
 *   node .tooling/build-brand.mjs      (or: npm run brand)
 *
 * Two variants of the mark are produced:
 *   - logo.png            original colours, transparent. Used by the Organization
 *                         structured data and anywhere the background is light.
 *   - mark-96 / mark-192  lightness floor raised so the deep-pine half of the monogram
 *                         still reads against the site's near-black green. Header, footer.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('src/root');
const IMG = path.resolve('src/assets/img');
const BRAND = path.resolve('.tooling/brand');
const MASTER = path.join(BRAND, 'logo-master.png');
await mkdir(ROOT, { recursive: true });
await mkdir(IMG, { recursive: true });

const BRANDC = '#16C264';   // --brand
const BG = '#06140D';       // --bg
const TXT = '#E8F2EB';
const MUTED = '#8CA497';
const FAINT = '#64786C';

/* ------------------------------------------------------------------ mark -- */
const master = sharp(MASTER);
const meta = await master.metadata();

/**
 * Dark-surface variant. `lightness` alone would wash the bright emerald out, so the
 * modulate is paired with a small saturation lift and the result is clamped by `linear`,
 * which raises the black point without touching the highlights.
 */
const forDark = (input) =>
  sharp(input).modulate({ saturation: 1.12 }).linear(0.78, 58);

const markSizes = [96, 192];
for (const w of markSizes) {
  const h = Math.max(1, Math.round((meta.height * w) / meta.width));
  await forDark(MASTER).resize(w, h, { fit: 'inside' })
    .png({ compressionLevel: 9 }).toFile(path.join(IMG, `mark-${w}.png`));
  console.log(`mark   mark-${w}.png`.padEnd(30), `${w}x${h}`);
}

// Full-colour, transparent. Structured data points Google at this file.
{
  const w = 640;
  const h = Math.max(1, Math.round((meta.height * w) / meta.width));
  await master.clone().resize(w, h).png({ compressionLevel: 9 })
    .toFile(path.join(IMG, 'logo.png'));
  console.log('logo   logo.png'.padEnd(30), `${w}x${h}`);
}

/* ----------------------------------------------------------------- icons -- */
// App icons place the dark-surface mark on the site's own background plate.
const plate = (size, radius) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
     <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BG}"/>
   </svg>`
);

async function icon(file, size, scale, radiusFrac) {
  const inner = Math.round(size * scale);
  const mark = await forDark(MASTER)
    .resize(inner, inner, { fit: 'inside' })
    .png().toBuffer();
  const m = await sharp(mark).metadata();
  await sharp(plate(size, Math.round(size * radiusFrac)))
    .composite([{
      input: mark,
      top: Math.round((size - m.height) / 2),
      left: Math.round((size - m.width) / 2),
    }])
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log(`icon   ${path.basename(file)}`.padEnd(30), `${size}x${size}`);
}

await icon(path.join(ROOT, 'icon-192.png'), 192, 0.80, 0.22);
await icon(path.join(ROOT, 'icon-512.png'), 512, 0.80, 0.22);
await icon(path.join(ROOT, 'icon-512-maskable.png'), 512, 0.58, 0.50);
await icon(path.join(ROOT, 'apple-touch-icon.png'), 180, 0.78, 0);

// favicon.svg wraps a 64px raster: the source artwork is a raster, and one file then
// serves every browser that prefers an SVG icon.
{
  await icon(path.join(BRAND, '_f64.png'), 64, 0.84, 0.18);
  const b64 = (await sharp(path.join(BRAND, '_f64.png')).png().toBuffer()).toString('base64');
  await writeFile(path.join(ROOT, 'favicon.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"' +
    ' role="img" aria-label="Geosustara Enviro Services LLP">' +
    '<title>Geosustara Enviro Services LLP</title>' +
    `<image width="64" height="64" href="data:image/png;base64,${b64}"/></svg>`);
  console.log('icon   favicon.svg');
}

// favicon.ico — Google reads the 48px frame for the favicon beside a search result and
// will not take an SVG for it. An .ico is just a directory of embedded PNGs; sharp cannot
// write the container, so it is assembled here.
{
  const frames = [];
  for (const size of [16, 32, 48]) {
    const tmp = path.join(BRAND, `_ico${size}.png`);
    await icon(tmp, size, 0.84, 0.18);
    frames.push({ size, buf: await sharp(tmp).png().toBuffer() });
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(frames.length, 4);
  const dir = Buffer.alloc(16 * frames.length);
  let offset = 6 + dir.length;
  frames.forEach((f, i) => {
    const o = i * 16;
    dir.writeUInt8(f.size % 256, o);     // 0 means 256
    dir.writeUInt8(f.size % 256, o + 1);
    dir.writeUInt16LE(1, o + 4);         // colour planes
    dir.writeUInt16LE(32, o + 6);        // bits per pixel
    dir.writeUInt32LE(f.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += f.buf.length;
  });
  await writeFile(path.join(ROOT, 'favicon.ico'),
    Buffer.concat([header, dir, ...frames.map((f) => f.buf)]));
  console.log('icon   favicon.ico'.padEnd(30), '16/32/48');
}

/* --------------------------------------------------------- Open Graph ---- */
const W = 1200, H = 630;

// Fonts are not guaranteed inside the SVG rasteriser, so the OG card uses a
// widely-present system stack. The mark itself is composited as an image.
const FONT = 'Segoe UI, Helvetica, Arial, sans-serif';

const ogText = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0%"   stop-color="${BG}" stop-opacity="0.97"/>
      <stop offset="55%"  stop-color="${BG}" stop-opacity="0.87"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.58"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${BRANDC}"/>

  <text x="164" y="112" font-family="${FONT}" font-size="34" font-weight="700"
        letter-spacing="1.5" fill="${TXT}">GEOSUSTARA</text>
  <text x="164" y="140" font-family="${FONT}" font-size="15" font-weight="600"
        letter-spacing="4.4" fill="${FAINT}">ENVIRO SERVICES LLP</text>

  <text x="72" y="286" font-family="${FONT}" font-size="58" font-weight="700"
        letter-spacing="-1.6" fill="${TXT}">Environmental and</text>
  <text x="72" y="354" font-family="${FONT}" font-size="58" font-weight="700"
        letter-spacing="-1.6" fill="${BRANDC}">geospatial consulting</text>
  <text x="72" y="422" font-family="${FONT}" font-size="58" font-weight="700"
        letter-spacing="-1.6" fill="${TXT}">backed by evidence.</text>

  <rect x="72" y="484" width="58" height="2" fill="${BRANDC}"/>
  <text x="72" y="528" font-family="${FONT}" font-size="21" fill="${MUTED}">EIA &#183; Environmental Clearance &#183; GIS &#183; Water &amp; Wastewater</text>
  <text x="72" y="560" font-family="${FONT}" font-size="19" fill="${FAINT}">Thiruvananthapuram, Kerala &#183; India</text>
</svg>`;

const ogMark = await forDark(MASTER).resize(72, 72, { fit: 'inside' }).png().toBuffer();
const ogMarkMeta = await sharp(ogMark).metadata();

await sharp(path.join(IMG, 'hero-1440.jpg'))
  .resize(W, H, { fit: 'cover', position: 'attention' })
  .composite([
    { input: Buffer.from(ogText), top: 0, left: 0 },
    { input: ogMark, top: Math.round(96 - ogMarkMeta.height / 2), left: 72 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(IMG, 'og-default.jpg'));

const st = await sharp(path.join(IMG, 'og-default.jpg')).metadata();
console.log(`\nog-default.jpg  ${st.width}x${st.height}`);
