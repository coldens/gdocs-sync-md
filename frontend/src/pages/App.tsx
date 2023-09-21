import AddDocumentForm from '../components/AddDocumentForm';
import AllowDocs from '../components/AllowDocs';
import { useAuth } from '../hooks/useAuth';
import { useDocs } from '../hooks/useDocs';

function App() {
  const { credentials } = useDocs();
  const auth = useAuth();

  return (
    <div className="row">
      <h1>Hello to Gdoc sync!</h1>

      {auth.isLogged ? (
        <>{credentials ? <AddDocumentForm /> : <AllowDocs />}</>
      ) : (
        <>
          <p>You need to login to use this app</p>
        </>
      )}
    </div>
  );
}

export default App;
