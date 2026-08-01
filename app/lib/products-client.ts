import type { Product } from "@/components/ProductCard";

export interface ProductVariant {
  shopifyVariantId: number;
  title: string;
  sku: string;
  price: number;
  available: boolean;
  option1: string;
  option2: string | null;
  option3: string | null;
  grams: number;
  compareAtPrice: number | null;
}

export interface ProductImage {
  shopifyImageId: number;
  src: string;
  width: number;
  height: number;
  position: number;
}

export interface MongoProduct {
  _id: string;
  shopifyProductId: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  publishedAt: string;
  createdAt: string;
}

export interface ProductsResponse {
  products: MongoProduct[];
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasMore: boolean;
  nextPage: number | null;
}

export function getMaterialColor(material: string) {
  const lowerMaterial = material.toLowerCase();
  if (lowerMaterial.includes("gold") || lowerMaterial.includes("vermeil")) return "#d7b36a";
  if (lowerMaterial.includes("silver")) return "#c0c0c0";
  if (lowerMaterial.includes("rose")) return "#b76e79";
  return "#d7b36a";
}

export function transformMongoProduct(product: MongoProduct): Product {
  const uniqueMaterials = [...new Set(product.variants.map((variant) => variant.option1))].filter(Boolean);

  if (uniqueMaterials.length > 1 && product.images.length >= uniqueMaterials.length * 2) {
    const imagesPerVariant = Math.floor(product.images.length / uniqueMaterials.length);

    const colorVariations = uniqueMaterials.map((material: string, index: number) => {
      const startIdx = index * imagesPerVariant;
      const variantImages = product.images.slice(startIdx, startIdx + imagesPerVariant);
      const variant = product.variants.find((item) => item.option1 === material);

      return {
        color: getMaterialColor(material),
        material,
        image: variantImages[0]?.src || product.images[0]?.src || "https://via.placeholder.com/400",
        imageHover: variantImages[2]?.src || variantImages[1]?.src || variantImages[0]?.src || product.images[0]?.src || "https://via.placeholder.com/400",
        price: variant?.price || product.variants[0]?.price || 0,
      };
    });

    return {
      badge: product.tags.some((tag: string) => tag.toLowerCase().includes("new")) ? "NEW" : "",
      name: product.title.toUpperCase(),
      price: `$${colorVariations[0].price}`,
      material: colorVariations[0].material,
      colors: colorVariations.map((variation) => variation.color),
      image: colorVariations[0].image,
      imageHover: colorVariations[0].imageHover,
      handle: product.handle,
      colorVariations,
    };
  }

  const mainImage = product.images[0]?.src || "https://via.placeholder.com/400";
  const hoverImage = product.images[2]?.src || product.images[1]?.src || mainImage;
  const price = product.variants[0]?.price || 0;
  const material = product.variants[0]?.option1 || "";

  return {
    badge: product.tags.some((tag: string) => tag.toLowerCase().includes("new")) ? "NEW" : "",
    name: product.title.toUpperCase(),
    price: `$${price}`,
    material,
    colors: [getMaterialColor(material)],
    image: mainImage,
    imageHover: hoverImage,
    handle: product.handle,
  };
}

export function transformMongoProducts(products: MongoProduct[]): Product[] {
  return products.map(transformMongoProduct);
}

export async function fetchProductsPage(params: URLSearchParams, signal?: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(`/api/products?${params.toString()}`, {
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return {
    products: Array.isArray(data.products) ? data.products : [],
    page: data.page || 1,
    limit: data.limit || 100,
    totalProducts: data.totalProducts || 0,
    totalPages: data.totalPages || 0,
    hasMore: Boolean(data.hasMore),
    nextPage: data.nextPage ?? null,
  };
}
