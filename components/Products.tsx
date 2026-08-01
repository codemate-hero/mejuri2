"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { ProductCard, type Product } from "./ProductCard";
import { useRef, useState, useEffect } from "react";
import AddToCartDrawer from "./AddToCartDrawer";

//console.log("REAL PRODUCT CARD LOADED");

interface MongoProduct {
  _id: string;
  shopifyProductId: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: Array<{
    shopifyImageId: number;
    src: string;
    width: number;
    height: number;
    position: number;
  }>;
  variants: Array<{
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
  }>;
  publishedAt: string;
  createdAt: string;
}

// Store original MongoDB products for reference
let originalMongoProducts: MongoProduct[] = [];

// Helper function to map material to color
const getMaterialColor = (material: string) => {
  const lowerMaterial = material.toLowerCase();
  if (lowerMaterial.includes('gold') || lowerMaterial.includes('vermeil')) return '#d7b36a';
  if (lowerMaterial.includes('silver')) return '#c0c0c0';
  if (lowerMaterial.includes('rose')) return '#b76e79';
  return '#d7b36a'; // default gold
};

// Transform MongoDB products to ProductCard format
const transformProducts = (products: MongoProduct[]): Product[] => {
  // Store original products for reference
  originalMongoProducts = products;

  return products.map((product) => {
    // Get unique materials from variants
    const uniqueMaterials = [...new Set(product.variants.map((variant) => variant.option1))].filter(Boolean);

    // If product has multiple material variants, create color variations
    if (uniqueMaterials.length > 1 && product.images.length >= uniqueMaterials.length * 2) {
      const imagesPerVariant = Math.floor(product.images.length / uniqueMaterials.length);

      const colorVariations = uniqueMaterials.map((material: string, index: number) => {
        const startIdx = index * imagesPerVariant;
        const variantImages = product.images.slice(startIdx, startIdx + imagesPerVariant);
        const variant = product.variants.find((item) => item.option1 === material);

        return {
          color: getMaterialColor(material),
          material: material,
          image: variantImages[0]?.src || product.images[0]?.src,
          imageHover: variantImages[2]?.src || variantImages[1]?.src || variantImages[0]?.src,
          price: variant?.price || product.variants[0]?.price || 0,
        };
      });

      return {
        badge: product.tags.some((tag: string) => tag.toLowerCase().includes("new")) ? "NEW" : "",
        name: product.title.toUpperCase(),
        price: `$${colorVariations[0].price}`,
        material: colorVariations[0].material,
        colors: colorVariations.map(cv => cv.color),
        image: colorVariations[0].image,
        imageHover: colorVariations[0].imageHover,
        handle: product.handle,
        _id: product._id, // Store MongoDB _id
        colorVariations: colorVariations.map(cv => ({
          color: cv.color,
          image: cv.image,
          imageHover: cv.imageHover,
          material: cv.material,
        })),
      };
    }

    // Single variant product
    const mainImage = product.images[0]?.src || "https://via.placeholder.com/400";
    const hoverImage = product.images[2]?.src || product.images[1]?.src || mainImage;
    const price = product.variants[0]?.price || 0;
    const material = product.variants[0]?.option1 || "";

    return {
      badge: product.tags.some((tag: string) => tag.toLowerCase().includes("new")) ? "NEW" : "",
      name: product.title.toUpperCase(),
      price: `$${price}`,
      material: material,
      colors: [getMaterialColor(material)],
      image: mainImage,
      imageHover: hoverImage,
      handle: product.handle,
      _id: product._id, // Store MongoDB _id
    };
  });
};

// Get auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// Get product variant ID
const getProductVariantId = (product: MongoProduct) => {
  return product.variants?.[0]?.shopifyVariantId ||
    product.shopifyProductId ||
    //  @ts-ignore
    product.variants?.[0]?.id;
};

export function Products() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        // First, ensure we have a token
        if (!localStorage.getItem("token")) {
          const tokenResponse = await fetch(`/api/users`, {
            signal: controller.signal,
            cache: "no-store",
          });
          const tokenData = await tokenResponse.json();
          localStorage.setItem("token", tokenData.token);
        }

        const response = await fetch('/api/products?limit=12', {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const mongoProducts = data.products || [];

        if (!ignore) {
          const transformed = transformProducts(mongoProducts);
          setProducts(transformed);
        }
      } catch (err) {
        if (!ignore && !controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
          console.error('Error fetching products:', err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  // Update scroll progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => container.removeEventListener('scroll', updateProgress);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth >= 768
        ? scrollContainerRef.current.offsetWidth * 0.8
        : scrollContainerRef.current.offsetWidth * 0.75;

      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle add to cart with API call
  const handleAddToCart = async (product: Product) => {
    try {
      // Find the original MongoDB product
      const originalProduct = originalMongoProducts.find(p => p.handle === product.handle);

      if (!originalProduct) {
        console.error("Original product not found");
        return;
      }

      const variantId = getProductVariantId(originalProduct);

      if (!variantId) {
        console.error("Variant ID not found");
        return;
      }

      // Make API call to add to cart
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productId: originalProduct._id,
          variantId: variantId,
          quantity: 1,
          size: "", // No size selection in collection view
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Dispatch custom event to update cart UI
        window.dispatchEvent(new Event("mejuri-cart-updated"));
        // Set selected product and open drawer
        setSelectedProduct(product);
        setCartOpen(true);
      } else {
        console.error("Failed to add to cart:", data);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section id="products" className="bg-white md:pt-[56px] pt-[48px]">
        <Reveal>
          <h2 className="text-left font-display px-[5.2vw] text-[32px] font-[500] uppercase leading-none tracking-[0.05em] text-black lg:text-left">
            PICKED JUST FOR YOU
          </h2>
        </Reveal>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="products" className="bg-white md:pt-[56px] pt-[48px]">
        <Reveal>
          <h2 className="text-left font-display px-[5.2vw] text-[32px] font-[500] uppercase leading-none tracking-[0.05em] text-black lg:text-left">
            PICKED JUST FOR YOU
          </h2>
        </Reveal>
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="font-sans text-[16px] text-red-600">Failed to load products. Please try again.</p>
        </div>
      </section>
    );
  }

  // Show no products state
  if (products.length === 0) {
    return (
      <section id="products" className="bg-white md:pt-[56px] pt-[48px]">
        <Reveal>
          <h2 className="text-left font-display px-[5.2vw] text-[32px] font-[500] uppercase leading-none tracking-[0.05em] text-black lg:text-left">
            PICKED JUST FOR YOU
          </h2>
        </Reveal>
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="font-sans text-[16px] uppercase tracking-[0.02em] text-[#79786c]">No products available.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="products" className="bg-white md:pt-[56px] pt-[48px]">
        <Reveal>
          <h2 className="text-left font-display px-[5.2vw] text-[32px] font-[500] uppercase leading-none tracking-[0.05em] text-black lg:text-left">
            PICKED JUST FOR YOU
          </h2>
        </Reveal>
        <div
          ref={scrollContainerRef}
          className="no-scrollbar mt-[2rem] flex gap-5 overflow-x-auto px-[5.2vw] pb-10 snap-x snap-mandatory"
        >
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              onAddClick={(clickedProduct) => {
                handleAddToCart(clickedProduct);
              }}
            />
          ))}
        </div>
        <div className="mx-auto mt-1 flex w-[400px] max-w-full items-center justify-center gap-10 px-[5.2vw]">
          <button onClick={() => scroll('left')} className="cursor-pointer transition-colors hover:text-black">
            <ChevronLeft className="h-5 w-5 text-[#777]" />
          </button>
          <div className="h-[2px] flex-1 bg-[#b7b0a7]">
            <div
              className="h-full bg-black transition-all duration-150"
              style={{ width: `${Math.min(scrollProgress + 24, 100)}%` }}
            />
          </div>
          <button onClick={() => scroll('right')} className="cursor-pointer transition-colors hover:text-black">
            <ChevronRight className="h-5 w-5 text-black" />
          </button>
        </div>
      </section>

      <AddToCartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setSelectedProduct(null);
        }}
        product={
          selectedProduct
            ? {
              name: selectedProduct.name,
              price: selectedProduct.price,
              material: selectedProduct.material,
              image: selectedProduct.image,
            }
            : undefined
        }
      />
    </>
  );
}