import TokenRepository from '../repositories/TokenRepository';
import { getDocuments } from './getDocumentIds';
import { saveDocument } from './saveDocument';

/**
 * Syncs all documents for all users.
 */
export async function syncDocuments() {
  const tokenRepository = new TokenRepository();
  const profiles = await tokenRepository.getProfiles();

  await Promise.allSettled(
    profiles.map(async (profile) => {
      const userId = profile.id!;

      const documents = await getDocuments(userId);
      await Promise.allSettled(
        documents.map(async (document) => {
          await saveDocument(userId, document.id);
        }),
      );
    }),
  );
}
