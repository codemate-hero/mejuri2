"use client";

import Link from "next/link";
import type {
  CollectionEditorialSectionConfig,
  CollectionEditorialTileConfig,
} from "@/data/collectionEditorialTiles";

function TileLabelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mr-1 h-[15px] w-[15px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="8" width="20" height="14" rx="0.5" stroke="currentColor" />
      <path d="M17 11V6C17 3.2 14.8 1 12 1C9.2 1 7 3.2 7 6V11" stroke="currentColor" />
    </svg>
  );
}

export function CollectionEditorialTile({ tile }: { tile: CollectionEditorialTileConfig }) {
  const isDoubleRow = tile.span === "2x2" || tile.span === "1x2";
  const heightClass = isDoubleRow
    ? "min-h-[620px] md:min-h-[1120px]"
    : "min-h-[420px] md:min-h-[550px]";

  const media = tile.type === "video" ? (
    <video
      src={tile.src}
      poster={tile.poster}
      autoPlay
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  ) : (
    <img src={tile.src} alt={tile.alt} className="h-full w-full object-cover" />
  );

  const content = (
    <div className={`relative h-full ${heightClass} overflow-hidden bg-[#f8f8f8]`}>
      {media}
      {tile.label && (
        <span className="absolute bottom-4 left-5 inline-flex items-center bg-white px-3 py-2 font-sans text-[14px] font-normal uppercase leading-none text-black">
          <TileLabelIcon />
          {tile.label}
        </span>
      )}
    </div>
  );

  return tile.href ? (
    <Link href={tile.href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

export function CollectionEditorialSection({ section }: { section: CollectionEditorialSectionConfig }) {
  const media = section.media.type === "video" ? (
    <video
      src={section.media.src}
      poster={section.media.poster}
      autoPlay
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  ) : (
    <img src={section.media.src} alt={section.media.alt} className="h-full w-full object-cover" />
  );

  const copy = (
    <div
      className="flex min-h-[360px] flex-col justify-center px-[5.2vw] py-16"
      style={{ backgroundColor: section.background ?? "#f4f4f4" }}
    >
      {section.eyebrow && (
        <p className="mb-6 font-sans text-[13px] font-bold uppercase text-black">{section.eyebrow}</p>
      )}
      <h2 className="font-sans text-[30px] font-bold uppercase leading-[1.08] tracking-[0.04em] text-black md:text-[34px]">
        {section.title}
      </h2>
      {section.copy && (
        <p className="mt-8 max-w-[540px] font-mono text-[16px] leading-[1.25] text-black">{section.copy}</p>
      )}
      {section.cta && section.href && (
        <Link
          href={section.href}
          className="mt-8 w-fit border-b border-black font-sans text-[14px] font-bold uppercase leading-none text-black"
        >
          {section.cta}
        </Link>
      )}
    </div>
  );

  return (
    <section className="grid bg-white md:grid-cols-2">
      <div className="min-h-[360px] overflow-hidden">{media}</div>
      {copy}
    </section>
  );
}
