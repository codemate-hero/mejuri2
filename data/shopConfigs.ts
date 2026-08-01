import { Product } from "@/components/ProductCard";
import { earringTiles } from "@/data/categoryRails";

export interface CategoryTile {
  name: string;
  image: string;
  href?: string;
}

export interface HeroSection {
  position: number;
  type: "icons" | "textWithImages";
  title: string;
  subtitle?: string;
  description?: string;
  images: Array<{
    src: string;
    title?: string;
    cta?: string;
  }>;
}

export interface ShopPageConfig {
  pageTitle: string;
  categoryTiles?: CategoryTile[];
  showCategoryTiles: boolean;
  heroSections: HeroSection[];
  seoDescription?: string;
  maxPages?: number;
  apiParams?: {
    collectionHandle?: string;
    category?: string;
    productType?: string;
  };
}

// Sample products - replace with API data
export const sampleProducts: Product[] = [
  {
    badge: "",
    name: "SINGLE MINI HOOP",
    price: "$98",
    material: "10k Yellow Gold",
    colors: ["#eacb7b"],
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Reshoot_SingleColoredMiniHoop_14K_OffFigAngledView_PDP.jpg?v=1759343466&width=600&crop=center",
    imageHover: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-SingleColoredMiniHoopWhiteSapphire-14K-Stack1_029.jpg?v=1758043873&width=600&crop=center",
  },
  {
    badge: "",
    name: "TUBE HUGGIE HOOPS",
    price: "$98",
    material: "18k Gold Vermeil",
    colors: ["#d9d9d9", "#d7b36a"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "NEW",
    name: "BIA MINI HOOPS",
    price: "$158",
    material: "18k Gold Vermeil, Lab Grown White Sapphire",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "LAB GROWN SAPPHIRE MARQUISE CUT STUDS",
    price: "$118",
    material: "18k Gold Vermeil, Lab Grown White Sapphire",
    colors: ["#d9d9d9", "#d7b36a"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "TUBE MEDIUM HOOPS",
    price: "$188",
    material: "18k Gold Vermeil",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "ROUND LAB GROWN SAPPHIRE BRACELET",
    price: "$158",
    material: "18k Gold Vermeil, Lab Grown Sapphire",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "NEW",
    name: "ROUND LAB GROWN SAPPHIRE STUDS",
    price: "$118",
    material: "18k Gold Vermeil, Lab Grown Sapphire",
    colors: ["#d7b36a"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
  },
  {
    badge: "",
    name: "BOLD HUGGIE HOOPS",
    price: "$128",
    material: "18k Gold Vermeil",
    colors: ["#d9d9d9", "#d7b36a"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90",
    imageHover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90",
  },
];

// Shop All Page Config (with hero sections)
export const shopAllConfig: ShopPageConfig = {
  pageTitle: "SHOP ALL",
  apiParams: {},
  showCategoryTiles: true,
  categoryTiles: [
    { name: "SHOP ALL", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80" },
    { name: "EARRINGS", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80" },
    { name: "RINGS", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80" },
    { name: "BRACELETS", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80" },
    { name: "NECKLACES", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
    { name: "CHARMS + PENDANTS", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80" },
    { name: "TENNIS JEWELRY", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=400&q=80" },
  ],
  heroSections: [
    {
      position: 8,
      type: "icons",
      title: "THE ICONS",
      subtitle: "Designed by us, defined by you. Our Icons are the pieces that get noticed wherever you go.",
      images: [
        { src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=90", title: "DOME COLLECTION", cta: "EXPLORE THE LOOK" },
        { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=90", title: "PUZZLE COLLECTION", cta: "SHOP THE LOOK" },
        { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=90", title: "INTERCONNECTED COLLECTION", cta: "SHOP THE LOOK" }
      ]
    },
    {
      position: 16,
      type: "textWithImages",
      title: "THE PERFECT FIT",
      description: "The pieces you can't stop collecting. A departure from the traditional round band, the Puzzle collection has become a community favorite for its architectural edge and infinite stackability.",
      images: [
        { src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=90" },
        { src: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=90" }
      ]
    }
  ],
  seoDescription: "Discover our complete collection of fine jewelry. From earrings to necklaces, find pieces designed to be lived in.",
  maxPages: 5
};

// Simple Category Page Config (no hero sections)
export const earringsConfig: ShopPageConfig = {
  pageTitle: "EARRINGS",
  apiParams: { collectionHandle: "earrings" },
  showCategoryTiles: true,
  categoryTiles: earringTiles,
  heroSections: [], // No hero sections for simple category pages
  seoDescription: "At Mejuri, we offer an exquisite collection of handcrafted 14k gold earrings for women that are inspired by you. Our stunning collection of fine gold earrings includes Hoops, Studs, Cartilage, Cuffs, and more!",
  maxPages: 5
};

// Piercing Config
export const piercingConfig: ShopPageConfig = {
  pageTitle: "PIERCING STUDIO",
  apiParams: { collectionHandle: "piercings" },
  showCategoryTiles: false,
  heroSections: [],
  seoDescription: "Book your piercing appointment at Mejuri's Piercing Studio. Choose from eight types of ear piercings and find the perfect studs.",
  maxPages: 2
};

// Rings Config
export const ringsConfig: ShopPageConfig = {
  pageTitle: "RINGS",
  apiParams: { collectionHandle: "rings" },
  showCategoryTiles: false,
  heroSections: [],
  seoDescription: "Discover our collection of fine gold rings. Stackable, statement, or everyday wear.",
  maxPages: 5
};

// You can add more configs for other categories
export const necklacesConfig: ShopPageConfig = {
  pageTitle: "NECKLACES",
  apiParams: { collectionHandle: "necklaces" },
  showCategoryTiles: false,
  heroSections: [],
  maxPages: 5
};
