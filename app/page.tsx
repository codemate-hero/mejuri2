"use client";

import { useEffect, useState } from "react";
import { PromoBar } from "@/components/PromoBar";
import { NavbarHome } from "@/components/NavbarHome";
import { SearchModal } from "@/components/SearchModal";
import { HeroVideo } from "@/components/HeroVideo";
import { SummerGuideIntro } from "@/components/SummerGuideIntro";
import { ShopTheLook } from "@/components/ShopTheLook";
import { StoryBlock } from "@/components/StoryBlock";
import { PromoTiles } from "@/components/PromoTiles";
import { Products } from "@/components/Products";
import { StoresServices } from "@/components/StoresServices";
import { Footer } from "@/components/Footer";
import { ChatButton } from "@/components/ChatButton";

export default function App() {
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Hide promo bar immediately on any scroll
      setHidePromoBar(scrollY > 0);
      setIsScrolled(scrollY > 10); // ← add this
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
      <NavbarHome
        isScrolled={isScrolled}  
        hidePromoBar={hidePromoBar}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMegaMenuOpen={isMegaMenuOpen}
        setIsMegaMenuOpen={setIsMegaMenuOpen}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <HeroVideo />
      {/* <SummerGuideIntro /> */}
      {/* <ShopTheLook /> */}
      <StoryBlock />
      <PromoTiles />
      <Products />
      <StoresServices />
      <Footer />
      <ChatButton />
    </main>
  );
}
