import { app } from './app.js';

// process.env-värden är alltid text (eller undefined), så vi gör om till ett tal
const port = Number(process.env.PORT ?? 3000);

app.listen(port, (error) => {
  // Express 5 skickar startfel hit, t.ex. EADDRINUSE om porten redan används
  if (error) throw error;
  console.log(`Restaurangen är öppen på http://localhost:${port}`);
});
