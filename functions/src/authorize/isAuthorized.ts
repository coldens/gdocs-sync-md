import TokenRepository from '../repositories/TokenRepository';

const repository = new TokenRepository();

/**
 * Returns true if the user is authorized.
 */
export async function isAuthorized(email: string) {
  const token = await repository.get(email);
  return token !== undefined;
}
