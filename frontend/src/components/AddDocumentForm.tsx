import { useState } from 'react';
import {
  // connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';

export default function AddDocumentForm() {
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState('');

  const functions = getFunctions();
  // connectFunctionsEmulator(functions, 'localhost', 5001);
  const upload = httpsCallable(functions, 'upload');

  const onSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setUploading(true);

    upload({ documentId })
      .then((result) => {
        console.log(result);
      })
      .finally(() => {
        setUploading(false);
        setDocumentId('');
      });
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setDocumentId(event.target.value);
  };

  return (
    <div className="g-3">
      <p>Insert your documentId to get the document from google docs</p>
      <form
        className="row row-cols-lg-auto align-items-center"
        onSubmit={onSubmit}
      >
        <div className="col-12 col-lg-6">
          <label
            className="visually-hidden"
            htmlFor="inlineFormInputGroupDocumentId"
          >
            DocumentId
          </label>
          <div className="input-group">
            <div className="input-group-text">id</div>
            <input
              type="text"
              className="form-control"
              id="inlineFormInputGroupDocumentId"
              placeholder="DocumentId"
              value={documentId}
              onChange={onChange}
              required={true}
            />
          </div>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
