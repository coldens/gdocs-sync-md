import { getOAuth2client } from './getOAuth2client';

export function generateAuthUrl(query: { email: string }) {
  const oauth2Client = getOAuth2client();

  // Generate the url that will be used for the consent dialog.
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: [
      'profile',
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/userinfo.email',
    ],

    state: JSON.stringify({ email: query.email }),
  });
  return url;
}
