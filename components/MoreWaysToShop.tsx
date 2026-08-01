import Image from "next/image";
import Link from "next/link";

const shopLinks = [
  {
    title: "BEST SELLERS",
    href: "/collections/best-sellers",
    image:
      "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1761330220/2025/Web%20Evergreen/Web%20Evergreen%20November/102425%20-%20BAU/FY25_NovBAU_Bestsellers.jpg",
    alt: "Hands wearing gold rings",
  },
  {
    title: "SUMMER",
    href: "/collections/summer-essentials",
    image:
      "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777671419/2026/Summer%20Chapter%201/PLP/Product%20Category%20PLPs/Summer_NecklacesPLP_STL_DT.jpg",
    alt: "Layered gold necklaces in the sun",
  },
  {
    title: "BEFORE WE MELT",
    href: "/collections/before-we-melt",
    image:
      "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1768942010/2025/Web%20Evergreen/Web%20Evergreen%20November/102425%20-%20BAU/FY25_NovBAU_LeavingSoon.jpg",
    alt: "Model wearing gold earrings and rings",
  },
];

export function MoreWaysToShop() {
  return (
    <section className="bg-white px-4 py-14 md:py-16 xl:mx-auto xl:px-20">
      <h2 className="mb-6 font-display text-[24px] font-semibold uppercase leading-none tracking-[0.05em] text-black md:text-[32px]">
        MORE WAYS TO SHOP
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {shopLinks.map((item) => (
          <Link key={item.title} href={item.href} className="group block">
            <div className="relative aspect-[5/6] overflow-hidden bg-[#f1f0ed] md:aspect-[1/1.3]">
              <Image  
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 31vw, 92vw"
                className="object-cover object-center transition duration-700 group-hover:scale-105"
              />
            </div>
            <span className="mt-4 inline-flex border-b border-black pb-0.5 font-display text-[0.875rem] font-medium uppercase leading-none tracking-[0.02em] text-black ">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
