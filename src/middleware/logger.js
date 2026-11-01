// Hovmästaren: antecknar varje gäst och skickar den vidare med next()
export function logger(req, res, next) {
  const startedAt = Date.now();

  // 'finish' = svaret är skickat. res är en Writable stream, samma event som i föreläsning 3.
  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration} ms)`);
  });

  next();
}
