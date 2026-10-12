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

/** Products with this many units or fewer (but more than zero) count as low stock. */
export const LOW_STOCK_THRESHOLD = 5;

/** Returns { level: 'out' | 'low' | 'in', label } for a product's stock; label is null when in stock. */
export function stockStatus(product) {
  const stock = product.stock;
  if (!(stock > 0)) return { level: 'out', label: 'Sold out' };
  if (stock <= LOW_STOCK_THRESHOLD) return { level: 'low', label: `Only ${stock} left` };
  return { level: 'in', label: null };
}

/** Formats a price in euros, e.g. 129 -> "€129.00". */
export function formatPrice(amount) {
  return priceFormatter.format(amount);
}
