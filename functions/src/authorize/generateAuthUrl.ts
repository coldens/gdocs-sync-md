import { getOAuth2client } from './getOAuth2client';

/**
 * Generates an url to the consent page that asks for permissions to access
 * the user's profile and documents, and returns the url with the state
 * parameter containing the user's email to be used later to save the tokens
 * in firestore.
 */
export function generateAuthUrl(query: { email: string }) {
  const oauth2Client = getOAuth2client();

  // Generate the url that will be used for the consent dialog.
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: [
      'profile',
      'https://www.googleapis.com/auth/documents.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/drive.readonly',
    ],

    state: JSON.stringify({ email: query.email }),
  });
  return url;
}
