// Fil-databasen: läser och skriver JSON-filer i mappen db/.
//
// OBS: två förfrågningar samtidigt kan läsa samma fil och sedan skriva över
// varandras ändringar. Det är en av anledningarna till att vi byter till en
// riktig databas i föreläsning 4. Då ersätts hela mappen src/data/.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// Sökvägen utgår från den här filen, inte från terminalen
export const dbDir = path.join(import.meta.dirname, '..', '..', 'db');

export async function readJson(fileName, fallback) {
  try {
    const text = await readFile(path.join(dbDir, fileName), 'utf8');
    return JSON.parse(text);
  } catch (err) {
    // Ingen fil än? Då börjar vi med fallback-värdet, t.ex. en tom lista.
    if (err.code === 'ENOENT') return fallback;
    throw err; // andra fel, t.ex. trasig JSON, ska inte tystas
  }
}

export async function writeJson(fileName, data) {
  await mkdir(dbDir, { recursive: true });
  // null, 2 = indentering, så att filen går att läsa för en människa
  await writeFile(path.join(dbDir, fileName), JSON.stringify(data, null, 2) + '\n');
}

// Nästa lediga id: ett mer än det största som finns
export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// Ett fel som errorHandler gör om till 409 Conflict
export function duplicateError(message) {
  const error = new Error(message);
  error.code = 'DUPLICATE';
  return error;
}
