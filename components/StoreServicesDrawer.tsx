"use client";

import Image from "next/image";
import Link from "next/link";
import { Store, X } from "lucide-react";
import { useState } from "react";

const serviceLinks = [
  {
    title: "OUR STORES",
    href: "/stores",
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=90",
    alt: "Mejuri store interior",
  },
  {
    title: "PIERCING STUDIO",
    href: "/piercing",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
    alt: "Ear with Mejuri piercings",
  },
  {
    title: "COMPLIMENTARY CLEANING",
    href: "/faq/stores",
    image:
      "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1761330220/2025/Web%20Evergreen/Web%20Evergreen%20November/102425%20-%20BAU/FY25_NovBAU_Bestsellers.jpg",
    alt: "Gold jewelry stack",
  },
];

export function StoreServicesDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  if (!open) return null;

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[180]">
      <button
        aria-label="Close store services"
        className="absolute inset-0 bg-black/35"
        onClick={closeDrawer}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full overflow-y-auto bg-white px-7 py-8 text-black shadow-2xl sm:max-w-[720px] md:px-10 ${
          isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Store className="h-4 w-4" />
            <span className="font-sans text-[16px] text-black">Select Store</span>
          </div>
          <button
            aria-label="Close"
            className="cursor-pointer text-black transition-opacity hover:opacity-60"
            onClick={closeDrawer}
          >
            <X className="h-8 w-8 stroke-[1.5]" />
          </button>
        </div>

        <div className="border-t border-black pt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {serviceLinks.map((item) => (
              <Link key={item.title} href={item.href} className="group block" onClick={closeDrawer}>
                <div className="relative mb-5 aspect-square overflow-hidden bg-[#f4f4f2]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 210px, 86vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="block font-sans text-[16px] font-extrabold uppercase leading-[1.2] tracking-[0.02em] text-black">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
