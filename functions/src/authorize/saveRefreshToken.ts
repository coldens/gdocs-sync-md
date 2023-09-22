import * as logger from 'firebase-functions/logger';
import { google } from 'googleapis';
import { getOAuth2client } from './getOAuth2client';
import TokenRepository from '../repositories/TokenRepository';

const repository = new TokenRepository();

/**
 * Saves the refresh token and the user's profile in firestore.
 */
export async function saveRefreshToken(
  code: string,
  state: string,
  retry = false,
) {
  const oauth2Client = getOAuth2client();
  const { userId } = JSON.parse(state);

  // Get tokens from the authorization code
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  if (!tokens.refresh_token) {
    await Promise.allSettled([
      oauth2Client.revokeCredentials(),
      repository.remove(userId),
    ]);

    if (retry === false) {
      return saveRefreshToken(code, state, true);
    } else {
      throw new Error('Refresh Token Not Found.');
    }
  }

  const profile = await google.oauth2('v2').userinfo.get({
    auth: oauth2Client,
  });

  try {
    // Save tokens and profile of the authorized user in firestore
    await repository.save(userId, { profile: profile.data, tokens });
  } catch (error) {
    logger.error('Error saving tokens', error);
  }
}
