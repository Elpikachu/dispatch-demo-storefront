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
