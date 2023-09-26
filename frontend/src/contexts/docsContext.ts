import { createContext } from 'react';

export const docsContext = createContext<DocsContext>({
  documents: [],
  isAuthorized: false,
  isLoading: true,
});

export type DocsContext = {
  documents: Document[];
  isAuthorized: boolean;
  isLoading: boolean;
};

export type Document = {
  id: string;
  title: string;
  markdown?: string;
};
