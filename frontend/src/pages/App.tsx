import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import AddDocumentForm from '../components/AddDocumentForm';
import AllowDocs from '../components/AllowDocs';
import { useDocs } from '../hooks/useDocs';

function App() {
  const functions = getFunctions();
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

  const { credentials } = useDocs();
  httpsCallable(functions, 'getDocs');

  const onSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="row">
      <h1>Hello to Gdoc sync!</h1>

      {credentials ? <AddDocumentForm {...{ onSubmit }} /> : <AllowDocs />}
    </div>
  );
}

export default App;
