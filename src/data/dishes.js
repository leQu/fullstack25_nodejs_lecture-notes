// Data-lagret för rätter. Det enda i appen som vet att datan ligger i en JSON-fil.
// I föreläsning 4 skriver vi om de här funktionerna med pg och Mongoose,
// med samma namn, samma in och samma ut. Rutterna och controllers rörs inte.
import { readJson, writeJson, nextId, duplicateError } from './jsonStore.js';

const FILE = 'dishes.json';

export async function listDishes({ category, maxPrice } = {}) {
  const dishes = await readJson(FILE, []);
  return dishes
    .filter((dish) => category === undefined || dish.category === category)
    .filter((dish) => maxPrice === undefined || dish.price <= maxPrice);
}

export async function getDish(id) {
  const dishes = await readJson(FILE, []);
  return dishes.find((dish) => dish.id === id); // undefined om den saknas
}

export async function createDish({ name, price, category }) {
  const dishes = await readJson(FILE, []);
  assertUniqueName(dishes, name);

  const dish = { id: nextId(dishes), name, price, category };
  await writeJson(FILE, [...dishes, dish]);
  return dish;
}

export async function updateDish(id, changes) {
  const dishes = await readJson(FILE, []);
  const existing = dishes.find((dish) => dish.id === id);
  if (!existing) return undefined;

  if (changes.name !== undefined) {
    assertUniqueName(dishes.filter((dish) => dish.id !== id), changes.name);
  }

  const updated = { ...existing, ...changes, id }; // id får aldrig ändras
  await writeJson(FILE, dishes.map((dish) => (dish.id === id ? updated : dish)));
  return updated;
}

export async function deleteDish(id) {
  const dishes = await readJson(FILE, []);
  const remaining = dishes.filter((dish) => dish.id !== id);
  if (remaining.length === dishes.length) return false; // fanns inte

  await writeJson(FILE, remaining);
  return true;
}

// Samma regel som UNIQUE i en databas: två rätter får inte heta likadant
function assertUniqueName(dishes, name) {
  const taken = dishes.some((dish) => dish.name.toLowerCase() === name.toLowerCase());
  if (taken) throw duplicateError(`${name} finns redan på menyn`);
}
