## Why

Customers add items to their basket and only find out at checkout that they are sold out. Merchandising also wants to create a sense of urgency when an item is nearly gone.

## What

Show the stock status of each product, using the existing `stock` field in `data/products.json`:

| Stock | Badge | Add to cart button (product page) |
|---|---|---|
| `0` | **Sold out** (grey) | Disabled, label reads "Sold out" |
| `1` to `5` | **Only N left** (amber), N is the stock | Enabled |
| more than `5` | No badge | Enabled |

- Show the badge on the catalogue cards (`/`) and on the product page (`/products/:id`).
- Put the rule in `src/catalog.js` as an exported `stockStatus(product)` function returning `{ level, label }`, where `level` is `"out"`, `"low"` or `"in"`. Define the threshold `5` as a named constant.

## Acceptance criteria

- [ ] Ridge Trail Shoes (stock 3) shows "Only 3 left".
- [ ] Alpine Down Jacket (stock 0) shows "Sold out" and its Add to cart button is disabled.
- [ ] Summit 35 Backpack (stock 42) shows no badge.
- [ ] Unit tests cover the boundaries 0, 1, 5 and 6, and HTTP tests cover the three pages above.
- [ ] `npm run lint` and `npm test` pass.

## Out of scope

No cart logic, no changes to the product data, no new dependencies.
