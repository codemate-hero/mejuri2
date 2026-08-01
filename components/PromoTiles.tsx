export function PromoTiles() {
  return (
    <section className="grid grid-cols-1 bg-black md:grid-cols-2">
      <a href="#" className="group relative lg:aspect-[3/3] aspect-[1/1] overflow-hidden">
        <img
          src="https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1783360292/2026/Summer%20Chapter%202/Homepage/Summer2_Homepage_SidekickX_DT.jpg"
          alt="Just add sun"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent lg:px-[5vw] px-[3vw] pb-20 pt-32 text-white">
          <small className="font-sans">ICONS</small>
          <h2 className="font-display text-[32px] font-[500] uppercase leading-none tracking-[0.05em]">INTERCONNECTED</h2>
          <span className="mt-4 inline-flex border-b-[1px] border-white pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] transition-colors duration-300 ease-in-out">SHOP NOW</span>
        </div>
      </a>
      <a href="#" className="group relative lg:aspect-[3/3] aspect-[1/1] overflow-hidden">
        <img
          src="https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1783360291/2026/Summer%20Chapter%202/Homepage/Summer2_Homepage_SidekickDome_DT.jpg"
          alt="Signs of summer"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent lg:px-[5vw] px-[3vw] pb-20 pt-32 text-white">
          <small className="font-sans">ICONS</small>
          <h2 className="font-display text-[32px] font-[500] uppercase leading-none tracking-[0.05em]">DÔME COLLECTION</h2>
          <span className="mt-4 inline-flex border-b-[1px] border-white pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] transition-colors duration-300 ease-in-out">SHOP NOW</span>
        </div>
      </a>
    </section>
  );
}
