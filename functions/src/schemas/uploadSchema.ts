import { object, string } from 'yup';

export const uploadSchema = object({
  documentId: string().required(),
});
