import { useEffect, useState } from 'react';
import { docsContext } from '../contexts/docsContext';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { useAuth } from '../hooks/useAuth';

export default function DocsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const { isLogged } = useAuth();

  // Load the documentIds from firebase
  useEffect(() => {
    const functions = getFunctions();
    if (import.meta.env.DEV) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
    const load = httpsCallable(functions, 'load');
    const handler = () => {
      if (isLogged) {
        load()
          .then((result) => {
            setDocumentIds(result.data as string[]);
            setIsAuthorized(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    handler();

    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [isLogged]);

  return (
    <docsContext.Provider value={{ documentIds, isAuthorized }}>
      {children}
    </docsContext.Provider>
  );
}
