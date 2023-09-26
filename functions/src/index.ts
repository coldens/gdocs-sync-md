import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';
import { onCall, onRequest } from 'firebase-functions/v2/https';
import {
  onDocumentCreated,
  onDocumentDeleted,
} from 'firebase-functions/v2/firestore';

// Initialize Firebase Admin before importing anything else because it
// allows us to use the Firebase Admin SDK in the imported files.
initializeApp();

import { generateAuthUrl } from './authorize/generateAuthUrl';
import { isAuthorized } from './authorize/isAuthorized';
import { saveRefreshToken } from './authorize/saveRefreshToken';
import { getDocuments } from './documents/getDocumentIds';
import { saveDocument } from './documents/saveDocument';
import { authHandlerSchema } from './schemas/authHandlerSchema';
import { authSchema } from './schemas/authSchema';
import { uploadSchema } from './schemas/uploadSchema';
import { getDocument } from './documents/getDocument';
import { deleteDocument } from './documents/deleteDocument';
import { updateWebHookSchema } from './schemas/updateWebHookSchema';
import { startWebhook } from './webhook/startWebhook';
import { stopWebhook } from './webhook/stopWebhook';

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

    const state = req.header('X-Goog-Resource-State')!;
    const documentId = req.header('X-Goog-Resource-ID')!;
    const token = req.header('X-Goog-Channel-Token')!;

    const userId = Buffer.from(token, 'base64').toString('utf-8');

    logger.info(
      `Received webhook for document "${documentId}" for user "${userId}" with state "${state}"`,
    );

    if (state === 'delete') {
      await deleteDocument(userId, documentId);
    }
    if (state === 'update') {
      await saveDocument(userId, documentId);
    }

    res.status(200).send();
  } catch (error) {
    logger.error('Error watching document', error);
    res.status(500).send('Error watching document');
  }
});

/**
 * Creates a webhook for a document when it is created.
 */
export const startWebhookOnCreated = onDocumentCreated(
  {
    document: 'users/{userId}/documents/{documentId}',
    retry: true,
  },
  async (event) => {
    const result = await startWebhook(event.params);

    if (result) {
      await event.data?.ref.update({
        webhookExpiration: result.expiration,
      });
    }
  },
);

/**
 * Deletes a webhook for a document when it is deleted.
 */
export const stopWebhookOnDeleted = onDocumentDeleted(
  {
    document: 'users/{userId}/documents/{documentId}',
    retry: true,
  },
  async (event) => {
    await stopWebhook(event.params);
  },
);

// TODO: Implement refreshWebhooks
// export const refreshWebhooks = pubsub
//   .schedule('every 1 hours')
//   .onRun(async () => {
//     logger.info('Refreshing webhooks');
//   });
