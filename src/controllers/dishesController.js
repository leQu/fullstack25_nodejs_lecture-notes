// Controllers säger VAD som händer. Rutterna (routes/) säger VAR.
import * as dishes from '../data/dishes.js';
import { httpError } from '../utils/httpError.js';
import { parseId, validateDish, pickDishFields } from '../validation.js';

// GET /dishes?category=main&maxPrice=200
export async function listDishes(req, res) {
  // req.query är alltid text: ?maxPrice=200 ger '200'
  const { category } = req.query;
  const maxPrice = req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);
  if (Number.isNaN(maxPrice)) {
    throw httpError(400, 'maxPrice måste vara ett tal');
  }

  res.json(await dishes.listDishes({ category, maxPrice }));
}

// GET /dishes/:id
export async function getDish(req, res) {
  const dish = await dishes.getDish(parseId(req.params.id));
  if (!dish) return res.status(404).json({ error: 'Rätten finns inte' });

  res.json(dish);
}

// POST /dishes
export async function createDish(req, res) {
  const errors = validateDish(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const dish = await dishes.createDish(pickDishFields(req.body));
  res.status(201).json(dish);
}

// PATCH /dishes/:id – ändra bara de fält som skickas
export async function updateDish(req, res) {
  const id = parseId(req.params.id);
  const errors = validateDish(req.body, { partial: true });
  if (errors.length > 0) return res.status(400).json({ errors });

  const dish = await dishes.updateDish(id, pickDishFields(req.body));
  if (!dish) return res.status(404).json({ error: 'Rätten finns inte' });

  res.json(dish);
}

// DELETE /dishes/:id
export async function deleteDish(req, res) {
  const deleted = await dishes.deleteDish(parseId(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Rätten finns inte' });

  res.status(204).end(); // 204 = gick bra, men ingen body att skicka
}
