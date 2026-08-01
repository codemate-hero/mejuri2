export type CollectionEditorialTileConfig = {
  kind?: "tile";
  index: number;
  span?: "2x1" | "2x2" | "1x2";
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  label?: string;
  href?: string;
};

export type CollectionEditorialSectionConfig = {
  kind: "section";
  index: number;
  layout?: "split" | "full";
  eyebrow?: string;
  title: string;
  copy?: string;
  cta?: string;
  href?: string;
  background?: string;
  media: {
    type: "image" | "video";
    src: string;
    poster?: string;
    alt: string;
  };
};

export type CollectionEditorialItemConfig =
  | CollectionEditorialTileConfig
  | CollectionEditorialSectionConfig;

export const collectionEditorialTiles: Record<string, CollectionEditorialItemConfig[]> = {
  "going-out-jewelry": [
    {
      kind: "tile",
      index: 4,
      span: "2x2",
      type: "image",
      src: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226441/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid3_DT.jpg",
      alt: "Jewelry for going out editorial look",
      label: "Shop",
      href: "/guided-shop/look-book#all-night-long",
    },
    {
      kind: "tile",
      index: 10,
      span: "2x2",
      type: "image",
      src: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1772226440/2026/Evergreen/STL%20Guide/All%20Night%20Long%20%28Go%20Out%29/EvergreenWeb_STLGuide_GoOut_Grid5_DT.jpg",
      alt: "Going out earrings editorial look",
      label: "Shop",
      href: "/guided-shop/look-book#all-night-long",
    },
  ],

  // Example: appears before the first product and takes 4 product slots on desktop.
  "before-we-melt": [
    {
      kind: "tile",
      index: 0,
      span: "2x2",
      type: "image",
      src: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-Heart_TwoOfHeartsNecklace_V_OnFigStacked_005.jpg?v=1765982351&width=1200",
      alt: "Before We Melt jewelry editorial",
      label: "Shop the look",
      href: "/collections/before-we-melt",
    },
    {
      kind: "section",
      index: 8,
      layout: "split",
      title: "Carry the summer",
      copy: "Coastline memories. Tide-washed gifts. The small things that ground you, worn close.",
      cta: "Shop now",
      href: "/collections/summer-guide",
      background: "#cfe3e5",
      media: {
        type: "video",
        src: "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777669306/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT.mp4",
        poster: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg",
        alt: "Summer jewelry editorial video",
      },
    },
  ],
};

export function getCollectionEditorialTiles(slug: string) {
  return collectionEditorialTiles[slug] ?? [];
}
