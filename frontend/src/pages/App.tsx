import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import AddDocumentForm from '../components/AddDocumentForm';
import AllowDocs from '../components/AllowDocs';
import { useDocs } from '../hooks/useDocs';
import { useAuth } from '../hooks/useAuth';

function App() {
  const functions = getFunctions();
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

  const { credentials } = useDocs();
  const auth = useAuth();
  httpsCallable(functions, 'getDocs');

  const onSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="row">
      <h1>Hello to Gdoc sync!</h1>

      {auth.isLogged ? (
        <>
          {credentials ? <AddDocumentForm {...{ onSubmit }} /> : <AllowDocs />}
        </>
      ) : (
        <>
          <p>You need to login to use this app</p>
        </>
      )}
    </div>
  );
}

export default App;
