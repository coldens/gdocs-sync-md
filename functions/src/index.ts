import dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? undefined : '.env.local',
});

import { onCall, onRequest } from 'firebase-functions/v2/https';
import { app, firestore, oauth2Client } from './app';
import { docs } from '@googleapis/docs';
import { uploadSchema } from './schemas/uploadSchema';
import * as logger from 'firebase-functions/logger';
import { googleDocsToMarkdown } from 'docs-markdown';

export const gdocs = onRequest(app);

export const upload = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('Unauthorized');
    }

    const dbToken = await firestore
      .collection('tokens')
      .doc(request.auth.token.email!)
      .get();
    const data = dbToken.data();

    if (data) {
      oauth2Client.setCredentials(data.tokens);
    } else {
      throw new Error('Unauthorized');
    }

    const { documentId } = await uploadSchema.validate(request.data);

    const client = docs({
      version: 'v1',
      auth: oauth2Client,
    });

    const doc = await client.documents.get({
      documentId,
    });

    if (doc.data.body) {
      const document = {
        id: documentId,
        markdown: googleDocsToMarkdown(doc.data),
        title: doc.data.title as string,
      };

      await firestore.collection('documents').doc(documentId).set(document, {
        merge: true,
      });

      return document;
    } else {
      throw new Error('No body');
    }
  } catch (err) {
    logger.error('Error uploading document', err);
    throw err;
  }
});
