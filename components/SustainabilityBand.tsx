export function SustainabilityBand() {
  return (
    <section className="grid border-y border-black bg-[#c7c0bd] px-[2.1vw] py-6 md:grid-cols-2 md:gap-16">
      <div>
        <h2 className="text-[24px] font-display font-semibold uppercase tracking-[0.08em] text-black">OUR SUSTAINABILITY PROGRESS</h2>
        <a
          href="https://mejuri.com/world/en/sustainability"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-[12px] font-sans font-bold uppercase text-black hover:underline"
        >
          VIEW SUSTAINABILITY REPORT
        </a>
      </div>
      <p className="mt-5 font-mono text-[12px] font-bold leading-[1.3] tracking-[-0.01em] text-black md:mt-0">Our journey mirrors that of the jewelry we create—crafted through collaboration and constant evolution. We&apos;re here to transform fine jewelry into everyday moments, empower women, and drive meaningful change in our communities and beyond.</p>
    </section>
  );
}
