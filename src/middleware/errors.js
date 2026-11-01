// "Finns inte på menyn": hit kommer alla förfrågningar som ingen rutt tog hand om
export function notFound(req, res) {
  res.status(404).json({ error: `Finns inte: ${req.method} ${req.originalUrl}` });
}

// Restaurangchefen. Fyra parametrar = felhanterare.
// Express 5 skickar hit även fel som kastas i async-rutter.
export function errorHandler(err, req, res, next) {
  // Har vi redan börjat skicka svaret (t.ex. en stream) kan vi inte byta statuskod.
  // Då låter vi Express stänga anslutningen.
  if (res.headersSent) return next(err);

  // Trasig JSON i bodyn: express.json() kunde inte tolka den
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Bodyn är inte giltig JSON' });
  }

  // Dubblett från data-lagret. I föreläsning 4 kommer databasens egna koder hit:
  // '23505' från PostgreSQL och 11000 från MongoDB.
  if (err.code === 'DUPLICATE') {
    return res.status(409).json({ error: err.message });
  }

  // Fel vi skapat själva med httpError(400, '…')
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  // Allt annat: logga detaljerna här, ge klienten ett lugnt standardsvar
  console.error(err);
  res.status(500).json({ error: 'Internt serverfel' });
}
