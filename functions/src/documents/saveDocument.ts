import { docs } from '@googleapis/docs';
import { googleDocsToMarkdown } from 'docs-markdown';
import { getOAuthToken } from '../authorize/getOAuthToken';
import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

/**
 * Saves a Google Docs document as a markdown file in firestore
 */
export async function saveDocument(email: string, documentId: string) {
  const oauth2Client = await getOAuthToken(email);

  const client = docs({
    version: 'v1',
    auth: oauth2Client,
  });

  const doc = await client.documents.get({
    documentId,
  });

  if (doc.data.body) {
    const document = {
      id: documentId,
      markdown: googleDocsToMarkdown(doc.data),
      title: doc.data.title as string,
    };

    await repository.save(email, document);

    return document;
  } else {
    throw new Error('No body');
  }
}
