import DocumentRepository from '../repositories/DocumentRepository';
import { stopWebhook } from '../webhook/stopWebhook';

const repository = new DocumentRepository();

/**
 * Deletes a document from firestore and stops watching it on Google Drive
 */
export async function deleteDocument(userId: string, documentId: string) {
  const doc = await repository.get(userId, documentId);
  await repository.delete(userId, documentId);

  if (doc?.webhook) {
    await stopWebhook({
      userId,
      documentId,
      id: doc.webhook.id,
      resourceId: doc.webhook.resourceId,
    });
  }
}
