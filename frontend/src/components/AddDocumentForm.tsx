import { useDocs } from '../hooks/useDocs';
import FormComponent from './FormComponent';

export default function AddDocumentForm() {
  const { documentIds } = useDocs();

  return (
    <div className="g-3">
      {documentIds.length > 0 && <p>Current documents:</p>}
      {documentIds.map((documentId) => (
        <div className="mb-2" key={documentId}>
          <FormComponent defaultDocumentId={documentId} />
        </div>
      ))}
      <p className="mt-3">
        Insert your documentId to get the document from google docs
      </p>
      {<FormComponent />}
    </div>
  );
}
