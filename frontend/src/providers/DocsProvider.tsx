import { useEffect, useState } from 'react';
import { docsContext } from '../contexts/docsContext';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { useAuth } from '../hooks/useAuth';
import { eventBus } from '../eventBus';

export default function DocsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        setIsLoading(true);

        load()
          .then((result) => {
            setDocumentIds(result.data as string[]);
            setIsAuthorized(true);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    handler();

    window.addEventListener('storage', handler);
    eventBus.addListener('refresh-docs', () => handler());
    return () => {
      window.removeEventListener('storage', handler);
      eventBus.removeAllListeners('refresh-docs');
    };
  }, [isLogged]);

  return (
    <docsContext.Provider value={{ documentIds, isAuthorized, isLoading }}>
      {children}
    </docsContext.Provider>
  );
}
