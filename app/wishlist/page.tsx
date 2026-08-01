"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import AddToCartDrawer from "@/components/AddToCartDrawer";

interface WishlistProduct {
  productId: {
    _id: string;
    shopifyProductId?: number;
    title: string;
    handle: string;
    productType?: string;
    vendor?: string;
    images: Array<{
      src: string;
      width: number;
      height: number;
    }>;
    variants?: Array<{
      _id?: string | { toString(): string };
      shopifyVariantId?: number;
      id?: number;
      price?: number | string;
      option1?: string;
      option2?: string;
      option3?: string;
    }>;
    tags?: string[];
  };
  variantId: number | string;
}

interface SelectedProduct {
  name: string;
  price: string;
  material: string;
  image: string;
}

interface WishlistData {
  userId: string;
  products: WishlistProduct[];
}

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("WISHLIST");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const response = await fetch("/api/wishlist", {
          headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (data.success) {
          setWishlist(data.data);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
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

  const handleAddToCart = async (product: WishlistProduct) => {
    try {
      const price = product.productId.variants?.[0]?.price || 98;
      const material = product.productId.variants?.[0]?.option1 || "";
      const variantId =
        String(
          product.productId.variants?.[0]?._id ||
            product.productId.variants?.[0]?.id ||
            product.productId.variants?.[0]?.shopifyVariantId ||
            product.productId.shopifyProductId ||
            product.variantId
        );

      setSelectedProduct({
        name: product.productId.title,
        price: `$${price}`,
        material: material,
        image: product.productId.images?.[0]?.src || "/products/product-1.webp",
      });

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productId: product.productId._id,
          variantId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        window.dispatchEvent(new Event("mejuri-cart-updated"));
        setCartOpen(true);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;
  const tabs = ["PROFILE", "MEMBERSHIP PERKS", "ORDERS", "ADDRESSES", "STORE CREDIT & GIFT CARDS", "WISHLIST"];

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
          <p className="text-lg text-black">Loading wishlist...</p>
        </div>
      </div>
    );
  }

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

      {/* Wishlist Header */}
      <div className="mx-auto max-w-[1920px] px-6 py-12 pt-[140px]">
        <h1 className="font-sans text-[56px] font-bold uppercase tracking-[0.05em] text-black mb-8">
          WISHLIST
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-6 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-sans text-[13px] font-bold uppercase tracking-[0.02em] whitespace-nowrap px-4 py-3 transition-colors ${
                activeTab === tab
                  ? "text-black border-b-2 border-black pb-2"
                  : "text-gray-600 hover:text-black bg-gray-100 rounded"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="mx-auto max-w-[1920px] px-6 pb-16">
        {!wishlist || wishlist.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 mb-4">Your wishlist is empty</p>
            <Link href="/shop" className="text-sm font-bold text-black underline hover:no-underline">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
            {wishlist.products.map((item, index) => {
              const variant = item.productId.variants?.[0] || {};
              const price = variant.price || "98";
              const material = variant.option1 || "Sterling Silver";
              const size = variant.option2 || "One Size";
              const color = variant.option3 || "";

              return (
                <div
                  key={`${item.productId._id}-${index}`}
                  className="border-b border-r bg-white"
                  style={{ borderColor: "rgba(178,176,161,1)" }}
                >
                  <div className="relative overflow-hidden bg-[#F8F8F8]">
                    {item.productId.tags?.some((tag: string) =>
                      tag.toLowerCase().includes("back in stock")
                    ) && (
                      <span className="absolute right-5 top-4 z-10 rounded-sm bg-white/90 px-3 py-2 text-[12px] uppercase text-[#777]">
                        BACK IN STOCK
                      </span>
                    )}

                    <Link href={`/products/${item.productId.handle}`}>
                      <img
                        src={item.productId.images?.[0]?.src || "/products/placeholder.png"}
                        alt={item.productId.title}
                        className="h-[420px] w-full object-cover transition duration-300 hover:opacity-90"
                      />
                    </Link>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-white border border-gray-300 px-6 py-2 text-[12px] font-bold uppercase tracking-[0.02em] text-gray-700 shadow-sm transition hover:bg-gray-100"
                    >
                      ADD +
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 font-sans text-[14px] font-bold uppercase tracking-[0.05em] text-black">
                      {item.productId.title}
                    </h3>
                    <p className="mb-4 font-mono text-[16px] font-bold text-black">
                      ${price}
                    </p>
                    <div className="mb-4 flex items-center gap-2 text-[12px] uppercase tracking-[0.06em] text-[#79786c]">
                      <span>{material}</span>
                      {color ? <span>• {color}</span> : null}
                      <span>• {size}</span>
                    </div>

                    <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.05em] text-[#79786c]">
                      SPECIFICATIONS
                    </div>
                    <div className="space-y-3 text-[12px] text-[#79786c]">
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <span>Product Type</span>
                        <span className="font-semibold text-black">{item.productId.productType || "Jewelry"}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <span>Brand</span>
                        <span className="font-semibold text-black">{item.productId.vendor || "MEJURI"}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <span>Material</span>
                        <span className="font-semibold text-black">{material}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <span>Product ID</span>
                        <span className="font-semibold text-black">{item.productId._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Add to Cart Drawer */}
      {selectedProduct && (
        <AddToCartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
