import { docs } from '@googleapis/docs';
import { drive } from '@googleapis/drive';
import * as logger from 'firebase-functions/logger';
import { getOAuthToken } from '../authorize/getOAuthToken';
import { convertToMarkdown } from '../pandoc';
import DocumentRepository from '../repositories/DocumentRepository';

const repository = new DocumentRepository();

/**
 * Saves a Google Docs document as a markdown file in firestore
 */
export async function saveDocument(userId: string, documentId: string) {
  const oauth2Client = await getOAuthToken(userId);

  // To export a Google Doc as a markdown file, we need to use the Drive API to export the file as HTML
  const driveClient = drive({
    version: 'v3',
    auth: oauth2Client,
  });

  // And then use the Docs API to get the title of the document, and any other metadata
  const docsClient = docs({
    version: 'v1',
    auth: oauth2Client,
  });

  const [doc, file] = await Promise.all([
    // Get the document metadata
    docsClient.documents.get({
      documentId,
    }),
    // Get the document content
    driveClient.files.export({
      fileId: documentId,
      mimeType: 'application/rtf',
    }),
  ]);

  if (doc.data && file.data) {
    logger.info(`Saving document "${documentId}" for user "${userId}"`);
    const content = await (file.data as Blob).text();
    const document = {
      id: documentId,
      markdown: await convertToMarkdown(content),
      title: doc.data.title || 'Document without title',
    };

    await repository.save(userId, document);

    return document;
  } else {
    throw new Error('Could not get document from Google Docs');
  }
}
