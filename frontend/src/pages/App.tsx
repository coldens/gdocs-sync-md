import AddDocumentForm from '../components/AddDocumentForm';
import AllowDocs from '../components/AllowDocs';
import { useAuth } from '../hooks/useAuth';
import { useDocs } from '../hooks/useDocs';

function App() {
  const { isAuthorized, isLoading } = useDocs();
  const auth = useAuth();

  return (
    <div className="row">
      <h1>Hello to Gdoc sync!</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {auth.isLogged ? (
            <>{isAuthorized ? <AddDocumentForm /> : <AllowDocs />}</>
          ) : (
            <>
              <p>You need to login to use this app</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
