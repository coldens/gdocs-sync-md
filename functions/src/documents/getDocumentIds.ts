import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

/**
 * Returns an array of document {id, title} for the given email.
 */
export async function getDocuments(userId: string) {
  const documents = await repository.getAll(userId);
  return documents;
}
