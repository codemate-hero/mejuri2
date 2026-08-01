"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";

interface Store {
  _id: string;
  city: string;
  name: string;
  address: string;
  storeUrl: string;
  image: string;
  region: string;
  brand: string;
}

export default function StoreDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabs = [
    "BUY ONLINE, PICK UP IN STORE",
    "PIERCING",
    "COMPLIMENTARY CLEANING",
    "STYLING APPOINTMENT",
  ];

  // Fetch store data
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let ignore = false;

    async function fetchStore() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/stores?limit=100`, {
          signal: controller.signal,
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch store");
        }
        
        const data = await response.json();
        // Find the store by slug (convert name to slug format)
        const foundStore = data.stores.find((s: Store) => {
          const storeSlug = s.name.toLowerCase().replace(/\s+/g, '-');
          return storeSlug === slug;
        });
        
        if (!foundStore) {
          throw new Error("Store not found");
        }
        
        if (!ignore) {
          setStore(foundStore);
        }
      } catch (err) {
        if (!ignore && !controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load store");
          console.error("Error fetching store:", err);
        }
      } finally {
        window.clearTimeout(timeout);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchStore();

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    const handlePageShow = () => {
      setLoading(false);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setIsMegaMenuOpen(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
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
        <div className="flex min-h-screen items-center justify-center pt-[114px]">
          <div className="font-sans text-[16px] uppercase tracking-[0.05em] text-[#79786c]">
            Loading store...
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-white">
        <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
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
        <div className="flex min-h-screen items-center justify-center pt-[114px]">
          <div className="font-sans text-[16px] uppercase tracking-[0.05em] text-red-600">
            {error || "Store not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
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

      <main className="pt-[114px]">
        {/* Hero Section */}
        <section className="bg-white px-4 py-16 text-center md:px-8">
          <p className="mb-4 font-sans text-[14px] font-bold uppercase tracking-[0.05em] text-[#79786c]">
            {store.city}
          </p>
          <h1 className="font-sans text-[48px] font-bold uppercase tracking-[0.05em] text-black md:text-[72px]">
            {store.name}
          </h1>
        </section>

        {/* Marquee Tabs */}
        <section className="border-b border-t border-white bg-black overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* First set */}
            {tabs.map((tab, index) => (
              <span
                key={`tab-1-${index}`}
                className="inline-block shrink-0 px-8 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.05em] text-white md:text-[12px]"
              >
                {tab}
              </span>
            ))}
            {/* Second set */}
            {tabs.map((tab, index) => (
              <span
                key={`tab-2-${index}`}
                className="inline-block shrink-0 px-8 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.05em] text-white md:text-[12px]"
              >
                {tab}
              </span>
            ))}
            {/* Third set */}
            {tabs.map((tab, index) => (
              <span
                key={`tab-3-${index}`}
                className="inline-block shrink-0 px-8 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.05em] text-white md:text-[12px]"
              >
                {tab}
              </span>
            ))}
            {/* Fourth set for seamless loop */}
            {tabs.map((tab, index) => (
              <span
                key={`tab-4-${index}`}
                className="inline-block shrink-0 px-8 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.05em] text-white md:text-[12px]"
              >
                {tab}
              </span>
            ))}
          </div>
        </section>

        {/* Store Image and Info Section */}
        <section className="px-4 py-12 md:px-8 xl:mx-auto xl:max-w-[1920px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Store Image */}
            <div className="h-[500px] overflow-hidden bg-[#F8F8F8] lg:h-[600px]">
              {store.image ? (
                <img
                  src={store.image}
                  alt={`${store.name} store`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-sans text-[14px] uppercase tracking-[0.05em] text-[#79786c]">
                    {store.name}
                  </span>
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-8 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black">
                  STORE INFO
                </h2>

                {/* Address */}
                <div className="mb-6 flex items-start gap-4">
                  <svg
                    className="mt-1 h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="font-mono text-[16px] leading-relaxed text-black">
                    {store.address}
                  </p>
                </div>

                {/* Phone */}
                <div className="mb-6 flex items-center gap-4">
                  <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:+17186918913"
                    className="font-mono text-[16px] text-black hover:underline"
                  >
                    +17186918913
                  </a>
                </div>

                {/* Hours */}
                <div className="mb-6 flex items-start gap-4">
                  <svg
                    className="mt-1 h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-mono text-[16px] text-black">
                      Monday to Sunday: 11am - 7pm
                    </p>
                    <p className="font-mono text-[14px] italic text-[#79786c]">
                      Hours are subject to change.
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="flex items-start gap-4">
                  <svg
                    className="mt-1 h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-mono text-[16px] font-bold text-black">
                      Credit & Debit
                    </p>
                    <p className="font-mono text-[14px] text-black">
                      Mejuri Gift Card & Store Credit
                    </p>
                    <p className="font-mono text-[14px] text-black">Apple Pay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white px-4 py-16 md:px-8 xl:mx-auto xl:max-w-[1920px]">
          <h2 className="mb-12 font-sans text-[32px] font-bold uppercase tracking-[0.05em] text-black md:text-[48px]">
            SERVICES
          </h2>

          {/* Piercing Service */}
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-[400px] overflow-hidden bg-[#F8F8F8]">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=90"
                alt="Book a piercing appointment"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <h3 className="font-sans text-[28px] font-bold uppercase tracking-[0.05em] text-black">
                BOOK A PIERCING APPOINTMENT
              </h3>
              <p className="max-w-xl font-mono text-[16px] leading-relaxed text-black">
                Your destination for a personalized piercing experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-black px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#333]">
                  BOOK A PIERCING APPOINTMENT
                </button>
                <button className="border border-black bg-white px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-black transition-colors hover:bg-[#F8F8F8]">
                  BOOK A CHECKUP APPOINTMENT
                </button>
              </div>
            </div>
          </div>

          {/* Styling Service */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-[400px] overflow-hidden bg-[#F8F8F8]">
              <img
                src="https://images.unsplash.com/photo-1611048268248-f97e9bc4e1c7?auto=format&fit=crop&w=900&q=90"
                alt="Get styled by us"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <h3 className="font-sans text-[28px] font-bold uppercase tracking-[0.05em] text-black">
                GET STYLED BY US
              </h3>
              <p className="max-w-xl font-mono text-[16px] leading-relaxed text-black">
                Need help curating your perfect stack? Get complimentary styling in store, including personalized product
                recommendations and advice on how to layer them.
              </p>
              <button className="w-fit border border-black bg-white px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-black transition-colors hover:bg-[#F8F8F8]">
                FIND YOUR LOCATION
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
