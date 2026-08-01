"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { CategoryTileRail } from "@/components/CategoryTileRail";
import { ShopPageConfig } from "@/data/shopConfigs";
import { shopAllTiles } from "@/data/categoryRails";
import { fetchProductsPage, transformMongoProducts } from "@/app/lib/products-client";

interface ShopLayoutProps {
  config: ShopPageConfig;
  initialProducts?: Product[];
}

export function ShopLayout({ config, initialProducts = [] }: ShopLayoutProps) {
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(initialProducts.length);
  const [error, setError] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);
  const pageSize = 100;

  const getRequestParams = useCallback((page: number) => {
    const params = new URLSearchParams();
    const pageSlug = config.pageTitle.toLowerCase().replace(/&/g, "and").replace(/\+/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const apiParams = config.apiParams || { collectionHandle: pageSlug };

    if (apiParams.collectionHandle) params.set("collectionHandle", apiParams.collectionHandle);
    if (apiParams.category) params.set("category", apiParams.category);
    if (apiParams.productType) params.set("productType", apiParams.productType);
    params.set("page", String(page));
    params.set("limit", String(pageSize));

    return params;
  }, [config.apiParams, config.pageTitle]);

  const loadProductsPage = useCallback(async (page: number, mode: "replace" | "append", signal?: AbortSignal) => {
    if (mode === "append" && requestInFlightRef.current) return;
    requestInFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProductsPage(getRequestParams(page), signal);
      const nextProducts = transformMongoProducts(data.products);

      setDisplayedProducts((prev) => (mode === "append" ? [...prev, ...nextProducts] : nextProducts));
      setCurrentPage(data.page);
      setTotalProducts(data.totalProducts);
      setHasMore(data.hasMore);

      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", data.page > 1 ? `?page=${data.page}` : window.location.pathname);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
      requestInFlightRef.current = false;
    }
  }, [getRequestParams]);

  useEffect(() => {
    const controller = new AbortController();
    const pageFromUrl = new URLSearchParams(window.location.search).get("page");
    const initialPage = Math.max(1, Number(pageFromUrl) || 1);
    const timeout = window.setTimeout(() => {
      loadProductsPage(initialPage, "replace", controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [loadProductsPage]);

  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;
    loadProductsPage(currentPage + 1, "append");
  }, [currentPage, hasMore, isLoading, loadProductsPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHidePromoBar(true);
      } else {
        setHidePromoBar(false);
      }
      
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 500;
      
      if (scrollPosition >= bottomPosition && !isLoading && hasMore) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, loadMoreProducts]);

  useEffect(() => {
    const handlePopState = () => {
      if (displayedProducts.length === 0 && initialProducts.length > 0) {
        setDisplayedProducts(initialProducts);
        setCurrentPage(1);
        setHasMore(true);
        setIsLoading(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [displayedProducts.length, initialProducts]);

  const renderInterleavedContent = () => {
    const content: React.JSX.Element[] = [];
    let productIndex = 0;

    // If no hero sections, render all products in one grid
    if (config.heroSections.length === 0) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ borderColor: 'rgba(178,176,161,1)' }}>
          {displayedProducts.map((product, index) => (
            <div 
              key={`${product.name}-${index}`} 
              className="border-b border-r"
              style={{ borderColor: 'rgba(178,176,161,1)' }}
            >
              <ProductCard product={product} layout="grid" />
            </div>
          ))}
        </div>
      );
    }

    // Render products with hero sections
    config.heroSections.forEach((section, sectionIdx) => {
      const startIdx = productIndex;
      const endIdx = Math.min(section.position, displayedProducts.length);

      if (startIdx < endIdx) {
        content.push(
          <div key={`products-${sectionIdx}`} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ borderColor: 'rgba(178,176,161,1)' }}>
            {displayedProducts.slice(startIdx, endIdx).map((product, index) => (
              <div 
                key={`${product.name}-${startIdx + index}`} 
                className="border-b border-r"
                style={{ borderColor: 'rgba(178,176,161,1)' }}
              >
                <ProductCard product={product} layout="grid" />
              </div>
            ))}
          </div>
        );
      }

      productIndex = endIdx;

      if (displayedProducts.length > section.position) {
        if (section.type === "icons") {
          content.push(
            <section key={`hero-${sectionIdx}`} className="bg-white px-4 py-16 md:px-8 xl:mx-auto xl:max-w-[1920px]">
              <h2 className="mb-4 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black">{section.title}</h2>
              {section.subtitle && <p className="mb-8 max-w-3xl font-mono text-[14px] leading-[1.3] text-black">{section.subtitle}</p>}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {section.images.map((img, idx) => (
                  <div key={idx} className="group relative h-[500px] cursor-pointer overflow-hidden">
                    <img src={img.src} alt={img.title || ''} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute bottom-6 left-6">
                      {img.title && <h3 className="font-sans text-[18px] font-bold uppercase tracking-[0.05em] text-white">{img.title}</h3>}
                      {img.cta && <button className="mt-2 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-white underline">{img.cta}</button>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        } else if (section.type === "textWithImages") {
          content.push(
            <section key={`hero-${sectionIdx}`} className="bg-white px-4 py-16 md:px-8 xl:mx-auto xl:max-w-[1920px]">
              <h2 className="mb-4 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black">{section.title}</h2>
              {section.description && <p className="mb-8 max-w-3xl font-mono text-[14px] leading-[1.3] text-black">{section.description}</p>}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {section.images.map((img, idx) => (
                  <div key={idx} className="relative h-[500px] overflow-hidden">
                    <img src={img.src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          );
        }
      }
    });

    if (productIndex < displayedProducts.length) {
      content.push(
        <div key="products-remaining" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ borderColor: 'rgba(178,176,161,1)' }}>
          {displayedProducts.slice(productIndex).map((product, index) => (
            <div 
              key={`${product.name}-${productIndex + index}`} 
              className="border-b border-r"
              style={{ borderColor: 'rgba(178,176,161,1)' }}
            >
              <ProductCard product={product} layout="grid" />
            </div>
          ))}
        </div>
      );
    }

    return content;
  };

  const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;

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

      {/* Category Tiles - Optional */ }
      {config.showCategoryTiles && config.categoryTiles && (
        <section className="bg-white px-4 pb-10 pt-[130px] md:px-8 xl:mx-auto xl:max-w-[1920px]">
          <h1 className="mb-10 font-sans text-[40px] font-bold uppercase leading-none tracking-[0.02em] text-black md:text-[42px]">
            {config.pageTitle}
          </h1>
          <CategoryTileRail
            tiles={
              config.pageTitle.toLowerCase() === "shop all"
                ? shopAllTiles
                : config.categoryTiles.map((category) => ({
                    name: category.name,
                    href: category.href || `/collections/${category.name.toLowerCase().replace(/\+/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
                    image: category.image,
                  }))
            }
          />
        </section>
      )}

      {/* Page Title for non-tile pages */}
      {!config.showCategoryTiles && (
        <section className="bg-white px-4 py-8 pt-[130px] md:px-8 xl:mx-auto xl:max-w-[1920px]">
          <h1 className="mb-8 font-sans text-[40px] font-bold uppercase leading-none tracking-[0.02em] text-black md:text-[42px]">{config.pageTitle}</h1>
        </section>
      )}

      {/* Filter Bar */}
      <div className={`sticky z-40 border-b border-t bg-[#F8F8F8] px-[1rem] py-[0.5rem] md:px-8 xl:mx-auto xl:max-w-[1920px] ${hidePromoBar ? "top-[70px]" : "top-[114px]"}`} style={{ borderColor: 'rgba(178,176,161,1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-[#0A0A0A] underline">CATEGORY</button>
            <button className="font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-[#0A0A0A] hover:text-black">MATERIAL</button>
            <button className="font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-[#0A0A0A] hover:text-black">% OFF</button>
            <button className="font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-[#0A0A0A] hover:text-black">ALL FILTERS</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] text-[#79786c]">({totalProducts} Products)</span>
            <button className="font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-[#0A0A0A] underline">SORT</button>
          </div>
        </div>
      </div>

      {/* Product Grid with Optional Hero Sections */}
      <section className="bg-[#F8F8F8] py-0">
        {error && (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-sans text-[16px] text-red-600">{error}</p>
          </div>
        )}

        {renderInterleavedContent()}
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        )}
        
        {!hasMore && !isLoading && (
          <div className="py-12 text-center">
            <p className="font-sans text-[14px] uppercase tracking-[0.02em] text-[#79786c]">You&apos;ve reached the end</p>
          </div>
        )}
      </section>

      {/* SEO Description - Optional */}
      {config.seoDescription && (
        <section className="bg-white px-4 py-16 md:px-8 xl:mx-auto xl:max-w-[1920px]">
          <h2 className="mb-4 font-sans text-[24px] font-bold uppercase tracking-[0.05em] text-black">{config.pageTitle}</h2>
          <p className="max-w-4xl font-mono text-[14px] leading-[1.5] text-black">{config.seoDescription}</p>
        </section>
      )}

      {/* More Ways to Shop */}
      {!hasMore && (
      <section className="bg-white px-4 py-16 md:px-8 xl:mx-auto xl:max-w-[1920px]">
        <h2 className="mb-8 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black">MORE WAYS TO SHOP</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          <div className="group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=90" 
                alt="Best Sellers" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-sans text-[18px] font-bold uppercase tracking-[0.05em] text-black">BEST SELLERS</h3>
          </div>
          <div className="group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=90" 
                alt="Personalized" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-sans text-[18px] font-bold uppercase tracking-[0.05em] text-black">PERSONALIZED</h3>
          </div>
          <div className="group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=90" 
                alt="Before We Melt" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-sans text-[18px] font-bold uppercase tracking-[0.05em] text-black">BEFORE WE MELT</h3>
          </div>
        </div>
      </section>
      )}

      {/* Category Buttons */}
      <section className="bg-white px-4 py-12 md:px-8 xl:mx-auto xl:max-w-[1920px]">
        <div className="no-scrollbar flex gap-3 overflow-x-auto">
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">EARRINGS</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">HOOPS</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">RINGS</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">NECKLACES</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">BRACELETS</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">CHARMS + PENDANTS</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">TENNIS JEWELRY</button>
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">MEN&apos;S</button>
        </div>
      </section>

      {/* Back to Top */}
      {showBackToTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-black px-6 py-3 font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-white shadow-lg hover:bg-[#333]"
        >
          Back to Top
          <svg className="h-4 w-4 rotate-[-90deg] transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" role="graphics-symbol" viewBox="0 0 24 24" fill="white">
            <title>Caret</title>
            <path d="M8.59175 20C8.47866 19.9947 8.36933 19.9555 8.27647 19.8871C8.18361 19.8187 8.11104 19.7238 8.06721 19.6135C8.02338 19.5031 8.01008 19.3819 8.02886 19.2639C8.04765 19.146 8.09774 19.036 8.17332 18.9469L14.7188 12.0179L8.17332 5.06776C8.06235 4.95046 8 4.79137 8 4.62548C8 4.45959 8.06235 4.3005 8.17332 4.1832C8.28429 4.0659 8.43481 4 8.59175 4C8.74869 4 8.89921 4.0659 9.01018 4.1832L15.7051 11.2492C15.7985 11.3471 15.8726 11.4635 15.9231 11.5918C15.9737 11.7202 15.9998 11.8578 15.9998 11.9968C15.9998 12.1358 15.9737 12.2735 15.9231 12.4018C15.8726 12.5301 15.7985 12.6466 15.7051 12.7445L9.01018 19.8105C8.95621 19.8703 8.8913 19.918 8.81937 19.9506C8.74744 19.9832 8.67 20 8.59175 20Z" fill="white"></path>
          </svg>
        </button>
      )}

      <Footer />
    </div>
  );
}
