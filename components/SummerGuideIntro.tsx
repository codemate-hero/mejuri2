import { Reveal } from "./ui/Reveal";

export function SummerGuideIntro() {
  return (
    <section className="bg-white px-[5.2vw] pb-16 pt-16 lg:pt-[72px]">
      <Reveal>
        <h2 className="font-sans text-[48px] font-extrabold uppercase leading-none tracking-[0.05em] text-black">THE SUMMER GUIDE</h2>
        <p className="mt-9 font-mono text-[14px] font-bold leading-[1.3] tracking-[-0.01em] text-black">A collection inspired by summers along the coastline.</p>
        <a href="#products" className="mt-7 inline-flex border-b-2 border-black pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] text-black transition-colors duration-300 ease-in-out">SHOP NOW</a>
      </Reveal>
    </section>
  );
}
