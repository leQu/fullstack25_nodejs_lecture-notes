import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import * as orders from '../data/orders.js';
import * as dishes from '../data/dishes.js';
import { logOrder, countDishesSold, orderLogFile } from '../logs/orderLog.js';
import { parseId, validateOrder } from '../validation.js';

// GET /orders – beställningarna, med namnet på rätten
export async function listOrders(req, res) {
  // Två läsningar som inte beror på varandra: kör dem samtidigt
  const [allOrders, allDishes] = await Promise.all([
    orders.listOrders(),
    dishes.listDishes(),
  ]);

  // Koppla ihop beställning och rätt för hand. I SQL heter det här en JOIN.
  const dishNames = new Map(allDishes.map((dish) => [dish.id, dish.name]));
  const withNames = allOrders.map((order) => ({
    ...order,
    dishName: dishNames.get(order.dishId) ?? '(borttagen rätt)',
  }));

  res.json(withNames);
}

// GET /orders/:id
export async function getOrder(req, res) {
  const order = await orders.getOrder(parseId(req.params.id));
  if (!order) return res.status(404).json({ error: 'Beställningen finns inte' });

  res.json(order);
}

// POST /orders
export async function createOrder(req, res) {
  const errors = validateOrder(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  const { dishId, quantity, table } = req.body;
  const dish = await dishes.getDish(dishId);
  if (!dish) {
    return res.status(400).json({ errors: [`Rätt ${dishId} finns inte på menyn`] });
  }

  const order = await orders.createOrder({ dishId, quantity, table });
  logOrder(order, dish);
  res.status(201).json(order);
}

// GET /orders/stats – läser orderloggen rad för rad
export async function orderStats(req, res) {
  res.json(await countDishesSold());
}

// GET /orders/log – hela loggen till klienten. res är en Writable stream.
export async function streamOrderLog(req, res) {
  res.type('text/plain; charset=utf-8');
  // pipeline väntar tills allt är skickat, och stänger allt om något går fel
  await pipeline(createReadStream(orderLogFile), res);
}

// GET /orders/export – alla beställningar som en gzippad JSON-fil att ladda ner
export async function exportOrders(req, res) {
  const allOrders = await orders.listOrders();
  res.attachment('orders.json.gz'); // webbläsaren sparar svaret som en fil

  // Readable (datan) → Transform (gzip komprimerar) → Writable (res, klienten)
  await pipeline(
    Readable.from([JSON.stringify(allOrders, null, 2)]),
    createGzip(),
    res,
  );
}
