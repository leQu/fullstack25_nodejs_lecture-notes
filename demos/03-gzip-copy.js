// Föreläsning 3: kopiera och komprimera en fil med pipeline. Kör: npm run demo:gzip
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import path from 'node:path';

const source = path.join(import.meta.dirname, '..', 'files', 'meny.txt');
const outputDir = path.join(import.meta.dirname, 'output');
const target = path.join(outputDir, 'meny.txt.gz');

try {
  await mkdir(outputDir, { recursive: true });

  // Readable → Transform → Writable. pipeline väntar på 'finish' och skickar fel vidare.
  await pipeline(
    createReadStream(source),
    createGzip(),
    createWriteStream(target),
  );

  const [before, after] = await Promise.all([stat(source), stat(target)]);
  console.log(`Klart! ${before.size} bytes blev ${after.size} bytes: ${target}`);
} catch (err) {
  console.error('Kopieringen misslyckades:', err.message);
  process.exitCode = 1;
}
