/**
 * Rýchla kontrola konzistentnosti obsahových JSON súborov v /content.
 * Spustenie:  npm run seed   (alebo: node ./scripts/verify-content.mjs)
 *
 * Kontroluje, že súbory sú platný JSON a že položky majú základné polia.
 * Nie je to validácia schémy – len záchranná sieť proti preklepom.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const CONTENT = path.join(process.cwd(), "content");

const REQUIRED = {
  "timeline.json": ["id", "date", "title"],
  "documents.json": ["id", "slug", "title", "category"],
  "contract.json": ["id", "order", "question"],
  "gallery.json": ["id", "src", "alt"],
  "opinions.json": ["id", "excerpt", "profileName", "platform"],
  "cityActions.json": ["id", "date", "step", "actionStatus"],
  "openQuestions.json": ["id", "question", "actionStatus"],
  "articles.json": ["id", "slug", "title"],
};

let errors = 0;
let placeholders = 0;

const files = (await readdir(CONTENT)).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const raw = await readFile(path.join(CONTENT, file), "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`✗ ${file}: neplatný JSON – ${e.message}`);
    errors++;
    continue;
  }
  const required = REQUIRED[file];
  if (required && Array.isArray(data)) {
    data.forEach((item, i) => {
      for (const key of required) {
        if (item[key] === undefined || item[key] === "") {
          console.error(`✗ ${file}[${i}]: chýba povinné pole „${key}"`);
          errors++;
        }
      }
      if (item.isPlaceholder) placeholders++;
    });
  }
  console.log(`✓ ${file}: OK (${Array.isArray(data) ? data.length + " položiek" : "objekt"})`);
}

console.log(`\nHotovo. Chyby: ${errors}, vzorové (placeholder) položky: ${placeholders}.`);
if (errors > 0) process.exit(1);
