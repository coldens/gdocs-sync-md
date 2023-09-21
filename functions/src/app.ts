import { google } from 'googleapis';
import express = require('express');
import { docs } from '@googleapis/docs';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { authSchema } from './schemas/authSchema';
import * as logger from 'firebase-functions/logger';

initializeApp();

export const app = express();
const db = getFirestore();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

app.post('/upload', async (req, res) => {
  const token = await db
    .collection('tokens')
    .doc(req.body.email as string)
    .get();

  oauth2Client.setCredentials(token.data() as any);

  const client = docs({
    version: 'v1',
    auth: oauth2Client,
  });

  const doc = await client.documents.get({
    documentId: req.body.documentId as string,
  });

  // doc to markdown
  const markdown = doc.data.body?.content;
  // TODO: guardar en firestore
  res.send(markdown);
});

app.get('/auth', async (req, res) => {
  let query: { email: string };

  try {
    // parse and assert validity
    query = await authSchema.validate(req.query);
  } catch (error) {
    logger.error('Error validating auth query', error);
    if (error.errors) {
      res.status(400).send(error.errors);
    }
    return;
  }

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

  logger.info('Redirecting to:', url);
  res.redirect(url);
});

app.get('/auth/handler', async (req, res) => {
  const { code, state } = req.query;
  const { tokens } = await oauth2Client.getToken(code as string);

  oauth2Client.setCredentials(tokens);

  const profile = await google.oauth2('v2').userinfo.get({
    auth: oauth2Client,
  });

  const { email } = JSON.parse(state as string);

  try {
    // Save tokens and profile of the authorized user in firestore
    await db.collection('tokens').doc(email).set(
      { profile: profile.data, tokens },
      {
        merge: true,
      },
    );
  } catch (error) {
    logger.error('Error saving tokens', error);
  }

  const url = new URL(process.env.FRONTEND_AUTH_URL as string);
  url.searchParams.set('tokens', JSON.stringify(tokens));
  res.redirect(url.toString());

  logger.info('Redirecting to:', url.toString());
});
