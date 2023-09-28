import * as logger from 'firebase-functions/logger';
import {
  onDocumentCreated,
  onDocumentDeleted,
} from 'firebase-functions/v2/firestore';
import crypto = require('node:crypto');

import { Document } from './repositories/DocumentRepository';
import { startWebhook } from './webhook/startWebhook';
import { stopWebhook } from './webhook/stopWebhook';

// TODO: this is an example of integrating with firestore events. It is not used in the app.

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
