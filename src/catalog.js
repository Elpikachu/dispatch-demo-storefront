import { readFileSync } from 'node:fs';

const DATA_URL = new URL('../data/products.json', import.meta.url);

const products = Object.freeze(
  JSON.parse(readFileSync(DATA_URL, 'utf8')).map((product) => Object.freeze(product)),
);

const priceFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
});

/** Returns every product, in catalogue order. */
export function listProducts() {
  return [...products];
}

/** Returns one product by id, or undefined when it does not exist. */
export function getProduct(id) {
  return products.find((product) => product.id === id);
}

/** Formats a price in euros, e.g. 129 -> "€129.00". */
export function formatPrice(amount) {
  return priceFormatter.format(amount);
}

/** Products with this many items or fewer (but more than zero) are flagged as low stock. */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Describes a product's availability.
 * Returns { level: 'out' | 'low' | 'in', label } where label is empty when in stock.
 */
export function stockStatus(product) {
  if (product.stock <= 0) return { level: 'out', label: 'Sold out' };
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return { level: 'low', label: `Only ${product.stock} left` };
  }
  return { level: 'in', label: '' };
}
