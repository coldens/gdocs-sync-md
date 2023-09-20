export default function AllowDocs() {
  const onClick: React.MouseEventHandler = (event) => {
    event.preventDefault();

    const authWindow = window.open(
      'http://127.0.0.1:5001/gdoc-md-sync-391822/us-central1/gdocs/auth',
      'authorize',
      'popup=yes',
    );

    if (authWindow) {
      authWindow.addEventListener(
        'message',
        (event) => {
          if (event.data === 'authorized') {
            authWindow.close();
            location.reload();
          }
        },
        false,
      );
    }
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
