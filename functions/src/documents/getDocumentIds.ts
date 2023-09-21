import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

/**
 * Returns an array of document ids for the given email.
 */
export async function getDocumentIds(email: string) {
  const documents = await repository.getAllIds(email);

  return documents;
}
