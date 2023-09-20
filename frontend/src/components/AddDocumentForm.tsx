export default function AddDocumentForm({
  onSubmit,
}: {
  onSubmit: React.FormEventHandler;
}) {
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
            />
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
