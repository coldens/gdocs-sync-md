import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import React, { useState } from 'react';
import { eventBus } from '../eventBus';

export default function FormComponent({ defaultDocumentId = '' }) {
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState(defaultDocumentId);

  /**
   * Update the documentId state
   */
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setDocumentId(event.target.value);
  };

  const functions = getFunctions();

  if (import.meta.env.DEV) {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }

  const upload = httpsCallable(functions, 'upload');
  const download = httpsCallable(functions, 'download');

  /**
   * Upload the document from google docs to firebase storage
   */
  const onSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setUploading(true);

    upload({ documentId })
      .then((result) => {
        console.log(result);
      })
      .finally(() => {
        setUploading(false);

        if (defaultDocumentId === '') {
          setDocumentId('');
        }

        // Refresh the documentIds
        eventBus.emit('refresh-docs');
      });
  };

  const onDownload: React.MouseEventHandler = (event) => {
    event.preventDefault();
    setUploading(true);

    download({ documentId })
      .then((result) => {
        const data: any = result.data;

        if (data.success) {
          const markdown = data.document.markdown;
          const title = data.document.title;

          // download the markdown
          const element = document.createElement('a');
          const file = new Blob([markdown], {
            type: 'text/markdown',
          });
          element.href = URL.createObjectURL(file);
          element.download = `${title}.md`;
          element.click();
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
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
            readOnly={uploading || defaultDocumentId !== ''}
            disabled={uploading || defaultDocumentId !== ''}
          />
        </div>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {defaultDocumentId !== '' ? 'Reload' : 'Import'}
        </button>
      </div>
      {defaultDocumentId !== '' && (
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-secondary"
            onClick={onDownload}
          >
            Download
          </button>
        </div>
      )}
    </form>
  );
}
