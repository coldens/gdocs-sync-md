import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AuthData } from '../contexts/AuthData';
import { authContext } from '../contexts/authContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AuthData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    setLoading(true);
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setData({ user });
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

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/documents.readonly');
      const result = await signInWithPopup(getAuth(), provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(credential);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    const auth = getAuth();
    await auth.signOut();
  };

  const isLogged = useMemo(() => !!data, [data]);

  return (
    <authContext.Provider value={{ data, isLogged, loading, logout, login }}>
      {children}
    </authContext.Provider>
  );
}
