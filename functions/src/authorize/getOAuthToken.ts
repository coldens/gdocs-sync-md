import TokenRepository from '../repositories/TokenRepository';
import { getOAuth2client } from './getOAuth2client';

const repository = new TokenRepository();

export async function getOAuthToken(email: string) {
  const data = await repository.get(email);

  const oauth2Client = getOAuth2client();

  if (data) {
    oauth2Client.setCredentials(data.tokens);
  } else {
    throw new Error('Unauthorized');
  }

  return oauth2Client;
}
