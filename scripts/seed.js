// Återställer fil-databasen till startläget: npm run seed
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { writeJson } from '../src/data/jsonStore.js';

const DISHES = [
  { id: 1, name: 'Biff', price: 289, category: 'main' },
  { id: 2, name: 'Tonfisk', price: 189, category: 'main' },
  { id: 3, name: 'Pasta', price: 159, category: 'main' },
  { id: 4, name: 'Toast Skagen', price: 145, category: 'starter' },
  { id: 5, name: 'Chokladfondant', price: 95, category: 'dessert' },
];

const orderLogFile = path.join(import.meta.dirname, '..', 'logs', 'orders.log');

try {
  // Oberoende skrivningar: kör dem samtidigt
  await Promise.all([
    writeJson('dishes.json', DISHES),
    writeJson('orders.json', []),
  ]);
  // Töm loggen. Mappen skapas av servern, men finns den inte än är det ok.
  await writeFile(orderLogFile, '').catch((err) => {
    if (err.code !== 'ENOENT') throw err;
  });
  console.log(`Klart: ${DISHES.length} rätter, inga beställningar.`);
} catch (err) {
  console.error('Kunde inte återställa datan:', err.message);
  process.exitCode = 1;
}
