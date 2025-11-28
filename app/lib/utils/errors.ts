export function createUnauthorizedError(message: string): Error {
  const error = new Error(message);
  error.name = 'UnauthorizedError';
  return error;
}
