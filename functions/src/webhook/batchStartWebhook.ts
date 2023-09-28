import crypto = require('node:crypto');
import DocumentRepository from '../repositories/DocumentRepository';
import TokenRepository from '../repositories/TokenRepository';
import { startWebhook } from './startWebhook';

const tokenRepository = new TokenRepository();
const documentRepository = new DocumentRepository();

/**
 * Starts a webhook for all documents that don't have one or have an expired one.
 */
export async function batchStartWebhook() {
  const profiles = await tokenRepository.getProfiles();

  return await Promise.allSettled(
    profiles.map(async (profile) => {
      const docs = await documentRepository.getMany(profile.uid!);
      await Promise.all(
        docs.map(async (doc) => {
          const uuid = crypto.randomUUID();

          const result = await startWebhook({
            userId: profile.uid!,
            documentId: doc.id,
            id: uuid,
          });

          if (result?.id) {
            await documentRepository.save(profile.uid!, {
              id: doc.id,
              webhook: {
                id: result.id,
                resourceId: result.resourceId!,
                expiration: result.expiration!,
              },
            });
          }
        }),
      );
    }),
  );
}
