"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChatButton } from "@/components/ChatButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";

const media = {
  gifts1:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669374/2026/Summer%20Chapter%201/PSP/Gifts%20From%20Nature/Summer_PSP_GiftsFromNature1_DT.jpg",
  gifts2Poster:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777918450/2026/Summer%20Chapter%201/PSP/Gifts%20From%20Nature/Summer_PSP_GiftsFromNature2_DT_POSTER.jpg",
  gifts2Video:
    "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777918451/2026/Summer%20Chapter%201/PSP/Gifts%20From%20Nature/Summer_PSP_GiftsFromNature2_DT.mp4",
  healing1:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669379/2026/Summer%20Chapter%201/PSP/Healing%20Stones/Summer_PSP_HealingStones1_DT.jpg",
  healing2:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669380/2026/Summer%20Chapter%201/PSP/Healing%20Stones/Summer_PSP_HealingStones2_DT.jpg",
  sunlitPoster:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777918244/2026/Summer%20Chapter%201/PSP/Sunlit%20Metals/Summer_PSP_SunlitMetals1_DT_POSTER.jpg",
  sunlitVideo:
    "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777918244/2026/Summer%20Chapter%201/PSP/Sunlit%20Metals/Summer_PSP_SunlitMetals1_DT.mp4",
  sunlit2:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669386/2026/Summer%20Chapter%201/PSP/Sunlit%20Metals/Summer_PSP_SunlitMetals2_DT.jpg",
  essentials1:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669394/2026/Summer%20Chapter%201/PSP/Essentials/Summer_PSP_Essentials1_DT.jpg",
  essentials2:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669396/2026/Summer%20Chapter%201/PSP/Essentials/Summer_PSP_Essentials2_DT.jpg",
  essentials3:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669397/2026/Summer%20Chapter%201/PSP/Essentials/Summer_PSP_Essentials3_DT.jpg",
  videoPoster:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669427/2026/Summer%20Chapter%201/PSP/Summer_PSP_Video_DT_Poster.jpg",
  video:
    "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777669460/2026/Summer%20Chapter%201/PSP/Summer_PSP_Video_DT.mp4",
};

type Product = {
  title: string;
  handle: string;
  price: string;
  material: string;
  image: string;
  badge?: string;
  colors?: string[];
  sale?: string;
};

const newSummerStyles: Product[] = [
  {
    title: "Pinch Me Necklace",
    handle: "crab-cord-necklace",
    price: "$238",
    material: "18k Gold Vermeil",
    badge: "Limited Edition",
    colors: ["#214835", "#d7b468"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-GiftsFromNature_PinchMeNecklace_V_OffFigFrontView_PDP.jpg?v=1777558686&width=700",
  },
  {
    title: "Single Ammonite Mini Stud",
    handle: "single-ammonite-mini-stud",
    price: "$178",
    material: "10k Yellow Gold",
    badge: "Limited Edition",
    colors: ["#d7b468"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-MiniStudAmmonite_Single_OffFigureFrontView2580x2160.jpg?v=1777558195&width=700",
  },
  {
    title: "Star Crossed Charm",
    handle: "star-crossed-charm",
    price: "$298",
    material: "10k Yellow Gold, Natural Diamond",
    badge: "Limited Edition",
    colors: ["#d7b468"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-_10k_StarfishCharmwTinyDiamondOffFigureFrontView2580x2160.jpg?v=1777558464&width=700",
  },
  {
    title: "Ammonite Charm",
    handle: "ammonite-charm",
    price: "$158",
    material: "18k Gold Vermeil",
    badge: "Limited Edition",
    colors: ["#d7b468"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-HealingStones_AmmoniteCharm_V_OffFigAngledView_PDP.jpg?v=1777558493&width=700",
  },
  {
    title: "Kai Pearl Collar",
    handle: "kia-pearl-collar",
    price: "$418",
    material: "Sterling Silver, Pearl",
    badge: "Limited Edition",
    colors: ["#d8d8d8", "#f7f2e9"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-HealingStones_KaiPearlCollar_SS_OffFigFrontView_PDP.jpg?v=1777556796&width=700",
  },
  {
    title: "In a Pinch Pearl Necklace",
    handle: "in-a-pinch-pearl-necklace",
    price: "$218",
    material: "18k Gold Vermeil, Pearl",
    colors: ["#d7b468", "#f7f2e9"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-CrabNecklaceVermeil_PearlOffFigureFrontView2580x2160.jpg?v=1777558852&width=700",
  },
];

const coloredStones: Product[] = [
  {
    title: "Isla Adjustable Lariat Necklace",
    handle: "isla-adjustable-lariat-necklae",
    price: "$238",
    material: "Aquamarine, Dyed Jade, Sterling Silver",
    badge: "Limited Edition",
    colors: ["#a9c8d7", "#8fb67e", "#e9e9e9"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-HealingStones_IslaAdjustableLariatNecklace_Aventurine_V_OffFigFrontView_Enhancer_PDP.jpg?v=1777556635&width=700",
  },
  {
    title: "Marina Carved Stone Charm",
    handle: "marina-carved-stone-charm",
    price: "$238",
    material: "18k Gold Vermeil, Aventurine",
    badge: "Limited Edition",
    colors: ["#d7d7d7", "#d7b468", "#73a77b"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-HealingStones_MarinaCarvedStoneCharm_Aventurine_OffFigFrontView_PDP.jpg?v=1777557053&width=700",
  },
  {
    title: "Carmen Beaded Necklace",
    handle: "carmen-beaded-necklaces",
    price: "$178",
    material: "Sodalite, 18k Gold Vermeil",
    badge: "New",
    colors: ["#0a3767", "#c9b5cf", "#c5d3e0", "#eeeeee"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-GoodLuckCharms_CarmenBeadedNecklace_Rhodolite_OffFigureFrontView_PDP.jpg?v=1772556851&width=700",
  },
  {
    title: "Mira Round Pearl Hoops",
    handle: "mira-round-pearl-hoops",
    price: "$178",
    material: "18k Gold Vermeil, Pearl",
    badge: "Back In Stock",
    colors: ["#d7b468", "#f7f2e9"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-VermeilBestSellers_PearlDropHoops_011_FOC-PDP_new_44bb1715-1db3-471a-aa6a-6de2215632c8.png?v=1758043906&width=700",
  },
  {
    title: "Jude Pinky Signet Ring",
    handle: "jude-pinky-signet-ring",
    price: "$198",
    material: "Amethyst, Sterling Silver",
    badge: "New",
    colors: ["#f4f4f0", "#f2c978", "#9bb6cf", "#a4c08f"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-PinkyRings_JudePinkySignetRing_Garnet_14K_OffFigureAngledView_PDP_new_55a9615c-da62-47cd-9191-ed17f616a8ee.png?v=1758043942&width=700",
  },
  {
    title: "Micro Pearl Anklet",
    handle: "micro-pearl-anklet",
    price: "$154.80",
    sale: "$258",
    material: "14k Yellow Gold, Pearl",
    colors: ["#d7b468", "#f7f2e9"],
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-EVILEYETURQUOISE-TeenyPearlBracelet-14K-TopDown_232_new.png?v=1757704398&width=700",
  },
];

function BagIcon() {
  return (
    <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="20" height="14" rx="0.5" stroke="currentColor" />
      <path d="M17 11V6C17.039 3.22 14.76 1.04 12 1C9.24 1.04 6.961 3.22 7 6V11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShopLookButton() {
  return (
    <Link
      href="/collections/shop-all"
      className="absolute bottom-4 left-5 z-10 inline-flex items-center gap-1 bg-white px-2.5 py-1 font-sans text-[14px] uppercase leading-none text-black hover:bg-black hover:text-white"
    >
      <BagIcon />
      Shop the look
    </Link>
  );
}

function ProductRail({ id, title, copy, cta, products }: { id: string; title: string; copy: string; cta: string; products: Product[] }) {
  return (
    <section id={id} className="py-[72px]">
      <div className="px-[5.2vw]">
        <h2 className="font-sans text-[34px] font-bold uppercase leading-none tracking-[0.08em] text-black md:text-[40px]">
          {title}
        </h2>
        <p className="mt-5 max-w-[1500px] font-mono text-[17px] leading-[1.25] text-black">{copy}</p>
        <Link href="/collections/new" className="mt-7 inline-block border-b border-black font-sans text-[15px] font-bold uppercase leading-none text-black">
          {cta}
        </Link>
      </div>
      <div className="mt-12 overflow-x-auto pb-5">
        <div className="flex min-w-max gap-5 px-0">
          {products.map((product) => (
            <Link href={`/products/${product.handle}`} key={product.title} className="group block w-[330px] shrink-0 bg-[#f7f7f7] text-black">
              <div className="relative flex h-[390px] items-center justify-center overflow-hidden bg-[#f7f7f7]">
                {product.badge ? (
                  <span className="absolute right-0 top-0 bg-[#fbfbfb] px-5 py-2 font-sans text-[14px] uppercase text-[#79786c]">
                    {product.badge}
                  </span>
                ) : null}
                <img src={product.image} alt={product.title} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
                <span className="absolute bottom-[78px] left-1/2 -translate-x-1/2 border border-[#e5e5e5] bg-white/80 px-3 py-1 font-sans text-[14px] uppercase text-[#79786c]">
                  Add +
                </span>
              </div>
              <div className="bg-[#f7f7f7] px-3 pb-4 pt-3">
                <h3 className="truncate font-sans text-[14px] font-bold uppercase leading-[1.25] text-[#68675e]">{product.title}</h3>
                <p className="mt-1 font-mono text-[13px] font-bold text-black">
                  {product.sale ? <span className="mr-2 text-[#777] line-through">{product.sale}</span> : null}
                  {product.price}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {(product.colors ?? ["#d8d8d8", "#d7b468"]).slice(0, 4).map((color, index) => (
                    <span key={`${product.title}-${color}-${index}`} className="relative h-3 w-3" style={{ backgroundColor: color }}>
                      {index === 1 ? <span className="absolute -bottom-1 left-0 h-px w-full bg-black" /> : null}
                    </span>
                  ))}
                  <span className="ml-2 max-w-[210px] truncate font-sans text-[14px] font-bold leading-none text-[#79786c]">{product.material}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden">
        <span className="font-sans text-[26px] text-[#aaa]">‹</span>
        <span className="relative h-px flex-1 bg-[#9f9b8f]">
          <span className="absolute left-0 top-0 h-px w-[22%] bg-black" />
        </span>
        <span className="font-sans text-[26px] text-black">›</span>
      </div>
      <div className="mx-auto mt-4 flex w-[380px] max-w-[70vw] items-center justify-center gap-10">
        <span className="font-sans text-[26px] text-[#aaa]">&lsaquo;</span>
        <span className="relative h-px flex-1 bg-[#9f9b8f]">
          <span className="absolute left-0 top-0 h-px w-[22%] bg-black" />
        </span>
        <span className="font-sans text-[26px] text-black">&rsaquo;</span>
      </div>
    </section>
  );
}

function SeoBlock() {
  return (
    <section className="bg-[#eeeeee] px-[5.2vw] py-10 text-black">
      <div className="mx-auto max-w-[780px]">
        <h2 className="text-center font-sans text-[16px] font-bold uppercase leading-[1.2]">Summer Jewelry Guide</h2>
        <div className="mt-4 space-y-8 font-mono text-[13px] font-bold leading-[1.28]">
          <p>
            Discover fine jewelry designed for every summer moment. From beach days to sunset dinners, Mejuri&apos;s Summer Jewelry Guide features waterproof jewelry,
            sweat-proof essentials, and timeless pieces crafted for all-day wear.
          </p>
          <p>
            Explore lightweight 14k gold jewelry, sterling silver staples, modern pearls, and styles from the Puzzle Collection designed to layer effortlessly throughout
            the season. Whether you&apos;re styling everyday hoops, stacking rings, or layering necklaces for a coastal-inspired look, these pieces are made to move with you.
          </p>
          <p>
            Crafted using high-quality materials including 14k solid gold, 10k gold, sterling silver, and freshwater pearls, Mejuri jewelry is designed for durability,
            comfort, and effortless summer styling. Build your summer jewelry rotation with pieces inspired by coastline memories, warm sunsets, and everyday adventures.
          </p>
        </div>
      </div>
    </section>
  );
}

export function SummerGuidePage() {
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

      <section className="grid gap-14 px-[5.2vw] pb-[74px] pt-[118px] lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <h1 className="font-sans text-[36px] font-bold uppercase leading-none tracking-[0.1em] md:text-[40px]">The Summer Guide</h1>
          <p className="mt-7 max-w-[760px] font-mono text-[18px] leading-[1.22]">
            In summer, jewelry becomes part of you: a chain warmed at your collarbone after a swim, a ring catching sunlight with every movement, a charm tied to
            your favorite memory.
          </p>
          <Link href="#summer-essentials" className="mt-5 inline-block border-b border-black font-sans text-[15px] font-bold uppercase leading-none">
            Shop summer essentials
          </Link>
        </div>
        <nav className="grid content-start gap-x-[70px] gap-y-10 pt-0 sm:grid-cols-2">
          <a href="#new-summer-styles" className="w-fit border-b border-black font-sans text-[30px] font-bold uppercase leading-none tracking-[0.08em]">
            New Summer Styles
          </a>
          <a href="#colored-stones" className="w-fit border-b border-black font-sans text-[30px] font-bold uppercase leading-none tracking-[0.08em]">
            Colored Stones
          </a>
          <a href="#summer-essentials" className="w-fit border-b border-black font-sans text-[30px] font-bold uppercase leading-none tracking-[0.08em] sm:col-span-2">
            Summer Essentials
          </a>
        </nav>
      </section>

      <section className="grid bg-[#f7f7f7] lg:grid-cols-2">
        <div className="relative min-h-[620px] overflow-hidden lg:min-h-[760px]">
          <img src={media.gifts1} alt="Summer jewelry styled by the water" className="h-full w-full object-cover" />
          <ShopLookButton />
        </div>
        <div className="relative flex min-h-[620px] items-center justify-center bg-[#f7f7f7] px-[6vw] py-20 lg:min-h-[760px]">
          <div className="relative w-full max-w-[670px]">
            <video
              className="aspect-[1.08] w-full object-cover"
              src={media.gifts2Video}
              poster={media.gifts2Poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <ShopLookButton />
          </div>
        </div>
      </section>

      <ProductRail
        id="new-summer-styles"
        title="New Summer Styles"
        copy="An ode to summers spent along the coastline-counting crabs, finding shells, and uncovering the treasures the tide leaves behind."
        cta="Shop all new summer styles"
        products={newSummerStyles}
      />

      <section className="px-[5.2vw] py-[92px] text-center">
        <h2 className="font-sans text-[22px] font-bold uppercase leading-none tracking-[0.06em]">Fine Jewelry For Every Day</h2>
        <p className="mx-auto mt-8 max-w-[1180px] font-mono text-[18px] leading-[1.22]">
          Handcrafted and responsibly sourced, Mejuri makes fine jewelry that&apos;s designed to be stacked, lived in, and worn as a tribute to yourself. Because why wait
          for a special occasion when you are the occasion?
        </p>
        <div className="mx-auto mt-[74px] grid max-w-[1430px] overflow-hidden md:grid-cols-2">
          <video className="aspect-[1.08] w-full object-cover" src={media.video} poster={media.videoPoster} autoPlay muted loop playsInline preload="metadata" />
          <video className="aspect-[1.08] w-full object-cover" src={media.sunlitVideo} poster={media.sunlitPoster} autoPlay muted loop playsInline preload="metadata" />
        </div>
      </section>

      <section className="grid gap-8 px-[5.2vw] pb-[72px] lg:grid-cols-2">
        <div className="relative">
          <img src={media.healing1} alt="Model wearing summer gemstone necklaces" className="h-full min-h-[520px] w-full object-cover" loading="lazy" />
          <ShopLookButton />
        </div>
        <div className="grid gap-8">
          <div className="relative">
            <img src={media.healing2} alt="Milky aquamarine necklace on stone" className="h-full min-h-[300px] w-full object-cover" loading="lazy" />
            <ShopLookButton />
          </div>
          <div className="relative">
            <img src={media.essentials1} alt="Summer smile with layered necklace" className="h-full min-h-[300px] w-full object-cover" loading="lazy" />
            <ShopLookButton />
          </div>
        </div>
      </section>

      <ProductRail
        id="colored-stones"
        title="Colored Stones"
        copy="The energy you've been chasing all year, captured in Milky Aquamarine, Aventurine, and Mother of Pearl. Best enjoyed with sun-warmed stone fruit and a beach with no cell signal."
        cta="Shop colored stones"
        products={coloredStones}
      />

      <section id="summer-essentials" className="grid md:grid-cols-3">
        {[media.essentials1, media.essentials2, media.essentials3].map((src, index) => (
          <div key={src} className="relative min-h-[560px] overflow-hidden">
            <img src={src} alt={`Summer essentials editorial ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
            <ShopLookButton />
          </div>
        ))}
      </section>

      <SeoBlock />
      <Footer />
      <ChatButton />
    </main>
  );
}
