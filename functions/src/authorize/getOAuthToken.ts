import TokenRepository from '../repositories/TokenRepository';
import { getOAuth2client } from './getOAuth2client';

const repository = new TokenRepository();

/**
 * Returns an OAuth2 client with the given credentials to make requests to the
 * Google APIs
 */
export async function getOAuthToken(userId: string) {
  const data = await repository.get(userId);

  const oauth2Client = getOAuth2client();

  if (data) {
    oauth2Client.setCredentials(data.tokens);
  } else {
    throw new Error('Unauthorized');
  }

  return oauth2Client;
}
