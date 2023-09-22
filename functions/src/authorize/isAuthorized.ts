import TokenRepository from '../repositories/TokenRepository';
import { getOAuth2client } from './getOAuth2client';

const repository = new TokenRepository();

/**
 * Returns true if the user is authorized.
 */
export async function isAuthorized(userId: string) {
  const token = await repository.get(userId);

  if (!token) {
    return false;
  }
  if (!token.tokens.refresh_token) {
    const oauth2Client = getOAuth2client();
    oauth2Client.setCredentials(token.tokens);
    await oauth2Client.revokeCredentials();
    await repository.remove(userId);

    return false;
  }

  return true;
}
