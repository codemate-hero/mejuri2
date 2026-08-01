"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";

const accountTabs = [
  {
    label: "Profile",
    href: "/account/profile",
  },
  {
    label: "Membership Perks",
    href: "/account/membership",
  },
  {
    label: "Orders",
    href: "/account/orders",
  },
  {
    label: "Addresses",
    href: "/account/addresses",
  },
  {
    label: "Store Credit & Gift Cards",
    href: "/account/store-credit",
  },
];

const emptyStateLinks = [
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
  {
    label: "Shop All",
    href: "/collections/shop-all",
  },
  {
    label: "All Rings",
    href: "/collections/rings",
  },
  {
    label: "New Arrivals",
    href: "/collections/new",
  },
];

export default function OrdersPage() {
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;

      setIsScrolled(scrolled);
      setHidePromoBar(scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;

  return (
    <div className="min-h-screen bg-white text-black">
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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main className="pt-[118px]">
        <section className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-16 md:px-10 lg:px-[80px]">
          <h1 className="font-sans text-[48px] font-bold uppercase leading-none tracking-[0.02em] text-black md:text-[64px] lg:text-[72px]">
            My Orders
          </h1>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {accountTabs.map((tab) => {
              const isActive = tab.href === "/account/orders";

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex h-[48px] shrink-0 items-center justify-center border px-6 font-sans text-[13px] font-normal uppercase tracking-[0.01em] transition md:h-[54px] md:px-8 md:text-[14px] ${
                    isActive
                      ? "border-black bg-[#c7c7c7] text-black"
                      : "border-transparent bg-[#d1d1d1] text-black hover:border-black"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-10 border-t border-black pt-8">
            <h2 className="font-sans text-[18px] font-bold leading-[24px] text-black">
              You haven&apos;t placed any orders yet.
            </h2>

            <p
              className='mt-1 font-[SimonMono,"Courier_New",Courier,monospace] text-[14px] font-normal leading-[20px] text-black'
            >
              Stack up on something new
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {emptyStateLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex h-[58px] items-center justify-center border border-black px-6 font-sans text-[16px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-black hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black bg-[#b8b8b8]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:px-[80px]">
            <div>
              <h2 className="font-sans text-[26px] font-bold uppercase leading-[32px] tracking-[0.04em] text-black md:text-[30px]">
                Our Sustainability Progress
              </h2>

              <Link
                href="/sustainability"
                className="mt-6 inline-block font-sans text-[14px] font-bold uppercase text-black underline underline-offset-4"
              >
                View Sustainability Report
              </Link>
            </div>

            <p
              className='max-w-[620px] font-[SimonMono,"Courier_New",Courier,monospace] text-[14px] font-normal leading-[20px] text-black lg:ml-auto'
            >
              Our journey mirrors that of the jewelry we create—crafted through
              collaboration and constant evolution. We&apos;re here to transform fine
              jewelry into everyday moments, empower women, and drive meaningful
              change in our communities and beyond.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}