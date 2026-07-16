import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "oree logos");
const destination = path.join(root, "public", "assets", "brand");
const ecosystemDestination = path.join(root, "public", "assets", "ecosystem");

await mkdir(destination, { recursive: true });
await mkdir(ecosystemDestination, { recursive: true });

const lockups = [
  {
    source: "ChatGPT Image 16 juil. 2026, 12_50_29 (1).png",
    output: "oree-lockup-complet.webp",
    width: 520,
  },
  {
    source: "ChatGPT Image 16 juil. 2026, 12_50_29 (2).png",
    output: "oree-entreprises-horizontal.webp",
    width: 560,
  },
  {
    source: "ChatGPT Image 16 juil. 2026, 12_50_34 (6).png",
    output: "oree-app-icon.webp",
    width: 320,
  },
];

for (const asset of lockups) {
  await sharp(path.join(source, asset.source))
    .trim({ background: "#ffffff", threshold: 18 })
    .resize({ width: asset.width, withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(destination, asset.output));
}

const ecosystemLogos = [
  ["ChatGPT Image 16 juil. 2026, 13_57_24 (1).png", "inpi-republique-francaise.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_25 (2).png", "urssaf.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_25 (3).png", "insee.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_26 (4).png", "infogreffe.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_26 (5).png", "greffiers-tribunaux-commerce.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_26 (6).png", "dgfip.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_27 (7).png", "cma-france.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_27 (8).png", "credit-agricole.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_27 (9).png", "credit-mutuel.webp"],
  ["ChatGPT Image 16 juil. 2026, 13_57_28 (10).png", "bpifrance.webp"],
];

for (const [filename, output] of ecosystemLogos) {
  await sharp(path.join(source, "partners logos", filename))
    .trim({ background: "#ffffff", threshold: 18 })
    .resize({ width: 320, height: 96, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(ecosystemDestination, output));
}

const faviconSource = path.join(source, "favicon_io");
for (const filename of [
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "apple-touch-icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon.ico",
]) {
  await copyFile(path.join(faviconSource, filename), path.join(root, "public", filename));
}

console.log("Identité Orée et repères d'écosystème optimisés.");
