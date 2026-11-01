# Fullstack 25 · Node.js lecture notes

Ett litet API för en restaurang, byggt med allt från föreläsning 1–3 i Fullstack 25.
Datan sparas i JSON-filer. Det är just den delen vi byter ut mot en riktig databas i föreläsning 4.

## Kom igång

Kräver Node 20.11 eller senare (`node -v`).

```bash
npm install
cp .env.example .env   # fyll i en egen API_KEY
npm run seed           # skapar startdatan i db/
npm run dev            # startar servern och startar om vid ändringar
```

Öppna sedan http://localhost:3000, eller testa förfrågningarna i `requests.http`
med VS Code-tillägget REST Client.

## Projektets delar

```
fullstack25_nodejs_lecture-notes/
├── src/
│   ├── server.js              startar servern (app.listen)
│   ├── app.js                 middleware och rutter, i rätt ordning
│   ├── routes/                VAR: vilka URL:er som finns
│   ├── controllers/           VAD: vad som händer vid varje URL
│   ├── middleware/            logger, requireApiKey, notFound, errorHandler
│   ├── data/                  data-lagret: läser och skriver JSON-filerna
│   ├── logs/orderLog.js       orderloggen med streams
│   ├── validation.js          kontroll av id, rätter och beställningar
│   └── utils/httpError.js     fel med en statuskod
├── db/                        fil-databasen (dishes.json, orders.json)
├── logs/                      orders.log, skapas när servern startar
├── files/meny.txt             skickas med res.sendFile
├── scripts/seed.js            återställer datan
├── demos/                     fristående exempel från föreläsningarna
└── requests.http              färdiga förfrågningar att testa med
```

## Var finns vad från föreläsningarna?

| Föreläsning | Begrepp | Var i projektet |
|---|---|---|
| 1 | npm, package.json och scripts | `package.json` |
| 1 | ES modules (`import`/`export`, `node:`-prefix) | överallt, `"type": "module"` |
| 1 | Event loopen: servitören, biffen och tonfisken | `demos/01-event-loop.js` |
| 2 | Server med bara http-modulen | `demos/02-http-server.js` |
| 2 | Express, `app.get`, `res.json`, statuskoder | `src/app.js`, `src/controllers/` |
| 2 | `req.params`, `req.query`, `req.body` | `src/controllers/dishesController.js` |
| 2 | Middleware och `next()` | `src/middleware/logger.js` |
| 2 | Middleware bara på vissa rutter | `requireApiKey` i `src/routes/dishes.js` |
| 2 | Ordningen: middleware → rutter → 404 → felhanterare | `src/app.js` |
| 2 | 404 och felhanterare med fyra parametrar | `src/middleware/errors.js` |
| 2 | Express 5: fel från async-rutter fångas automatiskt | alla controllers |
| 2 | `express.Router`, routes och controllers | `src/routes/`, `src/controllers/` |
| 2 | `.env`, `--env-file`, `--watch`, `.gitignore` | `package.json`, `.env.example`, `.gitignore` |
| 3 | Promises, `async`/`await`, try/catch | `src/data/` |
| 3 | Tre stilar: callbacks, `.then`, `await` | `demos/03-three-styles.js` |
| 3 | Gissa ordningen (1, 4, 2, 3) | `demos/03-guess-the-order.js` |
| 3 | `Promise.all` | `listOrders` i `src/controllers/ordersController.js`, `scripts/seed.js` |
| 3 | `node:fs/promises`: `readFile`, `writeFile`, `mkdir` | `src/data/jsonStore.js` |
| 3 | Sökvägar med `import.meta.dirname` och `path.join` | `src/data/jsonStore.js`, `src/app.js` |
| 3 | `err.code === 'ENOENT'` | `readJson` i `src/data/jsonStore.js` |
| 3 | Sync är okej vid uppstart | `mkdirSync` i `src/logs/orderLog.js` |
| 3 | Writable stream med `flags: 'a'` | `src/logs/orderLog.js` |
| 3 | Läsa rad för rad med readline och `for await` | `countDishesSold` i `src/logs/orderLog.js` |
| 3 | `pipeline` till `res` (res är en Writable) | `GET /orders/log` |
| 3 | Transform: gzip | `GET /orders/export`, `demos/03-gzip-copy.js` |
| 3 | `res.sendFile` | `GET /menu.txt` |
| 3 | `'finish'` när svaret är skickat | `src/middleware/logger.js` |
| 3 | Buffers: bytes och tecken | `demos/03-buffers.js` |

Demona körs med `npm run demo:event-loop`, `demo:http`, `demo:order`, `demo:styles`, `demo:buffers` och `demo:gzip`.

## Endpoints

| Metod | URL | Beskrivning | Svar |
|---|---|---|---|
| GET | `/dishes` | Hela menyn. Filter: `?category=main&maxPrice=200` | 200 |
| GET | `/dishes/:id` | En rätt | 200, 400, 404 |
| POST | `/dishes` | Ny rätt (kräver `x-api-key`) | 201, 400, 401, 409 |
| PATCH | `/dishes/:id` | Ändra en rätt (kräver `x-api-key`) | 200, 400, 401, 404, 409 |
| DELETE | `/dishes/:id` | Ta bort en rätt (kräver `x-api-key`) | 204, 401, 404 |
| GET | `/orders` | Alla beställningar, med rättens namn | 200 |
| GET | `/orders/:id` | En beställning | 200, 400, 404 |
| POST | `/orders` | Ny beställning: `{ dishId, quantity, table }` | 201, 400 |
| GET | `/orders/stats` | Antal sålda per rätt, från orderloggen | 200 |
| GET | `/orders/log` | Orderloggen som text (kräver `x-api-key`) | 200, 401 |
| GET | `/orders/export` | Beställningarna som gzippad JSON-fil | 200 |
| GET | `/menu.txt` | Menyn som textfil | 200 |

Exempel med curl:

```bash
curl http://localhost:3000/dishes/2

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"dishId": 2, "quantity": 2, "table": 4}'

curl -X POST http://localhost:3000/dishes \
  -H "Content-Type: application/json" \
  -H "x-api-key: hemlig-nyckel-123" \
  -d '{"name": "Kladdkaka", "price": 85, "category": "dessert"}'
```

På Windows i PowerShell: skriv `curl.exe`, eftersom `curl` där är ett alias för något annat.

## Det här byts ut i föreläsning 4

Bara mappen `src/data/` vet att datan ligger i JSON-filer. Rutter och controllers anropar
funktioner som `listDishes`, `getDish`, `createDish`, `updateDish` och `deleteDish`.

I föreläsning 4 skriver vi om de funktionerna med PostgreSQL (pg) och MongoDB (Mongoose),
med samma namn, samma in och samma ut. Resten av appen rörs inte.

Varför JSON-filen inte räcker:

- Två förfrågningar samtidigt kan läsa filen, och den som skriver sist skriver över den andras ändring.
- Hela filen läses för att hitta en enda rätt.
- Reglerna (unikt namn, pris större än 0) finns bara i vår kod, inte i lagringen.
- Bara en server kan dela på filen.
