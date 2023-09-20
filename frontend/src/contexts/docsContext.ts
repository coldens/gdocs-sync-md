import { createContext } from 'react';

export const docsContext = createContext<DocsContext>({
  setCredentials: async () => {},
});

export type Credentials = {
  refresh_token?: string;
  expiry_date?: number;
  access_token?: string;
  token_type?: string;
  id_token?: string;
  scope?: string;
};

export type DocsContext = {
  /**
   * Set the credentials in the local storage
   */
  setCredentials: (credentials: Credentials) => void;
  credentials?: Credentials;
};
