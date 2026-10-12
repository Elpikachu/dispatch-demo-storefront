import { formatPrice, stockStatus } from './catalog.js';

const CATEGORY_COLORS = {
  Packs: '#2f6f4f',
  Footwear: '#8a4b2a',
  Clothing: '#3b5998',
  Accessories: '#6b4c9a',
  Camping: '#b5651d',
};

/** Escapes text so it can be safely placed inside HTML. Use it for every dynamic value. */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function productImage(product, size) {
  const color = CATEGORY_COLORS[product.category] ?? '#444';
  return `<svg class="product-image" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${escapeHtml(product.name)}">
    <rect width="100" height="100" rx="12" fill="${color}"/>
    <text x="50" y="58" text-anchor="middle" font-size="30" font-family="system-ui, sans-serif" fill="#fff">${escapeHtml(initials(product.name))}</text>
  </svg>`;
}

function stockBadge(product) {
  const status = stockStatus(product);
  if (status.level === 'in') return '';
  return `<span class="stock-badge stock-${status.level}">${escapeHtml(status.label)}</span>`;
}

function environmentBanner(environment) {
  if (!environment || environment.isProduction) return '';
  return `<div class="env-banner">Preview environment · <strong>${escapeHtml(environment.name)}</strong></div>`;
}

export function layout({ title, body, environment }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} · Trailhead Supply Co.</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  ${environmentBanner(environment)}
  <header class="site-header">
    <a class="brand" href="/">Trailhead Supply Co.</a>
    <span class="tagline">Gear for the long way round</span>
  </header>
  <main>
${body}
  </main>
  <footer class="site-footer">
    Demo storefront · served by <code>${escapeHtml(environment?.name ?? 'local')}</code>
  </footer>
</body>
</html>`;
}

function productCard(product) {
  return `    <li class="product-card">
      <a href="/products/${escapeHtml(product.id)}">
        ${productImage(product, 120)}
        <h2>${escapeHtml(product.name)}</h2>
      </a>
      <p class="category">${escapeHtml(product.category)}</p>
      <p class="price">${formatPrice(product.price)}</p>
      ${stockBadge(product)}
    </li>`;
}

export function homePage(products, environment) {
  const body = `    <h1>All products</h1>
    <ul class="product-grid">
${products.map(productCard).join('\n')}
    </ul>`;
  return layout({ title: 'All products', body, environment });
}

function addToCartButton(product) {
  if (stockStatus(product).level === 'out') {
    return '<button class="add-to-cart" type="button" disabled>Sold out</button>';
  }
  return '<button class="add-to-cart" type="button">Add to cart</button>';
}

export function productPage(product, environment) {
  const body = `    <article class="product-detail">
      ${productImage(product, 240)}
      <div class="product-info">
        <p class="category">${escapeHtml(product.category)}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="price">${formatPrice(product.price)}</p>
        ${stockBadge(product)}
        <p class="description">${escapeHtml(product.description)}</p>
        ${addToCartButton(product)}
        <p><a href="/">← Back to all products</a></p>
      </div>
    </article>`;
  return layout({ title: product.name, body, environment });
}

export function notFoundPage(environment) {
  const body = `    <h1>Not found</h1>
    <p>We could not find that page. <a href="/">Browse all products</a>.</p>`;
  return layout({ title: 'Not found', body, environment });
}
