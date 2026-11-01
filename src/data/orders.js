// Data-lagret för beställningar. Byts ut mot en databas i föreläsning 4.
import { readJson, writeJson, nextId } from './jsonStore.js';

const FILE = 'orders.json';

export async function listOrders() {
  return readJson(FILE, []);
}

export async function getOrder(id) {
  const orders = await readJson(FILE, []);
  return orders.find((order) => order.id === id); // undefined om den saknas
}

export async function createOrder({ dishId, quantity, table }) {
  const orders = await readJson(FILE, []);
  const order = {
    id: nextId(orders),
    dishId,
    quantity,
    table,
    createdAt: new Date().toISOString(),
  };
  await writeJson(FILE, [...orders, order]);
  return order;
}
