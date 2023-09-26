import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

/**
 * Deletes a document from firestore and stops watching it on Google Drive
 */
export async function deleteDocument(userId: string, documentId: string) {
  await repository.delete(userId, documentId);
}
