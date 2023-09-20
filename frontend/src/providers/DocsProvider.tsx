import { useEffect, useState } from 'react';
import { Credentials, docsContext } from '../contexts/docsContext';

export default function DocsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tokens, setTokens] = useState<Credentials | undefined>(undefined); // [1

  const setCredentials = (credentials: Credentials) => {
    localStorage.setItem('credentials', JSON.stringify(credentials));
  };

  useEffect(() => {
    const handler = () => {
      const credentials = localStorage.getItem('credentials');
      if (credentials) {
        setTokens(JSON.parse(credentials) as Credentials);
      }
    };

    handler();

    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <docsContext.Provider value={{ setCredentials, credentials: tokens }}>
      {children}
    </docsContext.Provider>
  );
}
