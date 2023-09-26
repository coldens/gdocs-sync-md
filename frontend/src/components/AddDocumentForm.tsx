import { useDocs } from '../hooks/useDocs';
import FormComponent from './FormComponent';

export default function AddDocumentForm() {
  const { documents } = useDocs();

  return (
    <div className="g-3">
      {documents.length > 0 && <p>Current documents:</p>}
      {documents.map((doc) => (
        <div className="mb-2" key={doc.id}>
          <FormComponent defaultDocumentId={doc.id} documentTitle={doc.title} />
        </div>
      ))}
      <p className="mt-3">
        Insert your documentId to get the document from google docs
      </p>
      {<FormComponent />}
    </div>
  );
}
