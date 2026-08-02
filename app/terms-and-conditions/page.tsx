"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    paragraphs: [
      "These Terms and Conditions govern your access to and use of this website, including purchases made through it. By visiting the site or placing an order, you agree to these terms and to our Privacy Policy.",
      "If you do not agree with these terms, please do not use the website. You must be legally capable of entering into a binding agreement in your place of residence.",
    ],
  },
  {
    id: "accounts",
    title: "2. Accounts and eligibility",
    paragraphs: [
      "You are responsible for providing accurate account and checkout information and for keeping your login credentials secure. Please notify us promptly if you believe your account has been accessed without authorization.",
      "We may suspend or close an account when necessary to protect customers, prevent fraud, or enforce these terms.",
    ],
  },
  {
    id: "products",
    title: "3. Products and availability",
    paragraphs: [
      "We aim to display product descriptions, colors, measurements, materials, and images accurately. Screen settings and the natural characteristics of jewelry may cause minor differences from what appears online.",
      "Products and services are subject to availability. We may limit quantities, discontinue items, or correct product information at any time.",
    ],
  },
  {
    id: "orders",
    title: "4. Orders, pricing, and payment",
    paragraphs: [
      "Submitting an order is an offer to purchase. An order is accepted only when we confirm acceptance or dispatch the products. We may cancel or decline an order for availability, payment, pricing, fraud-prevention, or legal reasons.",
      "Prices, taxes, delivery charges, discounts, and currency are shown during checkout. You authorize the selected payment provider to charge the final amount shown before purchase.",
    ],
  },
  {
    id: "shipping",
    title: "5. Shipping and delivery",
    paragraphs: [
      "Delivery estimates are provided in good faith but are not guaranteed. Delays may occur because of carriers, customs, weather, demand, or circumstances outside our reasonable control.",
      "You are responsible for entering a complete and accurate delivery address. Risk of loss transfers as permitted by applicable consumer law.",
    ],
  },
  {
    id: "returns",
    title: "6. Returns, exchanges, and warranty",
    paragraphs: [
      "Eligible returns and exchanges are handled under the policies shown in our Help section. Certain personalized, engraved, altered, final-sale, or hygiene-sensitive products may not be returnable unless required by law.",
      "Any product warranty is subject to its stated coverage, exclusions, care requirements, and proof-of-purchase conditions. Your mandatory consumer rights remain unaffected.",
    ],
  },
  {
    id: "site-use",
    title: "7. Acceptable use",
    paragraphs: [
      "You may use this website only for lawful personal purposes. You must not interfere with site security, misuse checkout or promotional systems, scrape protected content, introduce malicious code, impersonate another person, or attempt unauthorized access.",
      "We may restrict access when activity threatens the website, our customers, or our partners.",
    ],
  },
  {
    id: "intellectual-property",
    title: "8. Intellectual property",
    paragraphs: [
      "The website design, branding, photographs, product designs, copy, graphics, software, and other content are owned by or licensed to the site operator and are protected by intellectual-property laws.",
      "You may view the site and retain order records for personal use. No other copying, publication, commercial use, modification, or distribution is permitted without prior written authorization.",
    ],
  },
  {
    id: "third-parties",
    title: "9. Third-party services",
    paragraphs: [
      "Payments, delivery, maps, and other features may be provided by third parties. Their services may be governed by separate terms and privacy practices. We are not responsible for third-party websites that are outside our control.",
    ],
  },
  {
    id: "liability",
    title: "10. Disclaimers and limitation of liability",
    paragraphs: [
      "To the extent permitted by law, the website is provided on an as-available basis. We do not guarantee uninterrupted access or that every error will be corrected immediately.",
      "Nothing in these terms excludes liability that cannot legally be excluded. Otherwise, liability is limited to losses that are a foreseeable result of our breach and excludes indirect or purely commercial losses.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to these terms",
    paragraphs: [
      "We may update these terms to reflect changes in our services, business practices, or legal requirements. Updated terms apply from the date posted here and will not retroactively alter an accepted order unless required by law.",
    ],
  },
  {
    id: "contact",
    title: "12. Contact us",
    paragraphs: [
      "Questions about these terms, an order, or your consumer rights can be submitted through our Help and Contact section. Please include the relevant order number, but never send full payment-card details.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHidePromoBar(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
      <Navbar
        isScrolled={hidePromoBar}
        hidePromoBar={hidePromoBar}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMegaMenuOpen={isMegaMenuOpen}
        setIsMegaMenuOpen={setIsMegaMenuOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        variant="light"
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="pt-[114px]">
        <header className="border-b border-black bg-[#f5f2ed] px-5 py-16 text-center md:px-[5.2vw] md:py-24">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">Legal</p>
          <h1 className="mt-5 font-sans text-[36px] font-extrabold uppercase leading-none tracking-[0.04em] md:text-[54px]">
            Terms &amp; Conditions
          </h1>
          <p className="mt-6 font-mono text-[12px] font-bold">Last updated: August 2, 2026</p>
        </header>

        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-14 md:px-[5.2vw] md:py-20 lg:grid-cols-[280px_minmax(0,760px)] lg:justify-center lg:gap-20">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="mb-5 text-[14px] font-bold uppercase">On this page</h2>
            <nav aria-label="Terms sections" className="border-y border-black/15 py-5">
              <ol className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-[12px] text-black/65 hover:text-black hover:underline">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article>
            <p className="mb-12 border-b border-black/15 pb-10 text-[15px] leading-7 text-black/75">
              Please read these terms carefully before using this website or placing an order. They explain the rules that apply to site use, purchases, and related services.
            </p>
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32 border-b border-black/15 pb-12 last:border-0">
                  <h2 className="mb-5 text-[22px] font-bold uppercase leading-tight tracking-[0.02em]">{section.title}</h2>
                  <div className="space-y-4 text-[14px] leading-7 text-black/75 md:text-[15px]">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
