"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { categoryMapping, getCategoryName, normalizeCollectionSlug } from "@/data/categoryMapping";
import { SearchModal } from "@/components/SearchModal";
import { MoreWaysToShop } from "@/components/MoreWaysToShop";
import { CategoryTileRail } from "@/components/CategoryTileRail";
import { getCollectionRailConfig } from "@/data/categoryRails";
import { CollectionEditorialSection, CollectionEditorialTile } from "@/components/CollectionEditorialTile";
import { getCollectionEditorialTiles } from "@/data/collectionEditorialTiles";
import AddToCartDrawer from "@/components/AddToCartDrawer";
import { fetchProductsPage, transformMongoProducts, type MongoProduct } from "@/app/lib/products-client";

type ProductCardItem = Product;

// Cache for collection data
const collectionCache = new Map<string, {
  products: MongoProduct[];
  timestamp: number;
  page: number;
  totalProducts: number;
  totalPages: number;
  hasMore: boolean;
  nextPage: number | null;
}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 100;
const SORT_OPTIONS = ["New Arrivals", "Price: High to Low", "Price: Low to High", "Top Match"] as const;
const CATEGORY_OPTIONS = ["Anklets", "Bracelets", "Charm + Pendant", "Earrings", "Lifestyle", "Necklaces", "Rings", "Service", "Small Leather Good"];
const MATERIAL_OPTIONS = ["10k Yellow Gold", "14k White Gold", "14k Yellow Gold", "14k Yellow Salmon Gold", "18k Gold Vermeil", "Brushed Gold", "Cord", "Enamel", "Gold Finished Steel", "Leather", "None", "Platinum", "Stainless Steel", "Sterling Silver", "Titanium"];
const STONE_OPTIONS = ["Diamond", "Lab Grown Diamond", "Lab Grown Sapphire", "Pearl", "Sapphire", "White Sapphire"];
const COLOR_OPTIONS = ["Black", "Blue", "Gold", "Green", "Pink", "Silver", "White"];
const SIZE_OPTIONS = ["3", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];
const LENGTH_OPTIONS = ["14-16 inches", "16-18 inches", "20-26 inches"];
const SALE_OPTIONS = ["20% Off", "30% Off", "40% Off", "50% Off"];

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const normalizedSlug = normalizeCollectionSlug(slug);

  const [products, setProducts] = useState<MongoProduct[]>(() => {
    // Initialize from cache if available
    const cached = collectionCache.get(normalizedSlug);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.products;
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = collectionCache.get(normalizedSlug);
    return !(cached && Date.now() - cached.timestamp < CACHE_DURATION);
  });
  const cachedMeta = collectionCache.get(normalizedSlug);
  const [hasMore, setHasMore] = useState(cachedMeta?.hasMore ?? true);
  const [nextPage, setNextPage] = useState<number | null>(cachedMeta?.nextPage ?? null);
  const [totalProducts, setTotalProducts] = useState(cachedMeta?.totalProducts || 0);
  const [error, setError] = useState<string | null>(null);
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Top Match");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedLengths, setSelectedLengths] = useState<string[]>([]);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["Sort By"]);
  const [cartOpen, setCartOpen] = useState(false);
  const [relatedDrawerProduct, setRelatedDrawerProduct] = useState<ProductCardItem | null>(null);
  const requestInFlightRef = useRef(false);

  const categoryName = getCategoryName(normalizedSlug);
  const filterConfig = categoryMapping[normalizedSlug];
  const categoryRailConfig = getCollectionRailConfig(normalizedSlug);
  const editorialTiles = getCollectionEditorialTiles(normalizedSlug);

  // Get auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  // Get product variant ID from product
  // const getProductVariantId = (product: MongoProduct) => {
  //   return product.variants?.[0]?.shopifyVariantId || 
  //          product.shopifyProductId || 
  //          product.variants?.[0]?.id;
  // };
  const getProductVariantId = (product: MongoProduct) => {
    const variantId = product.variants?.[0]?.shopifyVariantId;
    const productId = product.shopifyProductId;

    // Return the first available ID
    return variantId ?? productId;
  };
  // Main add to cart function
  const handleAddToCart = async (productData: ProductCardItem, originalProduct?: MongoProduct) => {
    try {
      const product = originalProduct || products.find(p => p.handle === productData.handle);

      if (!product) {
        console.error("Product not found");
        return;
      }

      const variantId = getProductVariantId(product);

      if (!variantId) {
        console.error("Variant ID not found");
        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productId: product._id,
          variantId: variantId,
          quantity: 1,
          size: "",
        }),
      });

      if (response.ok) {
        window.dispatchEvent(new Event("mejuri-cart-updated"));
        setRelatedDrawerProduct(productData);
        setCartOpen(true);
      }
    } catch (error) {
      console.log("Add to cart error:", error);
    }
  };

  const handleCartClose = () => {
    setCartOpen(false);
    setRelatedDrawerProduct(null);
  };

  const getRequestParams = useCallback((page: number) => {
    const params = new URLSearchParams();

    if (filterConfig?.collectionHandle) {
      params.set("collectionHandle", filterConfig.collectionHandle);
    } else if (filterConfig?.category) {
      params.set("category", filterConfig.category);
    } else if (filterConfig?.productType) {
      params.set("productType", filterConfig.productType);
    } else if (!filterConfig && normalizedSlug !== "shop-all") {
      params.set("collectionHandle", normalizedSlug);
    }

    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    const sortValues: Record<string, string> = {
      "New Arrivals": "new-arrivals",
      "Price: High to Low": "price-high-low",
      "Price: Low to High": "price-low-high",
      "Top Match": "top-match",
    };
    params.set("sort", sortValues[sortBy]);
    if (inStockOnly) params.set("available", "true");
    selectedCategories.forEach((value) => params.append("categoryFilter", value));
    selectedMaterials.forEach((value) => params.append("material", value));
    selectedStones.forEach((value) => params.append("stone", value));
    selectedColors.forEach((value) => params.append("color", value));
    selectedSizes.forEach((value) => params.append("size", value));
    selectedLengths.forEach((value) => params.append("length", value));
    selectedSales.forEach((value) => params.append("sale", value.replace(/% Off$/, "")));

    return params;
  }, [filterConfig, inStockOnly, normalizedSlug, selectedCategories, selectedColors, selectedLengths, selectedMaterials, selectedSales, selectedSizes, selectedStones, sortBy]);

  const loadProductsPage = useCallback(async (page: number, mode: "replace" | "append", signal?: AbortSignal) => {
    if (mode === "append" && requestInFlightRef.current) return;
    requestInFlightRef.current = true;
    setError(null);
    setLoading(true);

    try {
      const data = await fetchProductsPage(getRequestParams(page), signal);
      const productData = data.products;

      setProducts((prev) => {
        const nextProducts = mode === "append" ? [...prev, ...productData] : productData;
        collectionCache.set(normalizedSlug, {
          products: nextProducts,
          timestamp: Date.now(),
          page: data.page,
          totalProducts: data.totalProducts,
          totalPages: data.totalPages,
          hasMore: data.hasMore,
          nextPage: data.nextPage,
        });
        return nextProducts;
      });
      setTotalProducts(data.totalProducts);
      setHasMore(data.hasMore);
      setNextPage(data.nextPage);
      window.history.replaceState({}, "", data.page > 1 ? `?page=${data.page}` : window.location.pathname);
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
      requestInFlightRef.current = false;
    }
  }, [getRequestParams, normalizedSlug]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      loadProductsPage(1, "replace", controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [loadProductsPage, normalizedSlug]);

  useEffect(() => {
    const handlePageShow = () => {
      setLoading(false);
      setIsFilterOpen(false);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setIsMegaMenuOpen(false);
      setCartOpen(false);
      setRelatedDrawerProduct(null);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

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

  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore || !nextPage) return;
    loadProductsPage(nextPage, "append");
  }, [hasMore, loadProductsPage, loading, nextPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 700;

      if (scrollPosition >= bottomPosition) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProducts]);

  const transformedProducts: ProductCardItem[] = transformMongoProducts(products);

  const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;
  const visibleProducts = transformedProducts;

  const toggleSelection = (value: string, values: string[], setValues: React.Dispatch<React.SetStateAction<string[]>>) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const openFiltersAt = (section: string) => {
    setExpandedFilters((current) => current.includes(section) ? current : [...current, section]);
    setIsFilterOpen(true);
    setIsSortOpen(false);
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters((current) => current.includes(section) ? current.filter((item) => item !== section) : [...current, section]);
  };

  const renderCheckboxOptions = (
    options: string[],
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
  ) => (
    <div className="space-y-3 pb-5 pt-1">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 font-mono text-[14px] text-black">
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={() => toggleSelection(option, values, setValues)}
            className="h-5 w-5 accent-black"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );

  const renderProductGridItems = () => {
    const items: React.ReactNode[] = [];
    const tilesByIndex = new Map<number, typeof editorialTiles>();
    const getTileSpanClass = (span?: string) => {
      if (span === "2x2") return "col-span-2 row-span-2 max-md:col-span-2";
      if (span === "1x2") return "row-span-2 max-md:col-span-2";
      return "col-span-2 max-md:col-span-2";
    };

    editorialTiles.forEach((tile) => {
      const existing = tilesByIndex.get(tile.index) ?? [];
      tilesByIndex.set(tile.index, [...existing, tile]);
    });

    visibleProducts.forEach((product, index) => {
      (tilesByIndex.get(index) ?? []).forEach((tile, tileIndex) => {
        if (tile.kind === "section") {
          items.push(
            <div key={`editorial-section-${tile.index}-${tileIndex}`} className="col-span-full">
              <CollectionEditorialSection section={tile} />
            </div>
          );
          return;
        }

        items.push(
          <div
            key={`editorial-${tile.index}-${tileIndex}`}
            className={`${getTileSpanClass(tile.span)}`}
            style={{ borderColor: "rgba(178,176,161,1)" }}
          >
            <CollectionEditorialTile tile={tile} />
          </div>
        );
      });

      items.push(
        <div
          key={`${product.handle || product.name}-${index}`}
        >
          <ProductCard
            product={product}
            layout="grid"
            onAddClick={(clickedProduct: Product) => {
              const originalProduct = products.find(p => p.handle === clickedProduct.handle);
              handleAddToCart(clickedProduct, originalProduct);
            }}
          />
        </div>
      );
    });

    (tilesByIndex.get(visibleProducts.length) ?? []).forEach((tile, tileIndex) => {
      if (tile.kind === "section") {
        items.push(
          <div key={`editorial-section-end-${tileIndex}`} className="col-span-full">
            <CollectionEditorialSection section={tile} />
          </div>
        );
        return;
      }

      items.push(
        <div
          key={`editorial-end-${tileIndex}`}
          className={`${getTileSpanClass(tile.span)}`}
        >
          <CollectionEditorialTile tile={tile} />
        </div>
      );
    });

    return items;
  };

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

      {/* Page Header */}
      <section className="bg-white px-4 pb-10 pt-[105px] md:px-8 xl:mx-auto xl:max-w-[1920px]">
        {categoryRailConfig?.breadcrumbs.length ? (
          <nav className="mb-2 flex items-center gap-3 font-mono text-[14px] leading-none text-black">
            {categoryRailConfig.breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-3">
                <Link href={crumb.href} className="cursor-pointer hover:underline">
                  {crumb.label}
                </Link>
                {index < categoryRailConfig.breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        ) : null}

        <h1 className="mb-12 font-sans text-[40px] font-[500] uppercase leading-none tracking-[0.02em] text-black md:text-[32px]">
          {categoryName}
        </h1>

        {categoryRailConfig ? (
          <CategoryTileRail tiles={categoryRailConfig.tiles} />
        ) : filterConfig ? (
          <p className="font-sans text-[14px] text-[#79786c]">
            Browse our collection of {categoryName.toLowerCase()}
          </p>
        ) : null}
      </section>

      {/* Collection controls */}
      {products.length > 0 && (
        <div className={`sticky z-40 border-b border-[#d8d6cf] bg-white px-4 py-4 md:px-8 xl:mx-auto xl:max-w-[1920px] ${hidePromoBar ? "top-[57px]" : "top-[114px]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 md:gap-7">
              <button onClick={() => openFiltersAt("Category")} className="cursor-pointer font-display text-[12px] uppercase tracking-[0.02em] text-black hover:underline">CATEGORY</button>
              <button onClick={() => openFiltersAt("Material")} className="cursor-pointer font-display text-[12px] uppercase tracking-[0.02em] text-black hover:underline">MATERIAL</button>
              <button onClick={() => openFiltersAt("Availability")} className="cursor-pointer font-display text-[12px] uppercase tracking-[0.02em] text-black underline underline-offset-2">ALL FILTERS</button>
            </div>
            <div className="flex items-center gap-5 md:gap-8">
              <span className="hidden font-mono text-[14px] text-[#79786c] sm:block">
                ({totalProducts} Products)
              </span>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={isSortOpen}
                  aria-haspopup="listbox"
                  onClick={() => setIsSortOpen((open) => !open)}
                  className="cursor-pointer font-display text-[12px] uppercase tracking-[0.02em] text-black underline underline-offset-2"
                >
                  SORT
                </button>
                {isSortOpen && (
                  <div role="listbox" className="absolute right-0 top-8 z-[80] w-[235px] border border-[#d8d6cf] bg-white px-5 py-4 shadow-lg">
                    {SORT_OPTIONS.map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-3 py-2 font-mono text-[13px] text-black">
                        <input
                          type="radio"
                          name="toolbar-sort"
                          checked={sortBy === option}
                          onChange={() => { setSortBy(option); setIsSortOpen(false); }}
                          className="h-4 w-4 accent-black"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mejuri-style filter drawer */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/45" onClick={() => setIsFilterOpen(false)} />
          <aside role="dialog" aria-modal="true" aria-label="Filters" className="fixed bottom-0 left-0 top-0 z-[201] flex w-full flex-col bg-white text-black shadow-2xl md:w-[430px]">
            <div className="border-b border-[#d8d6cf] px-6 pb-5 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[20px] font-bold uppercase tracking-[0.05em] text-black">FILTERS</h2>
                <button type="button" aria-label="Close filters" onClick={() => setIsFilterOpen(false)} className="text-black hover:opacity-60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                </button>
              </div>
              <p className="mt-3 font-mono text-[13px] text-[#68675e]">Filter and sort results.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              {[
                { name: "Sort By", label: `SORT BY: ${sortBy.toUpperCase()}`, content: <div className="space-y-3 pb-5 text-black">{SORT_OPTIONS.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 font-mono text-[14px] text-black"><input type="radio" name="drawer-sort" checked={sortBy === option} onChange={() => setSortBy(option)} className="h-5 w-5 accent-black" />{option}</label>)}</div> },
                { name: "Availability", label: "AVAILABILITY", content: <label className="flex cursor-pointer items-center justify-between pb-5 font-mono text-[14px] text-black"><span>In-Stock and Ready to Ship</span><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="h-5 w-5 accent-black" /></label> },
                { name: "Category", label: "CATEGORY", content: renderCheckboxOptions(CATEGORY_OPTIONS, selectedCategories, setSelectedCategories) },
                { name: "Material", label: "MATERIAL", content: renderCheckboxOptions(MATERIAL_OPTIONS, selectedMaterials, setSelectedMaterials) },
                { name: "Stone", label: "STONE", content: renderCheckboxOptions(STONE_OPTIONS, selectedStones, setSelectedStones) },
                { name: "Color", label: "COLOR", content: renderCheckboxOptions(COLOR_OPTIONS, selectedColors, setSelectedColors) },
                { name: "Size", label: "SIZE", content: renderCheckboxOptions(SIZE_OPTIONS, selectedSizes, setSelectedSizes) },
                { name: "Length", label: "LENGTH", content: renderCheckboxOptions(LENGTH_OPTIONS, selectedLengths, setSelectedLengths) },
                { name: "Sale", label: "SALE", content: renderCheckboxOptions(SALE_OPTIONS, selectedSales, setSelectedSales) },
              ].map((section) => {
                const expanded = expandedFilters.includes(section.name);
                return (
                  <div key={section.name} className="border-b border-[#d8d6cf]">
                    <button type="button" aria-expanded={expanded} onClick={() => toggleFilterSection(section.name)} className="flex w-full items-center justify-between py-5 text-left font-display text-[13px] uppercase tracking-[0.02em] text-black">
                      {section.label}
                      <svg className={`transition-transform ${expanded ? "rotate-90" : ""}`} width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6.5 3.5L11.5 9L6.5 14.5" stroke="currentColor" strokeWidth="1.3" /></svg>
                    </button>
                    {expanded && section.content}
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#d8d6cf] bg-white p-6">
              <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black py-4 font-display text-[13px] font-bold uppercase tracking-[0.03em] text-white hover:bg-[#222]">
                VIEW {totalProducts} PRODUCTS
              </button>
            </div>
          </aside>
        </>
      )}

      <main className="bg-[#F8F8F8] pb-0">
        {/* Loading State - Show skeleton or spinner */}
        {loading && products.length === 0 && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-sans text-[16px] text-red-600">{error}</p>
          </div>
        )}

        {/* Products Grid - Show immediately if products exist, even if loading */}
        {!error && products.length > 0 && (
          <section className="py-0">
            <div className="grid grid-flow-dense bg-white sm:gap-[1rem] gap-[10px] grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {renderProductGridItems()}
            </div>
          </section>
        )}

        {loading && products.length > 0 && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-sans text-[16px] uppercase tracking-[0.02em] text-[#79786c]">No products found in this category.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && !hasMore && <MoreWaysToShop />}
      </main>

      <Footer />

      <AddToCartDrawer
        open={cartOpen}
        onClose={handleCartClose}
        product={relatedDrawerProduct ? {
          name: relatedDrawerProduct.name,
          price: relatedDrawerProduct.price,
          material: relatedDrawerProduct.material,
          image: relatedDrawerProduct.image,
        } : {
          name: "",
          price: "$0",
          material: "",
          image: "",
        }}
      />
    </div>
  );
}
