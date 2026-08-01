"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";
import { Footer } from "@/components/Footer";
import { ChatButton } from "@/components/ChatButton";

type MediaItem = {
  src?: string;
  video?: string;
  poster?: string;
  alt: string;
  span?: "wide" | "tall" | "full";
};

type FeatureLink = {
  label: string;
  href: string;
};

export type GuidedStoryPageData = {
  eyebrow: string;
  title: string;
  copy: string;
  navLinks?: FeatureLink[];
  sections: {
    id: string;
    title: string;
    copy?: string;
    cta?: FeatureLink;
    media: MediaItem[];
  }[];
  videoFeature?: {
    title: string;
    copy: string;
    poster: string;
    video: string;
  };
  exploreMore?: {
    title: string;
    items: {
      title: string;
      href: string;
      image: string;
      alt: string;
    }[];
  };
  seo?: {
    title: string;
    paragraphs: string[];
  };
};

function BagIcon() {
  return (
    <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="20" height="14" rx="0.5" stroke="currentColor" />
      <path d="M17 11V6C17.039 3.22 14.76 1.04 12 1C9.24 1.04 6.961 3.22 7 6V11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseMark() {
  return (
    <span className="absolute bottom-4 right-5 z-10 flex gap-1 text-white">
      <span className="block h-5 w-1 bg-current" />
      <span className="block h-5 w-1 bg-current" />
    </span>
  );
}

function StoryMedia({ item }: { item: MediaItem }) {
  const spanClass =
    item.span === "wide"
      ? "lg:col-span-2 aspect-[1.72]"
      : item.span === "full"
        ? "lg:col-span-4 aspect-[2.08]"
        : item.span === "tall"
          ? "aspect-[0.72]"
          : "aspect-[0.82]";

  return (
    <div className={`relative overflow-hidden bg-[#f4f4f4] ${spanClass}`}>
      {item.video ? (
        <video
          className="h-full w-full object-cover"
          poster={item.poster}
          src={item.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img className="h-full w-full object-cover" src={item.src} alt={item.alt} loading="lazy" />
      )}
      <Link
        href="/collections/shop-all"
        className="absolute bottom-4 left-5 z-10 flex items-center gap-1 bg-white px-3 py-1.5 font-sans text-[14px] uppercase leading-none text-black hover:bg-black hover:text-white"
      >
        <BagIcon />
        Shop the look
      </Link>
      {item.video ? <PauseMark /> : null}
    </div>
  );
}

function SeoCopy({ seo }: { seo: NonNullable<GuidedStoryPageData["seo"]> }) {
  return (
    <section className="bg-[#eeeeee] px-[5vw] pb-10 pt-8 text-center">
      <div className="mx-auto max-w-[720px]">
        <h2 className="font-sans text-[15px] font-bold uppercase leading-[1.2]">{seo.title}</h2>
        <div className="mt-3 space-y-7 text-left font-mono text-[12px] leading-[1.35] tracking-normal text-black">
          {seo.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuidedStoryPage({ data }: { data: GuidedStoryPageData }) {
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

      <section className="grid gap-14 px-10 pb-16 pt-[155px] lg:grid-cols-[1.1fr_0.9fr] lg:px-[100px] lg:pt-[190px]">
        <div>
          <p className="font-sans text-[14px] font-bold uppercase leading-none">{data.eyebrow}</p>
          <h1 className="mt-6 max-w-[780px] font-sans text-[38px] font-bold uppercase leading-[1.05] tracking-[0.04em] md:text-[40px]">
            {data.title}
          </h1>
          <p className="mt-5 max-w-[820px] font-mono text-[18px] leading-[1.25]">{data.copy}</p>
        </div>
        {data.navLinks?.length ? (
          <div className="grid content-start gap-x-14 gap-y-10 pt-10 sm:grid-cols-2">
            {data.navLinks.map((item) => (
              <a key={item.href} href={item.href} className="w-fit border-b border-black font-sans text-[30px] font-bold uppercase leading-none tracking-[0.04em]">
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </section>

      {data.sections.map((section) => (
        <section key={section.id} id={section.id} className="px-10 pt-16 lg:px-[100px]">
          <h2 className="font-sans text-[36px] font-bold uppercase leading-none tracking-[0.04em] md:text-[40px]">
            {section.title}
          </h2>
          {section.copy ? <p className="mt-7 max-w-[850px] font-mono text-[18px] leading-[1.25]">{section.copy}</p> : null}
          {section.cta ? (
            <Link href={section.cta.href} className="mt-7 inline-block border-b border-black font-sans text-[15px] font-bold uppercase leading-none">
              {section.cta.label}
            </Link>
          ) : null}
          <div className="grid gap-5 pt-9 md:grid-cols-2 xl:grid-cols-4">
            {section.media.map((item) => (
              <StoryMedia key={`${section.id}-${item.alt}`} item={item} />
            ))}
          </div>
        </section>
      ))}

      {data.videoFeature ? (
        <section className="px-10 py-24 lg:px-[100px]">
          <h2 className="font-sans text-[38px] font-bold uppercase leading-none tracking-[0.04em] md:text-[40px]">
            {data.videoFeature.title}
          </h2>
          <p className="mt-8 font-mono text-[18px] leading-[1.25]">{data.videoFeature.copy}</p>
          <div className="mt-14 overflow-hidden bg-[#f4f4f4]">
            <video
              className="h-[420px] w-full object-cover md:h-[620px]"
              poster={data.videoFeature.poster}
              src={data.videoFeature.video}
              controls
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </section>
      ) : null}

      {data.exploreMore ? (
        <section className="px-10 py-24 lg:px-[100px]">
          <h2 className="font-sans text-[38px] font-bold uppercase leading-none tracking-[0.04em] md:text-[40px]">
            {data.exploreMore.title}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:w-[48%]">
            {data.exploreMore.items.map((item) => (
              <Link href={item.href} className="block" key={item.title}>
                <img className="aspect-[0.82] w-full object-cover" src={item.image} alt={item.alt} loading="lazy" />
                <span className="mt-4 inline-block border-b border-black font-sans text-[15px] font-bold uppercase leading-[1.1]">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {data.seo ? <SeoCopy seo={data.seo} /> : null}
      <Footer />
      <ChatButton />
    </main>
  );
}
