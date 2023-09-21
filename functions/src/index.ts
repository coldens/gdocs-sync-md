import dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? undefined : '.env.local',
});

import { onRequest } from 'firebase-functions/v2/https';
import { app } from './app';

export const gdocs = onRequest(app);
