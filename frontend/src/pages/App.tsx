import AddDocumentForm from '../components/AddDocumentForm';
import AllowDocs from '../components/AllowDocs';
import { useAuth } from '../hooks/useAuth';
import { useDocs } from '../hooks/useDocs';

function App() {
  const { credentials } = useDocs();
  const auth = useAuth();

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
