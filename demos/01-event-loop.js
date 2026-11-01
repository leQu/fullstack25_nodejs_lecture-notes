// Föreläsning 1: servitören och event loopen. Kör: npm run demo:event-loop
// Gissa i vilken ordning raderna skrivs ut innan du kör!
import { readFile } from 'node:fs';
import path from 'node:path';

const priceFile = path.join(import.meta.dirname, 'tonfisk.txt');

console.log('Tar beställning: biff + tonfisk');

// Köket steker biffen i 3 sekunder. Servitören väntar inte vid spisen.
setTimeout(() => {
  console.log('Biffen är klar!');
}, 3000);

// Priset hämtas från en fil. Operativsystemet läser, servitören går vidare.
readFile(priceFile, 'utf8', (err, price) => {
  if (err) return console.error('Kunde inte läsa priset:', err.message);
  console.log(`Tonfisken kostar ${price.trim()} kr`);
});

console.log('Servitören går till nästa bord');
