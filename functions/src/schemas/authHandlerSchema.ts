import { object, string } from 'yup';

export const authHandlerSchema = object({
  code: string().required(),
  state: string().required(),
});
