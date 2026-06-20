export default async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('API request failed');
    error.status = res.status;
    try { error.info = await res.json(); } catch {}
    throw error;
  }
  return res.json();
}
