/**
 * Image pipeline â€” Geosustara (Direction B "Terrain")
 * Source: NASA / USGS Earth-observation imagery (public domain).
 *
 * Key idea: the hero's colour treatment (desaturate + darken) is BAKED IN at build time
 * rather than applied as a runtime CSS filter. Two wins:
 *   1. Removes a per-frame compositor filter on the largest element on the page.
 *   2. Desaturated + darkened pixels have far lower entropy, so they compress dramatically
 *      better â€” this is what takes the LCP image from 551 KB to under budget.
 */
import { mkdir, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAW = path.resolve('src/assets/img/raw');
const OUT = path.resolve('src/assets/img');
await mkdir(OUT, { recursive: true });

/** Colour treatments, pre-baked so no runtime CSS filter is needed. */
const TREAT = {
  // Hero: deep, cinematic, sits under a teal scrim + headline text.
  // The 0.45px blur is imperceptible at render size but strips the high-frequency
  // speckle in the delta, which is what was costing ~40% of the file size.
  hero:     img => img.modulate({ saturation: 0.34, brightness: 0.60 }).linear(1.08, -8).blur(0.45),
  // Panel: slightly lighter, used behind the lifecycle marker.
  panel:    img => img.modulate({ saturation: 0.32, brightness: 0.56 }).linear(1.06, -6),
  // Cards: readable at small size, still clearly photographic.
  card:     img => img.modulate({ saturation: 0.42, brightness: 0.74 }).linear(1.04, -4),
  none:     img => img,
};

const JOBS = [
  { name: 'hero',       src: 'lena-delta.jpg',            ar: 16 / 9, treat: 'hero',  widths: [960, 1440, 1920], q: 52 },
  { name: 'panel',      src: 'india-srilanka-shoals.jpg', ar: 1,      treat: 'panel', widths: [640, 1000],       q: 62 },
  { name: 'card-gis',   src: 'india-srilanka-shoals.jpg', ar: 16 / 10,treat: 'card',  widths: [520, 900],        q: 64 },
  { name: 'card-comp',  src: 'darling-river-wetlands.jpg',ar: 16 / 10,treat: 'card',  widths: [520, 900],        q: 64 },
  { name: 'card-sust',  src: 'lena-delta.jpg',            ar: 16 / 10,treat: 'card',  widths: [520, 900],        q: 64 },
];

const manifest = {};

for (const job of JOBS) {
  const src = path.join(RAW, job.src);
  const meta = await sharp(src).metadata();
  const entry = { widths: [], ar: job.ar, lqip: null };

  for (const w of job.widths) {
    const h = Math.round(w / job.ar);
    if (w > meta.width * 1.05) continue;

    const base = () => TREAT[job.treat](
      sharp(src).resize(w, h, { fit: 'cover', position: 'attention' })
    );

    await base().webp({ quality: job.q, effort: 6 }).toFile(path.join(OUT, `${job.name}-${w}.webp`));
    await base().avif({ quality: Math.max(30, job.q - 12), effort: 5 })
      .toFile(path.join(OUT, `${job.name}-${w}.avif`));
    await base().jpeg({ quality: job.q + 6, mozjpeg: true })
      .toFile(path.join(OUT, `${job.name}-${w}.jpg`));

    entry.widths.push(w);
  }

  const lqip = await TREAT[job.treat](
    sharp(src).resize(24, Math.round(24 / job.ar), { fit: 'cover', position: 'attention' })
  ).blur(1.2).webp({ quality: 35 }).toBuffer();
  entry.lqip = `data:image/webp;base64,${lqip.toString('base64')}`;

  manifest[job.name] = entry;
}

await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

// ---- report ----
const files = (await readdir(OUT)).filter(f => /\.(webp|avif|jpg)$/.test(f));
const rows = [];
for (const f of files) {
  const s = await stat(path.join(OUT, f));
  rows.push({ file: f, kb: +(s.size / 1024).toFixed(1) });
}
rows.sort((a, b) => b.kb - a.kb);
console.log('\nLargest outputs:');
for (const r of rows.slice(0, 14)) console.log(`  ${r.file.padEnd(24)} ${String(r.kb).padStart(7)} KB`);

const heroLcp = rows.filter(r => r.file.startsWith('hero-1440') || r.file.startsWith('hero-1920'));
console.log('\nLCP candidates (budget: <= 150 KB):');
for (const r of heroLcp) {
  console.log(`  ${r.file.padEnd(24)} ${String(r.kb).padStart(7)} KB  ${r.kb <= 150 ? 'PASS' : 'OVER BUDGET'}`);
}

