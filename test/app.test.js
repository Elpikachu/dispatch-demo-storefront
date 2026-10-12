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

test('GET / shows stock badges on the catalogue cards', async () => {
  const res = await fetch(server.url);
  const html = await res.text();
  assert.match(html, /<span class="stock-badge stock-badge--low">Only 3 left<\/span>/);
  assert.match(html, /<span class="stock-badge stock-badge--out">Sold out<\/span>/);
});

test('GET /products/ridge-trail-shoes shows "Only 3 left" with an enabled button', async () => {
  const res = await fetch(`${server.url}/products/ridge-trail-shoes`);
  const html = await res.text();
  assert.match(html, /<span class="stock-badge stock-badge--low">Only 3 left<\/span>/);
  assert.match(html, /<button class="add-to-cart" type="button">Add to cart<\/button>/);
  assert.doesNotMatch(html, /disabled/);
});

test('GET /products/alpine-down-jacket shows "Sold out" with a disabled button', async () => {
  const res = await fetch(`${server.url}/products/alpine-down-jacket`);
  const html = await res.text();
  assert.match(html, /<span class="stock-badge stock-badge--out">Sold out<\/span>/);
  assert.match(html, /<button class="add-to-cart" type="button" disabled>Sold out<\/button>/);
  assert.doesNotMatch(html, /Add to cart/);
});

test('GET /products/summit-35-backpack shows no stock badge', async () => {
  const res = await fetch(`${server.url}/products/summit-35-backpack`);
  const html = await res.text();
  assert.doesNotMatch(html, /stock-badge/);
  assert.match(html, /<button class="add-to-cart" type="button">Add to cart<\/button>/);
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
