# Agent guide: Trailhead storefront

A tiny Express 5 storefront (no database). Product data lives in `data/products.json`.

## Layout

- `src/catalog.js` — reads the catalogue; pure functions only.
- `src/views.js` — server-rendered HTML built with template literals.
- `src/app.js` — Express routes. `src/server.js` only starts the server.
- `public/styles.css` — all styling.
- `test/*.test.js` — `node:test` tests. `test/helpers.js` starts the app on a random port.

## Rules

- Escape every dynamic value rendered into HTML with `escapeHtml` from `src/views.js`.
- Put business logic (e.g. stock rules) in `src/catalog.js` as small exported functions, and unit-test them.
- Every behaviour change needs tests in `test/`. Keep tests fast (no network, no sleeps).
- Do not add npm dependencies.
- Do not change `.upsun/`, `.github/` or `demo/` unless the issue asks for it.
- Before finishing, `npm run lint` and `npm test` must pass.
