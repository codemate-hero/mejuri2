// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Search, X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// const popularSearches = ["earrings", "necklace", "bracelet", "pearl", "rings"];

// interface Product {
//   _id: string;
//   title: string;
//   handle: string;
//   images: { src: string }[];
//   variants: { price: number }[];
//   productType: string;
// }

// export function SearchModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [results, setResults] = useState<Product[]>([]);
//   const [totalResults, setTotalResults] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => inputRef.current?.focus(), 50);
//     } else {
//       setSearchQuery("");
//       setResults([]);
//       setTotalResults(0);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setResults([]);
//       setTotalResults(0);
//       return;
//     }
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}&limit=3`);
//         const data = await res.json();
//         setResults(data.products || []);
//         setTotalResults(data.totalProducts || 0);
//       } catch {
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);
//   }, [searchQuery]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[150] flex flex-col bg-white lg:h-auto lg:inset-auto lg:left-0 lg:right-0 lg:top-[10%]"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Header with Search Input */}
//       <div className="border-b border-gray-300 bg-white px-5 py-4 lg:px-8 lg:py-5">
//         <div className="mx-auto flex max-w-[1400px] items-start gap-3">
//           <div className="flex flex-1 flex-col">
//             <div className="flex items-center gap-3 pb-2">
//               <Search className="h-[18px] w-[18px] flex-shrink-0 text-black" />
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search jewelry..."
//                 className="flex-1 border-none bg-transparent font-mono text-[14px] text-black outline-none placeholder:text-gray-400"
//               />
//             </div>
//             <div className="h-[2px] bg-blue-500" />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="mt-2.5 cursor-pointer self-start font-sans text-[11px] font-medium tracking-wider text-black underline"
//               >
//                 CLEAR
//               </button>
//             )}
//           </div>
//           <button onClick={onClose} className="cursor-pointer" aria-label="Close search">
//             <X className="h-[22px] w-[22px] text-black" />
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto bg-white px-5 py-5 lg:px-8 lg:py-6">
//         <div className="mx-auto max-w-[1400px]">
//           {!searchQuery ? (
//             <div className="grid grid-cols-1 gap-x-12 gap-y-7 lg:grid-cols-2 lg:gap-x-24">
//               {/* Popular Searches */}
//               <div>
//                 <h3 className="mb-4 font-sans text-[15px] font-bold text-black">Popular Searches</h3>
//                 <div className="space-y-3.5">
//                   {popularSearches.map((search) => (
//                     <button
//                       key={search}
//                       onClick={() => setSearchQuery(search)}
//                       className="block cursor-pointer font-mono text-[13px] text-black hover:underline"
//                     >
//                       {search}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : loading ? (
//             <div className="py-8 text-center">
//               <p className="font-sans text-[13px] text-gray-400">Searching...</p>
//             </div>
//           ) : results.length === 0 ? (
//             <div className="py-8 text-center">
//               <p className="font-sans text-[13px] text-gray-400">No results for &quot;{searchQuery}&quot;</p>
//             </div>
//           ) : (
//             <div>
//               <p className="mb-4 font-sans text-[12px] tracking-wider text-gray-500 uppercase">
//                 {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
//               </p>
//               <div className="grid grid-cols-3 gap-3 sm:gap-4">
//                 {results.map((product) => {
//                   const image = product.images?.[0]?.src;
//                   const price = product.variants?.[0]?.price;
//                   const url = product.handle ? `/products/${product.handle}` : "#";
//                   return (
//                     <Link
//                       key={product._id}
//                       href={url}
//                       onClick={onClose}
//                       className="group flex flex-col gap-2"
//                     >
//                       {/* Square image */}
//                       <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f5]">
//                         {image ? (
//                           <Image
//                             src={image}
//                             alt={product.title}
//                             fill
//                             sizes="(max-width: 768px) 33vw, 200px"
//                             className="object-cover transition-transform duration-300 group-hover:scale-105"
//                           />
//                         ) : (
//                           <div className="h-full w-full bg-gray-200" />
//                         )}
//                       </div>
//                       <p className="font-sans text-[12px] leading-tight text-black line-clamp-2 group-hover:underline">
//                         {product.title}
//                       </p>
//                       {price !== undefined && (
//                         <p className="font-mono text-[12px] text-black">${price}</p>
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>
//               {totalResults > 3 && (
//                 <div className="mt-6 flex justify-center">
//                   <Link
//                     href={`/search?q=${encodeURIComponent(searchQuery)}`}
//                     onClick={onClose}
//                     className="border border-black px-8 py-2.5 font-sans text-[12px] font-medium tracking-widest text-black uppercase hover:bg-black hover:text-white transition-colors"
//                   >
//                     SHOW ALL ({totalResults})
//                   </Link>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const popularSearches = ["earrings", "necklace", "bracelet", "pearl", "rings"];

interface Product {
  _id: string;
  title: string;
  handle: string;
  images: { src: string }[];
  variants: { price: number; compareAtPrice?: number | null; title?: string | null }[];
  productType: string;
}

function SearchGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.19678 15.8032C4.14436 14.7479 3.43055 13.4124 3.14389 11.9624C2.85485 10.5083 3.00327 9.00302 3.57102 7.6304C4.13391 6.26547 5.09492 5.09431 6.33336 4.26398C8.84606 2.57867 12.1539 2.57867 14.6666 4.26398C15.9051 5.09431 16.8661 6.26547 17.429 7.6304C17.9967 9.00302 18.1451 10.5083 17.8561 11.9624C17.5694 13.4124 16.8556 14.7479 15.8032 15.8032C14.4095 17.2078 12.4971 18 10.5 18C8.50294 18 6.59055 17.2078 5.19678 15.8032V15.8032Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.3468 15.6461C16.1513 15.451 15.8348 15.4513 15.6397 15.6468C15.4446 15.8422 15.4449 16.1588 15.6403 16.3539L16.3468 15.6461ZM20.6491 21.3538C20.8446 21.5489 21.1612 21.5487 21.3562 21.3532C21.5513 21.1578 21.5511 20.8412 21.3556 20.6461L20.6491 21.3538ZM15.9935 16L15.6403 16.3539L20.6491 21.3538L21.0024 21L21.3556 20.6461L16.3468 15.6461L15.9935 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SparkleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.75L14.52 9.48L21.25 12L14.52 14.52L12 21.25L9.48 14.52L2.75 12L9.48 9.48L12 2.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getSuggestions(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return popularSearches;

  const words = normalized.split(/\s+/).filter(Boolean);
  const first = words[0];
  const last = words[words.length - 1];

  if (words.length === 1) {
    const plural = normalized.endsWith("s") ? normalized : `${normalized}s`;
    return Array.from(
      new Set([normalized, `tennis ${normalized}`, plural, `gold ${normalized}`].filter(Boolean))
    ).slice(0, 4);
  }

  return Array.from(new Set([last, normalized, first, `${last} earrings`].filter(Boolean))).slice(0, 4);
}

function formatPrice(price?: number | null) {
  if (price === undefined || price === null) return "";
  return `$${Number(price).toLocaleString("en-US", {
    minimumFractionDigits: Number(price) % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(["earrings"]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem("mejuri_recent_searches");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length) setRecentSearches(parsed.slice(0, 4));
        }
      } catch {
        setRecentSearches(["earrings"]);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
      setResults([]);
      setTotalResults(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}&limit=4`);
        const data = await res.json();
        setResults(data.products || []);
        setTotalResults(data.totalProducts || 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [searchQuery]);

  if (!isOpen) return null;

  const suggestions = getSuggestions(searchQuery);

  const selectSearch = (search: string) => {
    setSearchQuery(search);
    const next = [search, ...recentSearches.filter((item) => item !== search)].slice(0, 4);
    setRecentSearches(next);
    try {
      localStorage.setItem("mejuri_recent_searches", JSON.stringify(next));
    } catch {
      // Ignore storage failures; search should still work.
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("mejuri_recent_searches");
    } catch {
      // Ignore storage failures.
    }
  };

  return (
    <div className="fixed inset-0 z-[150]">
      <button
        type="button"
        aria-label="Close search overlay"
        className="absolute inset-x-0 bottom-0 top-[38px] cursor-default bg-black/50"
        onClick={onClose}
      />

      <section
        aria-label="Search"
        className="absolute bottom-0 right-0 top-[38px] w-full max-w-[504px] overflow-y-auto bg-white text-black md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:max-h-[calc(100vh-96px)] md:w-[564px] md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2 xl:inset-x-0 xl:bottom-auto xl:top-[38px] max-h-[calc(100%)] min-h-[404px] xl:w-auto xl:translate-x-0 xl:translate-y-0 xl:overflow-visible xl:px-[80px] xl:pb-[1.5rem] xl:pt-[3.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 cursor-pointer text-black md:right-5 md:top-5 xl:right-16 xl:top-6"
          aria-label="Close search"
        >
          <X className="h-8 w-8 stroke-[1.25]" />
        </button>

        <div className="mx-auto flex min-h-full flex-col xl:max-w-[1360px] xl:flex-row xl:gap-8">
          <div className="flex w-full shrink-0 flex-col space-y-md xl:basis-1/3">
            <div className="flex items-center border-b border-black pb-2">
              <SearchGlyph className="mr-1 h-7 w-7 shrink-0 text-black" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe what you're looking for"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[.75rem] leading-6 text-black outline-none placeholder:text-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-4 cursor-pointer font-sans text-[.875rem] font-semibold uppercase leading-5 text-black underline underline-offset-2"
                >
                  CLEAR
                </button>
              )}
              {!searchQuery && <SparkleGlyph className="h-8 w-8 shrink-0 text-black" />}
            </div>

            {searchQuery ? (
              <div className="mt-6 flex flex-col items-start gap-5">
                {suggestions.map((search) => (
                  <button
                    key={search}
                    onClick={() => selectSearch(search)}
                    className="cursor-pointer font-mono text-[.75rem] font-semibold lowercase leading-5 text-black hover:underline"
                  >
                    {search}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className={`mt-8 grid gap-10 ${
                  recentSearches.length > 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="font-sans text-[.875rem] pb-[1rem] font-semibold leading-6 text-black">
                      Recent Searches
                    </h3>
                    <div className="flex flex-col items-start">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => selectSearch(search)}
                          className="cursor-pointer font-mono text-[.75rem] pb-[1rem] font-semibold lowercase leading-5 text-black hover:underline"
                        >
                          {search}
                        </button>
                      ))}
                      <button
                        onClick={clearRecentSearches}
                        className="cursor-pointer text-left font-mono text-[.75rem] font-semibold leading-5 text-black underline underline-offset-2"
                      >
                        Clear Recent
                        <br />
                        Searches
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-sans text-[.875rem] pb-[1rem] font-semibold leading-6 text-black">
                    Popular Searches
                  </h3>
                  <div className=" flex flex-col items-start">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => selectSearch(search)}
                        className="cursor-pointer font-mono text-[.75rem] pb-[1rem] font-semibold lowercase leading-5 text-black hover:underline"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 xl:basis-2/3 xl:overflow-y-auto xl:pt-0 xl:max-h-[calc(100vh-132px)]">
            {loading ? (
              <div className="py-12 text-center font-sans text-[14px] text-[#6b6b63]">Searching...</div>
            ) : results.length === 0 && searchQuery ? (
              <div className="py-12 text-center font-sans text-[14px] text-[#6b6b63]">
                No results for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-12 xl:grid-cols-4 xl:gap-y-3">
                {results.map((product) => {
                  const image = product.images?.[0]?.src;
                  const variant = product.variants?.[0];
                  const price = variant?.price;
                  const compareAtPrice = variant?.compareAtPrice;
                  const material = variant?.title || product.productType;
                  const url = product.handle ? `/products/${product.handle}` : "#";

                  return (
                    <Link
                      key={product._id}
                      href={url}
                      onClick={onClose}
                      className="group block min-w-0 bg-[#f8f8f8] text-black"
                    >
                      <div className="relative aspect-[1/1.22] w-full overflow-hidden bg-[#f8f8f8]">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 1024px) 50vw, 220px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-[#f1f1f1]" />
                        )}
                      </div>
                      <div className="space-y-1 px-3 pb-4 pt-3">
                        <p className="truncate font-sans text-[14px] uppercase leading-5 text-[#54544f] group-hover:underline">
                          {product.title}
                        </p>
                        {price !== undefined && (
                          <div className="flex flex-wrap items-baseline gap-2 font-mono text-[15px] leading-5 text-black">
                            {compareAtPrice && compareAtPrice > price && (
                              <span className="text-[#5f5f5b] line-through">
                                {formatPrice(compareAtPrice)}
                              </span>
                            )}
                            <span>{formatPrice(price)}</span>
                            {compareAtPrice && compareAtPrice > price && (
                              <span className="font-sans text-[14px]">30% Off</span>
                            )}
                          </div>
                        )}
                        {material && (
                          <p className="truncate font-sans text-[15px] leading-5 text-[#54544f]">
                            {material}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
