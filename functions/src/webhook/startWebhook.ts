import { drive, drive_v3 } from '@googleapis/drive';
import * as logger from 'firebase-functions/logger';
import { getOAuthToken } from '../authorize/getOAuthToken';
import { WebHookParams } from './WebHookParams';

export async function startWebhook({
  userId,
  documentId,
}: WebHookParams): Promise<drive_v3.Schema$Channel | void> {
  try {
    const oauth2Client = await getOAuthToken(userId);
    const driveClient = drive({
      version: 'v3',
      auth: oauth2Client,
    });

    const result = await driveClient.files.watch({
      fileId: documentId,
      requestBody: {
        id: documentId,
        type: 'web_hook',
        address: process.env.WEBHOOK_URL,
        token: Buffer.from(userId, 'utf-8').toString('base64'),
      },
    });

    logger.info(`Started webhook for document "${documentId}"`);

    return result.data;
  } catch (error) {
    logger.error('Error starting webhook', error);
  }
}
