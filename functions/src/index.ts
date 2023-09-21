import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';
import { onCall, onRequest } from 'firebase-functions/v2/https';

// Initialize Firebase Admin before importing anything else because it
// allows us to use the Firebase Admin SDK in the imported files.
initializeApp();

import { generateAuthUrl } from './authorize/generateAuthUrl';
import { generateAuthorizedUrl } from './authorize/generateAuthorizedUrl';
import { saveDocument } from './documents/saveDocument';
import { authHandlerSchema } from './schemas/authHandlerSchema';
import { authSchema } from './schemas/authSchema';
import { uploadSchema } from './schemas/uploadSchema';
import { getDocumentIds } from './documents/getDocumentIds';

/**
 * Uploads a Google Doc to Firestore, converting it to Markdown.
 */
export const upload = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('Unauthorized');
    }

    const { documentId } = await uploadSchema.validate(request.data);
    const email = request.auth.token.email!;

    return saveDocument(email, documentId);
  } catch (err) {
    logger.error('Error uploading document', err);
    throw err;
  }
});

/**
 * Returns an array of document ids of the current User.
 */
export const load = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('Unauthorized');
    }

    const email = request.auth.token.email!;
    const result = await getDocumentIds(email);

    return result;
  } catch (err) {
    logger.error('Error loading document', err);
    throw err;
  }
});

/**
 * To be called by the frontend to get the url to redirect to for Google OAuth 2.0.
 */
export const authorize = onRequest(async (req, res) => {
  let query: { email: string };

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
 * and redirects the user to the frontend with the tokens in the query.
 */
export const authorizeHandler = onRequest(async (req, res) => {
  const query = await authHandlerSchema.validate(req.query).catch((error) => {
    logger.error('Error validating auth handler query', error);
    if (error.errors) {
      res.status(400).send(error.errors);
    }
  });

  if (query) {
    // Redirect to frontend with tokens in query
    const url = await generateAuthorizedUrl(query.code, query.state);

    logger.info('Redirecting to:', url.toString());
    res.redirect(url.toString());
  }
});
