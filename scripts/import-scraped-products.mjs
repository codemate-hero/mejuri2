import fs from 'fs';
import path from 'path';
import { connectDB } from '../app/lib/db.js';
import Product from '../app/models/Product.js';

const fileArg = process.argv[2] || './scraped-products.json';

function mapProduct(p) {
  return {
    shopifyProductId: p.shopifyProductId || p.id || null,
    title: p.title || '',
    handle: p.handle || '',
    description: p.description || p.body_html || '',
    vendor: p.vendor || 'Mejuri',
    productType: p.productType || p.product_type || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : (p.published_at ? new Date(p.published_at) : null),
    createdAtShopify: p.createdAtShopify ? new Date(p.createdAtShopify) : (p.created_at ? new Date(p.created_at) : null),
    updatedAtShopify: p.updatedAtShopify ? new Date(p.updatedAtShopify) : (p.updated_at ? new Date(p.updated_at) : null),
    variants: Array.isArray(p.variants) ? p.variants : [],
    images: Array.isArray(p.images) ? p.images : [],
    options: Array.isArray(p.options) ? p.options : [],
    source: 'mejuri',
  };
}

async function main() {
  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  try {
    await connectDB();
    console.log('Connected to DB via connectDB()');

    const raw = fs.readFileSync(filePath, 'utf-8');
    const productsData = JSON.parse(raw);
    const products = productsData.map(mapProduct);
    const productsByIdentity = new Map();

    for (const product of products) {
      const identity = product.shopifyProductId
        ? `shopify:${product.shopifyProductId}`
        : product.handle
          ? `handle:${product.handle.toLowerCase()}`
          : "";

      if (!identity) continue;
      productsByIdentity.set(identity, product);
    }

    const operations = [...productsByIdentity.values()]
      .map((p) => ({
        updateOne: {
          filter: p.shopifyProductId ? { shopifyProductId: p.shopifyProductId } : { handle: p.handle },
          update: { $set: p },
          upsert: true,
        },
      }));

    if (!operations.length) {
      console.log('No valid products to import');
      process.exit(0);
    }

    console.log(`Running bulkWrite for ${operations.length} unique products (upsert)`);
    const result = await Product.bulkWrite(operations);

    console.log('Import result:', {
      upsertedCount: result.upsertedCount || 0,
      modifiedCount: result.modifiedCount || 0,
      matchedCount: result.matchedCount || 0,
    });

    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
