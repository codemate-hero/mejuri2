// import { connectDB } from "@/app/lib/db";
// import Product from "@/app/models/Product";
// import fs from "fs";
// import path from "path";

// const BASE_URL = "https://mejuri.com/world/en";

// const MANUAL_COLLECTIONS = [
//   { category: "Puzzle", collectionHandle: "puzzle" },
//   { category: "Dome", collectionHandle: "dome" },
//   { category: "Charlotte", collectionHandle: "charlotte" },
//   { category: "Interconnected", collectionHandle: "interconnected" },
//   { category: "Stevie", collectionHandle: "stevie" },
// ];

// const MANUAL_COLLECTION_MATCHERS = {
//   puzzle: (text) => /\bpuzzle\b/i.test(text),
//   charlotte: (text) => /\bcharlotte\b/i.test(text),
//   interconnected: (text) => /\b(interconnected|interlock|linked|link)\b/i.test(text),
//   stevie: (text) => /\bstevie\b/i.test(text),
//   "new-earrings": (text, product) =>
//     product.collectionHandle === "new" &&
//     /\b(earring|earrings|hoop|hoops|huggie|huggies|stud|studs|ear cuff|ear-cuff)\b/i.test(text),
//   "new-rings": (text, product) =>
//     product.collectionHandle === "new" &&
//     /\b(ring|rings|band|bands|stacker|stacking|signet)\b/i.test(text),
//   "new-necklaces": (text, product) =>
//     product.collectionHandle === "new" &&
//     /\b(necklace|necklaces|chain|pendant|lariat|choker)\b/i.test(text),
//   "new-bracelets": (text, product) =>
//     product.collectionHandle === "new" &&
//     /\b(bracelet|bracelets|bangle|bangles)\b/i.test(text),
// };

// function cleanHtml(html) {
//   if (!html) return "";
//   return html.replace(/<[^>]*>/g, "").trim();
// }

// function getHandleFromUrl(url) {
//   const match = url.match(/\/collections\/([^/?#]+)/);
//   return match?.[1] || "";
// }

// function cleanCategoryName(text, handle) {
//   const name = text?.replace(/\s*>\s*$/, "").trim();

//   if (name) return name;

//   return handle
//     .replace(/-/g, " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// }

// function extractCollectionsFromText(text) {
//   const urlMatches = [...text.matchAll(/\/(?:world\/en\/)?collections\/([a-zA-Z0-9-]+)/g)];

//   const seen = new Set();
//   const categories = [];

//   for (const m of urlMatches) {
//     const handle = m[1];
//     if (!handle || seen.has(handle)) continue;
//     seen.add(handle);

//     const label = handle.replace(/-/g, " ") || handle;

//     categories.push({
//       category: cleanCategoryName(label, handle),
//       collectionHandle: handle,
//     });
//   }

//   return categories;
// }

// // Try to extract a products array from collection HTML (best-effort)
// function extractProductsFromHtml(html) {
//   try {
//     // 1) Find JSON blob that contains "products": [...]
//     const re = /"products"\s*:\s*\[/i;
//     const match = re.exec(html);
//     if (match) {
//       const idx = match.index;
//       const start = html.lastIndexOf('{', idx);
//       if (start !== -1) {
//         let depth = 0;
//         for (let i = start; i < html.length; i++) {
//           const ch = html[i];
//           if (ch === '{') depth++;
//           else if (ch === '}') depth--;
//           if (depth === 0) {
//             const jsonText = html.slice(start, i + 1);
//             try {
//               const obj = JSON.parse(jsonText);
//               if (obj && Array.isArray(obj.products)) return obj.products;
//             } catch (e) {}
//             break;
//           }
//         }
//       }
//     }

//     // 2) ld+json
//     const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
//     let ldMatch;
//     while ((ldMatch = ldRe.exec(html))) {
//       try {
//         const json = JSON.parse(ldMatch[1]);
//         if (Array.isArray(json)) {
//           const products = json.filter((it) => it && it['@type'] && (it['@type'].toLowerCase().includes('product') || it['@type'] === 'ItemList'));
//           if (products.length) return products;
//         } else if (json && json['@type'] && json['@type'].toLowerCase().includes('itemlist') && Array.isArray(json.itemListElement)) {
//           const items = json.itemListElement.map((el) => el.item || el);
//           if (items.length) return items;
//         }
//       } catch (e) {}
//     }

//     // 3) product-card fallback
//     const products = [];
//     const marker = 'data-testid="product-card"';
//     let pos = html.indexOf(marker);
//     while (pos !== -1) {
//       const divStart = html.lastIndexOf('<div', pos);
//       if (divStart === -1) break;
//       let liEnd = html.indexOf('</li>', pos);
//       if (liEnd === -1) liEnd = html.indexOf('</div>', pos);
//       if (liEnd === -1) break;
//       const snippet = html.slice(divStart, liEnd + 5);

//       const handleMatch = snippet.match(/data-handle=["']([^"']+)["']/i);
//       const objIdMatch = snippet.match(/data-object-id=["']([^"']+)["']/i);
//       const ariaLabelMatch = snippet.match(/<a[^>]+aria-label=["']([^"']+)["']/i);
//       const hrefMatch = snippet.match(/<a[^>]+href=["']([^"']+)["']/i);
//       const titleFromAnchorMatch = snippet.match(/<a[^>]*>\s*([^<]{2,200}?)\s*<\/a>/i);
//       const priceMatch = snippet.match(/\$\s*([0-9,]+(?:\.[0-9]+)?)/);
//       const imgMatches = [...snippet.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);

//       const handle = handleMatch ? handleMatch[1] : null;
//       let shopifyId = null;
//       if (objIdMatch) {
//         const idStr = objIdMatch[1].replace(/[^0-9]/g, '');
//         shopifyId = idStr ? Number(idStr) : null;
//       }

//       let title = ariaLabelMatch ? ariaLabelMatch[1] : null;
//       if (!title && titleFromAnchorMatch) title = titleFromAnchorMatch[1].trim();
//       if (!title && hrefMatch) {
//         const parts = hrefMatch[1].split('/');
//         title = decodeURIComponent(parts[parts.length - 1].split('?')[0]).replace(/[-_]/g, ' ');
//       }

//       const price = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : null;

//       if (handle || title) {
//         const p = {
//           id: shopifyId || null,
//           title: title || handle || null,
//           handle: handle || (hrefMatch ? hrefMatch[1].split('/').pop().split('?')[0] : null),
//           body_html: null,
//           vendor: null,
//           product_type: null,
//           tags: [],
//           variants: price ? [{ id: null, title: null, sku: null, price, available: true }] : [],
//           images: imgMatches.map((src, i) => ({ id: null, src, position: i + 1 })),
//         };

//         products.push(p);
//       }

//       pos = html.indexOf(marker, pos + marker.length);
//     }

//     if (products.length) return products;
//   } catch (err) {
//     console.warn('extractProductsFromHtml error', err?.message || err);
//   }

//   return [];
// }

// function mapProduct(product, categoryItem) {
//   return {
//     shopifyProductId: product.id,
//     title: product.title,
//     handle: product.handle,
//     description: cleanHtml(product.body_html),
//     vendor: product.vendor,
//     productType: product.product_type || product.productType || '',

//     navItem: categoryItem.navItem,
//     category: categoryItem.category,
//     collectionHandle: categoryItem.collectionHandle,
//     categoryOrder: categoryItem.categoryOrder,

//     tags: product.tags || [],
//     publishedAt: product.published_at,
//     createdAtShopify: product.created_at,
//     updatedAtShopify: product.updated_at,

//     variants: (product.variants || []).map((variant) => ({
//       shopifyVariantId: variant.id,
//       title: variant.title,
//       sku: variant.sku,
//       price: Number(variant.price),
//       available: variant.available,
//       option1: variant.option1,
//       option2: variant.option2,
//       option3: variant.option3,
//       grams: variant.grams,
//       compareAtPrice: variant.compare_at_price
//         ? Number(variant.compare_at_price)
//         : null,
//     })),

//     images: (product.images || []).map((image) => ({
//       shopifyImageId: image.id,
//       src: image.src,
//       width: image.width,
//       height: image.height,
//       position: image.position,
//     })),

//     options: (product.options || []).map((option) => ({
//       name: option.name,
//       position: option.position,
//       values: option.values || [],
//     })),
//   };
// }

// function getProductSearchText(product) {
//   return [
//     product.title,
//     product.handle,
//     product.productType,
//     ...(Array.isArray(product.tags) ? product.tags : []),
//   ]
//     .filter(Boolean)
//     .join(" ");
// }

// function cloneProductForCategory(product, categoryItem) {
//   return {
//     ...product,
//     navItem: categoryItem.navItem,
//     category: categoryItem.category,
//     collectionHandle: categoryItem.collectionHandle,
//     categoryOrder: categoryItem.categoryOrder,
//   };
// }

// function backfillManualCollections(allProducts, categories, summary) {
//   const manualCategories = categories.filter(
//     (category) => MANUAL_COLLECTION_MATCHERS[category.collectionHandle]
//   );

//   for (const categoryItem of manualCategories) {
//     const existingCount = allProducts.filter(
//       (product) => product.collectionHandle === categoryItem.collectionHandle
//     ).length;

//     if (existingCount > 0) continue;

//     const matcher = MANUAL_COLLECTION_MATCHERS[categoryItem.collectionHandle];
//     const seen = new Set();

//     const matches = allProducts
//       .filter((product) => product.collectionHandle !== categoryItem.collectionHandle)
//       .filter((product) => matcher(getProductSearchText(product), product))
//       .filter((product) => {
//         const key = (product.handle || product.shopifyProductId || product.title || "").toString();
//         if (!key || seen.has(key)) return false;
//         seen.add(key);
//         return true;
//       })
//       .map((product) => cloneProductForCategory(product, categoryItem));

//     if (!matches.length) continue;

//     allProducts.push(...matches);

//     const summaryItem = summary.find(
//       (item) => item.collectionHandle === categoryItem.collectionHandle
//     );

//     if (summaryItem) {
//       summaryItem.total = matches.length;
//       summaryItem.backfilled = true;
//     }
//   }
// }

// async function scrapeCategoriesFromDataFiles() {
//   const pages = [
//     "https://www.mejuri.com/world/en.data",
//     "https://www.mejuri.com/world/en/collections/all-jewelry.data",
//     "https://www.mejuri.com/world/en/collections/all-gifts.data",
//     "https://www.mejuri.com/world/en/collections/new-rings.data",
//     "https://www.mejuri.com/world/en/collections/before-we-melt.data",
//     "https://www.mejuri.com/world/en/collections/mens.data",
//   ];

//   let categories = [];

//   for (const url of pages) {
//     try {
//       console.log("Reading data file:", url);

//       const res = await fetch(url, {
//         headers: {
//           "user-agent": "Mozilla/5.0",
//           accept: "text/x-script,text/plain,*/*",
//         },
//       });

//       if (!res.ok) continue;

//       const text = await res.text();
//       const found = extractCollectionsFromText(text);

//       categories.push(...found);
//     } catch (error) {
//       console.log("Data file failed:", url, error.message);
//     }
//   }

//   const unique = [];
//   const seen = new Set();

//   for (const cat of [...MANUAL_COLLECTIONS, ...categories]) {
//     const key = cat.collectionHandle;

//     if (!seen.has(key)) {
//       seen.add(key);
//       unique.push({
//         ...cat,
//         categoryOrder: unique.length,
//       });
//     }
//   }

//   return unique;
// }

// async function fetchProductsByCategory(categoryItem) {
//   const all = [];

//   // 1) Try the products.json endpoint (with BASE_URL)
//   try {
//     let page = 1;
//     while (true) {
//       const jsonUrl = `${BASE_URL.replace(/\/$/, '')}/collections/${categoryItem.collectionHandle}/products.json?limit=250&page=${page}`;
//       console.log('Trying products.json →', jsonUrl);
//       const res = await fetch(jsonUrl, {
//         headers: { 'user-agent': 'Mozilla/5.0', accept: 'application/json' },
//       });
//       if (!res.ok) break;
//       const data = await res.json();
//       const products = data.products || [];
//       if (!products.length) break;

//       all.push(...products.map((p) => mapProduct(p, categoryItem)));

//       if (products.length < 250) break;
//       page++;
//     }
//   } catch (err) {
//     console.warn('products.json fetch failed', err?.message || err);
//   }

//   // 2) Fallback: scrape collection HTML pages
//   if (!all.length) {
//     console.log(`Falling back to HTML scraping for ${categoryItem.collectionHandle}`);
//     let page = 1;
//     const maxPages = 50;
//     while (page <= maxPages) {
//       const pageUrl = `${BASE_URL.replace(/\/$/, '')}/collections/${categoryItem.collectionHandle}?page=${page}`;
//       console.log('Fetching HTML page', page, '→', pageUrl);
//       try {
//         const res = await fetch(pageUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
//         if (!res.ok) break;
//         const html = await res.text();
//         const products = extractProductsFromHtml(html) || [];

//         if (!products.length) {
//           const hasNext = /rel=["']next["']|aria-label=["']next["']|>\s*Next\s*<|data-testid=["']load-more["']/i.test(html);
//           if (!hasNext) break;
//         }

//         for (const p of products) all.push(mapProduct(p, categoryItem));

//         if (products.length < 20) break;
//       } catch (err) {
//         console.warn('HTML fetch failed', err?.message || err);
//         break;
//       }
//       page++;
//     }
//   }

//   // dedupe by handle or shopifyProductId
//   const seen = new Set();
//   const dedup = [];
//   for (const p of all) {
//     const key = (p.handle || p.shopifyProductId || JSON.stringify(p)).toString();
//     if (seen.has(key)) continue;
//     seen.add(key);
//     dedup.push(p);
//   }

//   return dedup;
// }

// async function saveProductsToDB(products) {
//   if (!products.length) return null;

//   const operations = products.map((product) => {
//     const collection = {
//       navItem: product.navItem,
//       category: product.category,
//       collectionHandle: product.collectionHandle,
//       categoryOrder: product.categoryOrder,
//     };

//     return {
//       updateOne: {
//         filter: product.shopifyProductId
//           ? { shopifyProductId: product.shopifyProductId }
//           : { handle: product.handle },
//         update: {
//           $set: product,
//           $addToSet: { collections: collection },
//         },
//         upsert: true,
//       },
//     };
//   });

//   return Product.bulkWrite(operations);
// }

// async function backfillFromLocalFiles() {
//   const categoriesPath = path.join(
//     process.cwd(),
//     "app",
//     "scraped-categories.json"
//   );
//   const productsPath = path.join(
//     process.cwd(),
//     "app",
//     "scraped-products.json"
//   );

//   const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
//   const allProducts = JSON.parse(fs.readFileSync(productsPath, "utf8"));
//   const beforeTotal = allProducts.length;

//   const summary = categories.map((categoryItem) => ({
//     category: categoryItem.category,
//     collectionHandle: categoryItem.collectionHandle,
//     total: allProducts.filter(
//       (product) => product.collectionHandle === categoryItem.collectionHandle
//     ).length,
//   }));

//   backfillManualCollections(allProducts, categories, summary);

//   fs.writeFileSync(productsPath, JSON.stringify(allProducts, null, 2));

//   const manualHandles = new Set([
//     ...MANUAL_COLLECTIONS.map((item) => item.collectionHandle),
//     ...Object.keys(MANUAL_COLLECTION_MATCHERS),
//   ]);
//   const productsToSave = allProducts.filter((product) =>
//     manualHandles.has(product.collectionHandle)
//   );
//   const result = await saveProductsToDB(productsToSave);

//   return {
//     beforeTotal,
//     afterTotal: allProducts.length,
//     added: allProducts.length - beforeTotal,
//     savedToDb: productsToSave.length,
//     result,
//     summary,
//   };
// }

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);

//     if (searchParams.get("backfill") === "1") {
//       const backfill = await backfillFromLocalFiles();

//       return Response.json({
//         message: "Manual collections backfilled from local scraped-products.json and DB updated",
//         productsJsonFile: "app/scraped-products.json",
//         added: backfill.added,
//         savedToDb: backfill.savedToDb,
//         inserted: backfill.result?.upsertedCount || 0,
//         modified: backfill.result?.modifiedCount || 0,
//         matched: backfill.result?.matchedCount || 0,
//         summary: backfill.summary,
//       });
//     }

//     const categories = await scrapeCategoriesFromDataFiles();

//     const categoriesPath = path.join(
//       process.cwd(),
//       "app",
//       "scraped-categories.json"
//     );
//     fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

//     let allProducts = [];
//     const summary = [];

//     for (const categoryItem of categories) {
//       const products = await fetchProductsByCategory(categoryItem);

//       allProducts.push(...products);

//       summary.push({
//         category: categoryItem.category,
//         collectionHandle: categoryItem.collectionHandle,
//         total: products.length,
//       });
//     }

//     backfillManualCollections(allProducts, categories, summary);

//     const productsPath = path.join(
//       process.cwd(),
//       "app",
//       "scraped-products.json"
//     );
//     fs.writeFileSync(productsPath, JSON.stringify(allProducts, null, 2));

//     const result = await saveProductsToDB(allProducts);

//     return Response.json({
//       message: "Products scraped from Mejuri data files, JSON saved, and DB imported",
//       categoriesFound: categories.length,
//       totalProducts: allProducts.length,
//       categoriesJsonFile: "app/scraped-categories.json",
//       productsJsonFile: "app/scraped-products.json",
//       inserted: result?.upsertedCount || 0,
//       modified: result?.modifiedCount || 0,
//       matched: result?.matchedCount || 0,
//       summary,
//     });
//   } catch (error) {
//     console.error("Import failed:", error);

//     return Response.json(
//       {
//         message: "Import failed",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }



import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.mejuri.com";

function cleanHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function getHandleFromUrl(url) {
  const match = url.match(/\/collections\/([^/?#]+)/);
  return match?.[1] || "";
}

function cleanCategoryName(text, handle) {
  const name = text?.replace(/\s*>\s*$/, "").trim();

  if (name) return name;

  return handle
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractCollectionsFromText(text) {
  const urlMatches = [
    ...text.matchAll(/\/(?:world\/en\/)?collections\/([a-zA-Z0-9-]+)/g),
  ];

  const seen = new Set();
  const categories = [];

  for (const match of urlMatches) {
    const handle = match[1];

    if (!handle || seen.has(handle)) continue;

    seen.add(handle);

    categories.push({
      navItem: "Mejuri",
      category: cleanCategoryName("", handle),
      collectionHandle: handle,
    });
  }

  return categories;
}

function mapProduct(product, categoryItem) {
  return {
    shopifyProductId: product.id,
    title: product.title,
    handle: product.handle,
    description: cleanHtml(product.body_html),
    vendor: product.vendor,
    productType: product.product_type,

    navItem: categoryItem.navItem,
    category: categoryItem.category,
    collectionHandle: categoryItem.collectionHandle,
    categoryOrder: categoryItem.categoryOrder,

    tags: product.tags || [],
    publishedAt: product.published_at,
    createdAtShopify: product.created_at,
    updatedAtShopify: product.updated_at,

    variants: (product.variants || []).map((variant) => ({
      shopifyVariantId: variant.id,
      title: variant.title,
      sku: variant.sku,
      price: variant.price ? Number(variant.price) : 0,
      available: variant.available,
      option1: variant.option1,
      option2: variant.option2,
      option3: variant.option3,
      grams: variant.grams,
      compareAtPrice: variant.compare_at_price
        ? Number(variant.compare_at_price)
        : null,
    })),

    images: (product.images || []).map((image) => ({
      shopifyImageId: image.id,
      src: image.src,
      width: image.width,
      height: image.height,
      position: image.position,
    })),

    options: (product.options || []).map((option) => ({
      name: option.name,
      position: option.position,
      values: option.values || [],
    })),
  };
}

async function scrapeCategoriesFromDataFiles() {
  const pages = [
    "https://www.mejuri.com/world/en.data",
    "https://www.mejuri.com/world/en/collections/all-jewelry.data",
    "https://www.mejuri.com/world/en/collections/all-gifts.data",
    "https://www.mejuri.com/world/en/collections/new-rings.data",
    "https://www.mejuri.com/world/en/collections/before-we-melt.data",
    "https://www.mejuri.com/world/en/collections/mens.data",
  ];

  let categories = [];

  for (const url of pages) {
    try {
      console.log("Reading data file:", url);

      const res = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0",
          accept: "text/x-script,text/plain,*/*",
        },
      });

      if (!res.ok) continue;

      const text = await res.text();
      const found = extractCollectionsFromText(text);

      categories.push(...found);
    } catch (error) {
      console.log("Data file failed:", url, error.message);
    }
  }

  const unique = [];
  const seen = new Set();

  for (const cat of categories) {
    const key = cat.collectionHandle;

    if (!seen.has(key)) {
      seen.add(key);
      unique.push({
        ...cat,
        categoryOrder: unique.length,
      });
    }
  }

  return unique;
}

async function fetchProductsByCategory(categoryItem) {
  let page = 1;
  const allProducts = [];

  while (true) {
    const jsonUrl = `${BASE_URL}/collections/${categoryItem.collectionHandle}/products.json?limit=250&page=${page}`;

    console.log("Fetching JSON:", categoryItem.category, "page:", page);

    const res = await fetch(jsonUrl, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "application/json",
      },
    });

    if (!res.ok) {
      console.log("Failed:", jsonUrl, res.status);
      break;
    }

    const data = await res.json();
    const products = data.products || [];

    if (!products.length) break;

    allProducts.push(
      ...products.map((product) => mapProduct(product, categoryItem))
    );

    if (products.length < 250) break;

    page++;
  }

  return allProducts;
}

async function saveProductsToDB(products) {
  if (!products.length) return null;

  const productsByIdentity = new Map();

  for (const product of products) {
    const identity = product.shopifyProductId
      ? `shopify:${product.shopifyProductId}`
      : product.handle
        ? `handle:${product.handle.toLowerCase()}`
        : "";

    if (!identity) continue;

    const collection = {
      navItem: product.navItem,
      category: product.category,
      collectionHandle: product.collectionHandle,
      categoryOrder: product.categoryOrder,
    };

    const existing = productsByIdentity.get(identity);

    if (!existing) {
      productsByIdentity.set(identity, {
        product,
        collections: [collection],
      });
      continue;
    }

    existing.collections.push(collection);
  }

  const operations = [...productsByIdentity.values()].map(({ product, collections }) => {
    const filter = product.shopifyProductId
      ? { shopifyProductId: product.shopifyProductId }
      : { handle: product.handle };

    return {
      updateOne: {
        filter,
        update: {
          $set: product,
          $addToSet: {
            collections: {
              $each: collections,
            },
          },
        },
        upsert: true,
      },
    };
  });

  return Product.bulkWrite(operations);
}

export async function POST() {
  try {
    await connectDB();

    const categories = await scrapeCategoriesFromDataFiles();

    const categoriesPath = path.join(
      process.cwd(),
      "app",
      "scraped-categories.json"
    );

    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    let allProducts = [];
    const summary = [];

    for (const categoryItem of categories) {
      const products = await fetchProductsByCategory(categoryItem);

      allProducts.push(...products);

      summary.push({
        category: categoryItem.category,
        collectionHandle: categoryItem.collectionHandle,
        total: products.length,
      });
    }

    const productsPath = path.join(
      process.cwd(),
      "app",
      "scraped-products.json"
    );

    fs.writeFileSync(productsPath, JSON.stringify(allProducts, null, 2));

    const result = await saveProductsToDB(allProducts);

    return Response.json({
      message: "Products imported successfully with full variant data",
      categoriesFound: categories.length,
      totalProducts: allProducts.length,
      categoriesJsonFile: "app/scraped-categories.json",
      productsJsonFile: "app/scraped-products.json",
      inserted: result?.upsertedCount || 0,
      modified: result?.modifiedCount || 0,
      matched: result?.matchedCount || 0,
      summary,
    });
  } catch (error) {
    console.error("Import failed:", error);

    return Response.json(
      {
        message: "Import failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
