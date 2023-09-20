require('dotenv').config();
import { google } from 'googleapis';
import express = require('express');
import { onRequest } from 'firebase-functions/v2/https';
import { docs } from '@googleapis/docs';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

const app = express();
const db = getFirestore();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

export const gdocs = onRequest(app);

app.post('/upload', async (req, res) => {
  const token = await db
    .collection('tokens')
    .doc(req.body.id_token as string)
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
  res.send(markdown);
});

app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: ['profile', 'https://www.googleapis.com/auth/documents'],
  });

  res.redirect(url);
});

app.get('/auth/handler', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code as string);

  oauth2Client.setCredentials(tokens);
  const profile = await google.oauth2('v2').userinfo.get({
    auth: oauth2Client,
  });

  if (profile.data.id) {
    await db.collection('tokens').doc(profile.data.id).set(tokens);
    const url = new URL(process.env.FRONTEND_AUTH_URL as string);

    url.searchParams.set('tokens', JSON.stringify(tokens));

    res.redirect(url.toString());
  } else {
    res.send('Error');
  }
});
