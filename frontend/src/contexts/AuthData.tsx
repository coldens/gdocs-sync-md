export type AuthData = {
  refreshToken: string;
  user: {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
  };
};

export type AuthContext = {
  data?: AuthData;
  isLogged: boolean;
};
