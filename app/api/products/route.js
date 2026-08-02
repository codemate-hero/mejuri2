import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 250;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getPositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);

  const productType = searchParams.get("productType");
  const collectionHandle = searchParams.get("collectionHandle");
  const category = searchParams.get("category");
  const handle = searchParams.get("handle");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") || "top-match";
  const available = searchParams.get("available") === "true";
  const categories = searchParams.getAll("categoryFilter");
  const materials = searchParams.getAll("material");
  const stones = searchParams.getAll("stone");
  const colors = searchParams.getAll("color");
  const sizes = searchParams.getAll("size");
  const lengths = searchParams.getAll("length");
  const sales = searchParams.getAll("sale").map(Number).filter(Number.isFinite);
  const page = getPositiveInteger(searchParams.get("page"), 1);
  const requestedLimit = getPositiveInteger(searchParams.get("limit"), DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  const filters = [];

  if (handle) {
    filters.push({ handle: { $regex: `^${escapeRegex(handle)}$`, $options: "i" } });
  }

  if (collectionHandle) {
    const collectionRegex = { $regex: `^${escapeRegex(collectionHandle)}$`, $options: "i" };
    filters.push({
      $or: [
        { collectionHandle: collectionRegex },
        { "collections.collectionHandle": collectionRegex },
      ],
    });
  }

  if (category) {
    const normalizedCategory = category.replace(/-/g, " ");
    const categoryRegex = { $regex: `^${escapeRegex(normalizedCategory)}$`, $options: "i" };
    filters.push({
      $or: [
        { category: categoryRegex },
        { "collections.category": categoryRegex },
      ],
    });
  }

  if (productType) {
    if (productType.includes('|')) {
      const types = productType.split('|').map(t => t.trim()).filter(Boolean);
      if (types.length > 0) {
        filters.push({ productType: { $in: types } });
      }
    } else {
      filters.push({ productType: { $regex: `^${escapeRegex(productType)}$`, $options: "i" } });
    }
  }

  if (q) {
    const searchRegex = { $regex: escapeRegex(q), $options: "i" };
    filters.push({
      $or: [
        { title: searchRegex },
        { tags: searchRegex },
        { productType: searchRegex },
        { category: searchRegex },
        { collectionHandle: searchRegex },
        { "collections.category": searchRegex },
        { "collections.collectionHandle": searchRegex },
      ],
    });
  }

  if (available) {
    filters.push({ variants: { $elemMatch: { available: true } } });
  }

  if (categories.length > 0) {
    const categoryRegexes = categories.map((value) => new RegExp(`^${escapeRegex(value)}s?$`, "i"));
    filters.push({
      $or: [
        { productType: { $in: categoryRegexes } },
        { category: { $in: categoryRegexes } },
        { "collections.category": { $in: categoryRegexes } },
      ],
    });
  }

  const addVariantOptionFilter = (values, exact = false) => {
    if (values.length === 0) return;
    const regexes = values.map((value) => new RegExp(exact ? `^${escapeRegex(value)}$` : escapeRegex(value), "i"));
    filters.push({
      $or: [
        { "variants.option1": { $in: regexes } },
        { "variants.option2": { $in: regexes } },
        { "variants.option3": { $in: regexes } },
        { tags: { $in: regexes } },
      ],
    });
  };

  addVariantOptionFilter(materials);
  addVariantOptionFilter(stones);
  addVariantOptionFilter(colors);
  addVariantOptionFilter(sizes, true);
  addVariantOptionFilter(lengths, true);

  if (sales.length > 0) {
    filters.push({
      $expr: {
        $anyElementTrue: {
          $map: {
            input: "$variants",
            as: "variant",
            in: {
              $cond: [
                { $gt: ["$$variant.compareAtPrice", 0] },
                {
                  $in: [
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: [{ $subtract: ["$$variant.compareAtPrice", "$$variant.price"] }, "$$variant.compareAtPrice"] },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                    sales,
                  ],
                },
                false,
              ],
            },
          },
        },
      },
    });
  }

  let filter = filters.length > 0 ? { $and: filters } : {};
  const skip = (page - 1) * limit;

  const sortOptions = {
    "new-arrivals": { publishedAt: -1, createdAt: -1, _id: -1 },
    "price-high-low": { "variants.0.price": -1, _id: -1 },
    "price-low-high": { "variants.0.price": 1, _id: 1 },
    "top-match": { categoryOrder: 1, createdAt: -1, _id: -1 },
  };
  const sortOrder = sortOptions[sort] || sortOptions["top-match"];

  let [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  // Some older imports only persisted the parent `rings` collection and omitted
  // subtype memberships. Prefer the exact collection above, then derive these
  // well-known ring collections from fields that are present in every import.
  if (collectionHandle && totalProducts === 0) {
    const ringsCollection = {
      $or: [
        { collectionHandle: /^rings$/i },
        { "collections.collectionHandle": /^rings$/i },
      ],
    };
    const allGiftsCollection = {
      $or: [
        { collectionHandle: /^all-gifts$/i },
        { "collections.collectionHandle": /^all-gifts$/i },
      ],
    };
    const searchableFields = (value) => {
      const regex = new RegExp(escapeRegex(value), "i");
      return {
        $or: [
          { title: regex },
          { handle: regex },
          { tags: regex },
          { productType: regex },
        ],
      };
    };
    const fallbackFilters = {
      "best-selling-rings": { $and: [ringsCollection, searchableFields("best seller")] },
      "statement-rings": { productType: /^statement$/i },
      "wedding-bands": { $and: [ringsCollection, searchableFields("wedding")] },
      "mens-rings": {
        $and: [
          ringsCollection,
          {
            $or: [
              { collectionHandle: /^mens$/i },
              { "collections.collectionHandle": /^mens$/i },
            ],
          },
        ],
      },
      "bundles-sets": {
        title: { $regex: "\\b(?:bundle|set)\\b", $options: "i" },
      },
      "jewelry-gifts-under-500": {
        $and: [
          allGiftsCollection,
          { variants: { $elemMatch: { price: { $lte: 500 } } } },
        ],
      },
      "luxury-gifts": {
        $and: [
          allGiftsCollection,
          { variants: { $elemMatch: { price: { $gte: 500 } } } },
        ],
      },
      puzzle: searchableFields("puzzle"),
    };
    const fallbackFilter = fallbackFilters[collectionHandle.toLowerCase()];

    if (fallbackFilter) {
      filter = fallbackFilter;
      [products, totalProducts] = await Promise.all([
        Product.find(filter)
          .sort(sortOrder)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter),
      ]);
    }
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return Response.json({
    message: "Products fetched successfully",
    page,
    limit,
    totalProducts,
    totalPages,
    hasMore: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    products,
  });
}
