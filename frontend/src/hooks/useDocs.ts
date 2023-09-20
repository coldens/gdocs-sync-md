import { useContext } from 'react';
import { docsContext } from '../contexts/docsContext';

export const useDocs = () => {
  const context = useContext(docsContext);
  if (!context) {
    throw new Error('useDocs must be used within an DocsProvider');
  }
  return context;
};
