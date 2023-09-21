import { useEffect } from 'react';

export default function Authorized() {
  useEffect(() => {
    localStorage.setItem('authorized', 'true');
    window.close();
  }, []);

  return <div>Authorized</div>;
}
