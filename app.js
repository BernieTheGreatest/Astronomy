import { fetchApod, nasaDate, safeUrl } from './apod.js';
const $ = (id) => document.getElementById(id);
let key = 'DEMO_KEY';
let active;
$('date').max = nasaDate();
$('date').value = nasaDate();
async function load() {
  active?.abort();
  const controller = new AbortController();
  active = controller;
  const timeout = setTimeout(() => controller.abort('timeout'), 20000);
  $('entry').hidden = true;
  $('status').textContent = 'Looking up your corner of the cosmos…';
  try {
    const data = await fetchApod($('date').value, key, fetch, controller.signal);
    if (active !== controller) return;
    $('title').textContent = data.title;
    $('entry-date').textContent = data.date + ' / ASTRONOMY PICTURE OF THE DAY';
    $('explanation').textContent = data.explanation || '';
    $('credit').textContent = data.copyright ? 'Image credit: ' + data.copyright : 'Source: NASA Astronomy Picture of the Day';
    $('original').href = safeUrl(data.hdurl) || safeUrl(data.url);
    const media = $('media');
    media.replaceChildren();
    if (data.media_type === 'image') {
      const img = document.createElement('img');
      img.alt = data.title;
      img.src = safeUrl(data.url);
      img.addEventListener('error', () => { $('status').textContent = 'The image could not load. You can still read its story or open the original.'; });
      media.append(img);
    } else {
      if (safeUrl(data.thumbnail_url)) {
        const img = document.createElement('img'); img.src = safeUrl(data.thumbnail_url); img.alt = data.title + ' — video thumbnail'; media.append(img);
      }
      const link = document.createElement('a');
      link.href = safeUrl(data.url); link.textContent = '▶ Watch today’s astronomy video ↗';
      link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'video-link'; media.append(link);
    }
    $('entry').hidden = false;
    $('status').textContent = '';
  } catch (error) {
    if (active !== controller) return;
    $('status').textContent = controller.signal.aborted ? 'NASA took too long to respond. Please try again.' : error instanceof TypeError ? 'Could not reach NASA. Check your connection and try again.' : error.message;
  } finally { clearTimeout(timeout); }
}
$('date-form').addEventListener('submit', (event) => { event.preventDefault(); load(); });
$('today').addEventListener('click', () => { $('date').max = nasaDate(); $('date').value = nasaDate(); load(); });
$('key-form').addEventListener('submit', (event) => { event.preventDefault(); key = $('api-key').value.trim() || 'DEMO_KEY'; $('api-key').value = ''; load(); });
load();
