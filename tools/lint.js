// Fast, dependency-free checks: every JS file must parse, and the catalogue must be valid.
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const errors = [];

for (const dir of ['src', 'test', 'tools']) {
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.js'))) {
    const path = join(dir, file);
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    if (result.status !== 0) errors.push(`${path}: syntax error\n${result.stderr}`);
    if (dir === 'src' && /\bdebugger\b/.test(readFileSync(path, 'utf8'))) {
      errors.push(`${path}: remove the debugger statement`);
    }
  }
}

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));
const ids = new Set();
for (const product of products) {
  if (ids.has(product.id)) errors.push(`data/products.json: duplicate id ${product.id}`);
  ids.add(product.id);
  for (const field of ['id', 'name', 'category', 'description']) {
    if (typeof product[field] !== 'string' || !product[field]) {
      errors.push(`data/products.json: ${product.id ?? '?'} is missing "${field}"`);
    }
  }
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push(`data/products.json: ${product.id} has an invalid price`);
  }
  if (!Number.isInteger(product.stock) || product.stock < 0) {
    errors.push(`data/products.json: ${product.id} has an invalid stock`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`lint ok (${products.length} products checked)`);
