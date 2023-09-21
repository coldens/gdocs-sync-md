import { createContext } from 'react';

export const docsContext = createContext<DocsContext>({
  documentIds: [],
  isAuthorized: false,
  isLoading: true,
});

export type DocsContext = {
  documentIds: string[];
  isAuthorized: boolean;
  isLoading: boolean;
};
