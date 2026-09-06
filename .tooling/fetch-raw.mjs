/**
 * Re-download the original source imagery.
 *
 * These files are NOT in git (~35 MB) — only the optimised derivatives in
 * src/assets/img are committed, which is all a build needs. Run this only if you
 * want to regenerate the image set with different crops or treatments:
 *
 *     node .tooling/fetch-raw.mjs && npm run images
 *
 * Source: NASA / USGS Earth-observation imagery, public domain.
 * https://www.nasa.gov/nasa-brand-center/images-and-media/
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('src/assets/img/raw');
await mkdir(OUT, { recursive: true });

const ASSETS = [
  { nasaId: 'GSFC_20171208_Archive_e002160', file: 'lena-delta.jpg',
    what: 'Lena Delta, Siberia — Landsat false-colour land-cover classification' },
  { nasaId: 'iss071e700080', file: 'india-srilanka-shoals.jpg',
    what: 'Limestone shoals between mainland India and Sri Lanka (ISS Expedition 71)' },
  { nasaId: 'iss074e0794671', file: 'darling-river-wetlands.jpg',
    what: 'Darling River wetlands, New South Wales (ISS Expedition 74)' },
];

const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

for (const a of ASSETS) {
  const dest = path.join(OUT, a.file);
  if (await exists(dest)) { console.log(`skip  ${a.file} (already present)`); continue; }

  const manifest = await fetch(`https://images-api.nasa.gov/asset/${a.nasaId}`).then(r => r.json());
  const jpgs = manifest.collection.items.map(i => i.href).filter(h => h.endsWith('.jpg'));
  const url = jpgs.find(h => /~orig/.test(h)) || jpgs.find(h => /~large/.test(h)) || jpgs[0];
  if (!url) { console.error(`FAIL  ${a.file} — no JPEG in asset manifest`); continue; }

  const buf = Buffer.from(await fetch(url).then(r => r.arrayBuffer()));
  await writeFile(dest, buf);
  console.log(`ok    ${a.file.padEnd(28)} ${(buf.length / 1024 / 1024).toFixed(1)} MB  — ${a.what}`);
}

console.log('\nDone. Run `npm run images` to regenerate the optimised derivatives.');
