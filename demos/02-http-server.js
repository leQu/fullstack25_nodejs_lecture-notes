// Föreläsning 2: en server med bara http-modulen, utan Express. Kör: npm run demo:http
// Jämför med src/app.js: här måste vi göra allt för hand.
import http from 'node:http';

const menu = [
  { id: 1, name: 'Biff', price: 289 },
  { id: 2, name: 'Tonfisk', price: 189 },
];

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Välkommen till restaurangen!');
  } else if (req.method === 'GET' && req.url === '/menu') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(menu));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Sidan saknas');
  }
});

server.listen(4000, () => console.log('http-servern lyssnar på http://localhost:4000'));
