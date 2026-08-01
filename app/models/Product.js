// import mongoose from "mongoose";

// const VariantSchema = new mongoose.Schema(
//   {
//     shopifyVariantId: Number,
//     title: String,
//     sku: String,
//     price: Number,
//     available: Boolean,
//     option1: String,
//     option2: String,
//     option3: String,
//     grams: Number,
//     compareAtPrice: Number,
//   },
//   { _id: false }
// );

// const ImageSchema = new mongoose.Schema(
//   {
//     shopifyImageId: Number,
//     src: String,
//     width: Number,
//     height: Number,
//     position: Number,
//   },
//   { _id: false }
// );

// const OptionSchema = new mongoose.Schema(
//   {
//     name: String,
//     position: Number,
//     values: [String],
//   },
//   { _id: false }
// );

// const ProductSchema = new mongoose.Schema(
//   {
//     shopifyProductId: { type: Number, unique: true },
//     title: String,
//     handle: String,
//     description: String,
//     vendor: String,
//     productType: String,
//     tags: [String],
//     publishedAt: Date,
//     createdAtShopify: Date,
//     updatedAtShopify: Date,

//     variants: [VariantSchema],
//     images: [ImageSchema],
//     options: [OptionSchema],

//     source: {
//       type: String,
//       default: "mejuri",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Product ||
//   mongoose.model("Product", ProductSchema);


import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    shopifyVariantId: Number,
    title: String,
    sku: String,
    price: Number,
    available: Boolean,
    option1: String,
    option2: String,
    option3: String,
    grams: Number,
    compareAtPrice: Number,
  },
  { _id: true }
);

const ImageSchema = new mongoose.Schema(
  {
    shopifyImageId: Number,
    src: String,
    width: Number,
    height: Number,
    position: Number,
  },
  { _id: false }
);

const OptionSchema = new mongoose.Schema(
  {
    name: String,
    position: Number,
    values: [String],
  },
  { _id: false }
);

const CollectionSchema = new mongoose.Schema(
  {
    navItem: { type: String, trim: true },
    category: { type: String, trim: true },
    collectionHandle: { type: String, trim: true },
    categoryOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    shopifyProductId: Number,
    title: String,
    handle: String,
    description: String,
    vendor: String,
    productType: String,
    tags: [String],
    publishedAt: Date,
    createdAtShopify: Date,
    updatedAtShopify: Date,

navItem: { type: String, trim: true },
category: { type: String, trim: true },
collectionHandle: { type: String, trim: true },
categoryOrder: { type: Number, default: 0 },
collections: [CollectionSchema],



    variants: [VariantSchema],
    images: [ImageSchema],
    options: [OptionSchema],

    source: {
      type: String,
      default: "mejuri",
    },
  },
  { timestamps: true }
);

ProductSchema.index(
  { shopifyProductId: 1 },
  {
    unique: true,
    partialFilterExpression: { shopifyProductId: { $type: "number" } },
  }
);
ProductSchema.index(
  { handle: 1 },
  {
    unique: true,
    partialFilterExpression: { handle: { $type: "string", $gt: "" } },
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
