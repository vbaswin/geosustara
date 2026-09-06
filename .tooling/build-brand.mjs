/**
 * Brand assets — favicons, PWA icons, logo and the Open Graph card.
 * Everything is generated from vector sources, so nothing is licence-encumbered.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('src/root');
const IMG = path.resolve('src/assets/img');
await mkdir(ROOT, { recursive: true });
await mkdir(IMG, { recursive: true });

const AQUA = '#35C3AC';
const BG = '#061513';

/* ---------------------------------------------------------------- icons -- */
const markSvg = (size, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${pad ? 0 : 12}" fill="${BG}"/>
  <g transform="translate(32 32) scale(${pad ? 0.72 : 1}) translate(-32 -32)">
    <g stroke="${AQUA}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none">
      <path d="M32 12 55 22 32 32 9 22 32 12Z"/>
      <path d="M13.5 31 32 39 50.5 31" opacity=".66"/>
      <path d="M13.5 41 32 49 50.5 41" opacity=".36"/>
    </g>
    <circle cx="32" cy="22" r="3.4" fill="${AQUA}"/>
  </g>
</svg>`;

const icons = [
  { file: path.join(ROOT, 'icon-192.png'), size: 192, pad: false },
  { file: path.join(ROOT, 'icon-512.png'), size: 512, pad: false },
  { file: path.join(ROOT, 'icon-512-maskable.png'), size: 512, pad: true },
  { file: path.join(ROOT, 'apple-touch-icon.png'), size: 180, pad: false },
  { file: path.join(IMG, 'logo.png'), size: 512, pad: false },
];

for (const i of icons) {
  await sharp(Buffer.from(markSvg(64, i.pad)))
    .resize(i.size, i.size)
    .png({ compressionLevel: 9 })
    .toFile(i.file);
  console.log(`icon  ${path.basename(i.file).padEnd(26)} ${i.size}x${i.size}`);
}

/* --------------------------------------------------------- Open Graph ---- */
const W = 1200, H = 630;

// Fonts are not guaranteed inside the SVG rasteriser, so the OG card uses a
// widely-present system stack. The mark itself is vector and always renders.
const FONT = "Segoe UI, Helvetica, Arial, sans-serif";

const ogOverlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0%"   stop-color="${BG}" stop-opacity="0.97"/>
      <stop offset="55%"  stop-color="${BG}" stop-opacity="0.86"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${AQUA}"/>

  <g transform="translate(72 78) scale(1.05)">
    <g stroke="${AQUA}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" fill="none">
      <path d="M32 12 55 22 32 32 9 22 32 12Z"/>
      <path d="M13.5 31 32 39 50.5 31" opacity=".66"/>
      <path d="M13.5 41 32 49 50.5 41" opacity=".36"/>
    </g>
    <circle cx="32" cy="22" r="3.2" fill="${AQUA}"/>
  </g>

  <text x="152" y="112" font-family="${FONT}" font-size="34" font-weight="700"
        letter-spacing="1.5" fill="#E9F1EE">GEOSUSTARA</text>
  <text x="152" y="140" font-family="${FONT}" font-size="15" font-weight="600"
        letter-spacing="4.4" fill="#63756F">ENVIRO SERVICES LLP</text>

  <text x="72" y="286" font-family="${FONT}" font-size="60" font-weight="700"
        letter-spacing="-1.6" fill="#E9F1EE">Sustainability that is</text>
  <text x="72" y="356" font-family="${FONT}" font-size="60" font-weight="700"
        letter-spacing="-1.6" fill="${AQUA}">practical, measurable</text>
  <text x="72" y="426" font-family="${FONT}" font-size="60" font-weight="700"
        letter-spacing="-1.6" fill="#E9F1EE">and impactful.</text>

  <rect x="72" y="486" width="58" height="2" fill="${AQUA}"/>
  <text x="72" y="530" font-family="${FONT}" font-size="21" fill="#8CA39D">Environmental &amp; Geospatial Consulting</text>
  <text x="72" y="562" font-family="${FONT}" font-size="19" fill="#63756F">Thiruvananthapuram, Kerala &#183; India</text>
</svg>`;

await sharp(path.join(IMG, 'hero-1440.jpg'))
  .resize(W, H, { fit: 'cover', position: 'attention' })
  .composite([{ input: Buffer.from(ogOverlay), top: 0, left: 0 }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(IMG, 'og-default.jpg'));

const st = await sharp(path.join(IMG, 'og-default.jpg')).metadata();
console.log(`\nog-default.jpg  ${st.width}x${st.height}`);
