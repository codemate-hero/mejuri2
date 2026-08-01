import { Reveal } from "./ui/Reveal";

export function StoryBlock() {
  return (
    <section className="bg-white pt-[2.5rem]">

      <div className="grid lg:min-w-[1023px] grid-cols-1 items-center lg:px-[188px] px-8 lg:pb-[88px] pb-[64px] mt-[24px] lg:grid-cols-2 lg:gap-28 justify-items-center  mx-auto">

        <h2 className="lg:text-center w-full text-left font-display text-[24px] font-medium uppercase leading-none tracking-[0.05em] text-black py-0 md:py-[32px] py-[12px]">JEWELRY YOU CAN LIVE IN</h2>

        <Reveal delay={80}>
          <div className="font-mono text-[12px] font-bold leading-[1.3] tracking-[-0.01em] text-black py-[12px]">
            <p>For too long, fine jewelry was something you waited for. Reserved for birthdays. For anniversaries. Locked away in velvet boxes. Aurelia set out to change that.</p>
            <p className="mt-8">We believe jewelry isn&apos;t for waiting. It&apos;s for living. For marking milestones. For owning your everyday. For celebrating yourself — because you deserve the damn diamond.</p>
            <a href="#" className="mt-8 inline-flex border-b-2 border-black pb-0.5 font-sans text-[14px] font-[500] uppercase tracking-[0.02em] text-black transition-colors duration-300 ease-in-out">ABOUT US</a>
          </div>
        </Reveal>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-[560px] overflow-hidden"><img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=90" alt="Jewelry editorial" className="h-full w-full object-cover" /></div>
        <div className="h-[560px] overflow-hidden"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=90" alt="Jewelry editorial" className="h-full w-full object-cover" /></div>
      </div> */}
    </section>
  );
}
