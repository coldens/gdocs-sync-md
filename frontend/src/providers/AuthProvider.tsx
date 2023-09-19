import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { AuthData } from '../contexts/AuthData';
import { authContext } from '../contexts/authContext';

const logout = async () => {
  const auth = getAuth();
  await auth.signOut();
};

const login = async () => {
  try {
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());
    GoogleAuthProvider.credentialFromResult(result);
  } catch (error) {
    console.error(error);
  }
};

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AuthData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    setLoading(true);
    onAuthStateChanged(
      auth,
      (user) => {
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
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
    );
  }, []);

  const isLogged = useMemo(() => !!data, [data]);

  return (
    <authContext.Provider value={{ data, isLogged, loading, logout, login }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
