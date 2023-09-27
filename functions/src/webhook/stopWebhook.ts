import { drive } from '@googleapis/drive';
import * as logger from 'firebase-functions/logger';
import { getOAuthToken } from '../authorize/getOAuthToken';
import { WebHookParams } from './WebHookParams';

export async function stopWebhook({
  userId,
  documentId,
}: WebHookParams): Promise<void> {
  try {
    const oauth2Client = await getOAuthToken(userId);
    const driveClient = drive({
      version: 'v3',
      auth: oauth2Client,
    });

    await driveClient.channels.stop({
      requestBody: {
        id: documentId,
        resourceId: documentId,
      },
    });

    logger.info(`Stopped webhook for document "${documentId}"`);
  } catch (error) {
    const text: string = error.toString();

    if (text.includes(`Channel '${documentId}' not found for project`)) {
      logger.warn(`Webhook does not exist for document "${documentId}"`, error);
    } else {
      logger.error('Error stopping webhook', error);
    }
  }
}
