"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productsData from "@/app/scraped-products.json";

type ImageItem = { src?: string };
type VariantItem = { price?: number | string | null };
type Product = {
  handle: string;
  title: string;
  images?: ImageItem[];
  variants?: VariantItem[];
  productType?: string;
};

const products = productsData as Product[];

const heroImage =
  "https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1771958039/2026/Play%20Web%20Ecosystem/Landing%20Page/HPH_D.png";
const editorialImage =
  "https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1771958039/2026/Play%20Web%20Ecosystem/Landing%20Page/HPH_D.png";
const accentImage =
  "https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg";

function imageSrc(product: Product) {
  return (product.images?.[0]?.src || "").replaceAll("&amp;", "&").replace(/width=\d+/g, "width=900");
}

function price(product: Product) {
  const value = Number(product.variants?.[0]?.price || 0);
  if (!value) return "";
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 }).replace(/\.00$/, "")}`;
}

function material(product: Product) {
  const title = product.title.toLowerCase();
  if (title.includes("silver")) return "Sterling Silver";
  if (title.includes("diamond")) return "14k Yellow Gold, Natural Diamond";
  if (title.includes("pearl")) return "18k Gold Vermeil, Pearl";
  if (title.includes("sapphire")) return "18k Gold Vermeil, Lab Grown Sapphire";
  return "18k Gold Vermeil";
}

function uniqueByHandle(list: Product[]) {
  const seen = new Set<string>();
  return list.filter((product) => {
    if (!product.handle || seen.has(product.handle)) return false;
    seen.add(product.handle);
    return true;
  });
}

function pickProducts(terms: string[], count = 8) {
  const lowered = terms.map((term) => term.toLowerCase());
  return uniqueByHandle(products)
    .filter((product) => {
      const text = `${product.title} ${product.handle} ${product.productType || ""}`.toLowerCase();
      return lowered.some((term) => text.includes(term));
    })
    .slice(0, count);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.handle}`} className="group block bg-[#F8F8F8] text-white">
      <div className="relative h-[320px] overflow-hidden  sm:h-[380px]">
        <img src={imageSrc(product)} alt={product.title} className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 border border-[#444] bg-[#1a1a1a]/85 px-3 py-1 font-sans text-[14px] uppercase tracking-[0.16em] text-white">
          Add +
        </span>
      </div>
      <div className="px-3 pb-5 pt-3 font-sans text-[15px] leading-[1.45] text-[#000000]">
        <p className="truncate uppercase ">{product.title}</p>
        <p className="mt-1 font-semibold">{price(product)}</p>
        <p className="mt-2 truncate ">{material(product)}</p>
      </div>
    </Link>
  );
}

function FeatureCard({ title, copy, href, image }: { title: string; copy: string; href: string; image: string }) {
  return (
    <Link href={href} className="group relative h-[380px] overflow-hidden  sm:h-[420px]">
      <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <h3 className="font-sans text-[20px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[24px]">{title}</h3>
        <p className="mt-3 max-w-[420px] font-mono text-[14px] leading-[1.3] text-white/90 sm:text-[15px]">{copy}</p>
      </div>
    </Link>
  );
}

export default function MejuriPlayPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const playProducts = pickProducts(["tennis", "heart", "charm", "mini", "hoop", "diamond"], 8);
  const boldProducts = pickProducts(["bold", "sphere", "dome", "pave", "stack"], 8);
  const colorProducts = pickProducts(["pearl", "sapphire", "birthstone", "letter", "color"], 8);

  return (
    <>
      <Navbar
        isScrolled={true}
        hidePromoBar={true}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMegaMenuOpen={isMegaMenuOpen}
        setIsMegaMenuOpen={setIsMegaMenuOpen}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <main className="bg-white text-black">
        <section className="relative h-screen min-h-[480px] w-full overflow-hidden md:min-h-[600px]">
          <img src={heroImage} alt="Mejuri Play styling" className="h-full w-full object-cover" loading="eager" />
        </section>

      <section className=" px-6 py-16 sm:px-8 md:px-10 lg:px-[100px] lg:py-20">
        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.24em] text-black">Product Quality</p>
        <h1 className="mt-4 max-w-[960px] font-sans text-[48px] font-semibold uppercase leading-[0.95] tracking-[0.12em] text-black sm:text-[64px] md:text-[72px]">
          Jewelry you can play in
        </h1>
        <p className="mt-8 max-w-[860px] font-mono text-[16px] leading-[1.4] text-black sm:text-[18px]">
          Our jewelry is made for real life—the sweat of a workout, the stretch of a yoga pose, the jump for joy after a win. Pieces that move with your body and your life, reminding you of everything you do to feel your best.
        </p>
      </section>

     

      <section className=" px-6 py-12 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard 
            title="Solid Gold" 
            copy="Sweat-proof solid gold. Perfect for every day." 
            href="/collections/solid-gold-jewelry"
            image="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1771958005/2026/Play%20Web%20Ecosystem/Landing%20Page/SolidGold_D.png"
          />
          <FeatureCard 
            title="Sterling Silver" 
            copy="95% recycled. 100% yours." 
            href="/collections/sterling-silver-jewelry"
            image="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1771958017/2026/Play%20Web%20Ecosystem/Landing%20Page/SterlingSilver_D.png"
          />
          <FeatureCard 
            title="Tennis Jewelry" 
            copy="Diamonds and sapphires, set in the finest." 
            href="/collections/tennis-jewelry"
            image="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1771958020/2026/Play%20Web%20Ecosystem/Landing%20Page/TennisJewelry_D.png"
          />
        </div>
      </section>

      

      <section id="play-favorites" className="px-6 py-14 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-black">Build your Mejuri Play look</p>
            <h2 className="mt-2 font-sans text-[30px] font-semibold uppercase leading-none tracking-[0.08em] text-black sm:text-[38px]">
              Play favorites
            </h2>
          </div>
          <Link href="/collections/mejuri-play" className="w-fit border-b border-yellow-400 font-sans text-[14px] font-semibold uppercase tracking-[0.16em] text-black">
            Shop Mejuri Play Collection
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {playProducts.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

       <section className="px-6 py-14 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <h2 className="font-sans text-[32px] font-semibold uppercase leading-none tracking-[0.08em] text-black sm:text-[40px]">
          Build your Mejuri Play look
        </h2>
        
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/collections/earrings" className="group relative h-[320px] overflow-hidden">
            <img 
              src="https://res.cloudinary.com/mejuri-com/image/upload/w_414,q_auto,f_auto/v1771957996/2026/Play%20Web%20Ecosystem/Landing%20Page/Earrings_D.png" 
              alt="Earrings" 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute bottom-6 left-6 font-sans text-[16px] font-semibold uppercase tracking-[0.16em] text-black">
              Earrings
            </span>
          </Link>

          <Link href="/collections/rings" className="group relative h-[320px] overflow-hidden">
            <img 
              src="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1771957997/2026/Play%20Web%20Ecosystem/Landing%20Page/Rings_D.png" 
              alt="Rings" 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute bottom-6 left-6 font-sans text-[16px] font-semibold uppercase tracking-[0.16em] text-black">
              Rings
            </span>
          </Link>

          <Link href="/collections/bracelets" className="group relative h-[320px] overflow-hidden">
            <img 
              src="https://res.cloudinary.com/mejuri-com/image/upload/w_414,q_auto,f_auto/v1771958001/2026/Play%20Web%20Ecosystem/Landing%20Page/Bracelets_D.png" 
              alt="Bracelets" 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute bottom-6 left-6 font-sans text-[16px] font-semibold uppercase tracking-[0.16em] text-black">
              Bracelets
            </span>
          </Link>

          <Link href="/collections/necklaces" className="group relative h-[320px] overflow-hidden">
            <img 
              src="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1771957997/2026/Play%20Web%20Ecosystem/Landing%20Page/Necklaces_D.png" 
              alt="Necklaces" 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute bottom-6 left-6 font-sans text-[16px] font-semibold uppercase tracking-[0.16em] text-black">
              Necklaces
            </span>
          </Link>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[360px] overflow-hidden">
            <img src={editorialImage} alt="Mejuri Play editorial styling" className="h-full w-full object-cover" loading="lazy" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white px-3 py-2 font-sans text-[13px] uppercase tracking-[0.16em] text-black">
              <span className="text-[16px]">✦</span> Shop the look
            </span>
          </div>
          <div className="flex flex-col justify-center bg-[#f5f2eb] p-8 sm:p-10 lg:p-12">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-[#6f6b63]">From the studio to the street</p>
            <h3 className="mt-4 max-w-[560px] font-sans text-[30px] font-semibold uppercase leading-[1] tracking-[0.08em] sm:text-[36px]">
              A little movement, a lot of shine.
            </h3>
            <p className="mt-5 max-w-[620px] font-mono text-[16px] leading-[1.3] text-[#4b4a44]">
              Whether you’re heading out for a workout, a dinner, or a late-night walk, these pieces are designed to move with you and feel right at home in your rotation.
            </p>
            <Link href="/collections/charms-pendants" className="mt-8 inline-block w-fit border-b border-black font-sans text-[14px] font-semibold uppercase tracking-[0.16em]">
              Shop charms
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-[#6f6b63]">Color, charm, and small surprises</p>
            <h2 className="mt-2 font-sans text-[30px] font-semibold uppercase leading-none tracking-[0.08em] sm:text-[38px]">
              Bold little details
            </h2>
          </div>
          <Link href="/collections/new" className="w-fit border-b border-black font-sans text-[14px] font-semibold uppercase tracking-[0.16em]">
            Shop the edit
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {boldProducts.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center bg-[#f7f7f7] p-8 sm:p-10 lg:p-12">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-[#6f6b63]">Easy to wear, built to stack</p>
            <h3 className="mt-4 max-w-[560px] font-sans text-[30px] font-semibold uppercase leading-[1] tracking-[0.08em] sm:text-[36px]">
              Your favorite pieces, styled your way.
            </h3>
            <p className="mt-5 max-w-[620px] font-mono text-[16px] leading-[1.3] text-[#4b4a44]">
              Choose cool tones, bright stones, delicate layers, or bold chains. Mejuri Play is made for everyday expression and tiny moments that deserve a little shine.
            </p>
            <Link href="/collections/mejuri-play" className="mt-8 inline-block w-fit border-b border-black font-sans text-[14px] font-semibold uppercase tracking-[0.16em]">
              Browse the collection
            </Link>
          </div>
          <div className="relative min-h-[360px] overflow-hidden">
            <img src={accentImage} alt="Mejuri Play charms and layering" className="h-full w-full object-cover" loading="lazy" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white px-3 py-2 font-sans text-[13px] uppercase tracking-[0.16em] text-black">
              <span className="text-[16px]">✦</span> Shop charms
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f3ec] px-6 py-14 sm:px-8 md:px-10 lg:px-[100px] lg:py-16">
        <div className="mx-auto max-w-[840px] text-center">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.24em] text-[#6f6b63]">Mejuri Play Jewelry Guide</p>
          <h2 className="mt-4 font-sans text-[24px] font-semibold uppercase leading-[1.1] tracking-[0.08em] sm:text-[32px]">
            Playful fine jewelry for the moments that matter most.
          </h2>
          <div className="mt-6 space-y-4 font-mono text-[15px] leading-[1.35] text-[#4b4a44] sm:text-[16px]">
            <p>
              Discover rings, chains, hoops, and charms designed to bring a little more color and movement to your everyday stack.
            </p>
            <p>
              From bright stones to sculptural silhouettes, these pieces make it easy to dress for a workout, a dinner, or a spontaneous celebration.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
    </>
  );
}
