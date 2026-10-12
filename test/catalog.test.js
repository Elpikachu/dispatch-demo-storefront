import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  LOW_STOCK_THRESHOLD,
  formatPrice,
  getProduct,
  listProducts,
  stockStatus,
} from '../src/catalog.js';

test('listProducts returns the whole catalogue', () => {
  const products = listProducts();
  assert.equal(products.length, 8);
  for (const product of products) {
    assert.ok(product.id && product.name && product.category);
    assert.equal(typeof product.price, 'number');
    assert.ok(Number.isInteger(product.stock) && product.stock >= 0);
  }
});

test('listProducts returns a copy callers cannot use to change the catalogue', () => {
  const products = listProducts();
  products.pop();
  assert.equal(listProducts().length, 8);
});

test('getProduct finds a product by id', () => {
  assert.equal(getProduct('summit-35-backpack').name, 'Summit 35 Backpack');
  assert.equal(getProduct('does-not-exist'), undefined);
});

test('LOW_STOCK_THRESHOLD is 5', () => {
  assert.equal(LOW_STOCK_THRESHOLD, 5);
});

test('stockStatus covers the stock boundaries', () => {
  assert.deepEqual(stockStatus({ stock: 0 }), { level: 'out', label: 'Sold out' });
  assert.deepEqual(stockStatus({ stock: 1 }), { level: 'low', label: 'Only 1 left' });
  assert.deepEqual(stockStatus({ stock: 5 }), { level: 'low', label: 'Only 5 left' });
  assert.deepEqual(stockStatus({ stock: 6 }), { level: 'in', label: null });
});

test('stockStatus treats negative stock as sold out', () => {
  assert.deepEqual(stockStatus({ stock: -1 }), { level: 'out', label: 'Sold out' });
});

test('formatPrice formats euros', () => {
  assert.equal(formatPrice(129), '€129.00');
  assert.equal(formatPrice(34.5), '€34.50');
});
