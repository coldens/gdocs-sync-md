import { drive, drive_v3 } from '@googleapis/drive';
import * as logger from 'firebase-functions/logger';
import { getOAuthToken } from '../authorize/getOAuthToken';
import { WebHookParams } from './WebHookParams';

export async function startWebhook({
  userId,
  documentId,
  id,
}: WebHookParams): Promise<drive_v3.Schema$Channel | void> {
  try {
    const oauth2Client = await getOAuthToken(userId);
    const driveClient = drive({
      version: 'v3',
      auth: oauth2Client,
    });

    const token = {
      userId,
      documentId,
    };

    const date = new Date();
    // Set expiration to 1 day from now
    date.setUTCDate(date.getUTCDate() + 1);

    const result = await driveClient.files.watch({
      fileId: documentId,
      requestBody: {
        id,
        type: 'web_hook',
        address: process.env.GDRIVE_WEBHOOK_URL,
        token: Buffer.from(JSON.stringify(token), 'utf-8').toString('base64'),
        expiration: `${date.getTime()}`,
      },
    });

    logger.info(`Started webhook for document "${documentId}"`, result.data);

    return result.data;
  } catch (error) {
    const text: string = error.toString();

    if (text.includes(`Channel id ${documentId} not unique`)) {
      logger.warn(`Webhook already exists for document "${documentId}"`, error);
    } else {
      logger.error('Error starting webhook', error);
    }
  }
}
