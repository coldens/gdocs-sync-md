import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

/**
 * Returns an array of document ids for the given email.
 */
export async function getDocument(userId: string, documentId: string) {
  const document = await repository.get(userId, documentId);
  return document;
}
