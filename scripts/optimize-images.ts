import fs from "node:fs/promises";
import path from "node:path";
import sharp, { type FitEnum, type PositionEnum } from "sharp";

type Crop = {
  aspect: [number, number];
  position: keyof PositionEnum;
};

type AssetJob = {
  source: string;
  sourceDirectory?: string;
  directory: string;
  name: string;
  widths: number[];
  mobile?: Crop;
};

const root = process.cwd();
const sourceDirectory = path.join(root, "oree-company- images");
const requestedImageDirectory = path.join(root, "the demanded images");
const outputDirectory = path.join(root, "public/assets/imagery");
const requiredDirectories = ["activities", "brand", "heroes", "pathways", "process", "support", "testimonials", "landing", "app", "mobile"];

const jobs: AssetJob[] = [
  {
    source: "ChatGPT Image 15 juil. 2026, 17_42_58 (4).png",
    directory: "heroes",
    name: "hero-home-company-journey",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_42_58 (3).png",
    directory: "landing",
    name: "hero-sasu-solo-founder",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_42_58 (2).png",
    directory: "landing",
    name: "hero-eurl-structured-founder",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_37 (4).png",
    directory: "landing",
    name: "hero-sas-multiple-founders",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_41 (8).png",
    directory: "landing",
    name: "hero-sarl-organised-team",
    widths: [640, 960, 1280, 1448],
    mobile: { aspect: [4, 5], position: "center" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_42_58 (1).png",
    directory: "landing",
    name: "hero-employee-transition",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_42 (9).png",
    directory: "landing",
    name: "hero-existing-business-transition",
    widths: [640, 960, 1280, 1448],
    mobile: { aspect: [4, 5], position: "center" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_39 (5).png",
    directory: "landing",
    name: "hero-blocked-dossier-review",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_42_58 (5).png",
    directory: "landing",
    name: "hero-choose-status-decision",
    widths: [640, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_35 (2).png",
    directory: "pathways",
    name: "pathway-solo-founder",
    widths: [480, 720, 960, 1280],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_40 (7).png",
    directory: "support",
    name: "support-adviser-consultation",
    widths: [480, 720, 960, 1280],
    mobile: { aspect: [4, 5], position: "center" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_31_39 (6).png",
    directory: "support",
    name: "support-remote-appointment",
    widths: [480, 720, 960, 1280],
    mobile: { aspect: [4, 5], position: "center" },
  },
  {
    source: "ChatGPT Image 15 juil. 2026, 17_29_17 (5).png",
    directory: "process",
    name: "process-document-review",
    widths: [480, 720, 960, 1280],
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_09 (1).png",
    sourceDirectory: requestedImageDirectory,
    directory: "activities",
    name: "activity-artisan-workshop",
    widths: [480, 720, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_09 (2).png",
    sourceDirectory: requestedImageDirectory,
    directory: "activities",
    name: "activity-local-shop",
    widths: [480, 720, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_10 (3).png",
    sourceDirectory: requestedImageDirectory,
    directory: "activities",
    name: "activity-field-service",
    widths: [480, 720, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_10 (4).png",
    sourceDirectory: requestedImageDirectory,
    directory: "activities",
    name: "activity-restaurant-owner",
    widths: [480, 720, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_13 (5).png",
    sourceDirectory: requestedImageDirectory,
    directory: "activities",
    name: "activity-logistics",
    widths: [480, 720, 960, 1280, 1586],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_13 (6).png",
    sourceDirectory: requestedImageDirectory,
    directory: "pathways",
    name: "pathway-home-founder",
    widths: [480, 720, 960, 1280],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_14 (7).png",
    sourceDirectory: requestedImageDirectory,
    directory: "pathways",
    name: "pathway-founders-discussion",
    widths: [480, 720, 960, 1280],
    mobile: { aspect: [4, 5], position: "right" },
  },
  {
    source: "ChatGPT Image 23 juil. 2026, 11_01_14 (8).png",
    sourceDirectory: requestedImageDirectory,
    directory: "process",
    name: "process-project-organisation",
    widths: [480, 720, 960, 1280],
    mobile: { aspect: [4, 5], position: "center" },
  },
];

async function resetOutput() {
  const normalized = path.normalize(outputDirectory);
  if (!normalized.endsWith(path.join("public", "assets", "imagery"))) {
    throw new Error(`Refusing to clean unexpected output path: ${normalized}`);
  }
  await fs.rm(outputDirectory, { recursive: true, force: true });
  await Promise.all(requiredDirectories.map((directory) => fs.mkdir(path.join(outputDirectory, directory), { recursive: true })));
}

function eligibleWidths(widths: number[], sourceWidth: number) {
  const values = widths.filter((width) => width <= sourceWidth);
  if (!values.includes(sourceWidth) && sourceWidth < Math.max(...widths)) values.push(sourceWidth);
  return [...new Set(values)].sort((a, b) => a - b);
}

async function writeFormats(input: string, destination: string, width: number, crop?: Crop) {
  const base = sharp(input).rotate();
  const resize = crop
    ? base.resize({
        width,
        height: Math.round(width * crop.aspect[1] / crop.aspect[0]),
        fit: "cover" as keyof FitEnum,
        position: crop.position,
        withoutEnlargement: true,
      })
    : base.resize({ width, withoutEnlargement: true });

  await Promise.all([
    resize.clone().avif({ quality: 63, effort: 5, chromaSubsampling: "4:4:4" }).toFile(`${destination}-${width}.avif`),
    resize.clone().webp({ quality: 79, effort: 5, smartSubsample: true }).toFile(`${destination}-${width}.webp`),
  ]);
}

async function optimize(job: AssetJob) {
  const input = path.join(job.sourceDirectory ?? sourceDirectory, job.source);
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Unable to read dimensions for ${job.source}`);

  const target = path.join(outputDirectory, job.directory, job.name);
  await Promise.all(eligibleWidths(job.widths, metadata.width).map((width) => writeFormats(input, target, width)));

  if (job.mobile) {
    const mobileTarget = path.join(outputDirectory, "mobile", `${job.name}-mobile`);
    await Promise.all([480, 640, 800].filter((width) => width <= metadata.width).map((width) => writeFormats(input, mobileTarget, width, job.mobile)));
  }
  return job.name;
}

await resetOutput();
const completed = await Promise.all(jobs.map(optimize));
console.log(`Optimized ${completed.length} curated images into AVIF and WebP variants.`);
