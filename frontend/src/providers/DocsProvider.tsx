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
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      setTokens(JSON.parse(credentials) as Credentials);
    }
  }, []);

  return (
    <docsContext.Provider value={{ setCredentials, credentials: tokens }}>
      {children}
    </docsContext.Provider>
  );
}
