"use client";

import { ChatButton } from "@/components/ChatButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";
import { useEffect, useState } from "react";

export default function PiercingEvents() {
    const [hidePromoBar, setHidePromoBar] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setHidePromoBar(window.scrollY > 0);
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
                isScrolled
                hidePromoBar={hidePromoBar}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isMegaMenuOpen={isMegaMenuOpen}
                setIsMegaMenuOpen={setIsMegaMenuOpen}
                onSearchClick={() => setIsSearchOpen(true)}
            />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Hero Section 60% Image / 40% Text */}
            {/* Hero Section */}
            <section className="mt-[95px] w-full">
                <div className="flex flex-col lg:flex-row h-[700px]">

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 h-[420px] lg:h-full">
                        <img
                            src="https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1778862701/Store%20Led%20Events/Piercing_Landing_Hero_M.jpg"
                            alt="Piercing Hero"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Text Side */}
                    <div className="w-full lg:w-1/2 bg-black flex items-center">
                        <div className="px-10 lg:px-20">
                            <h1 className="text-white text-[34px] lg:text-[2rem] font-semibold uppercase tracking-[2px] leading-[1.05] mb-8">
                                THROW A PIERCING PARTY
                            </h1>

                            <p
                                className="text-white font-mono text-[.875rem] leading-[1.33] tracking-[-.01em]"
                            >
                                The ultimate group outing. Reserve a dedicated block for
                                you and your friends to get pierced by our pros—no wait
                                times, no service fees.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Booking Form Section */}
            <section className=" max-w-3xl mx-auto">
                <div className="py-[1rem] mb-[1.5rem]">
                    <h2 className="mb-[.75rem] text-[1.5rem] uppercase font-semibold tracking-[.05em] text-center">Booking Inquiry</h2>
                    <p className="font-mono text-[.875rem] leading-[1.33] tracking-[-.01em]">Tell us about your ideal piercing party. We’ll find a date and get in touch.</p>
                </div>
                <form className="grid grid-cols-1 gap-6">
                    {[
                        { label: "First & Last Name", type: "text", name: "name" },
                        { label: "Email", type: "email", name: "email" },
                        { label: "Phone Number", type: "tel", name: "phone" },
                        { label: "Preferred Dates", type: "text", name: "dates" },
                    ].map((field) => (
                        <div key={field.name} className="relative">
                            <input
                                id={field.name}
                                type={field.type}
                                name={field.name}
                                placeholder=" "
                                required
                                className="peer block w-full border-b-2 border-gray-300 focus:border-black outline-none text-base p-2 bg-transparent"
                            />
                            <label
                                htmlFor={field.name}
                                className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-black"
                            >
                                {field.label}*
                            </label>
                        </div>
                    ))}

                    <div className="relative">
                        <select
                            required
                            className="peer block w-full border-b-2 border-gray-300 focus:border-black outline-none bg-transparent text-base p-2 appearance-none"
                        >
                            <option value="" disabled selected>
                                SELECT YOUR PREFERRED LOCATION
                            </option>
                            <option>New York</option>
                            <option>Los Angeles</option>
                            <option>Chicago</option>
                        </select>
                    </div>

                    <div className="relative">
                        <textarea
                            placeholder=" "
                            required
                            className="peer block w-full border-b-2 border-gray-300 focus:border-black outline-none text-base p-2 bg-transparent resize-none"
                            rows={5}
                        />
                        <label
                            className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-black"
                        >
                            Tell us more about this occasion (500 words max)*
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" id="terms" className="mr-2" required />
                        <label htmlFor="terms" className="text-sm">
                            By signing up you agree to our{" "}
                            <a href="#" className="underline">
                                Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline">
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-black text-white w-auto px-6 py-3 font-semibold rounded hover:opacity-80 transition"
                    >
                        SUBMIT REQUEST
                    </button>
                </form>
            </section>

            <Footer />
            <ChatButton />
        </main>
    );
}