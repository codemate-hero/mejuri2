"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ChatButton } from "@/components/ChatButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SearchModal } from "@/components/SearchModal";




type FaqItem = {
  question: string;
  answer: ReactNode;
};

type FaqCategory = {
  label: string;
  id: string;
  heading: string;
  items: FaqItem[];
};

const quickActions = [
  {
    title: "Shipping & Fees",
    linkText: "How Long Does It Take To Ship?",
    href: "#order-and-shipping",
    image:
      "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1761330220/2025/Web%20Evergreen/Web%20Evergreen%20November/102425%20-%20BAU/FY25_NovBAU_Bestsellers.jpg",
    alt: "Model wearing Mejuri jewelry",
  },
  {
    title: "Returns",
    linkText: "Start Your Return",
    href: "#returns-and-exchanges",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=90",
    alt: "Layered necklaces",
  },
  {
    title: "Jewelry Care",
    linkText: "How To Care For Your Jewelry",
    href: "#product-information",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=90",
    alt: "Jewelry care packaging",
  },
];

const faqCategories: FaqCategory[] = [
  {
    label: "FREQUENTLY ASKED",
    id: "frequently-asked",
    heading: "FREQUENTLY ASKED",
    items: [
      {
        question: "Do you have a warranty?",
        answer: (
          <div className="space-y-7">
            <p>
              {"We are committed to providing high-quality, handcrafted jewelry made to last. We are confident in the quality of our products, which is why we offer a two-year warranty from the date you receive your order for defects or issues resulting from the workmanship of the jewelry. Our warranty does not cover lost items, normal wear and tear, including scratches, tarnishing, or fading of metals and gemstones, damage caused by improper care, such as exposure to chemicals, water, or excessive force, or any modification to your product done by a third party outside of Mejuri."}
            </p>

            <div>
              <p className="font-bold">
                To submit your warranty claim, please choose one of the links below:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-8">
                <li>
                  <a href="#" className="border-b border-black">
                    (English) Submit Your Warranty Claim Here
                  </a>
                </li>
                <li>
                  <a href="#" className="border-b border-black">
                    (English) Receive A Gift? Submit Your Warranty Claim Here
                  </a>
                </li>
                <li>
                  <a href="#" className="border-b border-black">
                    (French) Submit Your Warranty Claim Here
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold">Important</p>
              <p>By submitting a warranty claim, you acknowledge and agree to the following terms:</p>
              <ol className="mt-3 list-decimal space-y-3 pl-8">
                <li>
                  <strong>Return of Impacted Product:</strong> If your warranty submission is accepted, you must send the impacted product to us for quality assurance review and testing.
                </li>
                <li>
                  <strong>If the item is in stock,</strong> and your warranty submission is approved, you will receive a replacement of the same item.
                </li>
                <li>
                  <strong>If the item is not in stock</strong> due to inventory limitations or discontinuation, you will be issued a store credit equivalent to the purchase price of the original item.
                </li>
                <li>
                  <strong>No Refunds or Exchanges:</strong> refunds will not be provided nor an exchange for a different item, size or material.
                </li>
                <li>
                  <strong>Third-party vendor:</strong> Items purchased through a third-party vendor outside of Mejuri.com and/or Mejuri stores or pop-ups may be subject to a different warranty policy.
                </li>
                <li>
                  <strong>Third-party services:</strong> Leveraging a third party repair service will void Mejuri&apos;s warranty. Mejuri does not accept warranty claims with post-purchase modifications.
                </li>
                <li>
                  <strong>Promotional products:</strong> Items received from a promotion or campaign may be excluded from our warranty policy.
                </li>
              </ol>
            </div>
          </div>
        ),
      },
      {
        question: "What is the return policy?",
        answer: (
          <div className="space-y-8">
            <div>
              <p className="font-bold text-[21px]">Return requirements</p>
              <ul className="mt-3 list-disc space-y-3 pl-8">
                <li>Items must be in their original condition without signs of wear or damage</li>
                <li>Items returned by mail must be in all original packaging (tags, box, and pouch included)</li>
                <li>No individual item of a set can be returned for refund, store credit and/or size exchange, and must be returned as a complete set.</li>
                <li>For Lab Grown Diamonds, the SCS certification must be included or it will be returned back to the sender</li>
                <li>Orders must be returned in the same country which they were originally purchased in</li>
              </ul>
            </div>

            <div>
              <p>All below items are non-returnable:</p>
              <ul className="mt-3 list-disc space-y-3 pl-8">
                <li>Engraved and monogrammed products</li>
                <li>Earrings used to pierce during a piercing appointment</li>
                <li>Gift cards</li>
                <li>Final sale items</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">Return shipping</p>
              <p>Shipping fees are non-refundable. Returning orders subject to a return fee will be deducted from the amount being refunded to you.</p>
            </div>

            <div>
              <p className="font-bold">Exchange Guidelines</p>
              <p>
                We want you to love your purchase, and so we are happy to offer exchanges for Canadian customers at this time. If you need to exchange an item, please ensure it meets our <strong>Return Guidelines</strong> noted above.
              </p>
            </div>

            <div>
              <p className="font-bold">Important Details:</p>
              <ul className="mt-3 list-disc space-y-3 pl-8">
                <li>Exchanges must be initiated within the 30 day return policy, and <strong>must be put in the mail within 7 days</strong> of being initiated in order to secure the exchanging item</li>
                <li>All exchanges must comply with our <strong>Return Guidelines</strong> (e.g., item must be unworn, in original packaging, and accompanied by proof of purchase).</li>
              </ul>
            </div>

            <p>If your item does not meet our return criteria or falls outside the 7-day window, it will not be eligible for exchange.</p>
          </div>
        ),
      },
      {
        question: "What is the exchange policy?",
        answer: (
          <div className="space-y-7">
            <div>
              <p>We offer 30-day exchanges - whether you shopped online or in-store!</p>
              <p className="font-bold">Visiting a store?</p>
              <p>All customers are welcome to exchange items at any of our retail locations within 30 days of purchase. Please bring one of the following:</p>
              <ul className="mt-3 list-disc space-y-3 pl-8">
                <li>Your order confirmation email</li>
                <li>A gift receipt</li>
              </ul>
              <p className="font-bold">Do it online</p>
            </div>

            <p>
              Click <a href="#" className="border-b border-black">Here</a> to get started. Please note that purchases made in-store and buy-online-pickup-in-store can only be exchanged by visiting a store.
            </p>

            <div>
              <p className="font-bold">Important Details:</p>
              <ul className="mt-3 list-disc space-y-3 pl-8">
                <li>Exchanges must be initiated within the 30 day return policy, and <strong>must be put in the mail within 7 days</strong> of initiating the exchange.</li>
                <li>To qualify for an exchange, all items must meet the same return qualifications listed in our <a href="#" className="border-b border-black">Returns Policy</a>.</li>
                <li>If your item does not meet our return criteria or falls outside the 7-day window, it will not be eligible for exchange.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        question: "How can I track my order?",
        answer: (
          <div className="space-y-8">
            <div>
              <p className="font-bold">Have an account?</p>
              <p>
                Great! Login and head over to your Mejuri account and select &quot;My Orders&quot; to review your order status. Once your order is packed and ready to ship, you will receive a tracking number via email so you can keep an eye on its activity while it makes its way to you.
              </p>
            </div>

            <div>
              <p className="font-bold">Don&apos;t have an account?</p>
              <p>
                No worries! You can still create an account now using the same email address used to place the order and it will appear under &quot;My Orders&quot;. Tracking numbers are automatically sent as soon as your order is packed! Once the courier picks up the package and scans it into the system, the tracking number can be used to see the information about your order. This may take a couple hours and if the order was packed on the weekend, it will be updated next available business day!
              </p>
            </div>

            <div className="overflow-x-auto pt-6">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-black">
                    <th className="w-[150px] px-4 py-4 font-sans text-[18px] font-bold">STATUS</th>
                    <th className="px-4 py-4 font-sans text-[18px] font-bold">WHAT DOES THIS MEAN?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="px-4 py-5 align-top">Processing</td>
                    <td className="px-4 py-5">Your order has been handed over to our team to fulfill. If all items in your order are in-stock, typical processing time is 1 business day</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="px-4 py-5 align-top">Shipped</td>
                    <td className="px-4 py-5">Yay! Your order has been packed and is on the way to you. Kindly note that the tracking may take some time to be scanned into the courier&apos;s system to reflect any activity or movement.</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="px-4 py-5 align-top">Partial</td>
                    <td className="px-4 py-5">Oh, looks like your order has a backorder or made-to-order piece! To ensure you can get started on enjoying your Mejuri piece as early as possible, we have shipped the available pieces first.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        question: "Can I cancel my order?",
        answer: (
          <p>
            You can cancel your order within 30 minutes of purchase by logging into your account. Once logged in, go to <a href="#" className="border-b border-black">My Orders</a> and click &quot;Cancel Order&quot;. If you don&apos;t have an account, no worries, you can create one using the same email used to place the order. Our team works hard to get your order dispatched as quickly as possible, so we are unable to guarantee any cancellation requests or changes to your order past this window.
          </p>
        ),
      },
      {
        question: "Are Mejuri pieces good for sensitive skin?",
        answer: (
          <p>
            Yes, many Mejuri pieces are made from 14k solid gold or gold vermeil, which are ideal for sensitive skin. They&apos;re nickel safe and designed for everyday wear.
          </p>
        ),
      },
      {
        question: "What is 'Before We Melt' sale?",
        answer: (
          <div className="space-y-7">
            <p>
              From February 23, 2026 at 11:00 AM EST, select styles on our Before We Melt page are available at 30% off, while supplies last.
            </p>
            <div>
              <p className="font-bold">Offer Details</p>
              <ul className="mt-3 list-disc space-y-3 pl-8">
                <li>30% discount automatically applied at checkout</li>
                <li>Valid online, in-store, and through the Mejuri app, while supplies last</li>
              </ul>
              <p className="font-bold">Return Policy</p>
              <p>All items purchased through the Before We Melt promotion are final sale and cannot be returned or exchanged.</p>
            </div>
            <div>
              <p className="font-bold">Exclusions</p>
              <p>
                This promotion is not valid at Mejuri branded stores located inside Holt Renfrew Bloor Street (Toronto), Holt Renfrew Vancouver, Nordstrom 57th Street NYC. See <a href="#" className="border-b border-black">Terms & Conditions</a> for more details.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    label: "WARRANTY",
    id: "warranty",
    heading: "WARRANTY",
    items: [
      {
        question: "Do you have a warranty?",
        answer:
          "Yes. Mejuri offers a two-year warranty against manufacturing defects for eligible pieces.",
      },
      {
        question: "What is not covered under warranty?",
        answer:
          "Normal wear, accidental damage, loss, improper care, and third-party repairs are not covered.",
      },
      {
        question: "How do I submit a warranty claim?",
        answer:
          "Contact our team with your order details and clear photos of the piece so we can review it.",
      },
    ],
  },
  {
    label: "STORES & SERVICES",
    id: "stores-and-services",
    heading: "STORE & SERVICES",
    items: [
      {
        question: "Where are Mejuri stores located?",
        answer:
          "Mejuri stores are located across the US, Canada, UK, Australia, and select international regions. Visit the stores page to find your nearest location.",
      },
      {
        question: "Does every Mejuri store offer piercing services?",
        answer:
          "Piercing services are available at select stores only. Check the piercing page or your local store page for availability.",
      },
      {
        question: "Do you offer jewelry cleaning in-store?",
        answer:
          "Yes. Complimentary jewelry cleaning is available in Mejuri stores for most Mejuri pieces.",
      },
      {
        question: "How is jewelry cleaned in-store?",
        answer:
          "Our store team gently inspects the piece and uses appropriate care methods for the material and stone type.",
      },
    ],
  },
  {
    label: "ORDER & SHIPPING",
    id: "order-and-shipping",
    heading: "ORDER & SHIPPING",
    items: [
      {
        question: "How long does it take to ship?",
        answer:
          "Shipping timing depends on your location and selected delivery method. Estimated delivery dates are shown at checkout.",
      },
      {
        question: "Can I change my shipping address?",
        answer:
          "Contact us as soon as possible. Once an order is processing or shipped, address changes may not be available.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Mejuri ships to supported countries and regions. Available shipping options appear at checkout.",
      },
    ],
  },
  {
    label: "RETURNS & EXCHANGES",
    id: "returns-and-exchanges",
    heading: "RETURNS & EXCHANGES",
    items: [
      {
        question: "How do I start a return?",
        answer:
          "Use the returns flow from your order details or contact support for help with eligible items.",
      },
      {
        question: "Can I return an item in-store?",
        answer:
          "Eligible items may be returned at select Mejuri stores. Bring your order confirmation and the original packaging.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Refund timing depends on your payment provider after the return has been processed.",
      },
    ],
  },
  {
    label: "MEMBERSHIP",
    id: "membership",
    heading: "MEMBERSHIP",
    items: [
      {
        question: "What is Mejuri+?",
        answer:
          "Mejuri+ is our membership experience with access to special perks, drops, and promotions.",
      },
      {
        question: "Is membership free?",
        answer:
          "You can join Mejuri+ for free and start accessing member benefits.",
      },
    ],
  },
  {
    label: "PRODUCT INFORMATION",
    id: "product-information",
    heading: "PRODUCT INFORMATION",
    items: [
      {
        question: "How do I care for my jewelry?",
        answer:
          "Store pieces separately, avoid harsh chemicals, and gently clean with a soft cloth after wear.",
      },
      {
        question: "What materials do you use?",
        answer:
          "Materials vary by product and can include solid gold, gold vermeil, sterling silver, diamonds, pearls, and gemstones.",
      },
      {
        question: "How do I find my ring size?",
        answer:
          "Use the size guide or visit a Mejuri store for help finding the right fit.",
      },
    ],
  },
  {
    label: "SUSTAINABILITY",
    id: "sustainability",
    heading: "SUSTAINABILITY",
    items: [
      {
        question: "What is Mejuri doing for sustainability?",
        answer:
          "Mejuri continues to work on responsible sourcing, lower-impact materials, and transparent progress reporting.",
      },
      {
        question: "Where can I read the sustainability report?",
        answer:
          "You can view the latest sustainability progress from the footer resources.",
      },
    ],
  },
  {
    label: "PAYMENT",
    id: "payment",
    heading: "PAYMENT",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "Accepted payment methods are shown at checkout and may include major cards and supported digital wallets.",
      },
      {
        question: "Can I use a gift card online?",
        answer:
          "Gift cards can be applied at checkout where eligible.",
      },
    ],
  },
];

export default function StoreFaqPage() {
  const [hidePromoBar, setHidePromoBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("FREQUENTLY ASKED");
  const [openQuestions, setOpenQuestions] = useState<string[]>(["Do you have a warranty?"]);

  const selectedCategory =
    faqCategories.find((category) => category.label === activeCategory) ?? faqCategories[0];

  useEffect(() => {
    const handleScroll = () => setHidePromoBar(window.scrollY > 0);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectCategory = (label: string) => {
    setActiveCategory(label);
    const category = faqCategories.find((item) => item.label === label);
    setOpenQuestions(category?.items[0] ? [category.items[0].question] : []);
  };

  const toggleQuestion = (question: string) => {
    setOpenQuestions((current) =>
      current.includes(question)
        ? current.filter((item) => item !== question)
        : [...current, question]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <PromoBar isScrolled={hidePromoBar} hideForSidebar={isMobileMenuOpen || isMegaMenuOpen} />
      <Navbar
        isScrolled={false}
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
        <section className="flex min-h-[270px] items-center justify-center bg-black px-4 text-center text-white md:min-h-[310px]">
          <div>
            <h1 className="font-sans text-[34px] font-extrabold uppercase leading-none tracking-[0.05em] md:text-[40px]">
              HOW CAN WE HELP YOU?
            </h1>
            <p className="mt-7 font-mono text-[16px] font-bold text-white">
              Have a question? Feel free to check out our FAQs
            </p>
          </div>
        </section>

        <section className="bg-white px-4 pb-12 pt-20 md:px-[5.2vw]">
          <h2 className="mb-8 font-sans text-[36px] font-extrabold uppercase leading-none tracking-[0.05em] text-black md:text-[40px]">
            QUICK ACTIONS
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="grid min-h-[180px] bg-[#f6f6f6] transition-opacity hover:opacity-80 sm:grid-cols-[180px_1fr]"
              >
                <div className="relative min-h-[180px]">
                  <Image
                    src={action.image}
                    alt={action.alt}
                    fill
                    sizes="(min-width: 1024px) 180px, 92vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex flex-col justify-center px-6 py-6">
                  <h3 className="font-sans text-[23px] font-bold text-black">{action.title}</h3>
                  <span className="mt-3 w-fit border-b border-black font-sans text-[16px] font-bold text-black">
                    {action.linkText}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white px-4 pb-24 pt-10 md:px-[5.2vw]">
          <h2 className="mb-7 font-sans text-[36px] font-extrabold uppercase leading-none tracking-[0.05em] text-black md:text-[40px]">
            SELECT A CATEGORY
          </h2>
          <div className="no-scrollbar mb-12 flex gap-2 overflow-x-auto">
            {faqCategories.map((category) => (
              <button
                key={category.label}
                id={category.id}
                onClick={() => selectCategory(category.label)}
                className={`shrink-0 px-5 py-4 font-sans text-[16px] uppercase text-black ${
                  activeCategory === category.label
                    ? "border border-black bg-white"
                    : "border border-transparent bg-[#ebebea] hover:border-black"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <h2 className="mb-14 font-sans text-[38px] font-extrabold uppercase leading-none tracking-[0.05em] text-black md:text-[42px]">
            {selectedCategory.heading}
          </h2>
          <div className="max-w-none">
            {selectedCategory.items.map((item) => {
              const isOpen = openQuestions.includes(item.question);

              return (
                <div key={item.question} className="py-4">
                  <button
                    onClick={() => toggleQuestion(item.question)}
                    className="flex w-fit items-center gap-4 text-left"
                  >
                    <span className="font-sans text-[17px] font-bold text-black">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 stroke-[1.8] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-6 font-mono text-[8px] leading-[1.35] text-black md:text-[16px]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-b border-black bg-[#f7f3ec] px-4 py-16 text-center md:px-[5.2vw] md:py-20">
          <h2 className="font-sans text-[34px] font-extrabold uppercase leading-none tracking-[0.05em] text-black md:text-[40px]">
            STILL NEED HELP?
          </h2>
          <div className="mx-auto mt-16 grid max-w-6xl gap-14 md:grid-cols-3">
            <div>
              <h3 className="font-sans text-[22px] font-bold text-black">Email</h3>
              <a
                href="mailto:contact@mejuri.com"
                className="mt-10 inline-flex border-b border-black font-mono text-[16px] text-black"
              >
                contact@mejuri.com
              </a>
            </div>
            <div>
              <h3 className="font-sans text-[22px] font-bold text-black">Text</h3>
              <a
                href="tel:+18554961110"
                className="mt-10 inline-flex border-b border-black font-mono text-[16px] text-black"
              >
                +1-855-496-1110
              </a>
              <p className="mx-auto mt-10 max-w-[260px] font-mono text-[16px] leading-[1.25] text-black">
                This is a US based number. Charges may apply.
              </p>
            </div>
            <div>
              <h3 className="font-sans text-[22px] font-bold text-black">Visit Us</h3>
              <p className="mt-10 font-mono text-[16px] text-black">Find your nearest stores</p>
              <Link
                href="/stores"
                className="mt-8 inline-flex border-b-2 border-black font-sans text-[16px] font-bold uppercase text-black"
              >
                Find a Store
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatButton />
    </div>
  );
}
