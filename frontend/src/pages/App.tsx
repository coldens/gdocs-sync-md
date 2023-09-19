import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';

function App() {
  const { data, isLogged } = useAuth();

  const login = () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ user, token });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Hello to Gdoc sync!</h1>

      {isLogged && data && (
        <p>
          You are logged in as <strong>{data.user.displayName}</strong>
        </p>
      )}

      {!isLogged && (
        <button className="btn btn-primary" onClick={login}>
          Login!
        </button>
      )}
    </div>
  );
}

export default App;
