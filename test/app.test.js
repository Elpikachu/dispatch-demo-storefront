import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startServer } from './helpers.js';

let server;

before(async () => {
  server = await startServer({ environment: { name: 'pr-1', isProduction: false } });
});

after(() => server.close());

test('GET /health reports ok', async () => {
  const res = await fetch(`${server.url}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok', environment: 'pr-1' });
});

test('GET / lists every product with its price', async () => {
  const res = await fetch(server.url);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /Summit 35 Backpack/);
  assert.match(html, /€129\.00/);
  assert.match(html, /Preview environment/);
});

test('GET /products/:id shows the product page', async () => {
  const res = await fetch(`${server.url}/products/ridge-trail-shoes`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<h1>Ridge Trail Shoes<\/h1>/);
  assert.match(html, /Add to cart/);
});

test('GET /products/:id returns 404 for an unknown product', async () => {
  const res = await fetch(`${server.url}/products/nope`);
  assert.equal(res.status, 404);
});

test('GET /api/products returns JSON', async () => {
  const res = await fetch(`${server.url}/api/products`);
  assert.equal(res.status, 200);
  const products = await res.json();
  assert.equal(products.length, 8);
});

test('GET /api/products/:id returns 404 JSON for an unknown product', async () => {
  const res = await fetch(`${server.url}/api/products/nope`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Product not found' });
});
