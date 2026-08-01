"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { ProductCard, type Product } from "@/components/ProductCard";
import { sampleProducts } from "@/data/shopConfigs";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Product Slider Component
function PiercingProductSlider({ products }: { products: Product[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => container.removeEventListener('scroll', updateProgress);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth >= 768
        ? scrollContainerRef.current.offsetWidth * 0.8
        : scrollContainerRef.current.offsetWidth * 0.75;

      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      <div ref={scrollContainerRef} className="no-scrollbar flex gap-5 overflow-x-auto pb-10 snap-x snap-mandatory">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="mx-auto mt-1 flex w-[400px] max-w-full items-center justify-center gap-10">
        <button onClick={() => scroll('left')} className="cursor-pointer transition-colors hover:text-black">
          <ChevronLeft className="h-5 w-5 text-[#777]" />
        </button>
        <div className="h-[2px] flex-1 bg-[#b7b0a7]">
          <div
            className="h-full bg-black transition-all duration-150"
            style={{ width: `${Math.min(scrollProgress + 24, 100)}%` }}
          />
        </div>
        <button onClick={() => scroll('right')} className="cursor-pointer transition-colors hover:text-black">
          <ChevronRight className="h-5 w-5 text-black" />
        </button>
      </div>
    </div>
  );
}

export default function PiercingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHidePromoBar(window.scrollY > 0);
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hideForSidebar = isMobileMenuOpen || isMegaMenuOpen;

  return (
    <div className="min-h-screen bg-white">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={hideForSidebar} />
      <Navbar
        isScrolled={isScrolled}
        hidePromoBar={hidePromoBar}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMegaMenuOpen={isMegaMenuOpen}
        setIsMegaMenuOpen={setIsMegaMenuOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        variant="light"
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Hero Section */}
      <section className="relative h-[544px] md:h-[608px] 2xl:h-[858px] overflow-hidden bg-[#D4DCC4]">
        <div className="flex lg:flex-row flex-col flex-col-reverse w-full h-full">
          <div className="flex-1 flex justify-center items-center py-2 lg:py-3 xl:px-6 relative z-10">
            <div className="max-w-[262px] md:max-w-[1035px]">
              <img
                src="https://res.cloudinary.com/mejuri-com/image/upload/v1727366607/2024/Piercing/Web/Piercing%20Landing%20Page/PS-Logo.png"
                alt="Piercing Studio"
              />
            </div>
          </div>

          <div className="flex-1 h-full">
            <img
              src="https://res.cloudinary.com/mejuri-com/image/upload/w_1366,q_auto,f_auto/v1775508496/Piercing%20Page%20Image%20Swaps/stack_your_way_brilliant.jpg"
              alt="Piercing Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="relative h-[85vh] overflow-hidden hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundColor: '#D4DCC4',
            backgroundImage: 'linear-gradient(to right, #D4DCC4 50%, transparent 50%)',
          }}
        >
          <img
            src="https://res.cloudinary.com/mejuri-com/image/upload/w_1366,q_auto,f_auto/v1775508496/Piercing%20Page%20Image%20Swaps/stack_your_way_brilliant.jpg"
            alt="Piercing Studio"
            className="absolute right-0 top-0 h-full md:w-1/2 w-full object-cover"
          />
        </div>
        <div className="relative flex h-full items-center px-[5.2vw]">
          <Reveal>
            <div className="max-w-[262px] max-h-[163px] md:max-w-[50%] inline-flex pr-5"><img src="https://res.cloudinary.com/mejuri-com/image/upload/v1727366607/2024/Piercing/Web/Piercing%20Landing%20Page/PS-Logo.png" alt="Piercing Studio " /></div>
          </Reveal>
        </div>
      </section>

      {/* Booking Steps Section */}
      <section className="bg-white px-[5.2vw] py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="font-mono text-[14px] leading-[1.6] text-black">
                There's no better time to change things up than now. Discover a piercing service near you and curate a stack that feels uniquely yours—love it in until you're ready for more.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-6">
              <div className="border-b border-black pb-4">
                <h3 className="font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">
                  01. BOOK YOUR APPOINTMENT
                </h3>
              </div>
              <div className="border-b border-black pb-4">
                <h3 className="font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">
                  02. PIERCING PLACEMENT
                </h3>
              </div>
              <div className="border-b border-black pb-4">
                <h3 className="font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">
                  03. GET INSPIRED
                </h3>
              </div>
              <div className="border-b border-black pb-4">
                <h3 className="font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">
                  04. CHOOSE YOUR STUDS
                </h3>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Book Appointment Section */}
      <section className="bg-[#F8F8F8] px-[5.2vw] py-16">
        <Reveal>
          <h2 className="mb-8 font-sans text-[48px] font-semibold uppercase leading-none tracking-[0.05em] text-black">
            BOOK YOUR PIERCING APPOINTMENT
          </h2>
          <p className="mb-8 font-mono text-[14px] text-black">
            Sorry, but it looks like there aren't any piercing studios around your area.
          </p>
          <button className="bg-black px-8 py-4 font-sans text-[14px] font-semibold uppercase tracking-[0.02em] text-white transition-colors hover:bg-gray-800">
            EXPLORE ALL LOCATION
          </button>
        </Reveal>
      </section>

      {/* Piercing Placement Section */}
      <section className="bg-white px-[5.2vw] py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-square w-full">
              <img
                src="https://cdn.sanity.io/images/lb60gqpm/production/190101fff16b8a4f57c39cc9c07ec59f69212f78-1800x2160.png?w=1920&q=90&fit=max&auto=format"
                alt="Ear Piercing Diagram"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <h2 className="mb-8 font-sans text-[48px] font-semibold uppercase leading-none tracking-[0.05em] text-black">
                PICK YOUR NEXT PIERCING
              </h2>
              <p className="mb-6 font-mono text-[14px] leading-[1.6] text-black">
                Our Piercing Studio offers eight types of ear piercings to choose from. Heal time varies based on your chosen piercing location. Due to the length of our threadless flat back studs, we can't pierce any areas not labelled.
              </p>
              <ol className="space-y-2 font-mono text-[14px] text-black">
                <li>1. The lobe</li>
                <li>2. Stacked lobe</li>
                <li>3. Upper lobe</li>
                <li>4. Midi</li>
                <li>5. Helix</li>
                <li>6. Inner Helix</li>
                <li>7. Conch</li>
                <li>8. Tragus</li>
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stacking 101 Section */}
      <section className="bg-black px-[5.2vw] py-16 lg:py-24">
        <Reveal>
          <h2 className="mb-4 font-sans text-[48px] font-semibold uppercase leading-none tracking-[0.05em] text-white">
            STACKING 101
          </h2>
          <p className="mb-12 max-w-3xl font-mono text-[14px] leading-[1.6] text-white">
            Our earrings are made for stacking, so mix them up, and create every look you want. Here's how to do it:
          </p>
          <a href="#" className="mb-16 inline-block border-b-2 border-white font-sans text-[14px] font-semibold uppercase tracking-[0.02em] text-white transition-colors hover:border-gray-300 hover:text-gray-300">
            BROWSE OUR LOOK BOOK
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Play */}
          <Reveal>
            <div className="group">
              <div className="relative mb-6 aspect-[3/4] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775566705/Piercing%20Page%20Image%20Swaps/stacking_101_4.jpg"
                  alt="Play"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-white">PLAY</h3>
              <p className="font-mono text-[14px] leading-[1.6] text-white">
                Start with what catches your eye. Something new and exciting or just go by mood.
              </p>
            </div>
          </Reveal>

          {/* Mix */}
          <Reveal>
            <div className="group">
              <div className="relative mb-6 aspect-[3/4] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775566704/Piercing%20Page%20Image%20Swaps/stacking_101_2.jpg"
                  alt="Mix"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-white">MIX</h3>
              <p className="font-mono text-[14px] leading-[1.6] text-white">
                Rise to mix up the palette. Try a gemstone or a mix of gold and silver. You can't mess this up.
              </p>
            </div>
          </Reveal>

          {/* Stack */}
          <Reveal>
            <div className="group">
              <div className="relative mb-6 aspect-[3/4] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775566705/Piercing%20Page%20Image%20Swaps/stacking_101_3.jpg"
                  alt="Stack"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-white">STACK</h3>
              <p className="font-mono text-[14px] leading-[1.6] text-white">
                Add your essentials. Your core, most-worn pieces. What's been with you through the years? What feels like you?
              </p>
            </div>
          </Reveal>

          {/* Repeat */}
          <Reveal>
            <div className="group">
              <div className="relative mb-6 aspect-[3/4] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775566705/Piercing%20Page%20Image%20Swaps/stacking_101_1.jpg"
                  alt="Repeat"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-white">REPEAT</h3>
              <p className="font-mono text-[14px] leading-[1.6] text-white">
                Trust us. When you're happy with your mix, double something. Two hoops, studs, or huggies are always better than one.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Discover Your Piercing Studs - Slider Section */}
      <section className="bg-white px-[5.2vw] py-16 lg:py-24">
        <Reveal>
          <div className="mb-4 flex flex-wrap gap-4 items-baseline justify-between">
            <h2 className="font-sans text-[32px] font-semibold uppercase leading-none tracking-[0.05em] text-black md:text-[48px]">
              DISCOVER YOUR PIERCING STUDS
            </h2>
            <a href="#" className="hidden font-sans text-[14px] font-semibold uppercase tracking-[0.02em] text-black underline md:block">
              VIEW ALL
            </a>
          </div>
        </Reveal>
        <PiercingProductSlider products={sampleProducts} />
      </section>

      {/* Stack Your Way Section */}
      <section className="bg-black px-[5.2vw] py-16 lg:py-24">
        <Reveal>
          <h2 className="mb-4 font-sans text-[48px] font-semibold uppercase leading-none tracking-[0.05em] text-white">
            STACK YOUR WAY
          </h2>
          <p className="mb-12 max-w-3xl font-mono text-[14px] leading-[1.6] text-white">
            Come for your next piercing, and stay for the full stack. Here's some inspiration:
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 gap-4">
          {/* Minimalist */}
          <Reveal>
            <div className="group relative bg-white h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1741041294/2025/Ear%20Party%203.0/Piercing%20LP/Piercing-STL1-D.png"
                  alt="Minimalist"
                  className="h-full w-full object-cover"
                />
                <button className="absolute left-6 bottom-6 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <div className="bg-white p-6">
                <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">MINIMALIST:</h3>
                <p className="font-mono text-[14px] leading-[1.6] text-black">
                  A little goes a long way. Create a stack that doesn't try too hard.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Maximalist */}
          <Reveal>
            <div className="group relative bg-white h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775587677/Piercing%20Page%20Image%20Swaps/stack_your_way_maximalist.jpg"
                  alt="Maximalist"
                  className="h-full w-full object-cover"
                />
                <button className="absolute left-6 bottom-6 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <div className="bg-white p-6">
                <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">MAXIMALIST:</h3>
                <p className="font-mono text-[14px] leading-[1.6] text-black">
                  Too much is never enough, keep stacking.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="group relative bg-white h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1741041295/2025/Ear%20Party%203.0/Piercing%20LP/Piercing-STL3-D.png"
                  alt="Stacking Example"
                  className="h-full w-full object-cover"
                />
                <button className="absolute left-6 bottom-6 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <div className="bg-white p-6">
                <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">STATEMENT:</h3>
                <p className="font-mono text-[14px] leading-[1.6] text-black">
                  Choose bold. Choose mixed metals. Choose a stack that talks back.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="group relative bg-white h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1741041293/2025/Ear%20Party%203.0/Piercing%20LP/Piercing-STL4-D.png"
                  alt="Stacking Example"
                  className="h-full w-full object-cover"
                />
                <button className="absolute left-6 bottom-6 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <div className="bg-white p-6">
                <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">BRILLANT:</h3>
                <p className="font-mono text-[14px] leading-[1.6] text-black">
                  Stack on the shine.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="group relative bg-white h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775508496/Piercing%20Page%20Image%20Swaps/stack_your_way_vibrant.jpg"
                  alt="Stacking Example"
                  className="h-full w-full object-cover"
                />
                <button className="absolute left-6 bottom-6 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <div className="bg-white p-6">
                <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">VIBRANT:</h3>
                <p className="font-mono text-[14px] leading-[1.6] text-black">
                  Show your true colors.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="group relative bg-white h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1775587676/Piercing%20Page%20Image%20Swaps/stack_your_way_charmed.jpg"
                  alt="Stacking Example"
                  className="h-full w-full object-cover"
                />
                <button className="absolute left-6 bottom-6 flex items-center gap-2 bg-white px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  SHOP THE LOOK
                </button>
              </div>
              <div className="bg-white p-6">
                <h3 className="mb-2 font-sans text-[24px] font-semibold uppercase tracking-[0.02em] text-black">CHARMED:</h3>
                <p className="font-mono text-[14px] leading-[1.6] text-black">
                  A charm for every hoop? Makes sense.
                </p>
              </div>
            </div>
          </Reveal>


        </div>
      </section>

      {/* Piercing Aftercare Section */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Reveal>
            <div className="flex flex-col justify-center text-center px-[5.2vw] py-16 lg:py-24 h-full">
              <h2 className="mb-6 font-sans text-[48px] font-semibold uppercase leading-none tracking-[0.05em] text-black">
                PIERCING AFTERCARE
              </h2>
              <p className="mb-8 font-mono text-[14px] leading-[1.6] text-black">
                Your piercings are precious and Mejuri has you covered with expert tips to keep them safe.
              </p>
              <a href="#" className="inline-block text-center mx-auto border-b-2 w-fit border-black font-sans text-[14px] font-semibold uppercase tracking-[0.02em] text-black transition-colors hover:border-gray-600 hover:text-gray-600">
                LEARN MORE
              </a>
            </div>
          </Reveal>
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-[1/1] md:h-full">
              <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=90"
                alt="Piercing Aftercare"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#faf7f0] px-[5.2vw] py-16 lg:py-24">
        <Reveal>
          <h2 className="mb-4 font-sans text-[48px] font-semibold uppercase leading-none tracking-[0.05em] text-black">
            FAQ
          </h2>
          <p className="mb-12 font-mono text-[14px] text-black">
            All your piercing questions answered.<br />
            For more, <a href="#" className="underline">contact us</a>.
          </p>
        </Reveal>

        <div className="max-w-4xl space-y-0">
          {[
            "How do I book a piercing appointment?",
            "How do piercing appointments work?",
            "What should I do to prepare before going into my appointment?",
            "Where do you offer piercings?",
            "How many piercings can I get done in one appointment?",
            "Can I get an old piercing re-pierced?",
            "Do the piercing studios accept gratuity?",
            "What is a check-up appointment for downsizing?",
            "What is the cancellation or rescheduling policy for piercing appointments?",
            "What are the aftercare suggestions for my piercing?",
            "What is considered 'normal' after the piercing?",
            "What health and safety measures are being taken in the store?",
            "Are there age restrictions for piercings at Mejuri?",
            "Can I get pierced if I'm pregnant or breastfeeding?"
          ].map((question, index) => (
            <Reveal key={index}>
              <div className="border-b border-black py-6">
                <button className="flex w-full items-center justify-between text-left transition-colors hover:text-gray-600">
                  <span className="font-sans text-[16px] font-normal text-black">{question}</span>
                  <svg className="h-5 w-5 flex-shrink-0 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
