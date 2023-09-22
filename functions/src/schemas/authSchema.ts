import { object, string } from 'yup';

export const authSchema = object({
  userId: string().required(),
});
