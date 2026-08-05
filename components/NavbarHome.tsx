"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AccountDrawer from "./AccountDrawer";
import SigninModal from "./SigninModal";
import { SIGNIN_REQUESTED_EVENT } from "@/app/lib/clientAuth";
import CreateAccountModal from "./CreateAccountModal";
import ForgotPasswordModal from "./ForgotPasswordModel";
import { StoreServicesDrawer } from "./StoreServicesDrawer";
import AddToCartDrawer from "./AddToCartDrawer";
import { normalizeCollectionSlug } from "@/data/categoryMapping";

const CART_USER_ID = "6a197425b8dc3412fbcce4e1";
const CART_UPDATED_EVENT = "mejuri-cart-updated";

const SearchIcon = ({ className = "" }: { className?: string }) => (
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
      d="M5.79184 13.973C4.93353 13.1123 4.35138 12.0232 4.11759 10.8406C3.88187 9.65469 4.00291 8.42704 4.46594 7.30759C4.92501 6.19442 5.70877 5.23927 6.71878 4.56209C8.76803 3.18764 11.4658 3.18764 13.515 4.56209C14.525 5.23927 15.3088 6.19442 15.7679 7.30759C16.2309 8.42704 16.3519 9.65469 16.1162 10.8406C15.8824 12.0232 15.3003 13.1123 14.442 13.973C13.3053 15.1185 11.7456 15.7646 10.1169 15.7646C8.48819 15.7646 6.92853 15.1185 5.79184 13.973V13.973Z"
      stroke="currentColor"
      strokeWidth="1.05864"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.6403 14.3715C14.4334 14.1649 14.0983 14.1652 13.8917 14.3721C13.6852 14.579 13.6855 14.9142 13.8924 15.1207L14.2664 14.7461L14.6403 14.3715ZM19.6265 20.8446C19.8334 21.0511 20.1685 21.0508 20.375 20.844C20.5816 20.6371 20.5813 20.3019 20.3744 20.0954L20.0004 20.47L19.6265 20.8446ZM14.2664 14.7461L13.8924 15.1207L19.6265 20.8446L20.0004 20.47L20.3744 20.0954L14.6403 14.3715L14.2664 14.7461Z"
      fill="currentColor"
    />
  </svg>
);

const StoreIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="graphics-symbol"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <title>Store</title>
    <path
      d="M5.23075 20.3006V10.4131H4V9.41314L5.15375 3.5H18.8462L20 9.41314V10.4131H18.7693V20.3027H17.7693V10.4131H13.2308V20.3006H5.23075ZM6.23075 19.3007H12.2308V10.4131H6.23075V19.3007ZM5.0115 9.41314H18.9885L18.0615 4.5H5.9385L5.0115 9.41314Z"
      fill="currentColor"
    />
  </svg>
);

const AccountIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="log in"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.95117 11.9102H8.40723C8.4651 11.9509 8.53914 12.0033 8.62793 12.0625C8.84911 12.21 9.16147 12.4061 9.52344 12.6035C10.2251 12.9862 11.2008 13.4199 12.0898 13.4199C12.9788 13.4198 13.9547 12.9862 14.6562 12.6035C15.018 12.4062 15.3297 12.2099 15.5508 12.0625C15.6395 12.0033 15.7136 11.9509 15.7715 11.9102H18.2119C18.4721 11.9102 18.6886 12.1098 18.71 12.3691L19.4131 20.9346C19.437 21.2257 19.2071 21.4753 18.915 21.4756H5.10352C4.8081 21.4754 4.5774 21.2208 4.60645 20.9268L5.4541 12.3613C5.47626 12.1375 5.64363 11.9597 5.85742 11.9189L5.95117 11.9102Z"
      stroke="currentColor"
    />
  </svg>
);

const WishlistIcon = ({ className = "" }: { className?: string }) => (
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
      d="M12.0013 20.7059L8.24244 16.8481L4.51318 12.9902C2.49561 10.8581 2.49561 7.52106 4.51318 5.38894C5.5011 4.43947 6.83919 3.94331 8.2073 4.01915C9.57541 4.09499 10.8505 4.73603 11.7274 5.78887L12.0013 6.05764L12.2726 5.7773C13.1495 4.72445 14.4246 4.08342 15.7927 4.00758C17.1608 3.93173 18.4989 4.4279 19.4868 5.37737C21.5044 7.50949 21.5044 10.8465 19.4868 12.9786L15.7576 16.8365L12.0013 20.7059Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BagIcon = ({ className = "" }: { className?: string }) => (
  <svg
    data-testid="icon-bag-2"
    className={className}
    viewBox="0 0 24 24"
    role="graphics-symbol"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="2" y="8" width="20" height="14" rx="0.5" stroke="currentColor" />
    <path
      d="M17 11V6C17.039 3.22 14.76 1.04 12 1C9.24 1.04 6.961 3.22 7 6V11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MejuriLogo = ({ className = "" }: { className?: string }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 817 170"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible ${className}`}
    aria-label="MEJURI"
    role="img"
  >
    <g clipPath="url(#mejuri-logo-clip)">
      <path
        d="M43.0637 0H0V168.085H34.2572V58.1758L75.66 168.085H106.111L147.271 58.1758V168.085H181.529V0H138.949L91.1277 124.988L43.0637 0ZM694.245 0H630.713V168.085H664.971V102.003H695.179C715.405 102.003 716.356 116.369 717.308 138.396C717.792 148.217 717.792 156.348 720.647 168.085H755.147C752.05 153.963 749.437 130.247 749.437 120.2C749.437 101.76 742.776 90.9813 734.921 85.7226C746.34 76.6158 752.05 63.6956 752.05 49.0863C752.05 14.853 726.599 0 694.245 0ZM698.519 69.6856H664.971V32.8055H698.034C710.647 32.8055 717.55 39.9969 717.55 51.2455C717.55 63.2254 710.647 69.6856 698.519 69.6856ZM782.258 168.085H817V0H782.258V168.085ZM436.33 106.304L436.572 0H402.072V115.899C402.072 130.978 395.411 139.841 383.283 139.841C370.428 139.841 365.67 126.677 365.67 115.655L332.606 115.411C332.606 148.461 348.541 170 383.041 170C421.104 170 436.33 146.058 436.33 106.304ZM599.311 98.6428V0H564.569V92.6703C564.569 122.603 556.005 138.396 534.118 138.396C509.135 138.396 503.425 118.998 503.425 92.6703V0H468.926V98.6428C468.926 145.1 491.764 170 534.118 170C580.037 170 599.311 141.739 599.311 98.6428ZM320.478 0H215.803V168.085H322.156V135.993H249.835V96.9712H316.931V66.0811H249.835V32.0742H320.495V0H320.478Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="mejuri-logo-clip">
        <rect width="817" height="170" fill="none" />
      </clipPath>
    </defs>
  </svg>
);

// Helper function to generate URLs
const generateUrl = (menu: string, category?: string, subcategory?: string) => {
  const slug = (text: string) => normalizeCollectionSlug(text);
  const collectionUrl = (text: string) => `/collections/${slug(text)}`;
  const iconCollectionUrl = (text: string) => collectionUrl(text.replace(/\s+collection$/i, ""));
  const giftCollectionUrl = (text: string) => {
    const normalized = slug(text);

    if (/^under-\d+$/.test(normalized)) {
      return `/collections/jewelry-gifts-${normalized}`;
    }

    return `/collections/${normalized}`;
  };

  if (menu === "All Jewelry") {
    // Special handling for "All" links
    if (subcategory) {
      // Handle "All {Category}" → just the category plural
      if (subcategory.startsWith("All ")) {
        const cat = subcategory.replace("All ", "");
        return collectionUrl(cat);
      }
      return collectionUrl(subcategory);
    }
    if (category === "All Jewelry") {
      return "/collections/shop-all";
    }
    if (category) return collectionUrl(category);
    return "/collections/shop-all";
  }

  if (menu === "Gifts") {
    if (subcategory) return giftCollectionUrl(subcategory);
    if (category) return giftCollectionUrl(category);
    return "/collections/gifts";
  }

  // if (menu === "New In") {
  //   if (category) return `/collections/${slug(category)}`;
  //   return "/collections/new";
  // }

  if (menu === "New In") {
    // Special case: "All New" should go to /collections/new
    if (category === "All New") return "/collections/new";
    if (category === "Summer Guide") return "/guided-shop/summer";
    if (category) return iconCollectionUrl(category);
    return "/collections/new";
  }

  if (menu === "Collections") {
    const collectionLinks: Record<string, string> = {
      "Puzzle Collection": "/collections/puzzle",
      "Dome Collection": "/collections/dome",
      "DÃ´me Collection": "/collections/dome",
      "Charlotte Collection": "/collections/charlotte",
      "Interconnected Collection": "/collections/interconnected",
      "Stevie Collection": "/collections/stevie",
      "All Personalized": "/collections/personalized",
      "Personalized": "/collections/personalized",
      "Engravables": "/collections/engravables",
      "The Letter Shop": "/collections/the-letter-shop",
      "Birthstone + Zodiac": "/collections/birthstone-zodiac",
      "Mejuri Play": "/guided-shop/mejuri-play",
      "Wedding": "/collections/wedding",
      "Tennis Collection": "/collections/tennis-jewelry",
    };

    if (subcategory) return collectionLinks[subcategory] || iconCollectionUrl(subcategory);
    if (category) return collectionLinks[category] || iconCollectionUrl(category);
    return "/collections";
  }

  if (menu === "Get Inspired") {
    if (subcategory === "The Lookbook" || category === "The Lookbook") {
      return "/guided-shop/look-book";
    }
    if (subcategory === "Summer Guide" || category === "Summer Guide") {
      return "/guided-shop/summer";
    }
    if (subcategory === "Ring Stacking Guide" || category === "Ring Stacking Guide") {
      return "/guided-shop/ring-stacking-guide";
    }
    if (subcategory === "Lab Grown Gemstones Guide" || category === "Lab Grown Gemstones Guide") {
      return "/edit/lab-grown-gemstones";
    }
    if (subcategory === "Mejuri Play Guide" || category === "Mejuri Play Guide") {
      return "/guided-shop/mejuri-play";
    }
    if (subcategory) return `/collections/${slug(subcategory)}`;
    if (category) return `/collections/${slug(category)}`;
    return "/collections";
  }

  if (menu === "Personalized") {
    if (category) return `/personalized/${slug(category)}`;
    return "/personalized";
  }

  if (menu === "Before We Melt") {
    if (category) return `/collections/before-we-melt`;
    return "/collections/before-we-melt";
  }

  if (menu === "Best Sellers") {
    return "/collections/best-sellers";
  }

  if (menu === "Graduation Gifts") {
    if (category) return `/collections/graduation-gifts`;
    return "/collections/graduation-gifts";
  }

  return "#";
};

export const allJewelryMenu = {
  categories: [
    {
      name: "Earrings",
      items: [
        "All Earrings",
        "Best Selling Earrings",
        "Hoop Earrings",
        "Stud Earrings",
        "Drop Earrings",
        "Ear Cuffs",
        "Hoop Charms",
        "Cartilage & Helix",
        "Diamond Earrings",
        "Pearl Earrings",
        "Tennis Earrings",
      ],
      featured: [
        "Earrings Under $200",
        "Stevie Hoops",
        "Get Pierced",
      ],
    },

    {
      name: "Rings",
      items: [
        "All Rings",
        "Best Selling Rings",
        "Stackable Rings",
        "Statement Rings",
        "Signet Rings",
        "Diamond Rings",
        "Wedding Bands",
        "Eternity Bands",
        "Men's Rings",
      ],
      featured: [
        "Rings Under $200",
        "Puzzle Stacking Rings",
        "Ring Stacking Guide",
      ],
    },

    {
      name: "Necklaces",
      items: [
        "All Necklaces",
        "Best Selling Necklaces",
        "Chain Necklaces",
        "Pendant Necklaces",
        "Pearl + Beaded Necklaces",
        "Diamond Necklaces",
        "Tennis Necklaces",
        "Charm Compatible Necklaces",
        "Men's Necklaces",
      ],
      featured: [
        "Necklaces Under $200",
        "Charms + Pendants",
      ],
    },

    {
      name: "Bracelets",
      items: [
        "All Bracelets",
        "Best Selling Bracelets",
        "Chain Bracelets",
        "Cuffs + Bangle Bracelets",
        "Pearl + Beaded Bracelets",
        "Diamond Bracelets",
        "Tennis Bracelets",
        "Charm Compatible Bracelets",
        "Cord Bracelets",
        "Men's Bracelets",
      ],
      featured: [
        "Bracelets Under $200",
        "Charms + Pendants",
      ],
    },

    {
      name: "Charms + Pendants",
      items: [
        "All Charms + Pendants",
        "Charms",
        "Pendants",
        "Charm Compatible Necklaces",
        "Charm Compatible Bracelets",
        "Hoop Charms",
      ],
    },

    {
      name: "Tennis Jewelry",
      items: [
        "All Tennis Jewelry",
        "Tennis Necklaces",
        "Tennis Bracelets",
        "Tennis Earrings",
      ],
    },

    {
      name: "Bundles + Sets",
      items: [
        "Bundles + Sets",
      ],
    },

    {
      name: "Men's",
      items: [
        "All Men's",
        "Men's Necklaces",
        "Men's Bracelets",
        "Men's Rings",
      ],
    },

    {
      name: "Lifestyle",
      items: [
        "All Lifestyle",
        "Jewelry Boxes",
      ],
    },

    {
      name: "Before We Melt",
      items: [
        "Before We Melt",
      ],
    },
  ],

  featured: [
    "Best Sellers",
    "Under $200",
    "Personalized",
    "Wedding",
    "Summer Essentials",
  ],

  collections: [
    "Puzzle",
    "Dome",
    "Interconnected",
    "Charlotte",
    "Stevie",
  ],
};

export const giftsMenu = {
  categories: [
    {
      name: "Gift Guide",
      items: [],
    },
    {
      name: "All Gifts",
      items: [],
    },
    {
      name: "Most Gifted",
      items: [],
    },
    {
      name: "Gifts by Price",
      items: [
        "Under $200",
        "Under $500",
        "Luxury Gifts",
      ],
    },
    {
      name: "Personalized",
      items: [
        "All Personalized",
        "Birthstone + Zodiac",
        "Engravables",
        "The Letter Shop",
      ],
    },
    {
      name: "Bundles + Sets",
      items: [],
    },
    {
      name: "Gifts For Him",
      items: [],
    },
    {
      name: "Gift Cards",
      items: [],
    },
  ],

  featured: [
    "June Birthstone",
    "July Birthstone",
    "Graduation Gifts",
  ],
};

export const newInMenu = {
  categories: [
    {
      name: "All New",
      items: ["All New"],
    },
    {
      name: "New Earrings",
      items: ["New Earrings"],
    },
    {
      name: "New Rings",
      items: ["New Rings"],
    },
    {
      name: "New Necklaces",
      items: ["New Necklaces"],
    },
    {
      name: "New Bracelets",
      items: ["New Bracelets"],
    },
  ],

  featured: [
    "Summer Guide",
    "Puzzle Collection",
    "Back In Stock",
    "Graduation Gifts",
  ],
};

const newInPromo = {
  image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1784057998/2026/BAU/07_July/VM%20and%20SS/VMSS_Nav2.jpg",
  copy: "Your favorites, now available in sterling silver",
  href: "/collections/new",
};

export const collectionsMenu = {
  categories: [
    {
      name: "Icons",
      items: [
        "Puzzle Collection",
        "Dome Collection",
        "Charlotte Collection",
        "Interconnected Collection",
        "Stevie Collection",
      ],
    },
    {
      name: "Personalized",
      items: [
        "All Personalized",
        "Engravables",
        "The Letter Shop",
        "Birthstone + Zodiac",
      ],
    },
    {
      name: "Featured",
      items: [
        "Mejuri Play",
        "Wedding",
        "Tennis Collection",
      ],
    },
  ],
};

export const getInspiredMenu = {
  categories: [
    {
      name: "Categories",
      items: [
        "The Lookbook",
        "Jewelry for Going Out",
        "Jewelry for Everyday",
      ],
    },
    {
      name: "Styling",
      items: [
        "Summer Guide",
        "Ring Stacking Guide",
        "Lab Grown Gemstones Guide",
        "Mejuri Play Guide",
      ],
    },
  ],
};

export const personalizedMenu = {
  categories: [
    {
      name: "All Personalized",
      items: ["All Personalized"],
    },
    {
      name: "The Letter Shop",
      items: ["The Letter Shop"],
    },
    {
      name: "Birthstone + Zodiac",
      items: ["Birthstone + Zodiac"],
    },
    {
      name: "Engravables",
      items: ["Engravables"],
    },
  ],

  featured: [
    "June Birthstone",
    "July Birthstone",
  ],
};

const megaMenuContent = {
  "All Jewelry": {
    categories: [
      { name: "All Jewelry", hasArrow: false },
      { name: "Earrings", hasArrow: true },
      { name: "Rings", hasArrow: true },
      { name: "Necklaces", hasArrow: true },
      { name: "Bracelets", hasArrow: true },
      { name: "Charms + Pendants", hasArrow: true },
      { name: "Tennis Jewelry", hasArrow: true },
      { name: "Bundles + Sets", hasArrow: true },
      { name: "Men's", hasArrow: true },
      { name: "Lifestyle", hasArrow: true },
      { name: "Before We Melt", hasArrow: true },
    ],
    featured: [
      "Best Sellers",
      "Under $200",
      "Personalized",
      "Wedding",
      "Summer Essentials",
    ],
    collections: [
      "Puzzle",
      "Dome",
      "Interconnected",
      "Charlotte",
      "Stevie",
    ],
  },
  "Gifts": {
    categories: [
      { name: "Gift Guide", hasArrow: false },
      { name: "All Gifts", hasArrow: false },
      { name: "Most Gifted", hasArrow: false },
      { name: "Gifts by Price", hasArrow: true },
      { name: "Personalized", hasArrow: true },
      { name: "Bundles + Sets", hasArrow: false },
      { name: "Gifts For Him", hasArrow: false },
      { name: "Gift Cards", hasArrow: false },
    ],
    featured: [
      "June Birthstone",
      "July Birthstone",
      "Graduation Gifts",
    ],
    collections: [],
  },
  "New In": {
    categories: [
      { name: "All New", hasArrow: false },
      { name: "New Earrings", hasArrow: false },
      { name: "New Rings", hasArrow: false },
      { name: "New Necklaces", hasArrow: false },
      { name: "New Bracelets", hasArrow: false },
    ],
    featured: [
      "Summer Guide",
      "Puzzle Collection",
      "Back In Stock",
      "Graduation Gifts",
    ],
    collections: [],
  },
  "Collections": {
    categories: [
      { name: "Icons", hasArrow: false },
      { name: "Personalized", hasArrow: false },
      { name: "Featured", hasArrow: false },
    ],
    featured: [],
    collections: [],
  },
  "Get Inspired": {
    categories: [
      { name: "Categories", hasArrow: false },
      { name: "Styling", hasArrow: false },
    ],
    featured: [],
    collections: [],
  },
  "Personalized": {
    categories: [
      { name: "All Personalized", hasArrow: false },
      { name: "The Letter Shop", hasArrow: false },
      { name: "Birthstone + Zodiac", hasArrow: false },
      { name: "Engravables", hasArrow: false },
    ],
    featured: [
      "June Birthstone",
      "July Birthstone",
    ],
    collections: [],
  },
};

export function NavbarHome({

  isScrolled,
  hidePromoBar,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMegaMenuOpen,
  setIsMegaMenuOpen,
  onSearchClick,
  variant = "default"
}: {
  isScrolled?: boolean;
  hidePromoBar: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: (open: boolean) => void;
  onSearchClick: () => void;
  variant?: "default" | "light";
}) {
  const pathname = usePathname();
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileClosing, setIsMobileClosing] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [mobileSubcategory, setMobileSubcategory] = useState<string | null>(null);
  const [desktopSubcategory, setDesktopSubcategory] = useState<string | null>(null);
  const links = ["All Jewelry", "Best Sellers", "Gifts", "New In", "Collections", "Get Inspired", "Before We Melt"];

  const handleCloseMegaMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMegaMenuOpen(null);
      setIsMegaMenuOpen(false);
      setDesktopSubcategory(null);
      setIsClosing(false);
    }, 300);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setMobileSubmenu(null);
      setMobileSubcategory(null);
      setIsMobileClosing(false);
    }, 300);

  };
  // const [accountOpen, setAccountOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [storeServicesOpen, setStoreServicesOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);



  const getNavbarBg = () => {
    if (variant === "light") {
      return { bg: "bg-white", text: "text-black" };
    }
    if (isScrolled) {
      return { bg: "bg-black", text: "text-white" };
    }
    // At top of page — transparent over hero video
    return { bg: "lg:bg-transparent bg-black", text: "text-white" };
  };

  const navbarBg = getNavbarBg();

  const refreshCartCount = async () => {
    try {
      const response = await fetch(`/api/cart?userId=${CART_USER_ID}`, {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      const nextCount = items.reduce(
        (total: number, item: { quantity?: number | string }) =>
          total + (Number(item.quantity) || 0),
        0
      );

      setCartCount(nextCount);
    } catch (error) {
      console.log("Cart count error:", error);
    }
  };

  useEffect(() => {
    void refreshCartCount();

    const handleCartUpdated = () => {
      void refreshCartCount();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener("pageshow", handleCartUpdated);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("pageshow", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const closeTransientUi = () => {
      setMegaMenuOpen(null);
      setIsMegaMenuOpen(false);
      setDesktopSubcategory(null);
      setIsClosing(false);
      setIsMobileMenuOpen(false);
      setMobileSubmenu(null);
      setMobileSubcategory(null);
      setIsMobileClosing(false);
      setAccountOpen(false);
      setSigninOpen(false);
      setCreateAccountOpen(false);
      setForgotPasswordOpen(false);
      setStoreServicesOpen(false);
      setCartOpen(false);
    };

    closeTransientUi();
    window.addEventListener("pageshow", closeTransientUi);
    return () => window.removeEventListener("pageshow", closeTransientUi);
  }, [pathname, setIsMegaMenuOpen, setIsMobileMenuOpen]);

  const openSigninModal = () => {
    setAccountOpen(false);

    setTimeout(() => {
      setSigninOpen(true);
    }, 300);
  };

  const openMobileSigninModal = () => {
    handleCloseMobileMenu();
    setTimeout(() => setSigninOpen(true), 300);
  };

  useEffect(() => {
    const handleSigninRequest = () => {
      setAccountOpen(false);
      setSigninOpen(true);
    };

    window.addEventListener(SIGNIN_REQUESTED_EVENT, handleSigninRequest);
    return () => window.removeEventListener(SIGNIN_REQUESTED_EVENT, handleSigninRequest);
  }, []);

  const openCreateAccountModal = () => {
    setAccountOpen(false);

    setTimeout(() => {
      setCreateAccountOpen(true);
    }, 300);
  };

  <ForgotPasswordModal
    open={forgotPasswordOpen}
    onClose={() => setForgotPasswordOpen(false)}
  />

  return (
    <>
      <header className={`fixed left-0 right-0 z-[60] h-[57px] transition-all duration-300 ${hidePromoBar ? "top-0" : "top-0 lg:top-[40px]"} ${navbarBg.bg} ${navbarBg.text}`}>
        <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between py-[1rem] px-[2rem] ">
          <div className="flex  items-center lg:w-auto lg:flex-initial lg:gap-9">
            <button className="cursor-pointer lg:hidden " onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="absolute left-1/2 lg:block hidden h-[19.56px] w-[94px] -translate-x-1/2 cursor-pointer lg:static lg:translate-x-0" aria-label="MEJURI home">
              <MejuriLogo />
            </Link>
            <nav className="hidden items-center gap-7 text-[13px] font-normal lg:flex font-display">
              {links.map((link) => {
                const hasMegaMenu = !!megaMenuContent[link as keyof typeof megaMenuContent];
                const url = generateUrl(link);

                return hasMegaMenu ? (
                  <button
                    key={link}
                    onClick={() => {
                      const newValue = megaMenuOpen === link ? null : link;
                      setMegaMenuOpen(newValue);
                      setIsMegaMenuOpen(!!newValue);
                    }}
                    className="cursor-pointer whitespace-nowrap  hover:underline"
                  >
                    {link}
                  </button>
                ) : (
                  <Link
                    key={link}
                    href={url}
                    className="cursor-pointer whitespace-nowrap hover:underline"
                  >
                    {link}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Link href="/" className="block lg:hidden z-10 h-[19.56px] w-[94px] absolute inset-0 mx-auto top-5 -left-[3rem]  cursor-pointer lg:static lg:translate-x-0" aria-label="MEJURI home">
            <MejuriLogo />
          </Link>
          <div className="flex w-1/3 items-center justify-end font-sans text-[13px] font-normal font-display lg:w-auto gap-[1rem]">
            <button
              onClick={() => setStoreServicesOpen(true)}
              className="cursor-pointer lg:hidden"
              aria-label="Your Store"
            >
              <StoreIcon className="h-6 w-6" />
            </button>
            <button onClick={onSearchClick} className="cursor-pointer lg:hidden" aria-label="Search">
              <SearchIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onSearchClick}
              className="hidden w-[160px] cursor-pointer items-center justify-between border-b border-current pb-[6px] lg:flex"
              aria-label="Open search"
            >
              <SearchIcon className="h-6 w-6" />
              <span className="font-sans text-[13px] font-normal leading-none">Search</span>
            </button>
            <button
              onClick={() => setStoreServicesOpen(true)}
              className="hidden cursor-pointer items-center gap-2 lg:flex"
            >
              <StoreIcon className="h-6 w-6" /> Your Store
            </button>
            {/* <button className="cursor-pointer" aria-label="Account"><User className="h-5 w-5" /></button> */}
            <button
              onClick={() => setAccountOpen(true)}
              className="hidden cursor-pointer lg:inline-flex"
              aria-label="Account"
            >
              <AccountIcon className="h-6 w-6" />
            </button>
            <a href="/wishlist" className="hidden cursor-pointer lg:inline-flex" aria-label="Wishlist"><WishlistIcon className="h-6 w-6" /></a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative cursor-pointer"
              aria-label="Bag"
            >
              <BagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span
                  className={`absolute top-0 right-[-8px] flex h-[13px] w-[13px] items-center justify-center rounded-full text-[8px] font-display ${variant === "light" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                  <span className="sr-only">Item in Bag</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega Menu Sidebar - Desktop Only */}
        {megaMenuOpen && megaMenuContent[megaMenuOpen as keyof typeof megaMenuContent] && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[100] hidden bg-black/50 transition-opacity duration-300 lg:block"
              onClick={handleCloseMegaMenu}
            />

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-[110] hidden w-full max-w-[940px] bg-white text-black shadow-2xl lg:block ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
              <div className="flex h-full flex-col">
                {/* Header with Navigation */}
                <div className="border-b border-gray-200 px-9 py-5">
                  <div className="flex items-center justify-between">
                    <a href="/" className="block h-[19.56px] w-[94px]" aria-label="MEJURI home">
                      <MejuriLogo />
                    </a>

                    {/* Navigation */}
                    <nav className="flex items-center gap-7 font-sans text-[13px] font-normal">
                      {links.map((link) => {
                        const hasMegaMenu = !!megaMenuContent[link as keyof typeof megaMenuContent];

                        return hasMegaMenu ? (
                          <button
                            key={link}
                            onClick={() => {
                              setMegaMenuOpen(link);
                              setIsMegaMenuOpen(true);
                              setDesktopSubcategory(null);
                            }}
                            className={`cursor-pointer whitespace-nowrap hover:underline ${megaMenuOpen === link ? 'underline font-bold' : ''}`}
                          >
                            {link}
                          </button>
                        ) : (
                          <Link
                            key={link}
                            href={generateUrl(link)}
                            onClick={handleCloseMegaMenu}
                            className="cursor-pointer whitespace-nowrap hover:underline"
                          >
                            {link}
                          </Link>
                        );
                      })}

                    </nav>


                    <button
                      onClick={handleCloseMegaMenu}
                      className="cursor-pointer text-black hover:opacity-70"
                      aria-label="Close menu"
                    >
                      <X className="h-7 w-7" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-9 py-12">
                  {megaMenuOpen === "New In" && !desktopSubcategory ? (
                    <div className="grid max-w-[920px] grid-cols-[360px_1fr] gap-x-24 gap-y-10">
                      <div className="space-y-10">
                        <div className="space-y-4">
                          {newInMenu.categories.slice(1).map((group) => (
                            <Link key={group.name} href={generateUrl("New In", group.name)} onClick={handleCloseMegaMenu} className="block w-fit cursor-pointer font-sans text-[14px] text-[#666] hover:text-black hover:underline">
                              {group.name}
                            </Link>
                          ))}
                        </div>

                        <Link href={newInPromo.href} onClick={handleCloseMegaMenu} className="group block w-[300px] cursor-pointer text-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={newInPromo.image} alt={newInPromo.copy} className="block h-auto w-full" />
                          <p className="mt-3 max-w-[330px] font-mono text-[14px] leading-[1.2]">{newInPromo.copy}</p>
                          <span className="mt-4 inline-block font-display text-[14px] font-bold uppercase underline underline-offset-4 group-hover:no-underline">SHOP NOW</span>
                        </Link>
                      </div>
                      <div>
                        <h3 className="mb-6 font-sans text-[14px] font-bold text-black">Featured</h3>
                        <div className="space-y-4">
                          {newInMenu.featured.map((item) => (
                            <Link
                              key={item}
                              href={generateUrl("New In", item)}
                              onClick={handleCloseMegaMenu}
                              className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black hover:underline"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : megaMenuOpen === "Get Inspired" || megaMenuOpen === "Collections" ? (
                    <div className={`grid gap-20 ${megaMenuOpen === "Collections" ? "max-w-[860px] grid-cols-3" : "max-w-[760px] grid-cols-2"}`}>
                      {(megaMenuOpen === "Collections" ? collectionsMenu : getInspiredMenu).categories.map((group) => (
                        <div key={group.name}>
                          <h3 className="mb-6 font-sans text-[14px] font-bold text-black">{group.name}</h3>
                          <div className="space-y-4">
                            {group.items.map((item) => (
                              <a
                                key={item}
                                href={generateUrl(megaMenuOpen as string, group.name, item)}
                                onClick={handleCloseMegaMenu}
                                className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black"
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !desktopSubcategory ? (
                    <div className="grid grid-cols-3 gap-16">
                      {/* Categories */}
                      <div>
                        <h3 className="mb-6 font-sans text-[14px] font-bold text-black">Categories</h3>
                        <div className="space-y-4">
                          {megaMenuContent[megaMenuOpen as keyof typeof megaMenuContent].categories.map((item) => {
                            let categoryData = null;

                            if (megaMenuOpen === "All Jewelry") {
                              categoryData = allJewelryMenu.categories.find(c => c.name === item.name);
                            } else if (megaMenuOpen === "Gifts") {
                              categoryData = giftsMenu.categories.find(c => c.name === item.name);
                            } else if (megaMenuOpen === "New In") {
                              categoryData = newInMenu.categories.find(c => c.name === item.name);
                            } else if (megaMenuOpen === "Collections") {
                              categoryData = collectionsMenu.categories.find(c => c.name === item.name);
                            } else if (megaMenuOpen === "Get Inspired") {
                              categoryData = getInspiredMenu.categories.find(c => c.name === item.name);
                            } else if (megaMenuOpen === "Personalized") {
                              categoryData = personalizedMenu.categories.find(c => c.name === item.name);
                            }

                            const hasItems = categoryData && categoryData.items && categoryData.items.length > 0;

                            // If no subcategories, render as link
                            if (!hasItems) {
                              return (
                                <a
                                  key={item.name}
                                  href={generateUrl(megaMenuOpen as string, item.name)}
                                  className="flex w-full cursor-pointer items-center justify-between font-sans text-[14px] text-[#666] hover:text-black"
                                >
                                  <span>{item.name}</span>
                                </a>
                              );
                            }

                            // If has subcategories, render as button
                            return (
                              <button
                                key={item.name}
                                onClick={() => {
                                  setDesktopSubcategory(item.name);
                                }}
                                className="flex w-full cursor-pointer items-center justify-between font-sans text-[14px] text-[#666] hover:text-black"
                              >
                                <span>{item.name}</span>
                                <span className="text-[10px]">▸</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Featured */}
                      <div>
                        <h3 className="mb-6 font-sans text-[14px] font-bold text-black">Featured</h3>
                        <div className="space-y-4">
                          {megaMenuContent[megaMenuOpen as keyof typeof megaMenuContent].featured.map((item) => (
                            <a
                              key={item}
                              href={generateUrl(megaMenuOpen as string, item)}
                              className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Collections */}
                      {megaMenuContent[megaMenuOpen as keyof typeof megaMenuContent].collections.length > 0 && (
                        <div>
                          <h3 className="mb-6 font-sans text-[14px] font-bold text-black">ICON Collections</h3>
                          <div className="space-y-4">
                            {megaMenuContent[megaMenuOpen as keyof typeof megaMenuContent].collections.map((item) => (
                              <a
                                key={item}
                                href={generateUrl(megaMenuOpen as string, item)}
                                className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black"
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Back button */}
                      <button
                        onClick={() => setDesktopSubcategory(null)}
                        className="mb-8 flex cursor-pointer items-center gap-2 font-sans text-[16px] font-bold text-black hover:opacity-70"
                      >
                        <span className="text-[14px]">◂</span>
                        <span>{desktopSubcategory}</span>
                      </button>

                      {(() => {
                        let categoryData = null;

                        if (megaMenuOpen === "All Jewelry") {
                          categoryData = allJewelryMenu.categories.find(c => c.name === desktopSubcategory);
                        } else if (megaMenuOpen === "Gifts") {
                          categoryData = giftsMenu.categories.find(c => c.name === desktopSubcategory);
                        } else if (megaMenuOpen === "New In") {
                          categoryData = newInMenu.categories.find(c => c.name === desktopSubcategory);
                        } else if (megaMenuOpen === "Collections") {
                          categoryData = collectionsMenu.categories.find(c => c.name === desktopSubcategory);
                        } else if (megaMenuOpen === "Get Inspired") {
                          categoryData = getInspiredMenu.categories.find(c => c.name === desktopSubcategory);
                        } else if (megaMenuOpen === "Personalized") {
                          categoryData = personalizedMenu.categories.find(c => c.name === desktopSubcategory);
                        }

                        if (!categoryData) return null;

                        return (
                          <div className="grid grid-cols-3 gap-16">
                            {/* Main Items */}
                            <div>
                              <h3 className="mb-6 font-sans text-[14px] font-bold text-black">{desktopSubcategory}</h3>
                              <div className="space-y-4">
                                {categoryData.items.map((item) => (
                                  <a
                                    key={item}
                                    href={generateUrl(megaMenuOpen as string, desktopSubcategory as string, item)}
                                    className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black"
                                  >
                                    {item}
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Featured Items if available */}
                            {'featured' in categoryData && (categoryData as any).featured && (categoryData as any).featured.length > 0 && (
                              <div>
                                <h3 className="mb-6 font-sans text-[14px] font-bold text-black">Featured</h3>
                                <div className="space-y-4">
                                  {(categoryData as any).featured.map((item: string) => (
                                    <a
                                      key={item}
                                      href={generateUrl(megaMenuOpen as string, desktopSubcategory as string, item)}
                                      className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black"
                                    >
                                      {item}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Empty column for spacing */}
                            <div></div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[120] bg-black/50 lg:hidden" onClick={handleCloseMobileMenu}>
            <div className={`flex h-full w-full flex-col bg-white text-black md:w-[86%] md:max-w-[940px] ${isMobileClosing ? 'animate-slide-out' : 'animate-slide-in'}`} onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-end border-b border-gray-200 px-6 py-4">
                <button className="cursor-pointer" onClick={handleCloseMobileMenu} aria-label="Close menu">
                  <X className="h-7 w-7 text-black" />
                </button>
              </div>

              {/* Search Bar */}
              <button
                onClick={() => {
                  handleCloseMobileMenu();
                  onSearchClick();
                }}
                className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-200 px-6 py-4 text-left hover:bg-gray-50"
              >
                <SearchIcon className="h-5 w-5 text-gray-400" />
                <span className="font-sans text-[14px] text-gray-400">Search</span>
              </button>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {!mobileSubmenu ? (
                  <>
                    {/* Main Links */}
                    <div className="mb-8 space-y-5">
                      {links.map((link) => {
                        const hasSubMenu = !!megaMenuContent[link as keyof typeof megaMenuContent];

                        if (!hasSubMenu) {
                          return (
                            <Link
                              key={link}
                              href={generateUrl(link)}
                              onClick={handleCloseMobileMenu}
                              className="flex w-full cursor-pointer items-center justify-between font-sans text-[16px] font-normal text-black"
                            >
                              <span>{link}</span>
                            </Link>
                          );
                        }

                        return (
                          <button
                            key={link}
                            onClick={() => {
                              setMobileSubmenu(link);
                              setMobileSubcategory(null);
                            }}
                            className="flex w-full cursor-pointer items-center justify-between font-sans text-[16px] font-normal text-black"
                          >
                            <span>{link}</span>
                            <span className="text-[12px]">▸</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Featured Section */}
                    <div className="mb-8">
                      <h3 className="mb-4 font-sans text-[14px] font-bold text-black">Featured</h3>
                      <div className="space-y-4">
                        <a href="/summer-guide" className="block cursor-pointer font-sans text-[14px] text-[#666]">The Summer Guide</a>
                        <a href="/best-sellers" className="block cursor-pointer font-sans text-[14px] text-[#666]">Best Sellers</a>
                        <a href="/personalized" className="block cursor-pointer font-sans text-[14px] text-[#666]">Personalized Jewelry</a>
                      </div>
                    </div>

                    {/* Footer Links */}
                    <div className="space-y-4 border-t border-gray-200 pt-6">
                      <button
                        type="button"
                        onClick={openMobileSigninModal}
                        className="flex w-full cursor-pointer items-center justify-between font-sans text-[14px] text-black"
                      >
                        <span>Account</span>
                        <span className="text-[12px]">▸</span>
                      </button>
                      <a href="/wishlist" className="block cursor-pointer font-sans text-[14px] text-black">Wishlist</a>
                      <a href="/stores" className="block cursor-pointer font-sans text-[14px] text-black">Stores & Services</a>
                      <a href="/faqs" className="block cursor-pointer font-sans text-[14px] text-black">FAQs</a>
                    </div>
                  </>
                ) : !mobileSubcategory ? (
                  <>
                    {/* Submenu View */}
                    <button
                      onClick={() => {
                        setMobileSubmenu(null);
                        setMobileSubcategory(null);
                      }}
                      className="mb-6 flex cursor-pointer items-center gap-2 font-sans text-[16px] font-bold text-black"
                    >
                      <span className="text-[12px]">◂</span>
                      <span>{mobileSubmenu}</span>
                    </button>

                    {mobileSubmenu === "Get Inspired" || mobileSubmenu === "Collections" ? (
                      <div className="grid grid-cols-2 gap-8">
                        {(mobileSubmenu === "Collections" ? collectionsMenu : getInspiredMenu).categories.map((group) => (
                          <div key={group.name}>
                            <h3 className="mb-4 font-sans text-[14px] font-bold text-black">{group.name}</h3>
                            <div className="space-y-3">
                              {group.items.map((item) => (
                                <a
                                  key={item}
                                  href={generateUrl(mobileSubmenu as string, group.name, item)}
                                  className="block cursor-pointer font-sans text-[14px] text-[#666]"
                                >
                                  {item}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {/* Categories */}
                        <div className="mb-8 space-y-5">
                          <a
                            href={generateUrl(mobileSubmenu as string, megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.categories[0]?.name)}
                            className="block cursor-pointer font-sans text-[16px] text-black"
                          >
                            {megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.categories[0]?.name}
                          </a>
                          {megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.categories.slice(1).map((item) => {
                            let categoryData = null;

                            if (mobileSubmenu === "All Jewelry") {
                              categoryData = allJewelryMenu.categories.find(c => c.name === item.name);
                            } else if (mobileSubmenu === "Gifts") {
                              categoryData = giftsMenu.categories.find(c => c.name === item.name);
                            } else if (mobileSubmenu === "New In") {
                              categoryData = newInMenu.categories.find(c => c.name === item.name);
                            } else if (mobileSubmenu === "Collections") {
                              categoryData = collectionsMenu.categories.find(c => c.name === item.name);
                            } else if (mobileSubmenu === "Get Inspired") {
                              categoryData = getInspiredMenu.categories.find(c => c.name === item.name);
                            } else if (mobileSubmenu === "Personalized") {
                              categoryData = personalizedMenu.categories.find(c => c.name === item.name);
                            }

                            const hasItems = categoryData && categoryData.items && categoryData.items.length > 0;

                            // If no subcategories, render as link
                            if (!hasItems) {
                              return (
                                <a
                                  key={item.name}
                                  href={generateUrl(mobileSubmenu as string, item.name)}
                                  className="flex w-full cursor-pointer items-center justify-between font-sans text-[16px] text-[#666]"
                                >
                                  <span>{item.name}</span>
                                </a>
                              );
                            }

                            // If has subcategories, render as button
                            return (
                              <button
                                key={item.name}
                                onClick={() => {
                                  setMobileSubcategory(item.name);
                                }}
                                className="flex w-full cursor-pointer items-center justify-between font-sans text-[16px] text-[#666]"
                              >
                                <span>{item.name}</span>
                                <span className="text-[12px]">▸</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Featured & Collections Grid */}
                        <div className="grid grid-cols-2 gap-8">
                          {/* Featured */}
                          <div>
                            <h3 className="mb-4 font-sans text-[14px] font-bold text-black">Featured</h3>
                            <div className="space-y-3">
                              {megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.featured.map((item) => (
                                <a
                                  key={item}
                                  href={generateUrl(mobileSubmenu as string, item)}
                                  className="block cursor-pointer font-sans text-[14px] text-[#666]"
                                >
                                  {item}
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Collections */}
                          {megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.collections.length > 0 && (
                            <div>
                              <h3 className="mb-4 font-sans text-[14px] font-bold text-black">ICON Collections</h3>
                              <div className="space-y-3">
                                {megaMenuContent[mobileSubmenu as keyof typeof megaMenuContent]?.collections.map((item) => (
                                  <a
                                    key={item}
                                    href={generateUrl(mobileSubmenu as string, item)}
                                    className="block cursor-pointer font-sans text-[14px] text-[#666]"
                                  >
                                    {item}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Subcategory View - Detailed Items */}
                    <button
                      onClick={() => setMobileSubcategory(null)}
                      className="mb-6 flex cursor-pointer items-center gap-2 font-sans text-[16px] font-bold text-black"
                    >
                      <span className="text-[12px]">◂</span>
                      <span>{mobileSubcategory}</span>
                    </button>

                    {(() => {
                      let categoryData = null;

                      if (mobileSubmenu === "All Jewelry") {
                        categoryData = allJewelryMenu.categories.find(c => c.name === mobileSubcategory);
                      } else if (mobileSubmenu === "Gifts") {
                        categoryData = giftsMenu.categories.find(c => c.name === mobileSubcategory);
                      } else if (mobileSubmenu === "New In") {
                        categoryData = newInMenu.categories.find(c => c.name === mobileSubcategory);
                      } else if (mobileSubmenu === "Collections") {
                        categoryData = collectionsMenu.categories.find(c => c.name === mobileSubcategory);
                      } else if (mobileSubmenu === "Get Inspired") {
                        categoryData = getInspiredMenu.categories.find(c => c.name === mobileSubcategory);
                      } else if (mobileSubmenu === "Personalized") {
                        categoryData = personalizedMenu.categories.find(c => c.name === mobileSubcategory);
                      }

                      if (!categoryData) return null;

                      return (
                        <>
                          {/* Main Items */}
                          <div className="mb-8 space-y-5">
                            {categoryData.items.map((item) => (
                              <a
                                key={item}
                                href={generateUrl(mobileSubmenu as string, mobileSubcategory as string, item)}
                                className="block cursor-pointer font-sans text-[16px] text-[#666] hover:text-black"
                              >
                                {item}
                              </a>
                            ))}
                          </div>

                          {/* Featured Items if available */}
                          {'featured' in categoryData && (categoryData as any).featured && (categoryData as any).featured.length > 0 && (
                            <div className="mb-8">
                              <h3 className="mb-4 font-sans text-[14px] font-bold text-black">Featured</h3>
                              <div className="space-y-3">
                                {(categoryData as any).featured.map((item: string) => (
                                  <a
                                    key={item}
                                    href={generateUrl(mobileSubmenu as string, mobileSubcategory as string, item)}
                                    className="block cursor-pointer font-sans text-[14px] text-[#666] hover:text-black"
                                  >
                                    {item}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AccountDrawer
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onSigninClick={openSigninModal}
        onCreateAccountClick={openCreateAccountModal}

      />

      <SigninModal
        open={signinOpen}
        onClose={() => setSigninOpen(false)}
        onCreateAccountClick={() => {
          setSigninOpen(false);
          setCreateAccountOpen(true);
        }}
        onForgotPasswordClick={() => {
          console.log("Opening forgot password modal");
          setSigninOpen(false);
          setForgotPasswordOpen(true);
        }}
      />
      <CreateAccountModal
        open={createAccountOpen}
        onClose={() => setCreateAccountOpen(false)}
        onSigninClick={() => {
          setCreateAccountOpen(false);
          setSigninOpen(true);
        }}
      />

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />

      <StoreServicesDrawer
        open={storeServicesOpen}
        onClose={() => setStoreServicesOpen(false)}
      />

      <AddToCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

    </>

  );
}
