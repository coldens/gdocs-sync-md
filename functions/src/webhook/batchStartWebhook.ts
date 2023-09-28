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
    profiles.flatMap(async (profile) => {
      const docs = await documentRepository.getMany(profile.id!);

      return await Promise.allSettled(
        docs.map(async (doc) => {
          const uuid = crypto.randomUUID();

          const result = await startWebhook({
            userId: profile.id!,
            documentId: doc.id,
            id: uuid,
          });

          if (result?.id) {
            await documentRepository.save(profile.id!, {
              id: doc.id,
              webhook: {
                id: result.id,
                resourceId: result.resourceId!,
                expiration: parseInt(result.expiration!),
              },
            });
          }

          return result;
        }),
      );
    }),
  );
}
