export function nasaDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}
export function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
  catch { return null; }
}
export async function fetchApod(date, key = 'DEMO_KEY', fetcher = fetch, signal) {
  const url = new URL('https://api.nasa.gov/planetary/apod');
  url.search = new URLSearchParams({ api_key: key || 'DEMO_KEY', date, thumbs: 'true' });
  const response = await fetcher(url, { signal });
  if (!response.ok) {
    if (response.status === 429) throw new Error('NASA’s request limit has been reached. Try later or use your own NASA API key.');
    throw new Error(`NASA could not load this date (HTTP ${response.status}). Try another date or check your API key.`);
  }
  const data = await response.json();
  if (!data.title || !data.date || !safeUrl(data.url)) throw new Error('NASA returned an incomplete entry. Please try another date.');
  return data;
}
