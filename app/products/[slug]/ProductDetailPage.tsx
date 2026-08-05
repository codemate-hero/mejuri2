"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import AddToCartDrawer from "@/components/AddToCartDrawer";
import { ProductCard, type Product as ProductCardItem } from "@/components/ProductCard";
import ProductImageSwiper from '@/components/ProductImageSwiper';
import { hasAuthenticatedUserToken, requestSignin } from "@/app/lib/clientAuth";

interface Product {
  _id: string;
  shopifyProductId?: number;
  variantId: number;
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  category?: string;
  collectionHandle?: string;
  description?: string;
  tags: string[];
  variants?: {
    shopifyVariantId?: number;
    id?: number;
    title?: string;
    sku?: string;
    price?: number | string;
    available?: boolean;
    option1?: string;
    option2?: string;
    option3?: string;
  }[];
  images: Array<{
    src: string;
    width: number;
    height: number;
  }>;
  options: Array<{
    name: string;
    position?: number;
    values: string[];
  }>;
  body_html?: string;
}

interface WishlistProduct {
  productId: {
    _id: string;
  } | null;
  variantId: string | number;
}

const getProductVariantId = (item: Product) =>
  item.variants?.[0]?.shopifyVariantId ||
  item.variants?.[0]?.id ||
  item.shopifyProductId ||
  item.variantId;

const getProductCacheKey = (slug: string) => `mejuri-product:${slug}`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const cleanOptionValues = (values?: string[]) =>
  (values || []).filter((value) => value && value !== "Default Title" && value.toLowerCase() !== "none");

const getSwatchOption = (item: Product) => {
  const options = item.options || [];

  return (
    options.find((opt) => {
      const name = opt.name.toLowerCase();
      return (name.includes("stone") || name.includes("color")) && cleanOptionValues(opt.values).length > 1;
    }) ||
    options.find((opt) => opt.name.toLowerCase().includes("material") && cleanOptionValues(opt.values).length > 1) ||
    options.find((opt) => {
      const name = opt.name.toLowerCase();
      return !name.includes("size") && !name.includes("length") && cleanOptionValues(opt.values).length > 1;
    }) ||
    options.find((opt) => {
      const name = opt.name.toLowerCase();
      return (name.includes("stone") || name.includes("color") || name.includes("material")) && cleanOptionValues(opt.values).length > 0;
    })
  );
};

const getVariantOptionValue = (item: Product, optionName?: string) => {
  const option = optionName
    ? item.options?.find((opt) => opt.name === optionName)
    : getSwatchOption(item);
  const optionIndex = item.options?.findIndex((opt) => opt.name === option?.name) ?? -1;
  const optionPosition = option?.position || (optionIndex >= 0 ? optionIndex + 1 : 1);
  const optionKey = `option${optionPosition}` as "option1" | "option2" | "option3";
  const variant = item.variants?.find((entry) => {
    const value = entry[optionKey] || entry.title;
    return value && value !== "Default Title";
  });

  return variant?.[optionKey] || "";
};

const getMaterialOptionValue = (item: Product) => {
  const swatchOption = getSwatchOption(item);
  const values = cleanOptionValues(swatchOption?.values);

  return values[0] || getVariantOptionValue(item, swatchOption?.name) || "";
};

const readCachedProduct = (slug: string) => {
  if (typeof window === "undefined" || !slug) return null;

  try {
    const cached = window.sessionStorage.getItem(getProductCacheKey(slug));
    return cached ? (JSON.parse(cached) as Product) : null;
  } catch {
    return null;
  }
};

const writeCachedProduct = (slug: string, item: Product) => {
  try {
    window.sessionStorage.setItem(getProductCacheKey(slug), JSON.stringify(item));
  } catch {
    // Session storage is only a back-navigation fallback.
  }
};

const stripHtml = (value?: string) =>
  value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";

const HypoallergenicIcon = () => (
  <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" role="graphics-symbol" viewBox="0 0 24 24" fill="none">
    <path d="M10.2553 17.4568H11.1785V10.9001L9.36305 7.27206L8.5438 7.69631L10.2553 11.1001V17.4568ZM12.8323 17.4568H13.7553V11.1001L15.4668 7.69631L14.6475 7.27206L12.8323 10.9001V17.4568ZM15.9785 12.4876L17.5053 9.46556L16.6735 9.04131L15.1593 12.0923L15.9785 12.4876ZM8.00055 12.4683L8.8323 12.0538L7.3053 9.02206L6.48605 9.42706L8.00055 12.4683ZM12.005 20.8463C10.7819 20.8463 9.63138 20.6139 8.55355 20.1491C7.47571 19.6842 6.53813 19.0535 5.7408 18.2568C4.94346 17.46 4.31305 16.5242 3.84955 15.4496C3.38605 14.3749 3.1543 13.2266 3.1543 12.0046C3.1543 10.7814 3.38671 9.63089 3.85155 8.55306C4.31638 7.47522 4.94713 6.53764 5.7438 5.74031C6.54063 4.94297 7.47638 4.31256 8.55105 3.84906C9.62571 3.38556 10.774 3.15381 11.996 3.15381C13.2192 3.15381 14.3697 3.38622 15.4475 3.85106C16.5254 4.31589 17.463 4.94664 18.2603 5.74331C19.0576 6.53997 19.688 7.47573 20.1515 8.55056C20.615 9.62523 20.8468 10.7736 20.8468 11.9956C20.8468 13.2187 20.6144 14.3692 20.1495 15.4471C19.6847 16.5249 19.054 17.4625 18.2573 18.2598C17.4606 19.0571 16.5249 19.6876 15.45 20.1511C14.3754 20.6146 13.227 20.8463 12.005 20.8463ZM11.9998 19.9231C14.2048 19.9231 16.0767 19.1539 17.6155 17.6156C19.1542 16.0772 19.9235 14.2056 19.9235 12.0008C19.9235 9.79581 19.1544 7.92389 17.616 6.38506C16.0777 4.84639 14.2061 4.07706 12.0013 4.07706C9.7963 4.07706 7.92438 4.84622 6.38555 6.38456C4.84688 7.92289 4.07755 9.79447 4.07755 11.9993C4.07755 14.2043 4.84671 16.0762 6.38505 17.6151C7.92338 19.1537 9.79496 19.9231 11.9998 19.9231Z" fill="currentColor" />
  </svg>
);

const PlatingIcon = () => (
  <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" role="graphics-symbol" viewBox="0 0 24 24" fill="none">
    <path d="M11.6923 4.8463V2.46155H12.6923V4.8463H11.6923ZM18.5078 7.4538L17.8 6.7463L19.2923 5.2538L20 5.96155L18.5078 7.4538ZM5.87679 7.4538L4.38454 5.96155L5.09229 5.2538L6.58454 6.7463L5.87679 7.4538Z" fill="currentColor" />
    <path d="M21.1333 14.0598L22 19H12L12.9245 14L21.1333 14.0598ZM13 18H21L20.432 15.0513L13.5 15L13 18Z" fill="currentColor" />
    <path d="M16.1333 10.0598L17 15H7L7.92448 10L16.1333 10.0598ZM8 14H16L15.432 11.0513L8.5 11L8 14Z" fill="currentColor" />
    <path d="M11.1333 14.0598L12 19H2L2.92448 14L11.1333 14.0598ZM3 18H11L10.432 15.0513L3.5 15L3 18Z" fill="currentColor" />
  </svg>
);

const RecycledIcon = () => (
  <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" role="graphics-symbol" viewBox="0 0 24 24" fill="none">
    <path d="M9.33916 20.574C7.51282 20.0105 6.01024 18.9511 4.83141 17.3958C3.65257 15.8403 3.06316 14.0526 3.06316 12.0328C3.06316 11.4994 3.10899 10.9687 3.20066 10.4405C3.29232 9.91218 3.43816 9.39801 3.63816 8.89801L1.41016 10.1808L0.972656 9.38551L4.78916 7.17876L7.00541 10.9895L6.20441 11.475L4.68241 8.84426C4.45041 9.35126 4.27957 9.87451 4.16991 10.414C4.06024 10.9533 4.00541 11.4993 4.00541 12.052C4.00541 13.891 4.55332 15.5155 5.64916 16.9255C6.74499 18.3355 8.13682 19.2773 9.82466 19.751L9.33916 20.574ZM15.2554 7.99626V7.07301H18.2767C17.5163 6.10068 16.5884 5.35118 15.4929 4.82451C14.3974 4.29784 13.2333 4.03451 12.0007 4.03451C10.9205 4.03451 9.91057 4.23201 8.97091 4.62701C8.03107 5.02184 7.20249 5.56476 6.48516 6.25576L5.99691 5.41626C6.79357 4.70343 7.70091 4.14109 8.71891 3.72926C9.73691 3.31743 10.8244 3.11151 11.9814 3.11151C13.2956 3.11151 14.5381 3.37851 15.7089 3.91251C16.8797 4.44651 17.8952 5.21193 18.7554 6.20876V3.57301H19.6787V7.99626H15.2554ZM15.3352 22.8845L11.5189 20.649L13.7257 16.8578L14.5209 17.3145L12.9459 20.0068C14.9477 19.7676 16.6248 18.8945 17.9772 17.3875C19.3293 15.8805 20.0054 14.1052 20.0054 12.0615C20.0054 11.693 19.9795 11.3291 19.9277 10.9698C19.8757 10.6104 19.801 10.2603 19.7037 9.91926H20.6709C20.7536 10.2603 20.8172 10.6051 20.8617 10.9538C20.9063 11.3026 20.9287 11.6613 20.9287 12.0298C20.9287 14.2131 20.2372 16.1303 18.8544 17.7813C17.4717 19.4323 15.7195 20.4468 13.5977 20.825L15.8017 22.0895L15.3352 22.8845Z" fill="currentColor" />
  </svg>
);

const isSilverMaterial = (material: string) => {
  const value = material.toLowerCase();
  return value.includes("silver") || value.includes("white gold") || value.includes("platinum");
};

const normalizeOptionToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/lab grown/g, "")
    .replace(/natural/g, "")
    .replace(/[^a-z0-9]+/g, "");

const getOptionImageTokens = (value: string) => {
  const normalized = normalizeOptionToken(value);
  const lower = value.toLowerCase();
  const tokens = new Set([normalized]);

  if (lower.includes("rhodolite") || lower.includes("garnet") || lower.includes("ruby")) {
    tokens.add("red");
  }
  if (lower.includes("black spinel") || lower.includes("black")) {
    tokens.add("black");
  }
  if (lower.includes("green agate") || lower.includes("aventurine") || lower.includes("emerald") || lower.includes("tsavorite")) {
    tokens.add("green");
  }
  if (lower.includes("london blue topaz")) {
    tokens.add("lbt");
    tokens.add("blue");
  }
  if (lower.includes("blue sapphire") || lower.includes("sodalite") || lower.includes("aquamarine")) {
    tokens.add("blue");
  }
  if (lower.includes("white topaz") || lower.includes("white sapphire") || lower.includes("diamond")) {
    tokens.add("white");
  }
  if (lower.includes("peridot")) {
    tokens.add("peridot");
  }

  return Array.from(tokens).filter(Boolean);
};

const imageIncludesOption = (src: string, value: string) => {
  const imageToken = normalizeOptionToken(src);
  return getOptionImageTokens(value).some((token) => imageToken.includes(token));
};

const matchesImageMaterial = (src: string, material: string) => {
  const imageName = src.toLowerCase();
  const selected = material.toLowerCase();

  if (imageIncludesOption(src, material)) {
    return true;
  }

  if (isSilverMaterial(selected)) {
    return (
      imageName.includes("_ss_") ||
      imageName.includes("-ss-") ||
      imageName.includes("silver") ||
      imageName.includes("_wg_") ||
      imageName.includes("-wg-") ||
      imageName.includes("whitegold") ||
      imageName.includes("white-gold")
    );
  }

  if (selected.includes("salmon")) {
    return imageName.includes("salmongold") || imageName.includes("_yg_") || imageName.includes("-yg-");
  }

  if (selected.includes("vermeil")) {
    return (
      imageName.includes("_v_") ||
      imageName.includes("-v-") ||
      imageName.includes("_v.") ||
      imageName.includes("vermeil")
    );
  }

  if (selected.includes("yellow") || selected.includes("gold")) {
    return (
      imageName.includes("_yg_") ||
      imageName.includes("-yg-") ||
      imageName.includes("yellow") ||
      imageName.includes("salmongold")
    );
  }

  return false;
};

export default function ProductDetailPage(props: any) {
  const { productId } = props;
  const params = useParams();
  const slug = params.slug as string;

  // ✅ ALL useState hooks - called in the same order every render
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(() => readCachedProduct(slug));
  const [loading, setLoading] = useState(() => !readCachedProduct(slug));
  const [selectedMaterial, setSelectedMaterial] = useState<string>(() => {
    const cachedProduct = readCachedProduct(slug);
    return cachedProduct ? getMaterialOptionValue(cachedProduct) : "";
  });
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState<string>("");
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardItem[]>([]);
  const [relatedDrawerProduct, setRelatedDrawerProduct] = useState<ProductCardItem | null>(null);
  const [relatedScrollProgress, setRelatedScrollProgress] = useState(0);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // ✅ ALL useRef hooks
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  // ✅ ALL useEffect hooks - in the same order every render
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let ignore = false;

    const applyProduct = (item: Product) => {
      setProduct(item);
      writeCachedProduct(slug, item);
      setSelectedMaterial(getMaterialOptionValue(item));
      setSelectedSize("");
      setSizeError("");
    };

    async function fetchProduct() {
      const cachedProduct = readCachedProduct(slug);
      if (cachedProduct) {
        applyProduct(cachedProduct);
        setLoading(false);
      } else {
        setProduct(null);
        setLoading(true);
      }

      try {
        if (!localStorage.getItem("token")) {
          const UserTokenResponse = await fetch(`/api/users`, {
            signal: controller.signal,
            cache: "no-store",
          });
          const tokenData = await UserTokenResponse.json();
          localStorage.setItem("token", tokenData.token);
        }

        const response = await fetch(`/api/products?handle=${encodeURIComponent(slug)}&limit=1`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json();
        const foundProduct = data.products?.[0] as Product | undefined;

        if (!ignore && foundProduct) {
          applyProduct(foundProduct);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching product:", error);
        } else if (!ignore && cachedProduct) {
          applyProduct(cachedProduct);
        }
      } finally {
        window.clearTimeout(timeout);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      setCartOpen(false);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setIsMegaMenuOpen(false);

      const cachedProduct = readCachedProduct(slug);
      if (cachedProduct) {
        setProduct(cachedProduct);
        setSelectedMaterial(getMaterialOptionValue(cachedProduct));
        setLoading(false);
        return;
      }

      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [slug]);

  useEffect(() => {
    async function checkWishlist() {
      if (!product) return;
      if (!hasAuthenticatedUserToken(localStorage.getItem("token"))) {
        setIsInWishlist(false);
        return;
      }

      try {
        const response = await fetch("/api/wishlist", {
          headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (data.success) {
          const wishlistProducts = (data.data.products || []) as WishlistProduct[];
          const productInWishlist = wishlistProducts.some(
            (item) =>
              item.productId?._id === product._id &&
              String(item.variantId) === String(getProductVariantId(product))
          );
          setIsInWishlist(productInWishlist);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }

    checkWishlist();
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHidePromoBar(true);
      } else {
        setHidePromoBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!product) return;

    const currentProduct = product;
    let ignore = false;
    const controller = new AbortController();

    async function fetchRelatedProducts() {
      const params = new URLSearchParams({ limit: "12" });
      if (currentProduct.collectionHandle && currentProduct.collectionHandle !== "shop-all") {
        params.set("collectionHandle", currentProduct.collectionHandle);
      } else if (currentProduct.category && currentProduct.category.toLowerCase() !== "shop all") {
        params.set("category", currentProduct.category);
      } else if (currentProduct.productType) {
        params.set("productType", currentProduct.productType);
      }

      try {
        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json();
        let items = ((data.products || []) as Product[]).filter((item) => item.handle !== currentProduct.handle);

        if (items.length < 4) {
          const fallbackResponse = await fetch("/api/products?limit=12", {
            signal: controller.signal,
            cache: "no-store",
          });
          const fallbackData = await fallbackResponse.json();
          const fallbackItems = ((fallbackData.products || []) as Product[]).filter((item) => item.handle !== currentProduct.handle);
          const seenHandles = new Set(items.map((item) => item.handle));
          items = [
            ...items,
            ...fallbackItems.filter((item) => {
              if (seenHandles.has(item.handle)) return false;
              seenHandles.add(item.handle);
              return true;
            }),
          ];
        }

        if (!ignore) {
          setRelatedProducts(items.slice(0, 8).map(toProductCardItem));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching related products:", error);
        }
      }
    }

    fetchRelatedProducts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [product]);

  useEffect(() => {
    const container = relatedScrollRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollWidth = container.scrollWidth - container.clientWidth;
      setRelatedScrollProgress(scrollWidth > 0 ? (container.scrollLeft / scrollWidth) * 100 : 0);
    };

    container.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => container.removeEventListener("scroll", updateProgress);
  }, [relatedProducts]);

  // ✅ Helper functions (not hooks)
  const getMaterialColor = (material: string) => {
    const value = material.toLowerCase();

    if (value.includes("rhodolite")) {
      return "#8b1f48";
    }
    if (value.includes("tsavorite") || value.includes("emerald") || value.includes("aventurine") || value.includes("green")) {
      return "#0f8f5f";
    }
    if (value.includes("blue sapphire") || value.includes("sapphire") || value.includes("topaz") || value.includes("aquamarine") || value.includes("sodalite")) {
      return "#1d5f9f";
    }
    if (value.includes("turquoise")) {
      return "#32b8b2";
    }
    if (value.includes("garnet") || value.includes("ruby")) {
      return "#7b1230";
    }
    if (value.includes("amethyst")) {
      return "#7b4aa0";
    }
    if (value.includes("citrine") || value.includes("honey")) {
      return "#d4a437";
    }
    if (value.includes("peridot")) {
      return "#9ab94e";
    }
    if (value.includes("pearl") || value.includes("opal") || value.includes("white sapphire") || value.includes("diamond")) {
      return "#e8e5dc";
    }
    if (value.includes("black") || value.includes("onyx") || value.includes("agate")) {
      return "#1f1f1f";
    }
    if (value.includes('gold') && value.includes('yellow')) {
      return '#d7b36a';
    }
    if (value.includes('silver') || value.includes('white')) {
      return '#c0c0c0';
    }
    if (value.includes('rose')) {
      return '#b76e79';
    }
    return '#d7b36a';
  };

  const formatImageUrl = (src?: string) =>
    (src || "/products/product-1.webp").replace(/width=\d+/g, "width=600");

  const toProductCardItem = (item: Product): ProductCardItem => {
    const swatchValues = cleanOptionValues(getSwatchOption(item)?.values);
    const material = getMaterialOptionValue(item) || item.variants?.[0]?.title || item.productType || "Fine Jewelry";
    const itemPrice = Number(item.variants?.[0]?.price || 98);
    const colors = swatchValues.length > 0
      ? swatchValues.map((value) => getMaterialColor(value))
      : [getMaterialColor(material)];
    const firstImage = formatImageUrl(item.images?.[0]?.src);
    const secondImage = formatImageUrl(item.images?.[1]?.src || item.images?.[0]?.src);

    return {
      badge: "",
      name: item.title.toUpperCase(),
      price: `$${itemPrice}`,
      material,
      colors,
      image: firstImage,
      imageHover: secondImage,
      handle: item.handle,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomedImageIndex === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!hasAuthenticatedUserToken(localStorage.getItem("token"))) {
      requestSignin();
      return;
    }

    setWishlistLoading(true);

    try {
      const variantId = getProductVariantId(product);

      if (!variantId) {
        console.error("Variant ID not found");
        return;
      }

      if (isInWishlist) {
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            productId: product._id,
            variantId: variantId,
          }),
        });

        if (response.ok) {
          setIsInWishlist(false);
        }
      } else {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            productId: product._id,
            variantId: variantId,
          }),
        });

        if (response.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (sizeValues.length > 0 && !selectedSize) {
      setSizeError("Please select a size before adding this item to your bag.");
      return;
    }

    setSizeError("");

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productId: product._id,
          variantId: getProductVariantId(product),
          quantity: 1,
          size: selectedSize,
        }),
      });

      const data = await response.json();

      console.log("Cart response:", data);

      if (response.ok) {
        window.dispatchEvent(new Event("mejuri-cart-updated"));
        setRelatedDrawerProduct(null);
        setCartOpen(true);
      }
    } catch (error) {
      console.log("Add to cart error:", error);
    }
  };

  const scrollRelatedProducts = (direction: "left" | "right") => {
    const container = relatedScrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -container.clientWidth * 0.8 : container.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;

  // ✅ Conditional returns AFTER all hooks have been called
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PromoBar isScrolled={hidePromoBar} hideForSidebar={hideForSidebar} />
        <Navbar
          isScrolled={false}
          hidePromoBar={hidePromoBar}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMegaMenuOpen={isMegaMenuOpen}
          setIsMegaMenuOpen={setIsMegaMenuOpen}
          onSearchClick={() => setIsSearchOpen(true)}
          variant="light"
        />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-black">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <PromoBar isScrolled={hidePromoBar} hideForSidebar={hideForSidebar} />
        <Navbar
          isScrolled={false}
          hidePromoBar={hidePromoBar}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMegaMenuOpen={isMegaMenuOpen}
          setIsMegaMenuOpen={setIsMegaMenuOpen}
          onSearchClick={() => setIsSearchOpen(true)}
          variant="light"
        />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-black">Product not found</p>
        </div>
      </div>
    );
  }

  // ✅ Product computations - safe to use product here since it's guaranteed to exist
  const swatchOption = getSwatchOption(product);
  const swatchOptionIndex = product.options.findIndex((opt) => opt.name === swatchOption?.name);
  const swatchOptionPosition = swatchOption?.position || (swatchOptionIndex >= 0 ? swatchOptionIndex + 1 : 1);
  const swatchOptionKey = `option${swatchOptionPosition}` as "option1" | "option2" | "option3";
  const optionValues = cleanOptionValues(swatchOption?.values);
  const variantMaterials = Array.from(
    new Set(
      (product.variants || [])
        .map((variant) => variant[swatchOptionKey] || variant.title)
        .filter((value): value is string => Boolean(value && value !== "Default Title"))
    )
  );
  const productMaterials = optionValues.length > 0 ? optionValues : variantMaterials;
  const visibleMaterials = (() => {
    if (productMaterials.length !== 1) return productMaterials;

    const onlyMaterial = productMaterials[0];
    const lowerMaterial = onlyMaterial.toLowerCase();

    if (lowerMaterial.includes("gold") && !lowerMaterial.includes("silver")) {
      return ["Sterling Silver", onlyMaterial];
    }

    if (lowerMaterial.includes("silver") && !lowerMaterial.includes("gold")) {
      return [onlyMaterial, "18k Gold Vermeil"];
    }

    return productMaterials;
  })();
  const displayedMaterial = selectedMaterial || visibleMaterials[0] || "";
  const sizeOption = product.options?.find((opt) =>
    opt.name.toLowerCase().includes("size")
  );
  const sizeValues = cleanOptionValues(sizeOption?.values);
  const selectedImages = product.images.filter((image) =>
    matchesImageMaterial(image.src, displayedMaterial)
  );
  const otherMaterials = visibleMaterials.filter((material) => material !== displayedMaterial);
  const neutralImages = product.images.filter(
    (image) =>
      !selectedImages.some((selectedImage) => selectedImage.src === image.src) &&
      !otherMaterials.some((material) => imageIncludesOption(image.src, material))
  );
  const materialImages = selectedImages.length > 0 ? [...selectedImages, ...neutralImages] : [];
  const displayedImages = materialImages.length > 0 ? materialImages : product.images;
  const price = Number(product.variants?.[0]?.price || 98);
  const productDescription =
    stripHtml(product.body_html) ||
    stripHtml(product.description) ||
    "Go big or go back to shore. These spiral-shaped statement studs in vermeil or silver are designed to be noticed-and to require absolutely no effort on your part. Wear both. Wear one. Either way, you look amazing. Limited Edition.";

  return (
    <div className="min-h-screen bg-white">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={hideForSidebar} />
      <Navbar
        isScrolled={false}
        hidePromoBar={hidePromoBar}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMegaMenuOpen={isMegaMenuOpen}
        setIsMegaMenuOpen={setIsMegaMenuOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        variant="light"
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-[1920px] bg-white px-10 pb-4 lg:pt-[134px] pt-[67px]">
        <div className="flex items-center gap-3 font-display text-[14px] leading-none text-[#5f5f55]">
          <Link href="/collections/shop-all" className="hover:underline">Shop All</Link>
          <span>/</span>
          <Link href="/collections/earrings" className="hover:underline">Earrings</Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="mx-auto max-w-[1920px] px-0 sm:pt-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-[49%_51%]">
          <ProductImageSwiper productTitle={product.title} images={displayedImages} />
          {/* Left - Scrollable Images */}
          <div className="space-y-0 md:block hidden">
            {displayedImages.map((image, index) => (
              <div
                key={index}
                className={`relative lg:min-h-[700px] overflow-hidden lg:h-[calc(100vh-118px)] ${zoomedImageIndex === index ? 'cursor-zoom-out-custom' : 'cursor-zoom-in-custom'
                  }`}
                onMouseMove={handleMouseMove}
                onClick={() => {
                  if (zoomedImageIndex === index) {
                    setZoomedImageIndex(null);
                  } else {
                    setZoomedImageIndex(index);
                  }
                }}
              >
                <img
                  src={image.src}
                  alt={`${product.title} ${index + 1}`}
                  className={`h-full w-full transition-transform duration-200 ${index === 0 ? "object-fill" : "object-cover"} ${zoomedImageIndex === index ? 'scale-150' : 'scale-100'
                    }`}
                  style={
                    zoomedImageIndex === index
                      ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          {/* Right - Product Info (Sticky) */}
          <div className="md:px-10 px-4 pt-10 sticky top-[118px] h-fit">
            <div className="mx-auto w-full max-w-[482px] lg:ml-[18%] lg:mr-auto">
              {/* Title and Rating */}
              <div className="md:mb-[52px] mb-[32px]">
                <div className="mb-6 flex items-start justify-between gap-8">
                  <h1 className="max-w-[370px] font-display text-[1.25rem] font-semibold uppercase leading-[28px] tracking-[-0.02em] text-black">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-1 pt-1">
                    <span className="font-display text-[14px] font-bold leading-none text-black underline underline-offset-2">0.0</span>
                    <span className="font-display text-[15px] leading-none text-[#5f5f55]">&#9733;</span>
                  </div>
                </div>
                <span className="font-display font-medium text-[0.9rem] leading-none tracking-[0.02em] text-black">${price}</span>
              </div>

              {/* Material Selection */}
              {visibleMaterials.length > 0 && (
                <div className="mb-[48px]">
                  <p className="mb-5 font-display text-[16px] font-medium leading-none text-black">{displayedMaterial}</p>
                  <div className="flex items-end gap-3">
                    {visibleMaterials.map((material, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedMaterial(material);
                          setZoomedImageIndex(null);
                        }}
                        className="relative h-[14px] w-[14px] shrink-0 cursor-pointer transition-all"
                        style={{ backgroundColor: getMaterialColor(material) }}
                        title={material}
                      >
                        {displayedMaterial === material && (
                          <span className="absolute -bottom-[6px] left-0 right-0 h-px bg-black" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizeValues.length > 0 && (
                <div className="mb-[72px]">
                  <div className="mb-6 flex items-center justify-between">
                    <p className="font-display text-[12px] leading-none text-black">
                      Size
                    </p>
                    <button
                      type="button"
                      className="font-display text-[12px] font-medium uppercase text-black underline underline-offset-2"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex items-center gap-10">
                    {sizeValues.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError("");
                        }}
                        aria-pressed={selectedSize === size}
                        className={`relative font-display cursor-pointer text-[12px] leading-none text-black transition ${selectedSize === size ? "font-bold" : "font-normal"
                          }`}
                      >
                        {size}
                        {selectedSize === size && (
                          <span className="absolute -bottom-[8px] left-0 right-0 h-px bg-black" />
                        )}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="mt-4 font-display text-[12px] leading-none text-red-600">
                      {sizeError}
                    </p>
                  )}
                </div>
              )}

              {/* Add to Bag */}
              <div className="mt-[48px] mb-[84px] flex w-full">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="relative flex w-88 cursor-pointer items-center justify-center border border-black bg-black px-[1.5rem] py-[0.75rem] text-center font-display text-[14px] font-normal uppercase leading-[1.25rem] tracking-[0.04em] text-white outline-none transition-colors duration-300 ease-in-out hover:border-[#79786c] hover:bg-[#79786c] hover:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#d9d9d9] disabled:bg-[#d9d9d9] disabled:text-[#79786c]"
                >
                  <span className="flex items-center justify-center gap-1 leading-[1.25rem]">
                    Add to bag
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="relative ml-1 flex flex-[0_0_40px] cursor-pointer items-center justify-center border border-black bg-black p-4 text-center font-display text-[14px] font-normal uppercase leading-[1.25rem] tracking-[0.04em] text-white outline-none transition-colors duration-300 ease-in-out hover:border-[#79786c] hover:bg-[#79786c] hover:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#d9d9d9] disabled:bg-[#d9d9d9] disabled:text-[#79786c]"
                  data-title="Sign In To Wishlist"
                >
                  <span className="flex items-center justify-center gap-1 leading-[1.25rem]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.0013 20.7059L8.24244 16.8481L4.51318 12.9902C2.49561 10.8581 2.49561 7.52106 4.51318 5.38894C5.5011 4.43947 6.83919 3.94331 8.2073 4.01915C9.57541 4.09499 10.8505 4.73603 11.7274 5.78887L12.0013 6.05764L12.2726 5.7773C13.1495 4.72445 14.4246 4.08342 15.7927 4.00758C17.1608 3.93173 18.4989 4.4279 19.4868 5.37737C21.5044 7.50949 21.5044 10.8465 19.4868 12.9786L15.7576 16.8365L12.0013 20.7059Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sr-only">Sign in to go to your wishlist</span>
                  </span>
                </button>
              </div>

              {/* Description */}
              <div className="mb-[48px]">
                <p className="font-display text-[1.125rem] leading-[1.4] tracking-[-0.02em] text-black">
                  {productDescription}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-[.75rem]">
                <div className="flex items-center gap-6 text-black">
                  <HypoallergenicIcon />
                  <span className="font-display text-[.875rem] text-black">Hypoallergenic</span>
                </div>
                <div className="flex items-center gap-6 text-black">
                  <PlatingIcon />
                  <span className="font-display text-[.875rem] text-black">Thick 18K Gold Plating on Silver</span>
                </div>
                <div className="flex items-center gap-6 text-black">
                  <RecycledIcon />
                  <span className="font-display text-[.875rem] text-black">94% Recycled Sterling Silver Base Metal</span>
                </div>
              </div>

              {/* View More Details */}
              <div className="mt-[48px]">
                <button className="cursor-pointer font-display text-[14px] font-medium uppercase text-black underline underline-offset-4 hover:no-underline">
                  VIEW MORE DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="md:mt-16 mt-8 w-full space-y-0 md:pl-8 px-4 md:w-1/2">
          <details className="group border-b border-gray-200 font-display">
            <summary className="flex font-medium cursor-pointer items-center justify-between py-6 font-display text-sm uppercase tracking-wider text-black">
              MATERIALS & SPECIFICATIONS
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="transition-transform group-open:rotate-45"
              >
                <line x1="10" y1="5" x2="10" y2="15" stroke="black" strokeWidth="1.5" />
                <line x1="5" y1="10" x2="15" y2="10" stroke="black" strokeWidth="1.5" />
              </svg>
            </summary>
            <div className="pb-6 text-sm leading-relaxed text-black">
              <p>Content for materials and specifications...</p>
            </div>
          </details>

          <details className="group border-b border-gray-200">
            <summary className="flex font-medium cursor-pointer items-center justify-between py-6 font-display text-sm uppercase tracking-wider text-black">
              SUSTAINABILITY
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="transition-transform group-open:rotate-45"
              >
                <line x1="10" y1="5" x2="10" y2="15" stroke="black" strokeWidth="1.5" />
                <line x1="5" y1="10" x2="15" y2="10" stroke="black" strokeWidth="1.5" />
              </svg>
            </summary>
            <div className="pb-6 text-sm leading-relaxed text-black">
              <p>Content for sustainability...</p>
            </div>
          </details>

          <details className="group border-b border-gray-200">
            <summary className="flex font-medium cursor-pointer items-center justify-between py-6 font-display text-sm uppercase tracking-wider text-black">
              SHIPPING, RETURNS & WARRANTY
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="transition-transform group-open:rotate-45"
              >
                <line x1="10" y1="5" x2="10" y2="15" stroke="black" strokeWidth="1.5" />
                <line x1="5" y1="10" x2="15" y2="10" stroke="black" strokeWidth="1.5" />
              </svg>
            </summary>
            <div className="pb-6 text-sm leading-relaxed text-black">
              <p>Content for shipping, returns & warranty...</p>
            </div>
          </details>
        </div>

        <section className="mt-16 grid min-h-[520px] grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden bg-black lg:min-h-[520px]">
            <video
              preload="metadata"
              poster="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg"
              loop
              muted
              autoPlay
              playsInline
              tabIndex={-1}
              className="h-full min-h-full w-full min-w-full object-cover object-top"
              src="https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777669306/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT.mp4"
            />
          </div>
          <div className="flex min-h-[420px] items-center bg-[#d3e5e7] px-10 py-16 lg:min-h-[520px] lg:px-[5vw]">
            <div className="max-w-[520px]">
              <h2 className="mb-8 font-display text-[1.25rem] font-semibold uppercase leading-[28px] tracking-[-0.02em] text-black">
                Carry the summer
              </h2>
              <p className="mb-8 font-display text-[1.125rem] leading-[1.4] tracking-[-0.02em] text-black">
                Coastline memories. Tide-washed gifts. The small things that ground you, worn close.
              </p>
              <Link href="/collections/summer-guide" className="font-display text-[14px] font-medium uppercase text-black underline underline-offset-4">
                Shop now
              </Link>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="bg-white py-20">
            <h2 className="mb-12 px-[5.2vw] font-display text-[1.25rem] font-semibold uppercase leading-[28px] tracking-[-0.02em] text-black">
              You may also like
            </h2>
            <div ref={relatedScrollRef} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[5.2vw] pb-10">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.handle || relatedProduct.name}
                  product={relatedProduct}
                  onAddClick={(clickedProduct) => {
                    setRelatedDrawerProduct(clickedProduct);
                    setCartOpen(true);
                  }}
                />
              ))}
            </div>
            <div className="mx-auto mt-1 flex w-[400px] max-w-full items-center justify-center gap-10 px-[5.2vw]">
              <button onClick={() => scrollRelatedProducts("left")} className="cursor-pointer text-[#777] transition-colors hover:text-black" aria-label="Scroll related products left">
                ‹
              </button>
              <div className="h-[2px] flex-1 bg-[#b7b0a7]">
                <div
                  className="h-full bg-black transition-all duration-150"
                  style={{ width: `${Math.min(relatedScrollProgress + 24, 100)}%` }}
                />
              </div>
              <button onClick={() => scrollRelatedProducts("right")} className="cursor-pointer text-black transition-colors hover:text-black" aria-label="Scroll related products right">
                ›
              </button>
            </div>
          </section>
        )}

        <section className="bg-white px-10 lg:py-16 pt-8 pb-12 text-center">
          <h2 className="mx-auto max-w-[1100px] font-display text-[1.25rem] font-semibold uppercase leading-[28px] tracking-[-0.02em] text-black">
            &quot;We believe fine jewelry should be accessible to everyone&quot;
          </h2>
          <p className="mx-auto mt-6 max-w-[1220px] font-display text-[1.125rem] leading-[1.4] tracking-[-0.02em] text-black">
            Our pieces are handcrafted from precious materials like solid gold, sterling silver, and diamonds - never brass - so you can wear them with confidence.
          </p>
        </section>

        <section className="bg-white px-10 pb-16">
          <div className="flex flex-col gap-8 border-b border-[#e0ded7] pb-12 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-5">
                <h2 className="font-display text-[1.25rem] font-semibold uppercase leading-[28px] tracking-[-0.02em] text-black">
                  Customer reviews
                </h2>
                <span className="font-display text-[14px] font-bold text-black">4.8</span>
                <span className="font-display text-[20px] leading-none tracking-[0.08em] text-black">★★★★☆</span>
              </div>
              <button className="mt-12 cursor-pointer border-b border-black pb-4 font-display text-[14px] font-bold uppercase tracking-[0.02em] text-[#5f5f55]">
                Reviews (2253)
              </button>
            </div>

            <div className="flex items-center gap-8 font-display text-[14px] font-medium uppercase text-black">
              <button
                type="button"
                onClick={() => setWriteReviewOpen(true)}
                className="cursor-pointer underline underline-offset-4"
              >
                Write a review
              </button>
              <span className="h-11 w-px bg-black" />
              <button
                type="button"
                onClick={() => setAskQuestionOpen(true)}
                className="cursor-pointer underline underline-offset-4"
              >
                Ask a question
              </button>
            </div>
          </div>

          <div className="lg:mt-16 mt-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-[320px] items-center gap-3 border-b border-black pb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="10.5" cy="10.5" r="7.25" stroke="currentColor" strokeWidth="1" />
                <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1" />
              </svg>
              <input
                type="text"
                placeholder="Search Reviews"
                className="w-full bg-transparent font-display text-[14px] font-bold text-black outline-none placeholder:text-[#79786c]"
              />
            </div>

            <div className="flex flex-col gap-6 font-display text-[14px] font-medium uppercase leading-none text-black sm:flex-row sm:items-center lg:justify-end sm:gap-10">
              <button type="button" className="flex h-6 cursor-pointer items-center gap-4 whitespace-nowrap">
                Filter by topics
                <span className="-mt-1 inline-block h-3 w-3 rotate-45 border-b border-r border-black" />
              </button>
              <button type="button" className="flex h-6 cursor-pointer items-center gap-4 whitespace-nowrap">
                Sort: Highest rating
                <span className="-mt-1 inline-block h-3 w-3 rotate-45 border-b border-r border-black" />
              </button>
            </div>
          </div>

          <div className="lg:mt-16 mt-5 space-y-0">
            {[
              {
                name: "Geneviève-Andrée L.",
                date: "6/10/2026",
                title: "AMAZING!",
                body: "I loveeee it. Wear it 24/24 and always beautiful. I buy 4 others",
              },
              {
                name: "Erin L.",
                date: "6/9/2026",
                title: "MINI HOOP",
                body: "love!",
              },
              {
                name: "Sue M.",
                date: "6/2/2026",
                title: "FIRST TIME PURCHASE",
                body: "Although my daughters have bought from you before this was my first time and it was so easy and a great fast delivery. The product was exactly as described and I would definitely order again.",
              },
              {
                name: "Nithya N.",
                date: "5/29/2026",
                title: "LOVE IT",
                body: "Beautiful piece and perfect for everyday wear.",
              },
            ].map((review) => (
              <article key={`${review.name}-${review.date}`} className="grid gap-8 border-b border-[#e0ded7] py-10 lg:grid-cols-[34%_66%]">
                <div>
                  <p className="font-display text-[14px] font-bold leading-tight text-black">{review.name}</p>
                  <p className="mt-2 font-display text-[14px] font-bold text-[#5f5f55]">Verified Buyer</p>
                  <p className="mt-3 font-display text-[14px] font-bold text-[#5f5f55]">{review.date}</p>
                </div>
                <div>
                  <p className="font-display text-[20px] leading-none tracking-[0.08em] text-black">★★★★★</p>
                  <h3 className="mt-5 font-display text-[16px] font-semibold uppercase tracking-[0.02em] text-black">{review.title}</h3>
                  <p className="mt-3 font-display text-[1.125rem] leading-[1.4] tracking-[-0.02em] text-black">{review.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
      {(writeReviewOpen || askQuestionOpen) && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/35 px-6 py-10"
          onClick={() => {
            setWriteReviewOpen(false);
            setAskQuestionOpen(false);
          }}
        >
          <div
            className="w-full max-w-[660px] bg-white text-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-[110px] items-center justify-between bg-black px-10 text-white">
              <h2 className="font-display text-[1.25rem] font-bold uppercase leading-[28px] tracking-[-0.02em]">
                {writeReviewOpen ? "Write a review" : "Ask a question"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setWriteReviewOpen(false);
                  setAskQuestionOpen(false);
                }}
                className="relative h-8 w-8 cursor-pointer"
                aria-label="Close modal"
              >
                <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
                <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
              </button>
            </div>
            <form
              className="px-10 py-8"
              onSubmit={(event) => {
                event.preventDefault();
                setWriteReviewOpen(false);
                setAskQuestionOpen(false);
              }}
            >
              <div className="space-y-11">
                <input className="w-full border-b border-black bg-transparent pb-3 font-display text-[14px] font-bold outline-none placeholder:text-[#5f5f55]" placeholder="Your name*" />
                <input className="w-full border-b border-black bg-transparent pb-3 font-display text-[14px] font-bold outline-none placeholder:text-[#5f5f55]" placeholder="Your email*" />
                {writeReviewOpen ? (
                  <>
                    <input className="w-full border-b border-black bg-transparent pb-3 font-display text-[14px] font-bold outline-none placeholder:text-[#5f5f55]" placeholder="Review title*" />
                    <select className="w-full cursor-pointer border-b border-black bg-transparent pb-3 font-display text-[14px] font-bold text-[#5f5f55] outline-none">
                      <option>Review score</option>
                      <option>5 stars</option>
                      <option>4 stars</option>
                      <option>3 stars</option>
                      <option>2 stars</option>
                      <option>1 star</option>
                    </select>
                    <textarea className="min-h-[54px] w-full resize-none border-b border-black bg-transparent pb-3 font-display text-[14px] font-bold outline-none placeholder:text-[#5f5f55]" placeholder="Your review*" />
                  </>
                ) : (
                  <textarea className="min-h-[54px] w-full resize-none border-b border-black bg-transparent pb-3 font-display text-[14px] font-bold outline-none placeholder:text-[#5f5f55]" placeholder="Your question*" />
                )}
              </div>
              <button
                type="submit"
                className="mt-8 flex h-[58px] w-full cursor-pointer items-center justify-center bg-black font-display text-[14px] font-normal uppercase leading-[1.25rem] tracking-[0.04em] text-white"
              >
                {writeReviewOpen ? "Submit review" : "Send question"}
              </button>
            </form>
          </div>
        </div>
      )}
      <AddToCartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setRelatedDrawerProduct(null);
        }}
        product={relatedDrawerProduct ? {
          name: relatedDrawerProduct.name,
          price: relatedDrawerProduct.price,
          material: relatedDrawerProduct.material,
          image: relatedDrawerProduct.image,
        } : {
          name: product.title,
          price: `$${price}`,
          material: displayedMaterial || product.variants?.[0]?.option1 || "",
          image: product.images?.[0]?.src || "/products/product-1.webp",
        }}
      />
    </div>
  );
}
