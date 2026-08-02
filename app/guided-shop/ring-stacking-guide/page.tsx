"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";

const imageBase = "/ring-stacking-guide";

const guideImage = (name: string) => `${imageBase}/${name}`;

const heroImages = {
  desktop: guideImage("DT-01_Hero_DT.jpg"),
  mobile: guideImage("M-01_Hero_M.jpg"),
};

const ringImages = [
  "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-PaveDiamondThinDomeRing-14K-Angled_498_new.png?v=1757697394&width=600",
  "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-NewTexture_BoldOpenDomeRing_SS_OffFigAngledView_PDP.jpg?v=1759431690&width=700",
  "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-TheNewRingStack_SlimCharlotteStackerSet_V_OffFigureStyledStack_2Rings_PDP.jpg?v=1758723208&width=700",
  "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-CharlotteBold_Ring_V_Hero_new.png?v=1757697295&width=700",
  "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-VermeilLES_DotRing_V_OffFigAngledView_PDP.png?v=1758736411&width=600",
];

const occasionRows = [
  {
    title: "HOLIDAY LOOKS",
    text: "Statement stacks made for every invitation on your calendar.",
    cta: "SHOP HOLIDAY LOOKS",
    href: "/collections/rings",
    images: Array.from({ length: 5 }, (_, index) =>
      guideImage(`DT-03_Holiday-Looks-HolidayLooks${index + 1}_DT.jpg`),
    ),
  },
  {
    title: "WORK",
    text: "A little extra polish, but still you.",
    cta: "SHOP WORK",
    href: "/collections/dress-up-dress-down?category=rings",
    images: Array.from({ length: 5 }, (_, index) => guideImage(`DT-04_Work-Work${index + 1}_DT.jpg`)),
  },
  {
    title: "WEEKEND",
    text: "Relaxed, refined, ready for wherever the day goes.",
    cta: "SHOP WEEKEND",
    href: "/collections/weekend-jewelry?category=rings",
    images: Array.from({ length: 5 }, (_, index) =>
      guideImage(`DT-05_Weekend-Weekend${index + 1}_DT.jpg`),
    ),
  },
  {
    title: "WEDDING",
    text: "Special stacks for special occasions.",
    cta: "SHOP WEDDING",
    href: "/collections/wedding?category=rings",
    images: ["Wedding1", "Wedding2", "Weekend3", "Weekend4", "Weekend5"].map((name) =>
      guideImage(`DT-06_Wedding-${name}_DT.jpg`),
    ),
  },
];

const collectionBlocks = [
  {
    title: "PUZZLE",
    text: "Designed to fit together. Built to stand out. Destined to be your new favorite stacker.",
    cta: "SHOP PUZZLE",
    href: "/collections/puzzle",
    image: guideImage("DT-07_Collection-Collection1_DT.jpg"),
    reverse: false,
  },
  {
    title: "DÔME FIGURE COLLECTION",
    text: "Open and inviting, shaped by thoughtful, deliberate movement.",
    cta: "DÔME FIGURE COLLECTION",
    href: "/collections/dome-figure-rings",
    image: guideImage("DT-07_Collection-Collection2_DT.jpg"),
    reverse: true,
  },
  {
    title: "CHARLOTTE COLLECTION",
    text: "Born in Paris, shaped in New York, Charlotte's signature soft curves and fluted texture create a playful twist on a classic silhouette.",
    cta: "SHOP CHARLOTTE",
    href: "/collections/charlotte",
    image: guideImage("DT-07_Collection-Collection3_DT.jpg"),
    reverse: false,
  },
  {
    title: "DÔME COLLECTION",
    text: "A study in perspective. Dôme's artful silhouette embraces the duality between structure and movement.",
    cta: "SHOP DÔME",
    href: "/collections/dome",
    image: guideImage("DT-07_Collection-Collection4_DT.jpg"),
    reverse: true,
  },
];

const communityImages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12].map((number) =>
  guideImage(`DT-08_Community-Community${number}_DT.jpg`),
);

function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-sans text-[30px] font-semibold uppercase leading-[1.08] tracking-[0.08em] text-black md:text-[40px] ${className}`}
    >
      {children}
    </h2>
  );
}

function Copy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[16px] leading-[1.25] text-black md:text-[18px] ${className}`}>
      {children}
    </p>
  );
}

function UnderlineLink({
  children,
  href = "/collections/shop-all",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-block border-b border-current font-sans text-[16px] font-semibold uppercase leading-none tracking-normal ${className}`}
    >
      {children}
    </Link>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="8.5" width="19" height="13" stroke="currentColor" />
      <path d="M17 11V6C17 3.25 14.75 1.5 12 1.5C9.25 1.5 7 3.25 7 6V11" stroke="currentColor" />
    </svg>
  );
}

function ShopLookButton() {
  return (
    <Link
      href="/collections/shop-all"
      className="absolute bottom-4 left-4 flex items-center gap-1 bg-white px-3 py-1.5 font-sans text-[14px] uppercase leading-none text-black"
    >
      <BagIcon />
      Shop the look
    </Link>
  );
}

function EditorialImage({
  src,
  alt,
  className = "",
  button = true,
}: {
  src: string;
  alt: string;
  className?: string;
  button?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#f5f5f5] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {button ? <ShopLookButton /> : null}
    </div>
  );
}

function StackBuilder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = ringImages.length;
  const getIndex = (index: number) => (index + total) % total;
  const firstRow = [0, 1, 2].map((offset) => ringImages[getIndex(currentIndex + offset)]);
  const secondRow = [3, 4].map((offset) => ringImages[getIndex(currentIndex + offset)]);

  return (
    <div className="mt-20 grid items-center gap-10 md:grid-cols-[1fr_400px]">
      <div className="grid gap-6">
        <div className="grid grid-cols-[48px_repeat(3,minmax(120px,1fr))_48px] items-center gap-6">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => getIndex(index - 1))}
            className="text-[36px]"
            aria-label="Previous stack"
          >
            ←
          </button>
          {firstRow.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`Stack ring ${index + 1}`}
              className="mx-auto h-[110px] w-full object-contain md:h-[170px]"
            />
          ))}
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => getIndex(index + 1))}
            className="text-[36px]"
            aria-label="Next stack"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-[repeat(2,minmax(120px,1fr))_36px] items-center gap-6">
          {secondRow.map((image, index) => (
            <img
              key={`${image}-bottom-${index}`}
              src={image}
              alt={`Stack ring option ${index + 1}`}
              className="mx-auto h-[105px] w-full object-contain md:h-[155px]"
            />
          ))}
          <button
            type="button"
            onClick={() => setCurrentIndex(0)}
            className="text-center text-[28px]"
            aria-label="Reset stack"
          >
            ↻
          </button>
        </div>
      </div>
      <div className="space-y-5">
        <Link
          href="/collections/rings"
          className="block bg-black px-6 py-5 text-center font-sans text-[16px] font-semibold uppercase text-white transition-colors hover:bg-[#79786c]"
        >
          Shop Your Stack
        </Link>
        <button
          type="button"
          onClick={() => setCurrentIndex(0)}
          className="block w-full border border-black px-6 py-5 font-sans text-[16px] font-semibold uppercase"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function OccasionRow({
  title,
  text,
  cta,
  href,
  images,
}: {
  title: string;
  text: string;
  cta: string;
  href: string;
  images: string[];
}) {
  return (
    <section className="grid gap-7 px-6 py-12 md:grid-cols-[360px_1fr] md:px-[100px] md:py-20">
      <div className="self-center">
        <Heading className="text-[28px] md:text-[34px]">{title}</Heading>
        <Copy className="mt-5 max-w-[310px] text-[15px] md:text-[16px]">{text}</Copy>
        <UnderlineLink href={href} className="mt-7">
          {cta}
        </UnderlineLink>
      </div>
      <div className="flex gap-0 overflow-x-auto">
        {images.map((image, index) => (
          <EditorialImage
            key={image}
            src={image}
            alt={`${title} stack ${index + 1}`}
            className="h-[380px] min-w-[310px] md:h-[520px] md:min-w-[390px]"
          />
        ))}
      </div>
    </section>
  );
}

function CollectionBlock({
  title,
  text,
  cta,
  href,
  image,
  reverse,
}: {
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
  reverse: boolean;
}) {
  return (
    <section
      className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}
    >
      <EditorialImage src={image} alt={title} className="h-[360px] md:h-[500px]" button={false} />
      <div className="px-6 py-8 text-white md:px-16">
        <h3 className="font-sans text-[27px] font-semibold uppercase leading-[1.1] tracking-[0.08em]">
          {title}
        </h3>
        <p className="mt-7 max-w-[620px] font-mono text-[15px] leading-[1.25]">{text}</p>
        <UnderlineLink href={href} className="mt-8 text-white">
          {cta}
        </UnderlineLink>
      </div>
    </section>
  );
}

export default function RingStackingGuidePage() {
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
    <>
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

      <main className="bg-white pt-[58px] text-black lg:pt-[98px]">
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden md:h-[calc(100vh-136px)]">
        <picture className="absolute inset-0">
          <source media="(max-width: 767px)" srcSet={heroImages.mobile} />
          <img
            src={heroImages.desktop}
            alt="Hands styled with a mixed-metal ring stack"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative px-6 text-center text-white">
          <h1 className="font-sans text-[36px] font-semibold uppercase leading-[1.05] tracking-[0.12em] md:text-[54px]">
            The Art Of The Stack
          </h1>
          <p className="mt-6 font-mono text-[18px] leading-none md:text-[21px]">Step into our Stacking Studio.</p>
        </div>
      </section>

      <section className="grid gap-12 bg-black px-6 py-16 text-white md:grid-cols-[1fr_1fr] md:px-[100px] md:py-20">
        <div>
          <h2 className="font-sans text-[31px] font-semibold uppercase leading-[1.08] tracking-[0.08em] md:text-[38px]">
            Play, Mix, Stack, Repeat.
          </h2>
          <p className="mt-5 max-w-[760px] font-mono text-[15px] leading-[1.25] md:text-[16px]">
            We make fine jewelry for stacking. Create the look you want with the pieces you love most.
          </p>
        </div>
        <div className="grid gap-x-10 gap-y-7 md:grid-cols-2">
          {[
            ["CREATE YOUR STACK", "#create-your-stack"],
            ["MIXED METALS", "#mixed-metals"],
            ["OCCASIONS", "#occasions"],
            ["COLLECTIONS", "#collections"],
            ["COMMUNITY", "#community"],
            ["WORK WITH A STYLIST", "#work-with-a-stylist"],
          ].map(([label, href]) => (
            <UnderlineLink key={label} href={href} className="w-fit text-[22px] text-white md:text-[27px]">
              {label}
            </UnderlineLink>
          ))}
        </div>
      </section>

      <section id="create-your-stack" className="px-6 py-16 md:px-[100px] md:py-24">
        <Heading>Create Your Stack</Heading>
        <Copy className="mt-6 max-w-[760px]">Mix metals, colors, and textures till you love the look. There are no wrong answers.</Copy>
        <StackBuilder />
      </section>

      <section id="mixed-metals" className="px-6 py-12 md:px-[100px] md:py-20">
        <Heading>Mixed Metal Stacking</Heading>
        <Copy className="mt-6 max-w-[820px]">Gold-meets-silver-meets-you. Contrast is the new coordination.</Copy>
        <div className="mt-16 grid md:grid-cols-2">
          <EditorialImage
            src={guideImage("DT-02_Mixed-Metals-MixedMetal1_DT.jpg")}
            alt="Mixed metal stack one"
            className="h-[420px] md:h-[620px]"
          />
          <EditorialImage
            src={guideImage("DT-02_Mixed-Metals-MixedMetal2_DT.jpg")}
            alt="Mixed metal stack two"
            className="h-[420px] md:h-[620px]"
          />
        </div>
      </section>

      <section id="occasions">
        <div className="px-6 pt-14 md:px-[100px]">
          <Heading>Stacks By Occasion</Heading>
        </div>
        {occasionRows.map((row) => (
          <OccasionRow key={row.title} {...row} />
        ))}
      </section>

      <section id="collections" className="bg-black px-0 py-16 text-white md:py-24">
        <div className="px-6 md:px-[100px]">
          <h2 className="font-sans text-[31px] font-semibold uppercase leading-[1.08] tracking-[0.08em] md:text-[38px]">
            Collections Designed For Stacking
          </h2>
          <p className="mt-7 font-mono text-[16px] leading-[1.25]">Made to layer, made to live in.</p>
        </div>
        <div className="mt-16 space-y-16 px-6 md:px-[100px]">
          {collectionBlocks.map((block) => (
            <CollectionBlock key={block.title} {...block} />
          ))}
        </div>
      </section>

      <section id="community" className="px-6 py-16 md:px-[100px] md:py-24">
        <Heading>How Our Community Stacks</Heading>
        <Copy className="mt-6">Real people. Real stacks. All the inspiration.</Copy>
        <div className="mt-14 flex gap-5 overflow-x-auto">
          {communityImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Community stack ${index + 1}`}
              className="h-[460px] min-w-[280px] object-cover md:h-[650px] md:min-w-[360px]"
            />
          ))}
        </div>
      </section>

      <section id="work-with-a-stylist" className="px-6 py-16 md:px-[100px] md:py-24">
        <Heading>Work With A Stylist</Heading>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-[1.4fr_0.6fr]">
          <img
            src={guideImage("DT-09_Stores-Stores2_DT.jpg")}
            alt="A Mejuri store where a stylist can help build a ring stack"
            className="h-[380px] w-full object-cover md:h-[620px]"
          />
          <div>
            <Copy className="mt-5">Stop by and let our stylists help you build your perfect stack.</Copy>
            <UnderlineLink href="/stores" className="mt-7">
              Find A Store
            </UnderlineLink>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
