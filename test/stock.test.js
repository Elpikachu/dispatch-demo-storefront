import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { LOW_STOCK_THRESHOLD, stockStatus } from '../src/catalog.js';
import { startServer } from './helpers.js';

test('stockStatus boundaries', () => {
  assert.equal(LOW_STOCK_THRESHOLD, 5);
  assert.deepEqual(stockStatus({ stock: 0 }), { level: 'out', label: 'Sold out' });
  assert.deepEqual(stockStatus({ stock: 1 }), { level: 'low', label: 'Only 1 left' });
  assert.deepEqual(stockStatus({ stock: 5 }), { level: 'low', label: 'Only 5 left' });
  assert.deepEqual(stockStatus({ stock: 6 }), { level: 'in', label: '' });
});

let server;
before(async () => {
  server = await startServer({ environment: { name: 'test', isProduction: false } });
});
after(() => server.close());

const page = async (path) => (await fetch(`${server.url}${path}`)).text();

test('low-stock product shows "Only 3 left"', async () => {
  assert.match(await page('/products/ridge-trail-shoes'), /Only 3 left/);
});

test('sold-out product shows a disabled button', async () => {
  const html = await page('/products/alpine-down-jacket');
  assert.match(html, /<button class="add-to-cart" type="button" disabled>Sold out<\/button>/);
});

test('well-stocked product shows no badge', async () => {
  const html = await page('/products/summit-35-backpack');
  assert.doesNotMatch(html, /stock-badge/);
  assert.match(html, /<button class="add-to-cart" type="button">Add to cart<\/button>/);
});

test('catalogue cards show badges', async () => {
  const html = await page('/');
  assert.match(html, /Only 3 left/);
  assert.match(html, /Sold out/);
});
