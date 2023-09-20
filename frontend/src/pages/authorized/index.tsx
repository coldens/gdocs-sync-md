import { useDocs } from '../../hooks/useDocs';
import { useEffect } from 'react';

export default function Authorized() {
  const context = useDocs();

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokens = url.searchParams.get('tokens');
    if (tokens) {
      context.setCredentials(JSON.parse(tokens));
      window.postMessage('authorized', '*');
    }
  });

  return <div>Authorized</div>;
}
