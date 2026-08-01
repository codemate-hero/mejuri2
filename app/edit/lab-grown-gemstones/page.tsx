import Link from "next/link";
import productsData from "@/app/scraped-products.json";

export const metadata = {
  title: "Lab Grown Gemstones Guide | Mejuri",
};

const products = Array.isArray(productsData) ? productsData : [];

function imageSrc(product:any) {
  return product?.images?.[0]?.src?.replaceAll("&amp;", "&") || "";
}

function price(product:any) {
  const amount = product?.variants?.[0]?.price;
  return amount ? `$${amount}` : "$198";
}

function material(product:any) {
  const text = [product?.title, product?.handle].filter(Boolean).join(" ").toLowerCase();
  if (text.includes("silver")) return "Sterling Silver";
  if (text.includes("10k")) return "10k Yellow Gold";
  if (text.includes("14k")) return "14k Yellow Gold";
  if (text.includes("sapphire")) return "18k Gold Vermeil, Lab Grown Sapphire";
  if (text.includes("gemstone")) return "18k Gold Vermeil, Gemstone";
  return "18k Gold Vermeil";
}

function uniqueByHandle(items:any) {
  const seen = new Set();
  return items.filter((item:any) => {
    if (!item?.handle || seen.has(item.handle)) return false;
    seen.add(item.handle);
    return true;
  });
}

function pickProducts(words:any, fallback = 12) {
  const terms = words.map((word:any) => word.toLowerCase());
  const matched = uniqueByHandle(
    products.filter((product) => {
      const haystack = `${product.title || ""} ${product.handle || ""} ${product.category || ""}`.toLowerCase();
      return terms.some((term:any) => haystack.includes(term));
    })
  );
  return (matched.length ? matched : uniqueByHandle(products)).slice(0, fallback);
}

function ProductRail({ title, copy, cta, products }:any) {
  return (
    <section className="py-16">
      <div className="px-10 md:px-[100px]">
        <h2 className="font-sans text-[32px] font-semibold uppercase tracking-[.12em] leading-tight">{title}</h2>
        {copy ? <p className="mt-5 max-w-[980px] font-mono text-[18px] leading-snug">{copy}</p> : null}
        {cta ? (
          <Link href={cta.href} className="mt-8 inline-block border-b border-black font-sans text-[16px] font-semibold uppercase">
            {cta.label}
          </Link>
        ) : null}
      </div>
      <div className="mt-10 flex gap-5 overflow-x-auto px-0 pb-8">
        {products.map((product:any) => (
          <Link
            key={product.handle}
            href={`/products/${product.handle}`}
            className="group min-w-[260px] bg-[#f7f7f7] text-black no-underline md:min-w-[330px]"
          >
            <div className="relative flex h-[360px] items-center justify-center overflow-hidden bg-[#f7f7f7]">
              {imageSrc(product) ? (
                <img src={imageSrc(product)} alt={product.title} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
              ) : null}
              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 border border-[#ddd] bg-white/80 px-4 py-1 font-sans text-[16px] uppercase text-[#6f6d64]">
                ADD +
              </span>
            </div>
            <div className="space-y-1 px-3 pb-5 pt-4 font-sans text-[16px] leading-tight">
              <p className="uppercase text-[#66645b]">{product.title}</p>
              <p className="text-black">{price(product)}</p>
              <p className="text-[#66645b]">{material(product)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LookCard({ src, label = "SHOP THE LOOK", tall = false }:any) {
  return (
    <div className={`relative overflow-hidden bg-[#f4f4f2] ${tall ? "min-h-[760px]" : "min-h-[520px]"}`}>
      <img src={src} alt="" className="h-full w-full object-cover" />
      <Link href="/collections/shop-all" className="absolute bottom-5 left-5 bg-white px-3 py-1 font-sans text-[16px] uppercase">
        {label}
      </Link>
    </div>
  );
}

export default function LabGrownGemstonesPage() {
  const gemstoneProducts = pickProducts(["sapphire", "gemstone", "diamond", "emerald", "topaz"], 10);
  const pearlProducts = pickProducts(["pearl", "opal", "stone"], 8);

  return (
    <main className="bg-white text-black">
      <section className="grid gap-12 px-10 pb-20 pt-24 md:grid-cols-[1.1fr_.9fr] md:px-[100px] md:pt-32">
        <div>
          <p className="mb-6 font-sans text-[16px] font-semibold uppercase">Lab Grown Gemstones Guide</p>
          <h1 className="max-w-[760px] font-sans text-[42px] font-semibold uppercase tracking-[.14em] leading-[1.08]">
            Color Made For Every Day
          </h1>
          <p className="mt-7 max-w-[720px] font-mono text-[20px] leading-snug">
            Vibrant stones, modern settings, and fine jewelry that goes from bright mornings to late plans.
          </p>
        </div>
        <div className="grid content-start gap-6 font-sans text-[30px] font-semibold uppercase tracking-[.08em]">
          <Link className="w-fit border-b border-black" href="/collections/lab-grown-sapphire">
            Lab Grown Sapphire
          </Link>
          <Link className="w-fit border-b border-black" href="/collections/gemstone">
            Colored Stones
          </Link>
          <Link className="w-fit border-b border-black" href="/collections/diamonds">
            Diamond Essentials
          </Link>
        </div>
      </section>

      <section className="grid gap-5 px-0 md:grid-cols-2">
        <LookCard src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226440/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid5_DT.jpg" tall />
        <LookCard src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226441/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid3_DT.jpg" tall />
      </section>

      <ProductRail
        title="Lab Grown Gemstone Essentials"
        copy="Cuts of color designed to stack, layer, and stand out."
        cta={{ href: "/collections/gemstone", label: "Shop gemstones" }}
        products={gemstoneProducts}
      />

      <section className="bg-black px-10 py-20 text-white md:px-[100px]">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-sans text-[36px] font-semibold uppercase tracking-[.12em]">The Bright Edit</h2>
            <p className="mt-6 max-w-[620px] font-mono text-[18px] leading-snug">
              Lab grown gemstones bring saturated color with the polish of fine jewelry. Wear them solo or let them punctuate a stack.
            </p>
            <Link href="/collections/new" className="mt-8 inline-block border-b border-white font-sans text-[16px] font-semibold uppercase">
              Shop new styles
            </Link>
          </div>
          <img
            src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg"
            alt=""
            className="h-[520px] w-full object-cover"
          />
        </div>
      </section>

      <ProductRail title="Colored Stone Favorites" products={pearlProducts} />

      <section className="bg-[#eee] px-10 py-20 md:px-[100px]">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="font-sans text-[18px] font-semibold uppercase">Lab Grown Gemstones Guide</h2>
          <p className="mt-6 font-mono text-[17px] leading-snug">
            Explore fine jewelry with lab grown sapphires, emeralds, topaz, pearls, and diamonds. Designed for daily wear and crafted to layer with the pieces you already love.
          </p>
        </div>
      </section>
    </main>
  );
}
