import express from 'express';
import * as controller from '../controllers/dishesController.js';
import { requireApiKey } from '../middleware/requireApiKey.js';

const router = express.Router();

// Läsa menyn: öppet för alla
router.get('/', controller.listDishes);     // GET /dishes?category=main&maxPrice=200
router.get('/:id', controller.getDish);     // GET /dishes/2

// Ändra menyn: kräver API-nyckel. Middlewaren sätts bara på de här rutterna.
router.post('/', requireApiKey, controller.createDish);         // POST   /dishes
router.patch('/:id', requireApiKey, controller.updateDish);     // PATCH  /dishes/2
router.delete('/:id', requireApiKey, controller.deleteDish);    // DELETE /dishes/2

export default router;
