"use client";

import { useState, useEffect } from "react";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";

const categories = [
  { name: "SHOP ALL", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80" },
  { name: "EARRINGS", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80" },
  { name: "RINGS", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80" },
  { name: "BRACELETS", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80" },
  { name: "NECKLACES", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
  { name: "CHARMS + PENDANTS", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80" },
  { name: "TENNIS JEWELRY", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=400&q=80" },
];

const products: Product[] = [
  {
    badge: "",
    name: "SINGLE MINI HOOP",
    price: "$98",
    material: "10k Yellow Gold",
    colors: ["#eacb7b"],
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Reshoot_SingleColoredMiniHoop_14K_OffFigAngledView_PDP.jpg?v=1759343466&width=600&crop=center",
    imageHover: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-SingleColoredMiniHoopWhiteSapphire-14K-Stack1_029.jpg?v=1758043873&width=600&crop=center",
  },
  {
    badge: "",
    name: "TUBE HUGGIE HOOPS",
    price: "$98",
    material: "18k Gold Vermeil",
    colors: ["#d9d9d9", "#d7b36a"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "NEW",
    name: "BIA MINI HOOPS",
    price: "$158",
    material: "18k Gold Vermeil, Lab Grown White Sapphire",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "LAB GROWN SAPPHIRE MARQUISE CUT STUDS",
    price: "$118",
    material: "18k Gold Vermeil, Lab Grown White Sapphire",
    colors: ["#d9d9d9", "#d7b36a"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "TUBE MEDIUM HOOPS",
    price: "$188",
    material: "18k Gold Vermeil",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "ROUND LAB GROWN SAPPHIRE BRACELET",
    price: "$158",
    material: "18k Gold Vermeil, Lab Grown Sapphire",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "NEW",
    name: "ROUND LAB GROWN SAPPHIRE STUDS",
    price: "$118",
    material: "18k Gold Vermeil, Lab Grown Sapphire",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "BOLD HUGGIE HOOPS",
    price: "$128",
    material: "18k Gold Vermeil",
    colors: ["#d9d9d9", "#d7b36a"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
  },
];

export default function ShopPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHidePromoBar(true);
      } else {
        setHidePromoBar(false);
      }
      
      // Show back to top button when scrolled down
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Infinite scroll - load more when near bottom
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 500;
      
      if (scrollPosition >= bottomPosition && !isLoading && hasMore) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const loadMoreProducts = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      
      // Simulate loading more products (duplicate for demo)
      // In real app, this would be API call with page number
      if (nextPage <= 3) { // Show up to 3 pages for demo
        setDisplayedProducts(prev => [...prev, ...products]);
        setCurrentPage(nextPage);
        
        // Update URL with page number without creating history entries
        window.history.replaceState({}, '', `?page=${nextPage}`);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 800);
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
      {/* Category Tiles }*/}
      <section className="bg-[#F8F8F8] px-4 py-8 pt-[130px] md:px-8 xl:mx-auto xl:max-w-[1920px]">
        <h1 className="mb-8 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black">SHOP ALL</h1>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
          {categories.map((category) => (
            <div key={category.name} className="group relative h-[160px] w-[160px] shrink-0 cursor-pointer overflow-hidden">
              <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20" />
              <h3 className="absolute bottom-4 left-4 font-sans text-[16px] font-bold uppercase tracking-[0.05em] text-white">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

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
            <span className="font-mono text-[14px] text-[#79786c]">({displayedProducts.length} Products)</span>
            <button className="font-sans text-[12px] font-bold uppercase tracking-[0.02em] text-[#0A0A0A] underline">SORT</button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="bg-[#F8F8F8] py-0">
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
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        )}
        
        {/* End of products message */}
        {!hasMore && !isLoading && (
          <div className="py-12 text-center">
            <p className="font-sans text-[14px] uppercase tracking-[0.02em] text-[#79786c]">You've reached the end</p>
          </div>
        )}
      </section>

      {/* More Ways to Shop */}
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
            <h3 className="mt-4 inline-flex border-b-2 border-black pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black transition-colors duration-300 ease-in-out">BEST SELLERS</h3>
          </div>
          <div className="group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=90" 
                alt="Personalized" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 inline-flex border-b-2 border-black pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black transition-colors duration-300 ease-in-out">PERSONALIZED</h3>
          </div>
          <div className="group cursor-pointer">
            <div className="relative h-[280px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=90" 
                alt="Before We Melt" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 inline-flex border-b-2 border-black pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black transition-colors duration-300 ease-in-out">BEFORE WE MELT</h3>
          </div>
        </div>
      </section>

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
          <button className="shrink-0 border border-black bg-white px-6 py-3 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black hover:bg-black hover:text-white">MEN'S</button>
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
