import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

export async function getDocuments(email: string) {
  const documents = await repository.getAllIds(email);

  return documents;
}
