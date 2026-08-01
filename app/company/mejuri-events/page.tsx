    "use client";

    import { ChatButton } from "@/components/ChatButton";
    import { Footer } from "@/components/Footer";
    import { Navbar } from "@/components/Navbar";
    import { PromoBar } from "@/components/PromoBar";
    import { SearchModal } from "@/components/SearchModal";
    import { Reveal } from "@/components/ui/Reveal";
    import { useEffect, useState } from "react";

    export default function MejuriEvents() {
        const [hidePromoBar, setHidePromoBar] = useState(false);
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
        const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
        const [isSearchOpen, setIsSearchOpen] = useState(false);

        const eventCards = [
            {
                title: "PIERCING PARTIES",
                text: "A VIP experience (Very Iconic Piercings). Reserve the studio and enjoy complimentary piercing services for your entire guest list.",
                cta: "REQUEST THE STUDIO",
                image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1778862706/Store%20Led%20Events/Private_Events_Content_Card_Piercing_Party_D.jpg",
                link: "/company/piercing-events"
            },
            {
                title: "BRIDAL SESSIONS",
                text: "Say yes to the stack. Book a private bridal party styling session — enjoy celebratory sips, 15% off, and a dedicated team to find your something new.",
                cta: "BOOK YOUR EVENT",
                image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1778862705/Store%20Led%20Events/Private_Events_Content_Card_Milestone_Events_D.jpg",
                link: "/company/bridal-events"
            },
            {
                title: "GIVE BACK EVENTS",
                text: "Host an event dedicated to the charity you’re championing and we’ll donate up to 15% of every purchase to your chosen organization.",
                cta: "PARTNER WITH US",
                image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1778862711/Store%20Led%20Events/Private_Events_Content_Card_Philanthropy_D.jpg",
                link: "/company/philanthropy-events",
            }
        ];

        useEffect(() => {
            const handleScroll = () => {
                const scrollY = window.scrollY;
                setHidePromoBar(scrollY > 0);
            };

            handleScroll();
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }, []);

        return (
            <main className="min-h-screen bg-white text-black">
                <PromoBar
                    isScrolled={hidePromoBar}
                    hideForSidebar={isMobileMenuOpen || isMegaMenuOpen}
                />
                <Navbar
                    isScrolled={true}
                    hidePromoBar={hidePromoBar}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    isMegaMenuOpen={isMegaMenuOpen}
                    setIsMegaMenuOpen={setIsMegaMenuOpen}
                    onSearchClick={() => setIsSearchOpen(true)}
                />
                <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                />

                {/* Hero Section */}
                <div className="relative mt-[95px] w-full flex overflow-hidden md:max-h-[608px] max-h-[544px] 2xl:max-h-[858px]">
                    <div className="md:max-h-[608px] max-h-[544px] flex flex-col w-full lg:flex-row-reverse">
                        {/* Image / Hero Media */}
                        <div
                            className="grow-0 relative z-base max-h-[330px] lg:max-h-none basis-2/3"
                            style={{ aspectRatio: '1.59978 / 1' }}
                        >
                            <div className="h-full w-full overflow-hidden z-base absolute top-0 left-0">
                                <picture>
                                    <source
                                        media="(min-width: 1024px)"
                                        srcSet="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 360w, https://res.cloudinary.com/mejuri-com/image/upload/w_414,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 414w, https://res.cloudinary.com/mejuri-com/image/upload/w_768,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 768w, https://res.cloudinary.com/mejuri-com/image/upload/w_1366,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 1366w, https://res.cloudinary.com/mejuri-com/image/upload/w_1536,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 1536w, https://res.cloudinary.com/mejuri-com/image/upload/w_1920,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 1920w, https://res.cloudinary.com/mejuri-com/image/upload/w_2560,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 2560w"
                                    />
                                    <source
                                        media="(max-width: 1023px)"
                                        srcSet="https://res.cloudinary.com/mejuri-com/image/upload/w_360,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 360w, https://res.cloudinary.com/mejuri-com/image/upload/w_414,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 414w, https://res.cloudinary.com/mejuri-com/image/upload/w_768,q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg 768w"
                                    />
                                    <img
                                        className="relative w-full z-[1] object-contain h-full"
                                        sizes="100vw"
                                        alt="Mejuri Hero"
                                        loading="eager"
                                        fetchPriority="high"
                                        src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1763134851/2025/Web%20Evergreen/Corporate%20Landing%20Gifting%20Page/DT/FY25_Corporate_Gifting_Landing_Page_Hero_DT.jpg"
                                    />
                                </picture>
                            </div>
                        </div>

                        {/* Text Overlay */}
                        <div className="bg-black flex flex-col h-auto w-full items-end justify-center basis-1/3 py-2xl lg:py-[3rem] lg:px-[1rem] xl:px-6xl px-md pointer-events-none">
                            <div className="text-left flex flex-col items-end justify-center">
                                <h1 className="text-[4rem] text-white leading-[1] font-bold tracking-[.05em] w-full lg:w-full">
                                    MEJURI PRIVATE EVENTS AND CORPORATE GIFTING
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-[.5rem] bg-black">
                    <div className="bg-black py-[0.5rem] flex justify-center gap-[1.5rem]">
                        <a href="#social" className="bg-white font-semibold uppercase relative pointer-cursor text-black inline-block text-center py-[.75rem] px-[1.5rem] tracking-[.0625rem] leading-[20px] text-[.875rem]">
                            Social Hosting
                        </a>
                        <a href="#brands" className="bg-white font-semibold uppercase relative pointer-cursor text-black inline-block text-center py-[.75rem] px-[1.5rem] tracking-[.0625rem] leading-[20px] text-[.875rem]">
                            Brands And Business
                        </a>
                    </div>
                </div>
                <div className="py-[3.5rem] px-[2rem]">
                    <div className="w-full text-left">
                        <h1 className="text-[2rem] font-semibold tracking-[.05em] leading-[1] text-black">
                            SOCIAL EVENTS
                        </h1>
                        <br />
                        <p className="font-mono text-[.875rem] leading-[1.33] tracking-[-.01em] text-black">
                            Better than a dinner reservation. Claim the store for bridal parties, piercings, or philanthropy. No lines, no fees, and no reasons to stay home. Terms & Conditions apply.
                        </p>
                        <p className="font-mono text-[.875rem] leading-[1.33] tracking-[-.01em] text-black">
                        </p>
                        <p className="font-mono text-[.875rem] leading-[1.33] tracking-[-.01em] text-black">
                        </p>
                    </div>
                </div>
                <div id="social" className="pb-[3.5rem] px-[2rem]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1.5rem]">
                        {eventCards.map((card, index) => (
                            <Reveal key={card.title} delay={index * 70}>
                                <div className="flex-col flex h-full py-[.75rem] px-[.5rem]">
                                    <div className="overflow-hidden bg-[#f3f3f3]">
                                        <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                                    </div>
                                    <h3 className="mt-0 mb-[.5rem] font-sans text-[1.5rem] font-semibold tracking-[.05em] uppercase text-black">{card.title}</h3>
                                    <p className="mb-[.5rem] font-mono text-[.875rem] leading-[1.33] tracking-[-.01em] text-black">{card.text}</p>
                                    <div className="mt-[.75rem] mb-[.5rem]">
                                        <a href={card.link} className="inline-flex border-b border-black pb-0.5 font-sans text-[14px] font-bold uppercase tracking-[0.02em] transition-colors duration-300 ease-in-out">{card.cta}</a>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div id="brands" className="py-[3.5rem] px-[2rem]">
                    <div className="flex flex-col lg:flex-row text-left gap-[5rem] lg:flex-row-reverse">
                        <div className="flex-1">
                            <div className="h-full content-center">
                                <div className="mb-[1.5rem]">
                                    <h3 className="text-[2rem] tracking-[.05em] leading-[1] font-medium uppercase">Corporate EVENTS &amp; GIFTING</h3>
                                    <br />
                                    <ul className="list-disc list-inside font-mono text-[.875rem]">
                                        <li className="text-inherit type-body-1 marker:text-inherit marker:type-body-1 flex items-start mt-2">
                                            <span className="flex-shrink-0 ml-1 w-6">
                                                <span className="inline-block text-left">•</span>
                                            </span>
                                            <div className="flex-1">
                                                <p className="">Host a private shopping experience for your team.</p>
                                            </div>
                                        </li>
                                        <li className="text-inherit type-body-1 marker:text-inherit marker:type-body-1 flex items-start mt-2">
                                            <span className="flex-shrink-0 ml-1 w-6">
                                                <span className="inline-block text-left">•</span>
                                            </span>
                                            <div className="flex-1">
                                                <p className="">Enjoy exclusive access to any of our retail locations, fully staffed to host your group.</p>
                                            </div>
                                        </li>
                                        <li className="text-inherit type-body-1 marker:text-inherit marker:type-body-1 flex items-start mt-2">
                                            <span className="flex-shrink-0 ml-1 w-6">
                                                <span className="inline-block text-left">•</span>
                                            </span>
                                            <div className="flex-1">
                                                <p className="">Light bites and bubbly. A small event fee may apply for additional staffing or catering requests.</p>
                                            </div>
                                        </li>
                                        <li className="text-inherit type-body-1 marker:text-inherit marker:type-body-1 flex items-start mt-2">
                                            <span className="flex-shrink-0 ml-1 w-6">
                                                <span className="inline-block text-left">•</span>
                                            </span>
                                            <div className="flex-1">
                                                <p className="">All guests receive 15% off in store purchases during the event.</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <br />
                                    <p className="font-mono text-[.875rem] ">
                                        Corporate gifting is offered to our approved corporate partners for bulk orders, making it ideal for holidays, employee recognition, and special milestones.
                                    </p>
                                    <br />
                                    <p className="font-mono text-[.875rem] ">
                                        Reach out to corporatesales@mejuri.com for more details.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <img className="h-auto w-full object-cover" src="https://cdn.sanity.io/images/lb60gqpm/production/afd37d40ac3402c32267b51e46e095cc34122624-585x703.jpg?w=1920&q=90&fit=max&auto=format"/>
                        </div>
                    </div>

                </div>
                <Footer />
                <ChatButton />
            </main>
        );
    }