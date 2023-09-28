import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';
import { onCall, onRequest } from 'firebase-functions/v2/https';

// Initialize Firebase Admin before importing anything else because it
// allows us to use the Firebase Admin SDK in the imported files.
initializeApp();

import { generateAuthUrl } from './authorize/generateAuthUrl';
import { isAuthorized } from './authorize/isAuthorized';
import { saveRefreshToken } from './authorize/saveRefreshToken';
import { getDocuments } from './documents/getDocuments';
import { saveDocument } from './documents/saveDocument';
import { authHandlerSchema } from './schemas/authHandlerSchema';
import { authSchema } from './schemas/authSchema';
import { uploadSchema } from './schemas/uploadSchema';
import { getDocument } from './documents/getDocument';
import { deleteDocument } from './documents/deleteDocument';
import { updateWebHookSchema } from './schemas/updateWebHookSchema';
import { pubsub } from 'firebase-functions/v1';
import { batchStartWebhook } from './webhook/batchStartWebhook';

/**
 * Uploads a Google Doc to Firestore, converting it to Markdown.
 */
export const upload = onCall(
  {
    memory: '512MiB',
  },
  async (request) => {
    try {
      if (!request.auth) {
        throw new Error('You must be logged in to upload a document');
      }

      const userId = request.auth.uid;
      const authorized = await isAuthorized(userId);

      if (!authorized) {
        throw new Error('Unauthorized');
      }

      const { documentId } = await uploadSchema.validate(request.data);

      return saveDocument(userId, documentId);
    } catch (err) {
      logger.error('Error uploading document', err);
      throw err;
    }
  },
);

/**
 * Returns an array of document ids of the current User.
 */
export const load = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('You must be logged in to load documents');
    }

    const userId = request.auth.uid;
    const authorized = await isAuthorized(userId);

    if (!authorized) {
      throw new Error('Unauthorized');
    }

    const result = await getDocuments(userId);

    return result;
  } catch (err) {
    logger.error('Error loading document', err);
    throw err;
  }
});

/**
 * Returns a download url for a given document id.
 */
export const download = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('You must be logged in to load documents');
    }

    const userId = request.auth.uid;
    const authorized = await isAuthorized(userId);

    if (!authorized) {
      throw new Error('Unauthorized');
    }

    const document = await getDocument(userId, request.data.documentId);

    return { document, success: true };
  } catch (err) {
    logger.error('Error loading document', err);

    return { success: false };
  }
});

/**
 * To be called by the frontend to get the url to redirect to for Google OAuth 2.0.
 */
export const authorize = onRequest(async (req, res) => {
  let query: { userId: string };

  try {
    query = await authSchema.validate(req.query);
  } catch (error) {
    logger.error('Error validating auth query', error);
    if (error.errors) {
      res.status(400).send(error.errors);
    }
    return;
  }

  const url = generateAuthUrl(query);

  logger.info('Redirecting to:', url);
  res.redirect(url);
});

/**
 * Exchanges a given Google OAuth 2.0 authorization code for tokens
 * and redirects the user to the frontend.
 */
export const authorizeHandler = onRequest(async (req, res) => {
  const query = await authHandlerSchema.validate(req.query).catch((error) => {
    logger.error('Error validating auth handler query', error);

    if (error.errors) {
      res.status(400).send(error.errors);
    }
  });

  if (query) {
    const url = new URL(process.env.FRONTEND_AUTH_URL!);

    try {
      await saveRefreshToken(query.code, query.state);
    } catch (error) {
      url.searchParams.set('error', 'Error saving tokens');
    }

    logger.info('Redirecting to:', url.toString());
    res.redirect(url.toString());
  }
});

/**
 * Webhook for Google Drive to notify us when a document has been updated.
 */
export const documentWebHook = onRequest(async (req, res) => {
  try {
    await updateWebHookSchema.validate(req.headers);

    const state = req.header('x-goog-resource-state')!;
    const tokenStr = req.header('x-goog-channel-token')!;
    const { documentId, userId } = JSON.parse(
      Buffer.from(tokenStr, 'base64').toString('utf-8'),
    );

    logger.info(
      `Received webhook for document "${documentId}" for user "${userId}"`,
    );

    if (state === 'delete') {
      await deleteDocument(userId, documentId);
    }
    if (state === 'update') {
      await saveDocument(userId, documentId);
    }
    if (state === 'sync') {
      await saveDocument(userId, documentId);
    }

    res.status(200).send();
  } catch (error) {
    logger.error('Error watching document', error, req.headers);
    res.status(500).send('Error watching document');
  }
});

/**
 * Refreshes webhooks for all documents.
 */
export const refreshWebhooks = pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    logger.info('Refreshing webhooks');

    try {
      const batch = await batchStartWebhook();
      const errors = batch.filter((result) => result.status === 'rejected');

      if (errors.length) {
        logger.error('Error refreshing webhooks', errors);
      }
    } catch (error) {
      logger.error('Error refreshing webhooks', error);
    }

    logger.info('Finished refreshing webhooks');
  });
