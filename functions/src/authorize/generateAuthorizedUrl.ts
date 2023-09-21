import * as logger from 'firebase-functions/logger';
import { google } from 'googleapis';
import { getOAuth2client } from './getOAuth2client';
import TokenRepository from '../repositories/TokenRepository';

const repository = new TokenRepository();

export async function generateAuthorizedUrl(code: string, state: string) {
  const oauth2Client = getOAuth2client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const profile = await google.oauth2('v2').userinfo.get({
    auth: oauth2Client,
  });

  const { email } = JSON.parse(state);

  const url = new URL(process.env.FRONTEND_AUTH_URL!);

  try {
    // Save tokens and profile of the authorized user in firestore
    await repository.save(email, { profile: profile.data, tokens });
  } catch (error) {
    logger.error('Error saving tokens', error);
    url.searchParams.set('error', 'Error saving tokens');
  }

  return url.toString();
}
