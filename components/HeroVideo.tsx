
import Link from "next/link";
import Image from "next/image";


export function HeroVideo() {
  return (
    <section className="relative h-auto pt-[40px] bg-black font-display">
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet="https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1783360275/2026/Summer%20Chapter%202/Homepage/Summer2_Homepage_Hero1POSTER_DT.jpg"
        />
        <source
          media="(max-width: 1023px)"
          srcSet="https://res.cloudinary.com/mejuri-com/image/upload/w_768,q_auto,f_auto/v1783360272/2026/Summer%20Chapter%202/Homepage/Summer2_Homepage_Hero1POSTER_M.jpg"
        />
        <img
          src="https://res.cloudinary.com/mejuri-com/image/upload/w_768,q_auto,f_auto/v1783360272/2026/Summer%20Chapter%202/Homepage/Summer2_Homepage_Hero1POSTER_M.jpg"
          alt="Steel The Show"
          className="h-full w-full object-cover object-top"
        />
      </picture>
      <div className="absolute inset-0 z-10 flex flex-col  items-start justify-end lg:px-[80px] px-[16px] pb-[48px] text-left md:px-6 md:pb-[70px]">
        <h1
          className="uppercase text-white  font-medium text-[48px] mb-[1rem]"

        >
          From Sunrise to Sunset
        </h1>
        <Link
          href="/collections/summer-guide"
          className="font-sans text-[12px] font-bold uppercase text-white underline underline-offset-4 md:text-[14px]"
        >
          EXPLORE SUMMER GUIDE
        </Link>
      </div>

      {/* Gradient overlay at bottom */}
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" /> */}
    </section>
  );
}