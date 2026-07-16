import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [path.join(root, "app"), path.join(root, "docs")];
const output = path.join(root, "app/generated/search-index.json");
const allowedExtensions = new Set([".ts", ".tsx", ".md", ".json"]);
const ignored = new Set([output, path.join(root, "app/generated/search-index.json")]);
const frenchSignals = /[àâçéèêëîïôùûüÿœ]|\b(entreprise|société|projet|document|statut|création|rendez-vous|conseiller|associé|formalités|diagnostic|offre|suivi|capital|dossier|client|message|confidentialité)\b/i;

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git", "generated"].includes(entry.name)) continue;
      walk(full, files);
    } else if (allowedExtensions.has(path.extname(entry.name)) && !ignored.has(full)) {
      files.push(full);
    }
  }
  return files;
}

function clean(value) {
  return value
    .replace(/\\n/g, " ")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const records = [];
const seen = new Set();
for (const file of targets.flatMap((target) => walk(target))) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const source = fs.readFileSync(file, "utf8");
  const candidates = [];

  if (file.endsWith(".md")) {
    for (const line of source.split("\n")) {
      const value = clean(line.replace(/^#+\s*/, "").replace(/^[-*]\s*/, ""));
      if (value.length >= 18) candidates.push(value);
    }
  } else {
    const stringPattern = /(["'`])((?:\\.|(?!\1).){12,240})\1/gms;
    for (const match of source.matchAll(stringPattern)) candidates.push(clean(match[2]));
  }

  for (const text of candidates) {
    if (text.length < 18 || text.length > 240) continue;
    if (!frenchSignals.test(text)) continue;
    if (/^(className|@\/|https?:|[a-z0-9:_\-/.]+)$/i.test(text)) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    records.push({ id: `${relative}:${records.length + 1}`, text, file: relative });
  }
}

records.sort((a, b) => a.file.localeCompare(b.file) || a.text.localeCompare(b.text));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(records, null, 2) + "\n");
console.log(`Assistant index generated: ${records.length} records from ${new Set(records.map((item) => item.file)).size} files.`);
