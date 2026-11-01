// Föreläsning 3: samma uppgift i tre stilar. Kör: npm run demo:styles
// Uppgift: läs priset på tonfisk från fil, skriv ett kvitto, läs kvittot.
import fs from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const priceFile = path.join(import.meta.dirname, 'tonfisk.txt');
const outputDir = path.join(import.meta.dirname, 'output');

// 1. Callbacks: varje steg nästlas i det förra, och felet kollas på varje nivå
function withCallbacks(done) {
  fs.readFile(priceFile, 'utf8', (err, price) => {
    if (err) return done(err);
    const receiptFile = path.join(outputDir, 'kvitto-callback.txt');
    fs.writeFile(receiptFile, `Tonfisk: ${price.trim()} kr\n`, (err) => {
      if (err) return done(err);
      fs.readFile(receiptFile, 'utf8', (err, receipt) => {
        if (err) return done(err);
        done(null, receipt);
      });
    });
  });
}

// 2. Promise-kedja: platt, ett .catch för alla fel
function withPromiseChain() {
  const receiptFile = path.join(outputDir, 'kvitto-then.txt');
  return readFile(priceFile, 'utf8')
    .then((price) => writeFile(receiptFile, `Tonfisk: ${price.trim()} kr\n`))
    .then(() => readFile(receiptFile, 'utf8'));
}

// 3. async/await: läses uppifrån och ned, ett try/catch hos den som anropar
async function withAsyncAwait() {
  const receiptFile = path.join(outputDir, 'kvitto-await.txt');
  const price = await readFile(priceFile, 'utf8');
  await writeFile(receiptFile, `Tonfisk: ${price.trim()} kr\n`);
  return readFile(receiptFile, 'utf8');
}

try {
  await mkdir(outputDir, { recursive: true });

  // Callback-versionen görs om till ett Promise så att vi kan await:a den
  const fromCallbacks = await new Promise((resolve, reject) => {
    withCallbacks((err, receipt) => (err ? reject(err) : resolve(receipt)));
  });
  console.log('Callbacks:   ', fromCallbacks.trim());
  console.log('Promise-kedja:', (await withPromiseChain()).trim());
  console.log('async/await: ', (await withAsyncAwait()).trim());
} catch (err) {
  console.error('Något gick fel:', err.message);
  process.exitCode = 1;
}
