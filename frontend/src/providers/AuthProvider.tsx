import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { AuthData } from '../contexts/AuthData';
import { authContext } from '../contexts/authContext';

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = getAuth();
  const [data, setData] = useState<AuthData | undefined>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setData({
          refreshToken: user.refreshToken,
          user: {
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            uid: user.uid,
          },
        });
      } else {
        setData(undefined);
      }
    });
  }, [auth]);

  const isLogged = useMemo(() => !!data, [data]);

  return (
    <authContext.Provider value={{ data, isLogged }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
