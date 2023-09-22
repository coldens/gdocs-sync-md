import { docs } from '@googleapis/docs';
import { drive } from '@googleapis/drive';
import * as logger from 'firebase-functions/logger';
import { getOAuthToken } from '../authorize/getOAuthToken';
import DocumentRepository from '../repositories/DocumentRepository';
import TurndownService = require('turndown');
import { googleDocsToMarkdown } from 'docs-markdown';

const repository = new DocumentRepository();
const turndownService = new TurndownService();

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

  const [doc, htmlDoc] = await Promise.all([
    // Get the document metadata
    docsClient.documents.get({
      documentId,
    }),
    // Get the document as HTML
    driveClient.files.export({
      fileId: documentId,
      mimeType: 'text/html',
    }),
  ]);

  if (htmlDoc.data && doc.data) {
    logger.info(`Saving document "${documentId}" for user "${userId}"`);
    const html = htmlDoc.data as string;

    const document = {
      id: documentId,
      markdown: googleDocsToMarkdown(doc.data),
      title: doc.data.title || 'Document without title',

      // TODO: For testing purposes, we're saving the HTML as markdown as well
      html: html,
      htmlMarkdown: turndownService.turndown(html),
    };

    await repository.save(userId, document);

    return document;
  } else {
    throw new Error('Could not get document from Google Docs');
  }
}
