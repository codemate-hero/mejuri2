import Link from "next/link";
import Image from "next/image";
import { SustainabilityBand } from "@/components/SustainabilityBand";

type FooterLink = {
  label: string;
  href: string;
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

const groups: FooterGroup[] = [
  {
    title: "Help",
    links: [
      { label: "FAQs", href: "/faq/stores#frequently-asked" },
      { label: "Order Status", href: "/account/orders" },
      { label: "Shipping & Delivery", href: "/faq/stores#order-and-shipping" },
      { label: "Returns & Exchanges", href: "/faq/stores#returns-and-exchanges" },
      { label: "Warranty", href: "/faq/stores#warranty" },
      { label: "Contact Us", href: "/faq/stores#frequently-asked" },
      { label: "Payment Help", href: "/faq/stores#payment" },
    ],
  },
  {
    title: "Stores & Services",
    links: [
      { label: "Our Stores", href: "/stores" },
      { label: "Piercing Services Near You", href: "/piercing" },
      { label: "Piercing Aftercare", href: "/faq/stores#stores-and-services" },
      { label: "Bridal Events", href: "/company/bridal-events" },
      { label: "Corporate Events & Gifting", href: "/company/mejuri-events" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Jewelry Care", href: "/faq/stores#product-information" },
      { label: "Our Materials", href: "/edit/lab-grown-gemstones" },
      { label: "Size Guides", href: "/guided-shop/ring-stacking-guide" },
      { label: "How To Guides", href: "/guided-shop/ring-stacking-guide" },
      { label: "The Lookbook", href: "/guided-shop/look-book" },
      { label: "Terms & Conditions", href: "https://mejuri.com/world/en/terms-and-conditions" },
    ],
  },
  {
    title: "About Mejuri",
    links: [
      { label: "Our Mission", href: "https://mejuri.com/world/en/about" },
      { label: "Sustainability", href: "/faq/stores#sustainability" },
      { label: "Commitments", href: "/company/philanthropy-events" },
      { label: "Modern Slavery Policy", href: "https://mejuri.com/world/en/modern-slavery-statement" },
      { label: "Accessibility Statement", href: "https://mejuri.com/world/en/accessibility" },
      { label: "Supplier Code Of Conduct", href: "https://mejuri.com/world/en/supplier-code-of-conduct" },
      { label: "Careers", href: "https://mejuri.com/careers" },
    ],
  },
];

const paymentMethods = [
  { src: "/visa.svg", alt: "Visa" },
  { src: "/mastercard.svg", alt: "Mastercard" },
  { src: "/amex.svg", alt: "American Express" },
  { src: "/paypal-logo.svg", alt: "PayPal" },
  { src: "/klarna.svg", alt: "Klarna" },
  { src: "/afterpay.svg", alt: "Afterpay" },
];

function FooterNavLink({ link }: { link: FooterLink }) {
  const className = "block text-[13px] text-black/70 transition-colors hover:text-black hover:underline";

  if (link.href.startsWith("http")) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return <Link href={link.href} className={className}>{link.label}</Link>;
}

export function Footer() {
  return (
    <>
      <SustainabilityBand />
      <footer className="bg-white font-display text-black">
        <div className="px-5 py-10 md:px-[5.2vw] md:py-16">
          <div className="hidden gap-10 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.15fr]">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-6 text-[14px] font-semibold">{group.title}</h3>
                <nav aria-label={group.title} className="space-y-4">
                  {group.links.map((link) => <FooterNavLink key={link.label} link={link} />)}
                </nav>
              </div>
            ))}
            <div>
              <h3 className="mb-8 text-[14px] font-bold">Our Certifications And Partnerships</h3>
              <Image
                src="https://res.cloudinary.com/mejuri-com/image/upload/v1752760519/certifications-parternship_logos_frtvgx.png"
                alt="Mejuri certifications and partnerships"
                width={300}
                height={80}
                className="w-full max-w-[300px]"
              />
            </div>
          </div>

          <div className="divide-y divide-black/15 border-y border-black/15 md:hidden">
            {groups.map((group) => (
              <details key={group.title} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[14px] font-semibold">
                  {group.title}
                  <span aria-hidden="true" className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <nav aria-label={group.title} className="space-y-4 pb-6">
                  {group.links.map((link) => <FooterNavLink key={link.label} link={link} />)}
                </nav>
              </details>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <h3 className="mb-6 text-[14px] font-bold">Our Certifications And Partnerships</h3>
            <Image
              src="https://res.cloudinary.com/mejuri-com/image/upload/v1752760519/certifications-parternship_logos_frtvgx.png"
              alt="Mejuri certifications and partnerships"
              width={300}
              height={80}
              className="w-full max-w-[300px]"
            />
          </div>
        </div>

        <section className="border-t border-black/10 px-5 py-10 md:px-[5.2vw] md:py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-4xl">
              <h3 className="text-[16px] font-bold">MEJURI+ &nbsp; BECOME A MEMBER</h3>
              <p className="mt-2 text-[13px] leading-6 text-black/75">
                Join Mejuri+ for free and discover exclusive access to our biggest drops, promotions, members-only products, and more.
              </p>
            </div>
            <a
              href="https://mejuri.com/world/en/mejuri-plus"
              target="_blank"
              rel="noreferrer"
              className="flex h-12 shrink-0 items-center justify-center border border-black px-8 text-[13px] font-bold uppercase transition hover:bg-black hover:text-white"
            >
              Join Now For Free
            </a>
          </div>
        </section>

        <div className="border-t border-black/10 px-5 py-6 md:px-[5.2vw]">
          <div className="flex flex-wrap items-center gap-3" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <span key={method.alt} className="flex h-8 w-12 items-center justify-center rounded border border-black/15 bg-white px-1.5">
                <Image src={method.src} alt={method.alt} width={48} height={20} className="max-h-5 max-w-full" />
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-black px-5 py-5 text-[11px] text-white md:px-[5.2vw] lg:flex-row lg:items-center lg:justify-between">
          <a href="https://mejuri.com/world/en/" target="_blank" rel="noreferrer" className="hover:underline">
            Country & Language: United States (USD) | English
          </a>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="https://mejuri.com/world/en/privacy-policy" target="_blank" rel="noreferrer" className="hover:underline">Privacy Policy</a>
            <a href="https://mejuri.com/world/en/terms-and-conditions" target="_blank" rel="noreferrer" className="hover:underline">Terms And Conditions</a>
            <span>© {new Date().getFullYear()} Mejuri Inc</span>
          </div>
        </div>
      </footer>
    </>
  );
}
