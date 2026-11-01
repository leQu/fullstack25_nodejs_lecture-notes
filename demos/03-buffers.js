// Föreläsning 3: en Buffer är rena bytes. Kör: npm run demo:buffers

const hello = Buffer.from('Hej');
console.log(hello);        // <Buffer 48 65 6a>
console.log(hello[0]);     // 72, alltså bokstaven H
console.log(hello.length); // 3 bytes

const word = 'Smörgås';
console.log(`'${word}' är ${word.length} tecken men ${Buffer.byteLength(word)} bytes`);
console.log(Buffer.from(word)); // ö och å tar två bytes var

// Ett å delat mitt itu, som det kan bli mellan två chunks i en stream
const aa = Buffer.from('å');                 // <Buffer c3 a5>
const firstHalf = aa.subarray(0, 1);
const secondHalf = aa.subarray(1);
console.log('Var för sig:', firstHalf.toString() + secondHalf.toString()); // trasigt
console.log('Ihopsatt:   ', Buffer.concat([firstHalf, secondHalf]).toString()); // å
