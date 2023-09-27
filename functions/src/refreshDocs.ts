import * as logger from 'firebase-functions/logger';
import { pubsub } from 'firebase-functions/v1';
import { syncDocuments } from './documents/syncDocuments';

// TODO: this is an example of a scheduled function. It is not used in the app.
/**
 * Refreshes the documents in firestore using a scheduled function.
 */
export const refreshDocs = pubsub.schedule('every 1 hours').onRun(async () => {
  logger.info('Refreshing docs');
  await syncDocuments();
  logger.info('Finished refreshing docs');
});
