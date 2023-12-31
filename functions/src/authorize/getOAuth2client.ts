import { google } from 'googleapis';

/**
 * Returns an OAuth2 client with the given credentials
 */
export const getOAuth2client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );
