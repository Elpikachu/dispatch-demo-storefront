import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatPrice, getProduct, listProducts } from '../src/catalog.js';

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

test('formatPrice formats euros', () => {
  assert.equal(formatPrice(129), '€129.00');
  assert.equal(formatPrice(34.5), '€34.50');
});
