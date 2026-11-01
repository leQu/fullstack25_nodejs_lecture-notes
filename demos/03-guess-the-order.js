// Föreläsning 3: gissa ordningen. Kör: npm run demo:order
// Svaret är 1, 4, 2, 3. await pausar bara funktionen, inte resten av programmet.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const menuFile = path.join(import.meta.dirname, '..', 'files', 'meny.txt');

async function readMenu() {
  console.log('1) Börjar läsa menyn');
  const menu = await readFile(menuFile, 'utf8');
  console.log('2) Menyn är läst');
  console.log('3) Antal tecken:', menu.length);
}

readMenu().catch((err) => console.error('Kunde inte läsa menyn:', err.message));
console.log('4) Den här raden körs direkt');
