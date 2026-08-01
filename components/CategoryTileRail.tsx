"use client";

import Link from "next/link";
import { useRef } from "react";
import type { CategoryRailTile } from "@/data/categoryRails";

interface CategoryTileRailProps {
  tiles: CategoryRailTile[];
}

export function CategoryTileRail({ tiles }: CategoryTileRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const canScroll = tiles.length > 6;

  return (
    <div className="relative">
      <div ref={railRef} className="no-scrollbar flex gap-[8px] overflow-x-auto pb-1">
        {tiles.map((tile) => (
          <Link
            key={`${tile.name}-${tile.href}`}
            href={tile.href}
            className="group relative h-[159px] w-[159px] shrink-0 cursor-pointer overflow-hidden bg-[#f4f4f4]"
          >
            <img
              src={tile.image}
              alt={tile.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
            <span className="absolute bottom-3 left-4 right-3 font-display text-[0.75rem] font-bold uppercase leading-[1.05] text-white underline underline-offset-2">
              {tile.name}
            </span>
          </Link>
        ))}
      </div>

      {/* {canScroll && (
        <button
          type="button"
          aria-label="Scroll categories"
          onClick={() => railRef.current?.scrollBy({ left: 438, behavior: "smooth" })}
          className="absolute right-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center bg-black text-white lg:flex"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M6.5 3.5L11.5 9L6.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )} */}
    </div>
  );
}
