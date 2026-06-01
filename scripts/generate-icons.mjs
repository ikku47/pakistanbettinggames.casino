/**
 * Generates favicons and app icons from public/logo.png.
 * Run: bun run icons
 */
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/logo.png");

const pngOutputs = [
  { path: "app/apple-icon.png", size: 180 },
  { path: "public/apple-icon.png", size: 180 },
  { path: "public/favicon-32x32.png", size: 32 },
  { path: "public/icon-192.png", size: 192 },
  { path: "public/icon-512.png", size: 512 },
];

for (const { path, size } of pngOutputs) {
  const out = join(root, path);
  await mkdir(dirname(out), { recursive: true });
  await sharp(src).resize(size, size, { fit: "contain" }).png().toFile(out);
  console.log(`Wrote ${path} (${size}x${size})`);
}

const ico16 = await sharp(src).resize(16, 16, { fit: "contain" }).png().toBuffer();
const ico32 = await sharp(src).resize(32, 32, { fit: "contain" }).png().toBuffer();
const ico48 = await sharp(src).resize(48, 48, { fit: "contain" }).png().toBuffer();
const ico = await toIco([ico16, ico32, ico48]);

for (const path of ["app/favicon.ico", "public/favicon.ico"]) {
  await writeFile(join(root, path), ico);
  console.log(`Wrote ${path}`);
}

// Legacy file — remove so Next does not prefer a stale generated /favicon.ico?… route
try {
  await unlink(join(root, "app/icon.png"));
  console.log("Removed app/icon.png (use app/favicon.ico instead)");
} catch {
  /* already absent */
}
