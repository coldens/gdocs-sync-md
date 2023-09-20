import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';

function App() {
  const functions = getFunctions();
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

  const getDocs = httpsCallable(functions, 'getDocs');

  getDocs()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <div>
      <h1>Hello to Gdoc sync!</h1>
    </div>
  );
}

export default App;
