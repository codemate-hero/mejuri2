import Link from "next/link";

type ProductImage = {
  src?: string;
};

type ProductVariant = {
  price?: number;
  compareAtPrice?: number | null;
};

type Product = {
  title?: string;
  handle?: string;
  category?: string;
  productType?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

function cleanImage(src?: string) {
  if (!src) return "";
  return src.replaceAll("&amp;", "&").replace(/width=\d+/g, "width=900");
}

function price(product: Product) {
  const value = product.variants?.[0]?.price;
  return typeof value === "number" ? `$${value}` : "$98";
}

function material(product: Product) {
  const text = `${product.title ?? ""} ${product.handle ?? ""}`.toLowerCase();
  if (text.includes("silver")) return "Sterling Silver";
  if (text.includes("10k")) return "10k Yellow Gold";
  if (text.includes("14k")) return "14k Yellow Gold";
  if (text.includes("pearl")) return "18k Gold Vermeil, Pearl";
  return "18k Gold Vermeil";
}

export default function GuidedProductRail({
  title,
  copy,
  ctaLabel,
  ctaHref,
  products,
}: {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products: Product[];
}) {
  const items = products.filter((product) => product.handle).slice(0, 12);

  return (
    <section className="py-14 lg:py-20">
      <div className="px-6 lg:px-[100px]">
        <h2 className="font-sans text-[32px] lg:text-[40px] font-semibold uppercase tracking-[0.08em] leading-none">
          {title}
        </h2>
        {copy ? (
          <p className="mt-6 max-w-[1200px] font-mono text-[17px] leading-[1.25]">
            {copy}
          </p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="mt-7 inline-block border-b border-current font-sans text-[16px] font-semibold uppercase leading-none"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      <div className="mt-12 overflow-x-auto pb-6">
        <div className="flex min-w-max gap-5 px-6 lg:px-[100px]">
          {items.map((product) => (
            <article key={product.handle} className="w-[285px] shrink-0 bg-[#f7f7f7]">
              <Link href={`/products/${product.handle}`} className="block">
                <div className="relative flex h-[370px] items-center justify-center overflow-hidden bg-[#f7f7f7]">
                  {cleanImage(product.images?.[0]?.src) ? (
                    <img
                      src={cleanImage(product.images?.[0]?.src)}
                      alt={product.title ?? ""}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 border border-[#e4e1dc] bg-white/75 px-3 py-1 font-sans text-[16px] uppercase text-[#6f6d62]">
                    Add +
                  </span>
                </div>
              </Link>
              <div className="px-3 pb-4 pt-3">
                <Link
                  href={`/products/${product.handle}`}
                  className="block truncate font-sans text-[14px] font-medium uppercase leading-[1.2] text-[#5f5f56]"
                >
                  {product.title}
                </Link>
                <p className="mt-1 font-mono text-[16px] leading-none text-black">{price(product)}</p>
                <p className="mt-3 truncate font-sans text-[16px] leading-[1.2] text-[#6f6d62]">
                  {material(product)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
