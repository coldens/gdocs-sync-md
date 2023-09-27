import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';
import { onCall, onRequest } from 'firebase-functions/v2/https';
import {
  onDocumentCreated,
  onDocumentDeleted,
} from 'firebase-functions/v2/firestore';
import crypto = require('node:crypto');

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
import { Document } from './repositories/DocumentRepository';

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
 * Creates a webhook for a document when it is created.
 */
export const startWebhookOnCreated = onDocumentCreated(
  {
    document: 'documents/{userId}/documents/{documentId}',
    // retry: true,
  },
  async (event) => {
    const id = crypto.randomUUID();
    const result = await startWebhook({ ...event.params, id });

    if (result) {
      await event.data?.ref.update({
        webhook: {
          id: result.id,
          resourceId: result.resourceId,
          expiration: result.expiration,
        },
      });

      logger.info('Webhook created for document', result);
    } else {
      logger.info('Webhook already exists for document');
    }
  },
);

/**
 * Deletes a webhook for a document when it is deleted.
 */
export const stopWebhookOnDeleted = onDocumentDeleted(
  {
    document: 'documents/{userId}/documents/{documentId}',
    // retry: true,
  },
  async (event) => {
    const doc = event.data?.data() as Document;

    if (doc?.webhook) {
      await stopWebhook({
        ...event.params,
        resourceId: doc.webhook.resourceId,
        id: doc.webhook.id,
      });
    }
  },
);

// TODO: Refresh webhooks
// USING FIRESTORE TRIGGERS
// export const refreshWebhooks = pubsub
//   .schedule('every 1 hours')
//   .onRun(async () => {
//     logger.info('Refreshing webhooks');
//   });
