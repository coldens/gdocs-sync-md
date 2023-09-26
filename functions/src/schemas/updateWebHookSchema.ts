import { object, string } from 'yup';

// X-Goog-Channel-ID	UUID or other unique string you provided to identify this notification channel.
// X-Goog-Message-Number	Integer that identifies this message for this notification channel. Value is always 1 for sync messages. Message numbers increase for each subsequent message on the channel, but they are not sequential.
// X-Goog-Resource-ID	An opaque value that identifies the watched resource. This ID is stable across API versions.
// X-Goog-Resource-State	The new resource state, which triggered the notification. Possible values: sync, add, remove, update, trash, untrash, or change .
// X-Goog-Resource-URI	An API-version-specific identifier for the watched resource.
export const updateWebHookSchema = object({
  'X-Goog-Channel-ID': string().required(),
  'X-Goog-Message-Number': string().required(),
  'X-Goog-Resource-ID': string().required().label('documentId'),
  'X-Goog-Resource-State': string()
    .required()
    .oneOf(['sync', 'add', 'remove', 'update', 'trash', 'untrash', 'change'])
    .label('state'),
  'X-Goog-Resource-URI': string().required(),
  'X-Goog-Channel-Token': string().required(),
});
