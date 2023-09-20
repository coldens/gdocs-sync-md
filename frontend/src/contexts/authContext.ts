import { createContext } from 'react';
import { AuthContext } from './AuthData';

export const authContext = createContext<AuthContext>({
  isLogged: false,
  loading: true,
  logout: async () => {},
  login: async () => {},
});
