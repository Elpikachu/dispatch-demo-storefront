## Why

Shoppers cannot find a product without scrolling through the whole catalogue.

## What

- Add a search box above the catalogue.
- `GET /search?q=<text>` lists the products whose name or description contains the text (case-insensitive).
- Show the query and the number of results.

## Acceptance criteria

- [ ] Searching "tent" returns Basecamp 2P Tent.
- [ ] Tests cover the search route.
