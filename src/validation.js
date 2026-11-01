import { httpError } from './utils/httpError.js';

export const CATEGORIES = ['starter', 'main', 'dessert'];

// req.params är alltid text: '/dishes/2' ger id '2', och '/dishes/abc' ger 'abc'
export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw httpError(400, `Ogiltigt id: ${value}`);
  }
  return id;
}

// Returnerar en lista med fel. Tom lista = allt är ok.
// partial: true används vid PATCH, då är alla fält valfria men måste vara rätt om de skickas.
export function validateDish(body = {}, { partial = false } = {}) {
  const errors = [];
  const { name, price, category } = body;

  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      errors.push('name måste vara en text');
    }
  }
  if (!partial || price !== undefined) {
    if (!Number.isInteger(price) || price <= 0) {
      errors.push('price måste vara ett heltal större än 0 (kronor)');
    }
  }
  if (!partial || category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      errors.push(`category måste vara en av: ${CATEGORIES.join(', ')}`);
    }
  }
  if (partial && Object.keys(pickDishFields(body)).length === 0) {
    errors.push('skicka minst ett av fälten name, price eller category');
  }
  return errors;
}

// Plockar bara ut de fält vi känner till. Allt annat i bodyn ignoreras.
export function pickDishFields(body = {}) {
  const fields = {};
  if (body.name !== undefined) fields.name = String(body.name).trim();
  if (body.price !== undefined) fields.price = body.price;
  if (body.category !== undefined) fields.category = body.category;
  return fields;
}

export function validateOrder(body = {}) {
  const errors = [];
  const { dishId, quantity, table } = body;

  if (!Number.isInteger(dishId) || dishId < 1) {
    errors.push('dishId måste vara ett heltal');
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    errors.push('quantity måste vara ett heltal mellan 1 och 20');
  }
  if (!Number.isInteger(table) || table < 1) {
    errors.push('table måste vara ett bordsnummer');
  }
  return errors;
}
