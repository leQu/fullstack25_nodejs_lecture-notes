// Ett fel som vet vilken statuskod det ska bli. errorHandler läser err.status.
export function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
