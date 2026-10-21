import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchApod, nasaDate, safeUrl } from '../apod.js';
test('NASA date follows Eastern time at UTC midnight', () => {
  assert.equal(nasaDate(new Date('2026-01-02T01:00:00Z')), '2026-01-01');
});
test('only HTTPS media links are allowed', () => {
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('https://apod.nasa.gov/image.jpg'), 'https://apod.nasa.gov/image.jpg');
});
for (const media_type of ['image', 'video']) {
  test(`loads a ${media_type} entry and encodes the requested date and key`, async () => {
    const data = { title: 'The cosmos', date: '2026-01-01', url: 'https://example.com/media', media_type };
    const result = await fetchApod('2026-01-01', 'a+b', async (url) => {
      assert.equal(url.searchParams.get('date'), '2026-01-01');
      assert.equal(url.searchParams.get('api_key'), 'a+b');
      return { ok: true, json: async () => data };
    });
    assert.deepEqual(result, data);
  });
}
test('reports rate limits', async () => {
  await assert.rejects(fetchApod('2026-01-01', '', async () => ({ ok: false, status: 429 })), /request limit/);
});
test('rejects malformed NASA data', async () => {
  await assert.rejects(fetchApod('2026-01-01', '', async () => ({ ok: true, json: async () => ({}) })), /incomplete/);
});
