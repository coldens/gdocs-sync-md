import { createContext } from 'react';

export const docsContext = createContext<DocsContext>({
  documentIds: [],
  isAuthorized: false,
});

export type DocsContext = {
  documentIds: string[];
  isAuthorized: boolean;
};
