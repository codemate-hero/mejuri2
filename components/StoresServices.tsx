import { Reveal } from "./ui/Reveal";

const storeCards = [
  {
    title: "OUR STORES",
    text: "Your new favorite space to shop, stack, and stay a while.",
    cta: "VISIT OUR STORES",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/v1749734607/Mejuri_Topanga_005_hscynn.jpg",
    link: "/stores"
  },
  {
    title: "PIERCING STUDIO",
    text: "Create your dream ear stack with an expert piercer at our stores.",
    cta: "BOOK AN APPOINTMENT",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/v1763568937/2025/Web%20Evergreen/Web%20Evergreen%20November/191125%20-%20Piercing%20banner/piercing%20content%20card.jpg",
    link: "/piercing"
  },
  {
    title: "MAKE IT AN EVENT",
    text: "For work, play, and whatever's in between. Host your next get together in store.",
    cta: "LEARN MORE",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/v1780599527/Store%20Led%20Events%20Changelog%20June%205/Homepage_-_Stores_Services_content_card.jpg",
    link: "#",
  }
];

// Helper function to generate responsive image URLs
const getResponsiveImage = (baseUrl:any, widths:any) => {
  // Extract the base path without the upload parameters
  const uploadPath = baseUrl.split('/upload/')[1] || baseUrl;
  
  return widths.map((w:any) => 
    `https://res.cloudinary.com/mejuri-com/image/upload/w_${w},q_auto,f_auto/${uploadPath} ${w}w`
  ).join(', ');
};

export function StoresServices() {
  return (
    <section id="stores" className="bg-white px-[5.2vw] pb-[56px] sm:pt-[4rem] pt-[28px]">
      <Reveal>
        <h2 className="mb-6 font-display text-[32px] font-[500] uppercase leading-none tracking-[0.05em] text-black text-left">
          STORES & SERVICES
        </h2>
        <p className="mt-4 font-mono text-[12px] font-bold leading-[1.3] tracking-[-0.01em] text-black">
          Discover our thoughtfully designed stores and Piercing Studios across North America, Australia, and the UK.
        </p>
      </Reveal>
      <div className="mt-9 grid  lg:grid-cols-3 md:gap-[3rem] gap-[2rem]">
        {storeCards.map((card, index) => {
          return (
            <Reveal key={card.title} delay={index * 70}>
              <article>
                <div className="overflow-hidden bg-[#f3f3f3]">
                  <picture>
                    <source
                      media="(max-width: 1023px)"
                      srcSet={getResponsiveImage(card.image, [360, 414, 768])}
                    />
                    <source
                      media="(min-width: 1024px)"
                      srcSet={getResponsiveImage(card.image, [768, 1366, 1536, 1920, 2560])}
                    />
                    <img
                      className="relative z-[1] aspect-[1.6] size-full object-cover"
                      sizes="(max-width: 1023px) 100vw, (min-width: 1024px) 33.33vw"
                      alt={card.title}
                      loading="lazy"
                      src={card.image}
                    />
                  </picture>
                </div>
                <h3 className="mt-4 font-sans text-[14px] font-bold tracking-[0.02em] uppercase text-black">
                  {card.title}
                </h3>
                <p className="mt-2 mb-2 font-mono text-[12px] font-bold leading-[1.3] tracking-[-0.01em] text-black">
                  {card.text}
                </p>
                <a
                  href={card.link}
                  className="mt-4 inline-flex border-b-2 border-black pb-0.5 mb-[12px] font-sans text-[14px] font-bold uppercase tracking-[0.02em] transition-colors duration-300 ease-in-out"
                >
                  {card.cta}
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
