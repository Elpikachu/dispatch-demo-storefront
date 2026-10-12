import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startServer } from './helpers.js';

let server;
before(async () => {
  server = await startServer({ environment: { name: 'test', isProduction: false } });
});
after(() => server.close());

test('GET /search finds products by name', async () => {
  const res = await fetch(`${server.url}/search?q=tent`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /Basecamp 2P Tent/);
  assert.match(html, /1 product\(s\) found/);
});
