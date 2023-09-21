import { useAuth } from '../hooks/useAuth';

export default function AllowDocs() {
  const { data } = useAuth();

  if (!data) {
    return null;
  }

  const onClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    const url = new URL(import.meta.env.VITE_AUTHORIZE_URL);
    url.searchParams.set('email', data?.user.email || '');
    window.open(url.toString(), 'authorize', 'popup=yes');
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
