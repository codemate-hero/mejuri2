"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";

interface Product {
    _id: string;
    title: string;
    handle: string;
    images: { src: string }[];
    variants: { price: number; option1?: string }[];
    tags?: string[];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [transformedProducts, setTransformedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isScrolled, setIsScrolled] = useState(false);
    const [hidePromoBar, setHidePromoBar] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=100`);
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        }
        if (query) fetchProducts();
    }, [query]);

    // Transform for ProductCard
    useEffect(() => {
        const transformed = products.map((p) => {
            const material = p.variants[0]?.option1 || "Unknown";
            const price = `$${p.variants[0]?.price || 0}`;
            return {
                name: p.title.toUpperCase(),
                price,
                material,
                colors: ["#d7b36a"], // default color
                image: p.images[0]?.src,
                imageHover: p.images[1]?.src || p.images[0]?.src,
                badge: p.tags?.includes("new") ? "NEW" : "",
                handle: p.handle,
            };
        });
        setTransformedProducts(transformed);
    }, [products]);

    useEffect(() => {
        const handleScroll = () => {
            setHidePromoBar(window.scrollY > 0);
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;

    return (
        <div className="min-h-screen bg-white">
            <PromoBar isScrolled={hidePromoBar} hideForSidebar={hideForSidebar} />
            <Navbar
                isScrolled={isScrolled}
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
            <section className="bg-[#F8F8F8] px-4 py-8 pt-[130px] md:px-8 xl:mx-auto xl:max-w-[1920px]">
                <h1 className="mb-2 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black">
                    Search Results
                </h1>
                <p className="font-sans text-[14px] text-[#79786c]">
                    Showing results for "{query}"
                </p>
            </section>

            {/* Products Grid */}
            <main className="bg-[#F8F8F8] pb-16 px-4 md:px-8 xl:mx-auto xl:max-w-[1920px] border-t" style={{ borderColor: 'rgba(178,176,161,1)' }}>
                {!loading && !error && transformedProducts.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ borderColor: 'rgba(178,176,161,1)' }}>
                        {transformedProducts.map((product, index) => (
                            <div
                                key={index}
                                className="border-b border-r"
                                style={{ borderColor: 'rgba(178,176,161,1)' }}
                            >
                                <ProductCard key={product.handle} product={product} layout="grid" />
                            </div>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
                    </div>
                )}

                {!loading && !error && transformedProducts.length === 0 && (
                    <p className="text-center text-gray-400 py-20">No products found for "{query}"</p>
                )}

                {error && (
                    <p className="text-center text-red-600 py-20">{error}</p>
                )}
            </main>

            <Footer />
        </div>
    );
}