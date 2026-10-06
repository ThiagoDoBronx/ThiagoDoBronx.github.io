// Renders a round-picker thumbnail (WebP, transparent) for every model in product.json.
// Usage: npm run build && npx vite preview --port 4173 & npm run thumbs
// Set CHROMIUM_PATH to use a specific Chromium binary.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.THUMB_BASE ?? 'http://localhost:4173/';
const product = JSON.parse(readFileSync(new URL('../src/data/product.json', import.meta.url)));
mkdirSync(new URL('../public/thumbs/', import.meta.url), { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 384, height: 384 } });
for (const m of product.models) {
  await page.goto(`${BASE}?thumb=${m.id}`);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  const dataUrl = await page.evaluate(() => document.querySelector('#thumb canvas').toDataURL('image/webp', 0.9));
  writeFileSync(new URL(`../public/${m.thumb}`, import.meta.url), Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('thumb', m.id);
}
await browser.close();
