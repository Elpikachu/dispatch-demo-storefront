import express from 'express';
import { getProduct, listProducts } from './catalog.js';
import { currentEnvironment } from './environment.js';
import { homePage, notFoundPage, productPage } from './views.js';

export function createApp({ environment = currentEnvironment() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.static(new URL('../public', import.meta.url).pathname));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: environment.name });
  });

  app.get('/api/products', (req, res) => {
    res.json(listProducts());
  });

  app.get('/api/products/:id', (req, res) => {
    const product = getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.get('/', (req, res) => {
    res.send(homePage(listProducts(), environment));
  });

  app.get('/products/:id', (req, res) => {
    const product = getProduct(req.params.id);
    if (!product) return res.status(404).send(notFoundPage(environment));
    res.send(productPage(product, environment));
  });

  app.use((req, res) => {
    res.status(404).send(notFoundPage(environment));
  });

  return app;
}
