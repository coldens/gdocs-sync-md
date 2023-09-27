import { object, string } from 'yup';

// X-Goog-Channel-ID UUID or other unique string you provided to identify this notification channel.
// X-Goog-Message-Number Integer that identifies this message for this notification channel. Value is always 1 for sync messages. Message numbers increase for each subsequent message on the channel, but they are not sequential.
// X-Goog-Resource-ID An opaque value that identifies the watched resource. This ID is stable across API versions.
// X-Goog-Resource-State The new resource state, which triggered the notification. Possible values: sync, add, remove, update, trash, untrash, or change.
// X-Goog-Resource-URI An API-version-specific identifier for the watched resource.
// X-Goog-Channel-Token Notification channel token that was set by your application, and that you can use to verify the source of notification.
export const updateWebHookSchema = object({
  'x-goog-channel-id': string().required(),
  'x-goog-message-number': string().required(),
  'x-goog-resource-id': string().required(),
  'x-goog-resource-state': string().required(),
  'x-goog-resource-uri': string().required(),
  'x-goog-channel-token': string().required(),
});
