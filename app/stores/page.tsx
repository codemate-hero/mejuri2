"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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

const regions = [
  "ALL STORES",
  "AUSTRALIA",
  "CANADA",
  "MIDDLE EAST",
  "UK",
  "US - MIDWEST",
  "US - NORTHEAST",
  "US - SOUTHEAST",
  "US - SOUTHWEST",
  "US - WEST",
];

const services = [
  {
    title: "PIERCING STUDIO",
    description: "Create your dream ear stack with an expert piercer, and discover our lobe and cartilage flat back studs.",
    cta: "CREATE YOUR STACK",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1763568937/2025/Web%20Evergreen/Web%20Evergreen%20November/191125%20-%20Piercing%20banner/piercing%20content%20card.jpg",
  },
  {
    title: "COMPLIMENTARY IN-STORE STYLING",
    description: "Chat with a stylist one-on-one for expert stacking advice. Available in-store.",
    cta: null,
    image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1731611229/2024/Web%20Evergreen/November%20%7C%20Image%20Updates/StylingAppointment_StoreHub_ContentCard.jpg",
  },
];

export default function StoresPage() {
  const [selectedRegion, setSelectedRegion] = useState("ALL STORES");
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores from API
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let ignore = false;

    async function fetchStores() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (selectedRegion !== "ALL STORES") {
          params.append("region", selectedRegion);
        }
        params.append("limit", "100");

        const response = await fetch(`/api/stores?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }

        const data = await response.json();
        if (!ignore) {
          setStores(data.stores || []);
        }
      } catch (err) {
        if (!ignore && !controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load stores");
          console.error("Error fetching stores:", err);
        }
      } finally {
        window.clearTimeout(timeout);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchStores();

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [selectedRegion]);

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

      <main className="lg:pt-[114px]">
        {/* Hero Section */}
        <section className="bg-[#F8F8F8] px-4 py-16 md:px-8 xl:mx-auto xl:max-w-[1920px]">
          <h1 className=" text-center font-sans text-[48px] font-semibold uppercase tracking-[0.05em] text-black md:text-[64px]">
            OUR STORES
          </h1>
        </section>

        {/* Region Filter */}
        <section className="bg-white lg:px-20 md:px-8 px-4  lg:py-12 pt-12 xl:mx-auto xl:max-w-[1920px]">
          <h2 className="mb-8 font-sans text-[24px] font-semibold uppercase tracking-[0.05em] text-black">
            SELECT YOUR REGION
          </h2>
          {/* slider */}
          <Swiper
            slidesPerView={'auto'}
            speed={600}
            className={`relative w-full`}
          >
            {regions?.map((region, index) => (
              <SwiperSlide key={index} className="!w-auto first:ml-0 ml-3">
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`shrink-0 px-6 py-3 cursor-pointer bg-[#ebebe8] hover:text-white hover:bg-[#79786c] font-sans text-[13px] font-semibold uppercase tracking-[0.02em] transition-colors ${selectedRegion === region
                    ? "border-2 border-black  text-black"
                    : "border border-[#D4D4D4] bg-[#F8F8F8] text-black"
                    }`}
                >
                  {region}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <div className="no-scrollbar flex flex-wrap gap-3 overflow-x-auto">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`shrink-0 px-6 py-3 cursor-pointer bg-[#ebebe8] hover:text-white hover:bg-[#79786c] font-sans text-[13px] font-semibold uppercase tracking-[0.02em] transition-colors ${selectedRegion === region
                  ? "border-2 border-black  text-black"
                  : "border border-[#D4D4D4] bg-[#F8F8F8] text-black"
                  }`}
              >
                {region}
              </button>
            ))}
          </div> */}
        </section>

        {/* Store Cards */}
        <section className="bg-white lg:px-20 md:px-8 px-4 py-8  xl:mx-auto xl:max-w-[1920px]">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="font-sans text-[16px] uppercase tracking-[0.05em] text-[#79786c]">
                Loading stores...
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="font-sans text-[16px] uppercase tracking-[0.05em] text-red-600">
                {error}
              </div>
            </div>
          ) : stores.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="font-sans text-[16px] uppercase tracking-[0.05em] text-[#79786c]">
                No stores found in this region
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stores.map((store) => {
                const storeSlug = store.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={store._id}
                    href={`/stores/${storeSlug}`}
                    className="group block cursor-pointer h-full bg-[#fcf6ee]"
                  >
                    <div className="relative aspect-[1.6] overflow-hidden ">
                      {store.image ? (
                        <img
                          src={store.image}
                          alt={`${store.name} store`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-sans text-[14px] uppercase tracking-[0.05em] text-[#79786c]">
                            {store.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 py-5 px-4 ">
                      <p className="font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-[#79786c]">
                        {store.city}
                      </p>
                      <h3 className="font-sans text-[20px] font-semibold uppercase tracking-[0.05em] text-black">
                        {store.name}
                      </h3>
                      <p className="font-mono text-[14px] leading-[1.3] text-black">
                        {store.address}
                      </p>
                      <span className="inline-block font-sans text-[14px] font-semibold uppercase tracking-[0.02em] text-black underline hover:opacity-70">
                        VIEW STORE INFO
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Services Section */}
        <section className=" md:py-16 pb-16 pt-4 lg:px-20 md:px-8 px-4 :mx-auto xl:max-w-[1920px]">
          <h2 className="md:mb-12 mb-4 font-sans text-[2rem] font-semibold uppercase tracking-[0.05em] text-black md:text-[48px]">
            OUR SERVICES
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((service, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="relative h-[500px] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 space-y-4">
                  <h3 className="font-sans font-semibold text-[24px] font-bold uppercase tracking-[0.05em] text-black">
                    {service.title}
                  </h3>
                  <p className="max-w-xl font-mono text-[14px] leading-[1.3] text-black">
                    {service.description}
                  </p>
                  {service.cta && (
                    <button className="font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black underline hover:opacity-70">
                      {service.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
