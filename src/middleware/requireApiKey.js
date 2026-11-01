// Bokningskontrollen: släpper bara in den som skickar rätt nyckel i headern x-api-key.
// Används bara på de rutter som ändrar något, inte globalt.
export function requireApiKey(req, res, next) {
  if (!process.env.API_KEY) {
    // Serverns fel, inte klientens: .env saknar nyckeln. errorHandler svarar 500.
    return next(new Error('API_KEY saknas i .env'));
  }

  if (req.get('x-api-key') !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Fel eller saknad API-nyckel' });
  }

  next();
}
