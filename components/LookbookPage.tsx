"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";
import { Footer } from "@/components/Footer";
import { ChatButton } from "@/components/ChatButton";

const media = {
  go1: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226261/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid1_DT_POSTER.jpg",
  go2: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226266/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid2_DT.jpg",
  go3: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226265/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid3_DT.jpg",
  go4Poster: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226267/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid4_DT_POSTER.jpg",
  go4Video: "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1772226273/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid4_DT.mp4",
  go5: "https://res.cloudinary.com/mejuri-com/image/upload/w_1536,q_auto,f_auto/v1772226274/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid5_DT.jpg",
  go6: "https://res.cloudinary.com/mejuri-com/image/upload/w_1536,q_auto,f_auto/v1772226279/2026/Evergreen/STL%20Guide/On%20the%20Go%20%28Thrive%29/EvergreenWeb_STLGuide_Thrive_Grid6_DT.jpg",
  night1: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226438/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid1_DT.jpg",
  night2: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226440/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid2_DT.jpg",
  night3: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226441/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid3_DT.jpg",
  night4: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226435/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid4_DT.jpg",
  night5: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226440/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid5_DT.jpg",
  night6Poster: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226433/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid6_DT_POSTER.jpg",
  night6Video: "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1773427582/2026/Evergreen/STL%20Guide/New%20AI%20Video/EvergreenWeb_STLGuide_GoOut_DT.mp4",
  night7: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226445/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid7_DT.jpg",
  dayPoster: "https://res.cloudinary.com/mejuri-com/image/upload/v1773169406/2026/Evergreen/STL%20Guide/Video/EvergreenVideo_DT_Poster.jpg",
  dayVideo: "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1773167137/2026/Evergreen/STL%20Guide/Video/EvergreenVideo_DT.mp4",
  ringGuide: "https://res.cloudinary.com/mejuri-com/image/upload/v1740175793/2025/International%20Women%27s%20Day/WEB/SHOP%20ALL/NAV/2025_IWD_ShopAll_Nav_Rings.jpg",
  gemGuide: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100786/2025/LGS/WEB/LP/LGS_LP_STL_01.jpg",
};

const navLinks = [
  { label: "ON THE GO", href: "#on-the-go" },
  { label: "ALL NIGHT LONG", href: "#all-night-long" },
  { label: "24 HOURS IN MEJURI", href: "#twenty-four-hours" },
];

type LookCardProps = {
  src?: string;
  video?: string;
  poster?: string;
  alt: string;
  className?: string;
};

function BagIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="20" height="14" rx="0.5" stroke="currentColor" />
      <path d="M17 11V6C17.039 3.22 14.76 1.04 12 1C9.24 1.04 6.961 3.22 7 6V11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <span className="absolute bottom-5 right-5 z-10 flex gap-1 text-[24px] font-bold leading-none text-white">
      <span className="block h-6 w-1 bg-current" />
      <span className="block h-6 w-1 bg-current" />
    </span>
  );
}

function ShopLookButton() {
  return (
    <Link
      href="/collections/shop-all"
      className="absolute bottom-4 left-5 z-10 flex items-center gap-1 bg-white px-3 py-1.5 font-sans text-[14px] font-normal uppercase leading-none text-black hover:bg-black hover:text-white"
    >
      <BagIcon />
      Shop the look
    </Link>
  );
}

function LookCard({ src, video, poster, alt, className = "" }: LookCardProps) {
  return (
    <div className={`relative overflow-hidden bg-[#f4f4f4] ${className}`}>
      {video ? (
        <video
          className="h-full w-full object-cover"
          poster={poster}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img className="h-full w-full object-cover" src={src} alt={alt} loading="lazy" />
      )}
      <ShopLookButton />
      {video ? <PauseIcon /> : null}
    </div>
  );
}

function SectionIntro({
  id,
  title,
  copy,
}: {
  id: string;
  title: string;
  copy: string;
}) {
  return (
    <section id={id} className="px-10 pt-20 lg:px-[100px] lg:pt-[104px]">
      <h2 className="font-sans text-[36px] font-bold uppercase leading-none tracking-[0.04em] md:text-[40px]">
        {title}
      </h2>
      <p className="mt-8 max-w-[780px] font-mono text-[18px] leading-[1.25] tracking-normal">
        {copy}
      </p>
      <Link href="/collections/dome" className="mt-8 inline-block border-b border-black font-sans text-[15px] font-bold uppercase leading-none tracking-normal">
        Shop now
      </Link>
    </section>
  );
}

function SeoCopy() {
  return (
    <section className="bg-[#eeeeee] px-[5vw] pb-10 pt-8 text-center">
      <div className="mx-auto max-w-[668px]">
        <h2 className="font-sans text-[15px] font-bold uppercase leading-[1.2]">
          Look Book - Everyday Jewelry & Lifestyle
        </h2>
        <div className="mt-2 space-y-7 text-left font-mono text-[12px] leading-[1.3] tracking-[-0.01em] text-black">
          <p>
            Discover how everyday jewelry fits seamlessly into your lifestyle. Our jewelry lookbook highlights versatile pieces styled for everything from morning coffee runs to evening plans. Explore minimalist rings, layering necklaces, and statement earrings that elevate both casual outfits and going-out looks.
          </p>
          <p>
            Designed to move effortlessly with you, Mejuri jewelry blends modern design with everyday wearability. Whether you&apos;re building a capsule jewelry collection or looking for pieces to elevate your personal style, this lookbook offers inspiration for every moment.
          </p>
          <p>
            From subtle essentials to bold accents, discover jewelry made to complement your lifestyle. These versatile pieces are designed to transition from everyday wear to nights out, helping you create looks that feel effortless and modern.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LookbookPage() {
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHidePromoBar(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
      <Navbar
        isScrolled={true}
        hidePromoBar={hidePromoBar}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMegaMenuOpen={isMegaMenuOpen}
        setIsMegaMenuOpen={setIsMegaMenuOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        variant="light"
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <section className="grid gap-16 px-10 pb-20 pt-[170px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:px-[100px] lg:pt-[205px]">
        <div>
          <p className="font-sans text-[14px] font-bold uppercase leading-none">The Lookbook</p>
          <h1 className="mt-6 max-w-[760px] font-sans text-[38px] font-bold uppercase leading-[1.05] tracking-[0.055em] md:text-[40px]">
            Jewelry you can live in
          </h1>
          <p className="mt-5 max-w-[780px] font-mono text-[18px] leading-[1.25]">
            For taking the long way home, staying for one more song, and loving the little things-like the jewelry you wear every day.
          </p>
        </div>
        <div className="grid content-start gap-x-14 gap-y-10 pt-10 sm:grid-cols-2">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="w-fit border-b border-black font-sans text-[30px] font-bold uppercase leading-none tracking-[0.04em]">
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <SectionIntro
        id="on-the-go"
        title="On the go"
        copy="Our Dôme favorites, designed to make every day feel effortless"
      />

      <section className="grid gap-5 px-10 pt-9 md:grid-cols-2 lg:px-[100px] xl:grid-cols-4">
        <LookCard src={media.go1} alt="Gold pendant detail" className="aspect-[0.82]" />
        <LookCard src={media.go2} alt="Woman wearing rings" className="aspect-[0.82]" />
        <LookCard src={media.go3} alt="Black and white ear stack" className="aspect-[0.82]" />
        <LookCard video={media.go4Video} poster={media.go4Poster} alt="Woman holding clutch" className="aspect-[0.82]" />
      </section>

      <section className="grid gap-5 px-10 pt-10 lg:grid-cols-2 lg:px-[100px]">
        <LookCard src={media.go5} alt="Woman in yellow top with layered necklaces" className="aspect-[1.02]" />
        <LookCard src={media.go6} alt="Woman in black top with layered necklaces" className="aspect-[1.02]" />
      </section>

      <SectionIntro
        id="all-night-long"
        title="All night long"
        copy="Pavé Diamond X Studs and lab grown sapphire essentials-the only accessories you need after dark."
      />

      <section className="grid gap-5 px-10 pt-9 lg:grid-cols-3 lg:px-[100px]">
        <LookCard src={media.night1} alt="Night out jewelry look one" className="aspect-[0.82]" />
        <LookCard src={media.night2} alt="Black and white ring stack" className="aspect-[0.82]" />
        <LookCard src={media.night3} alt="Woman holding a drink wearing bracelets" className="aspect-[0.82]" />
      </section>

      <section className="grid gap-5 px-10 pt-10 md:grid-cols-2 lg:px-[100px] xl:grid-cols-4">
        <LookCard src={media.night4} alt="Woman with hand on jacket" className="aspect-[0.82]" />
        <LookCard src={media.night5} alt="Close crop of ear jewelry" className="aspect-[0.82]" />
        <LookCard video={media.night6Video} poster={media.night6Poster} alt="Curved gold earring" className="aspect-[0.82]" />
        <LookCard src={media.night7} alt="Hands wearing rings and bracelets" className="aspect-[0.82]" />
      </section>

      <section id="twenty-four-hours" className="px-10 pt-36 lg:px-[100px]">
        <h2 className="font-sans text-[38px] font-bold uppercase leading-none tracking-[0.04em] md:text-[40px]">
          24 Hours in Mejuri
        </h2>
        <p className="mt-8 font-mono text-[18px] leading-[1.25]">
          Jewelry for doing what you do best: just about everything.
        </p>
        <div className="mt-14 overflow-hidden bg-[#f4f4f4]">
          <video
            className="h-[420px] w-full object-cover md:h-[620px]"
            poster={media.dayPoster}
            src={media.dayVideo}
            controls
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </section>

      <section className="px-10 py-24 lg:px-[100px]">
        <h2 className="font-sans text-[38px] font-bold uppercase leading-none tracking-[0.04em] md:text-[40px]">
          Explore More
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:w-[39%]">
          <Link href="/guided-shop/ring-stacking-guide" className="group block">
            <img className="aspect-[0.82] w-full object-cover" src={media.ringGuide} alt="Ring stacking guide" loading="lazy" />
            <span className="mt-4 inline-block border-b border-black font-sans text-[15px] font-bold uppercase leading-[1.1]">
              Ring Stacking Guide
            </span>
          </Link>
          <Link href="/edit/lab-grown-gemstones" className="group block">
            <img className="aspect-[0.82] w-full object-cover" src={media.gemGuide} alt="Lab grown gemstones guide" loading="lazy" />
            <span className="mt-4 inline-block max-w-[270px] border-b border-black font-sans text-[15px] font-bold uppercase leading-[1.1]">
              Lab Grown Gemstones Guide
            </span>
          </Link>
        </div>
      </section>

      <SeoCopy />
      <Footer />
      <ChatButton />
    </main>
  );
}
