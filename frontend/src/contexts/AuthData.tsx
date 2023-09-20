import { User } from 'firebase/auth';

export type AuthData = {
  user: User & {
    accessToken?: string;
    refreshToken?: string;
  };
};

export type AuthContext = {
  data?: AuthData;
  isLogged: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: () => Promise<void>;
};
