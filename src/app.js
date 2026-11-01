import express from 'express';
import path from 'node:path';
import { logger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/errors.js';
import dishesRouter from './routes/dishes.js';
import ordersRouter from './routes/orders.js';

// Sökvägen utgår från den här filen, inte från mappen där du startade node
const filesDir = path.join(import.meta.dirname, '..', 'files');

export const app = express();

// 1. Middleware för alla förfrågningar. Ordningen spelar roll:
//    loggern först, så att även förfrågningar med trasig JSON antecknas,
//    och express.json() före rutterna, annars är req.body undefined.
app.use(logger);
app.use(express.json());

// 2. Rutterna
app.get('/', (req, res) => {
  res.json({
    message: 'Välkommen till restaurangen!',
    endpoints: ['/dishes', '/orders', '/orders/stats', '/orders/export', '/menu.txt'],
  });
});

// En hel fil till klienten: sendFile streamar den och sätter Content-Type åt oss
app.get('/menu.txt', (req, res) => {
  res.sendFile(path.join(filesDir, 'meny.txt'));
});

app.use('/dishes', dishesRouter);
app.use('/orders', ordersRouter);

// 3. Ingen rutt matchade: 404
app.use(notFound);

// 4. Felhanteraren allra sist
app.use(errorHandler);
