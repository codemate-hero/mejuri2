"use client";

import { useEffect, useState } from "react";

const promoMessages = [
  "Complimentary Jewelry Cleaning At Stores.",
  "Before We Melt: 40% Off More Styles.",
  "Free Shipping On All Intl. Orders $150+"
];

const PromoCaret = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    className={`h-4 w-4 transform transition-transform duration-300 ${
      direction === "left" ? "rotate-180" : "rotate-0"
    }`}
    xmlns="http://www.w3.org/2000/svg"
    role="graphics-symbol"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <title>Caret</title>
    <path
      d="M8.59175 20C8.47866 19.9947 8.36933 19.9555 8.27647 19.8871C8.18361 19.8187 8.11104 19.7238 8.06721 19.6135C8.02338 19.5031 8.01008 19.3819 8.02886 19.2639C8.04765 19.146 8.09774 19.036 8.17332 18.9469L14.7188 12.0179L8.17332 5.06776C8.06235 4.95046 8 4.79137 8 4.62548C8 4.45959 8.06235 4.3005 8.17332 4.1832C8.28429 4.0659 8.43481 4 8.59175 4C8.74869 4 8.89921 4.0659 9.01018 4.1832L15.7051 11.2492C15.7985 11.3471 15.8726 11.4635 15.9231 11.5918C15.9737 11.7202 15.9998 11.8578 15.9998 11.9968C15.9998 12.1358 15.9737 12.2735 15.9231 12.4018C15.8726 12.5301 15.7985 12.6466 15.7051 12.7445L9.01018 19.8105C8.95621 19.8703 8.8913 19.918 8.81937 19.9506C8.74744 19.9832 8.67 20 8.59175 20Z"
      fill="currentColor"
    />
  </svg>
);

export function PromoBar({ isScrolled, hideForSidebar }: { isScrolled: boolean; hideForSidebar: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + promoMessages.length) % promoMessages.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % promoMessages.length);

  return (
    <div className={`fixed left-0 right-0 top-0 z-[70] hidden h-[40px] bg-black text-white transition-transform duration-300 lg:block ${isScrolled || hideForSidebar ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-8 text-[14px] font-bold">
        <div className="flex items-center">
          <button type="button" onClick={prevSlide} className="cursor-pointer" aria-label="Previous promotion">
            <PromoCaret direction="left" />
          </button>
          <button type="button" onClick={nextSlide} className="cursor-pointer" aria-label="Next promotion">
            <PromoCaret direction="right" />
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          {promoMessages[current].split(": ").map((part, i) => (
            <span key={i}>
              {i > 0 && ": "} 
              {i === 1 ? <span className="border-b border-white pb-0.5">{part}</span> : part}
            </span>
          ))}
        </div>
        <div />
      </div>
    </div>
  );
}
