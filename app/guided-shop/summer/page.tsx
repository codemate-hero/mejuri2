import Link from "next/link";
import productsData from "@/app/scraped-products.json";

export const metadata = {
  title: "The Summer Guide | Mejuri",
};

type ProductVariant = {
  price?: number | string | null;
};

type ProductImage = {
  src?: string | null;
};

type Product = {
  title: string;
  handle: string;
  category?: string | null;
  collectionHandle?: string | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
};

type ProductRailProps = {
  title: string;
  copy?: string;
  cta?: string;
  href?: string;
  items: Product[];
};

const products: Product[] = Array.isArray(productsData) ? (productsData as Product[]) : [];

const summerImages = {
  left:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg",
  right:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226441/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid3_DT.jpg",
  wide:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226440/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid5_DT.jpg",
  videoPoster:
    "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg",
  video:
    "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777669306/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT.mp4",
};

function cleanImage(src = ""): string {
  return src.replace(/&amp;/g, "&").replace(/width=\d+/g, "width=900");
}

function uniqueByHandle(items:any) {
  const seen = new Set();
  return items.filter((item:any) => {
    if (!item?.handle || seen.has(item.handle)) return false;
    seen.add(item.handle);
    return true;
  });
}

function pickProducts(words:any, limit = 8) {
  const lowerWords = words.map((word:any) => word.toLowerCase());
  const matched = uniqueByHandle(
    products.filter((product) => {
      const haystack = `${product.title} ${product.handle} ${product.category} ${product.collectionHandle}`.toLowerCase();
      return lowerWords.some((word:any) => haystack.includes(word));
    }),
  );

  if (matched.length >= limit) return matched.slice(0, limit);
  return uniqueByHandle([...matched, ...products]).slice(0, limit);
}

function money(product:any) {
  const value = product?.variants?.[0]?.price;
  if (value === undefined || value === null) return "$0";
  return `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 }).replace(/\.00$/, "")}`;
}

function material(product:any) {
  const title = product?.title || "";
  if (/silver/i.test(title)) return "Sterling Silver";
  if (/sapphire|diamond|gemstone|pearl|stone/i.test(title)) return "18k Gold Vermeil, Lab Grown White Sapphire";
  if (/charm|summer|ammonite|crab|shell/i.test(title)) return "10k Yellow Gold";
  return "18k Gold Vermeil";
}

function ProductRail({ title, copy, cta, href, items }:any) {
  return (
    <section className="py-16">
      <div className="px-10 lg:px-[100px]">
        <h2 className="font-sans text-[34px] font-bold uppercase tracking-[0.08em] leading-none">{title}</h2>
        {copy ? <p className="mt-5 max-w-[1200px] font-mono text-[18px] leading-[1.25]">{copy}</p> : null}
        {cta ? (
          <Link href={href || "/collections/shop-all"} className="mt-7 inline-block font-sans text-[16px] font-bold uppercase underline underline-offset-4">
            {cta}
          </Link>
        ) : null}
      </div>

      <div className="mt-10 flex gap-5 overflow-x-auto px-0 pb-8">
        {items.map((product:any) => (
          <Link key={product.handle} href={`/products/${product.handle}`} className="group min-w-[300px] bg-[#f7f7f7] text-black">
            <div className="relative flex h-[420px] items-center justify-center overflow-hidden">
              {product.images?.[0]?.src ? (
                <img
                  src={cleanImage(product.images[0].src)}
                  alt={product.title}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : null}
              <span className="absolute bottom-28 left-1/2 -translate-x-1/2 border border-[#deded8] bg-white/75 px-4 py-1 font-sans text-[16px] uppercase text-[#6f6f63]">
                ADD +
              </span>
            </div>
            <div className="min-h-[118px] px-3 pb-5 font-sans text-[16px] leading-[1.45] text-[#5f5f57]">
              <p className="truncate uppercase">{product.title}</p>
              <p className="font-mono text-black">{money(product)}</p>
              <p className="truncate">{material(product)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto flex w-[330px] items-center justify-center gap-10">
        <button className="text-[28px]" aria-label="Previous">
          ‹
        </button>
        <div className="h-px flex-1 bg-[#b8b3aa]">
          <div className="h-[3px] w-1/4 bg-black" />
        </div>
        <button className="text-[28px]" aria-label="Next">
          ›
        </button>
      </div>
    </section>
  );
}

function LookButton() {
  return (
    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white px-3 py-1 font-sans text-[16px] uppercase">
      <span className="text-[18px]">♧</span>
      Shop the look
    </span>
  );
}

export default function SummerGuidePage() {
  const newSummer = pickProducts(["summer", "ammonite", "charm", "pearl", "shell"], 8);
  const colored = pickProducts(["sapphire", "gemstone", "aquamarine", "opal", "stone", "pearl"], 8);

  return (
    <main className="bg-white text-black">
      <section className="grid gap-12 px-10 pb-20 pt-24 lg:grid-cols-[1.05fr_1fr] lg:px-[100px] lg:pt-28">
        <div>
          <h1 className="font-sans text-[38px] font-bold uppercase tracking-[0.09em] leading-none">The Summer Guide</h1>
          <p className="mt-6 max-w-[760px] font-mono text-[20px] leading-[1.18]">
            In summer, jewelry becomes part of you: a chain warmed at your collarbone after a swim, a ring catching sunlight with every
            movement, a charm tied to your favorite memory.
          </p>
          <Link href="/collections/shop-all" className="mt-6 inline-block font-sans text-[17px] font-bold uppercase underline underline-offset-4">
            Shop summer essentials
          </Link>
        </div>
        <nav className="grid content-start gap-9 font-sans text-[30px] font-bold uppercase tracking-[0.06em] leading-none sm:grid-cols-2">
          <Link href="#new-summer-styles" className="underline underline-offset-8">
            New Summer Styles
          </Link>
          <Link href="#colored-stones" className="underline underline-offset-8">
            Colored Stones
          </Link>
          <Link href="#summer-essentials" className="underline underline-offset-8 sm:col-span-2">
            Summer Essentials
          </Link>
        </nav>
      </section>

      <section className="grid bg-[#f4f4f4] md:grid-cols-2">
        <div className="relative min-h-[680px]">
          <img src={summerImages.left} alt="" className="h-full w-full object-cover" />
          <LookButton />
        </div>
        <div className="relative flex min-h-[680px] items-center justify-center p-14">
          <img src={summerImages.right} alt="" className="h-[78%] w-[80%] object-cover" />
          <LookButton />
        </div>
      </section>

      <div id="new-summer-styles">
        <ProductRail
          title="New Summer Styles"
          copy="An ode to summers spent along the coastline-counting crabs, finding shells, and uncovering the treasures the tide leaves behind."
          cta="Shop all new summer styles"
          href="/collections/new"
          items={newSummer}
        />
      </div>

      <section className="px-10 py-20 text-center lg:px-[100px]">
        <h2 className="font-sans text-[20px] font-bold uppercase tracking-[0.03em]">Fine jewelry for every day</h2>
        <p className="mx-auto mt-8 max-w-[1100px] font-mono text-[18px] leading-[1.25]">
          Handcrafted and responsibly sourced, Mejuri makes fine jewelry that's designed to be stacked, lived in, and worn as a tribute to
          yourself. Because why wait for a special occasion when you are the occasion?
        </p>
      </section>

      <section id="summer-essentials" className="px-0">
        <div className="mx-auto grid max-w-[1430px] md:grid-cols-2">
          <video
            className="h-[620px] w-full object-cover"
            src={summerImages.video}
            poster={summerImages.videoPoster}
            autoPlay
            muted
            loop
            playsInline
          />
          <img src={summerImages.wide} alt="" className="h-[620px] w-full object-cover" />
        </div>
      </section>

      <section className="grid gap-8 py-24 md:grid-cols-3">
        <div className="relative min-h-[720px]">
          <img src={summerImages.right} alt="" className="h-full w-full object-cover" />
          <LookButton />
        </div>
        <div className="relative min-h-[720px]">
          <img src={summerImages.wide} alt="" className="h-full w-full object-cover" />
          <LookButton />
        </div>
        <div className="relative min-h-[720px]">
          <img src={summerImages.left} alt="" className="h-full w-full object-cover" />
          <LookButton />
        </div>
      </section>

      <div id="colored-stones">
        <ProductRail
          title="Colored Stones"
          copy="The energy you've been chasing all year, captured in Milky Aquamarine, Aventurine, and Mother of Pearl. Best enjoyed with sun-warmed stone fruit and a beach with no cell signal."
          cta="Shop colored stones"
          href="/collections/gemstone-jewelry"
          items={colored}
        />
      </div>

      <section className="bg-[#ededed] px-10 py-20 lg:px-[100px]">
        <div className="mx-auto max-w-[760px] font-mono text-[17px] leading-[1.25]">
          <h2 className="mb-6 text-center font-sans text-[18px] font-bold uppercase">Summer Jewelry Guide</h2>
          <p>
            Discover fine jewelry designed for every summer moment. From beach days to sunset dinners, Mejuri's Summer Jewelry Guide features
            waterproof jewelry, sweat-proof essentials, and timeless pieces crafted for all-day wear.
          </p>
          <p className="mt-8">
            Explore lightweight 14k gold jewelry, sterling silver staples, modern pearls, and styles from the Puzzle Collection designed to
            layer effortlessly throughout the season.
          </p>
        </div>
      </section>
    </main>
  );
}
