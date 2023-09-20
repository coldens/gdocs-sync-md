export default function AllowDocs() {
  const onClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    window.open(import.meta.env.VITE_AUTHORIZE_URL, 'authorize', 'popup=yes');
  };

  return (
    <div className="col-12">
      <p>Give us permission to access to your google gocs!</p>
      <button className="btn btn-primary" onClick={onClick}>
        Allow
      </button>
    </div>
  );
}
