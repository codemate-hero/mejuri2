const collectionSlugAliases: Record<string, string> = {
  "under-$200": "jewelry-under-200",
  "under-200": "jewelry-under-200",
  "jewelry-under-$200": "jewelry-under-200",
  "jewelry-under-200": "jewelry-under-200",
  "earrings-under-$200": "earrings-under-200",
  "hoops": "hoop-earrings",
  "studs": "stud-earrings",
  "huggie-hoops": "huggie-earrings",
  "cartilage-and-helix": "cartilage-helix",
  "cartilage-helix": "cartilage-helix",
  "hoop-charms": "hoop-charms",
  "charms-pendants": "charms",
  "charms-and-pendants": "charms-and-pendants",
  "cuffs-and-bangles": "cuffs-and-bangles",
  "cuff-bangles": "cuffs-and-bangles",
  "pearl-beaded-bracelets": "pearl-beaded-bracelets",
  "tennis-bracelets": "tennis-bracelet-jewelry",
  "tennis-bracelet": "tennis-bracelet-jewelry",
  "tennis-necklaces": "tennis-necklace-jewelry",
  "tennis-necklace": "tennis-necklace-jewelry",
  "pearl-beaded-necklaces": "pearl-beaded-necklaces",
  "tennis-jewelry": "tennis-jewelry",
  "rings-under-$200": "rings-under-200",
  "necklaces-under-$200": "necklaces-under-200",
  "bracelets-under-$200": "bracelets-under-200",
  "gifts-under-$200": "jewelry-gifts-under-200",
  "gifts-under-200": "jewelry-gifts-under-200",
  "jewelry-gifts-under-$200": "jewelry-gifts-under-200",
  "jewelry-for-going-out": "going-out-jewelry",
  "going-out-jewelry": "going-out-jewelry",
};

export function normalizeCollectionSlug(value: string): string {
  let decoded = value;

  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  const slug = decoded
    .replace(/Ã´/g, "o")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\+/g, "")
    .replace(/\$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return collectionSlugAliases[slug] || slug;
}

// Mapping from URL slugs to MongoDB collection/category filters
export const categoryMapping: Record<string, { collectionHandle?: string; category?: string; productType?: string; tags?: string[] }> = {
  // Shop All - All products
  "shop-all": {},
  
  // Categories - Match imported MongoDB collectionHandle/category values
  "earrings": { collectionHandle: "earrings" },
  "rings": { collectionHandle: "rings" },
  "necklaces": { collectionHandle: "necklaces" },
  "bracelets": { collectionHandle: "bracelets" },
  "anklets": { collectionHandle: "anklets" },
  "piercings": { collectionHandle: "piercings" },
  "charms": { collectionHandle: "charms" },
  "charms-and-pendants": { collectionHandle: "charms-and-pendants" },
  "pendants": { collectionHandle: "pendants" },
  "tennis-jewelry": { collectionHandle: "tennis-jewelry" },
  "fine-jewelry": { collectionHandle: "fine-jewelry" },
  "diamonds": { collectionHandle: "diamonds" },
  "solid-gold": { collectionHandle: "solid-gold-jewelry" },
  "gift-cards": { collectionHandle: "gift-cards" },
  "new": { collectionHandle: "new" },
  "back-in-stock": { collectionHandle: "back-in-stock" },
  "best-sellers": { collectionHandle: "best-sellers" },
  "jewelry-under-200": { collectionHandle: "jewelry-under-200" },
  "going-out-jewelry": { collectionHandle: "going-out-jewelry" },
  "before-we-melt": { collectionHandle: "before-we-melt" },
  "summer": { collectionHandle: "summer" },
  "puzzle": { collectionHandle: "puzzle" },
  "dome": { collectionHandle: "dome" },
  "charlotte": { collectionHandle: "charlotte" },
  "interconnected": { collectionHandle: "interconnected" },
  "stevie": { collectionHandle: "stevie" },
  
  // Earring Subcategories
  "hoop-earrings": { collectionHandle: "hoop-earrings" },
  "stud-earrings": { collectionHandle: "stud-earrings" },
  "drop-earrings": { collectionHandle: "drop-earrings" },
  "huggie-earrings": { collectionHandle: "huggie-earrings" },
  "ear-jackets": { collectionHandle: "ear-jackets" },
  "threader-earrings": { collectionHandle: "threader-earrings" },
  "mismatched-earrings": { collectionHandle: "mismatched-earrings" },
  "single-earrings": { collectionHandle: "single-earrings" },
  "ear-cuffs": { collectionHandle: "ear-cuffs" },
  "climber-earrings": { collectionHandle: "climber-earrings" },
  "charm-hoops": { collectionHandle: "charm-hoops" },
  "cartilage-helix": { collectionHandle: "cartilage-helix" },
  "small-hoops": { collectionHandle: "small-hoops" },
  "medium-hoops": { collectionHandle: "medium-hoops" },
  "large-hoops": { collectionHandle: "large-hoops" },
  "oversized-hoops": { collectionHandle: "oversized-hoops" },
  "charm-compatible-hoops": { collectionHandle: "charm-compatible-hoops" },
  "hoop-charms": { collectionHandle: "hoop-charms" },
  "best-selling-earrings": { collectionHandle: "best-selling-earrings" },
  "lab-grown-diamond-earrings": { collectionHandle: "lab-grown-diamond-earrings" },
  "zodiac-earrings": { collectionHandle: "zodiac-earrings" },
  "earrings-under-200": { collectionHandle: "earrings-under-200" },
  
  // Ring Subcategories
  "stackable-rings": { collectionHandle: "stackable-rings" },
  "best-selling-rings": { collectionHandle: "best-selling-rings" },
  "statement-rings": { collectionHandle: "statement-rings" },
  "signet-rings": { collectionHandle: "signet-rings" },
  "dome-rings": { collectionHandle: "dome-rings" },
  "open-rings": { collectionHandle: "open-rings" },
  "midi-rings": { collectionHandle: "midi-rings" },
  "engagement-rings": { collectionHandle: "engagement-rings" },
  "wedding-bands": { collectionHandle: "wedding-bands" },
  "diamond-rings": { collectionHandle: "diamond-rings" },
  "eternity-rings": { collectionHandle: "eternity-rings" },
  "mens-rings": { collectionHandle: "mens-rings" },
  "rings-under-200": { collectionHandle: "rings-under-200" },
  
  // Necklace Subcategories
  "best-selling-necklaces": { collectionHandle: "best-selling-necklaces" },
  "pendant-necklaces": { collectionHandle: "pendant-necklaces" },
  "choker-necklaces": { collectionHandle: "choker-necklaces" },
  "chain-necklaces": { collectionHandle: "chain-necklaces" },
  "lariat-necklaces": { collectionHandle: "lariat-necklaces" },
  "layered-necklaces": { collectionHandle: "layered-necklaces" },
  "letter-necklaces": { collectionHandle: "letter-necklaces" },
  "nameplate-necklaces": { collectionHandle: "nameplate-necklaces" },
  "beaded-necklaces": { collectionHandle: "beaded-necklaces" },
  "pearl-beaded-necklaces": { collectionHandle: "pearl-beaded-necklaces" },
  "diamond-necklaces": { collectionHandle: "diamond-necklaces" },
  "tennis-necklace-jewelry": { collectionHandle: "tennis-necklace-jewelry" },
  "charm-necklaces": { collectionHandle: "charm-necklaces" },
  "mens-necklaces": { collectionHandle: "mens-necklaces" },
  "necklaces-under-200": { collectionHandle: "necklaces-under-200" },
  
  // Bracelet Subcategories
  "best-selling-bracelets": { collectionHandle: "best-selling-bracelets" },
  "chain-bracelets": { collectionHandle: "chain-bracelets" },
  "cuffs-and-bangles": { collectionHandle: "cuffs-and-bangles" },
  "cuff-bracelets": { collectionHandle: "cuff-bracelets" },
  "bangle-bracelets": { collectionHandle: "bangle-bracelets" },
  "tennis-bracelets": { collectionHandle: "tennis-bracelets" },
  "tennis-bracelet-jewelry": { collectionHandle: "tennis-bracelet-jewelry" },
  "beaded-bracelets": { collectionHandle: "beaded-bracelets" },
  "pearl-beaded-bracelets": { collectionHandle: "pearl-beaded-bracelets" },
  "diamond-bracelets": { collectionHandle: "diamond-bracelets" },
  "charm-bracelets": { collectionHandle: "charm-bracelets" },
  "cord-bracelets": { collectionHandle: "cord-bracelets" },
  "mens-bracelets": { collectionHandle: "mens-bracelets" },
  "link-bracelets": { collectionHandle: "link-bracelets" },
  "bracelets-under-200": { collectionHandle: "bracelets-under-200" },
  "jewelry-gifts-under-200": { collectionHandle: "jewelry-gifts-under-200" },
  "new-earrings": { collectionHandle: "new-earrings" },
  "new-rings": { collectionHandle: "new-rings" },
  "new-necklaces": { collectionHandle: "new-necklaces" },
  "new-bracelets": { collectionHandle: "new-bracelets" },
};

// Get category name from slug
export function getCategoryName(slug: string): string {
  const normalizedSlug = normalizeCollectionSlug(slug);
  const mapping: Record<string, string> = {
    "shop-all": "Shop All",
    "earrings": "Earrings",
    "rings": "Rings",
    "necklaces": "Necklaces",
    "bracelets": "Bracelets",
    "anklets": "Anklets",
    "piercings": "Piercings",
    "charms": "Charms",
    "charms-and-pendants": "Charms And Pendants",
    "pendants": "Pendants",
    "fine-jewelry": "Fine Jewelry",
    "diamonds": "Diamonds",
    "solid-gold": "Solid Gold",
    "gift-cards": "Gift Cards",
    "new": "New In",
    
    "hoop-earrings": "Hoop Earrings",
    "stud-earrings": "Stud Earrings",
    "drop-earrings": "Drop Earrings",
    "huggie-earrings": "Huggie Earrings",
    "ear-jackets": "Ear Jackets",
    "threader-earrings": "Threader Earrings",
    "mismatched-earrings": "Mismatched Earrings",
    "single-earrings": "Single Earrings",
    "ear-cuffs": "Ear Cuffs",
    "climber-earrings": "Climber Earrings",
    "charm-hoops": "Charm Hoops",
    "cartilage-helix": "Cartilage & Helix",
    "small-hoops": "Small Hoops",
    "medium-hoops": "Medium Hoops",
    "large-hoops": "Large Hoops",
    "oversized-hoops": "Oversized Hoops",
    "charm-compatible-hoops": "Charm Compatible Hoops",
    "hoop-charms": "Hoop Charms",
    "best-selling-earrings": "Best Selling Earrings",
    "jewelry-under-200": "Jewelry Under $200",
    "going-out-jewelry": "Jewelry For Going Out",
    "puzzle": "Puzzle",
    "dome": "Dome",
    "charlotte": "Charlotte",
    "interconnected": "Interconnected",
    "stevie": "Stevie",
    "new-earrings": "New Earrings",
    "new-rings": "New Rings",
    "new-necklaces": "New Necklaces",
    "new-bracelets": "New Bracelets",
    "earrings-under-200": "Earrings Under $200",
    "rings-under-200": "Rings Under $200",
    "necklaces-under-200": "Necklaces Under $200",
    "bracelets-under-200": "Bracelets Under $200",
    "jewelry-gifts-under-200": "Gifts Under $200",
    
    "stackable-rings": "Stackable Rings",
    "best-selling-rings": "Best Selling Rings",
    "statement-rings": "Statement Rings",
    "signet-rings": "Signet Rings",
    "dome-rings": "Dome Rings",
    "open-rings": "Open Rings",
    "midi-rings": "Midi Rings",
    "engagement-rings": "Engagement Rings",
    "wedding-bands": "Wedding Bands",
    "diamond-rings": "Diamond Rings",
    "eternity-rings": "Eternity Rings",
    "mens-rings": "Mens Rings",
    
    "best-selling-necklaces": "Best Selling Necklaces",
    "pendant-necklaces": "Pendant Necklaces",
    "choker-necklaces": "Choker Necklaces",
    "chain-necklaces": "Chain Necklaces",
    "lariat-necklaces": "Lariat Necklaces",
    "layered-necklaces": "Layered Necklaces",
    "letter-necklaces": "Letter Necklaces",
    "nameplate-necklaces": "Nameplate Necklaces",
    "beaded-necklaces": "Beaded Necklaces",
    "pearl-beaded-necklaces": "Pearl Beaded Necklaces",
    "diamond-necklaces": "Diamond Necklaces",
    "tennis-necklace-jewelry": "Tennis Necklace Jewelry",
    "charm-necklaces": "Charm Necklaces",
    "mens-necklaces": "Mens Necklaces",
    
    "best-selling-bracelets": "Best Selling Bracelets",
    "chain-bracelets": "Chain Bracelets",
    "cuffs-and-bangles": "Cuffs And Bangles",
    "cuff-bracelets": "Cuff Bracelets",
    "bangle-bracelets": "Bangle Bracelets",
    "tennis-bracelets": "Tennis Bracelets",
    "beaded-bracelets": "Beaded Bracelets",
    "pearl-beaded-bracelets": "Pearl Beaded Bracelets",
    "diamond-bracelets": "Diamond Bracelets",
    "tennis-bracelet-jewelry": "Tennis Bracelet Jewelry",
    "charm-bracelets": "Charm Bracelets",
    "cord-bracelets": "Cord Bracelets",
    "mens-bracelets": "Mens Bracelets",
    "link-bracelets": "Link Bracelets",
  };
  
  return mapping[normalizedSlug] || normalizedSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
