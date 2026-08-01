import type { GuidedStoryPageData } from "@/components/GuidedStoryPage";

const summerMedia = {
  gifts1: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669275/2026/Summer%20Chapter%201/PDP/Summer_PSP_GiftsFromNature1_DT.jpg",
  gifts2: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669272/2026/Summer%20Chapter%201/PDP/Summer_PSP_GiftsFromNature2_DT.jpg",
  healing1: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669278/2026/Summer%20Chapter%201/PDP/Summer_PSP_HealingStones1_DT.jpg",
  healing2: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669281/2026/Summer%20Chapter%201/PDP/Summer_PSP_HealingStones2_DT.jpg",
  essentials1: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669269/2026/Summer%20Chapter%201/PDP/Summer_PSP_Essentials1_DT.jpg",
  essentials2: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669266/2026/Summer%20Chapter%201/PDP/Summer_PSP_Essentials2_DT.jpg",
  essentials3: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669263/2026/Summer%20Chapter%201/PDP/Summer_PSP_Essentials3_DT.jpg",
  poster: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1777669283/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT_POSTER.jpg",
  video: "https://res.cloudinary.com/mejuri-com/video/upload/q_auto:good/v1777669306/2026/Summer%20Chapter%201/PDP/Summer_PSP_ContentCard_DT.mp4",
};

const ringMedia = {
  hero: "https://res.cloudinary.com/mejuri-com/image/upload/v1725370084/homepage2/2024/September/Site%20Merch/Ring%20Stacking%20Guide/01_Hero_M.jpg",
  mix1: "https://res.cloudinary.com/mejuri-com/image/upload/v1725370307/homepage2/2024/September/Site%20Merch/Ring%20Stacking%20Guide/03_MixedMetal1.jpg",
  mix2: "https://res.cloudinary.com/mejuri-com/image/upload/v1725370312/homepage2/2024/September/Site%20Merch/Ring%20Stacking%20Guide/04_MixedMetal2.jpg",
  bold1: "https://res.cloudinary.com/mejuri-com/image/upload/v1725370320/homepage2/2024/September/Site%20Merch/Ring%20Stacking%20Guide/06_Work1.jpg",
  bold2: "https://res.cloudinary.com/mejuri-com/image/upload/v1725370328/homepage2/2024/September/Site%20Merch/Ring%20Stacking%20Guide/07_Work2.jpg",
  bold3: "https://res.cloudinary.com/mejuri-com/image/upload/v1725370333/homepage2/2024/September/Site%20Merch/Ring%20Stacking%20Guide/08_Work3.jpg",
};

const labMedia = {
  hero: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100786/2025/LGS/WEB/LP/LGS_LP_STL_01.jpg",
  card1: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100788/2025/LGS/WEB/LP/LGS_LP_STL_02.jpg",
  card2: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100789/2025/LGS/WEB/LP/LGS_LP_STL_03.jpg",
  card3: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100790/2025/LGS/WEB/LP/LGS_LP_STL_04.jpg",
  sapphire: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100792/2025/LGS/WEB/LP/LGS_LP_STL_05.jpg",
  diamond: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1752100794/2025/LGS/WEB/LP/LGS_LP_STL_06.jpg",
};

const playMedia = {
  hero: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-MejuriPlay_PlayCharmNecklace_Dice_OffFigureFrontView_PDP.jpg?v=1777558686&width=1200",
  card1: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Heart_TwoOfHeartsNecklace_V_OffFigureFrontView.jpg?v=1765982351&width=1200",
  card2: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-GiftsFromNature_PinchMeNecklace_V_OffFigFrontView_PDP.jpg?v=1777558686&width=1200",
  card3: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-_10k_StarfishCharmwTinyDiamondOffFigureFrontView2580x2160.jpg?v=1777558464&width=1200",
  card4: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-LadyLuckCharm_0012160x2580_dc10f731-7550-49b3-a943-5df6028847c2.jpg?v=1772550275&width=1200",
  card5: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Copy_of_05-Puzzle_Slider_Charm-May-001_2160x2580_ec4baa80-2e75-4450-8098-a72fd76beef2.jpg?v=1774453230&width=1200",
};

export const summerGuidePage: GuidedStoryPageData = {
  eyebrow: "The Summer Guide",
  title: "Carry the summer",
  copy: "Coastline memories. Tide-washed gifts. The small things that ground you, worn close.",
  navLinks: [
    { label: "Gifts from nature", href: "#gifts-from-nature" },
    { label: "Healing stones", href: "#healing-stones" },
    { label: "Summer essentials", href: "#summer-essentials" },
  ],
  sections: [
    {
      id: "gifts-from-nature",
      title: "Gifts from nature",
      copy: "Treasures shaped like shells, stars, and sea-swept keepsakes.",
      cta: { label: "Shop now", href: "/collections/mejuri-play" },
      media: [
        { src: summerMedia.gifts1, alt: "Gold coastal charm closeup" },
        { src: summerMedia.gifts2, alt: "Model wearing summer charms" },
        { video: summerMedia.video, poster: summerMedia.poster, alt: "Summer jewelry video" },
        { src: summerMedia.healing1, alt: "Gemstone summer jewelry" },
      ],
    },
    {
      id: "healing-stones",
      title: "Healing stones",
      copy: "Color, texture, and meaning for every sunny plan.",
      cta: { label: "Shop now", href: "/collections/lab-grown-gemstones" },
      media: [
        { src: summerMedia.healing1, alt: "Healing stone necklace" },
        { src: summerMedia.healing2, alt: "Healing stone charm" },
        { src: summerMedia.essentials1, alt: "Summer bracelet stack" },
        { src: summerMedia.essentials2, alt: "Layered summer jewelry" },
      ],
    },
    {
      id: "summer-essentials",
      title: "Summer essentials",
      copy: "Easy pieces made for warm days, late nights, and every plan between.",
      media: [
        { src: summerMedia.essentials1, alt: "Gold summer essentials" },
        { src: summerMedia.essentials2, alt: "Warm-weather jewelry styling" },
        { src: summerMedia.essentials3, alt: "Summer earrings and necklace" },
        { src: summerMedia.gifts1, alt: "Coastal charm detail" },
      ],
    },
  ],
  seo: {
    title: "Summer Jewelry Guide",
    paragraphs: [
      "Discover summer jewelry designed for sunlit plans, warm evenings, and everyday styling. From sculptural charms to colorful stones, these pieces bring a vacation feeling to your daily stack.",
      "Layer necklaces, add easy hoops, or choose a charm that feels personal. The summer guide is built around effortless styling that works from beach days to dinner plans.",
    ],
  },
};

export const ringStackingGuidePage: GuidedStoryPageData = {
  eyebrow: "The Ring Stacking Guide",
  title: "Stack your story",
  copy: "A guide to mixing textures, metals, shapes, and shine in the ring stack you wear every day.",
  navLinks: [
    { label: "Mixed metals", href: "#mixed-metals" },
    { label: "Work in texture", href: "#work-in-texture" },
    { label: "Make it yours", href: "#make-it-yours" },
  ],
  sections: [
    {
      id: "mixed-metals",
      title: "Mixed metals",
      copy: "Silver and gold belong together. Start with a shape you love, then build contrast around it.",
      cta: { label: "Shop rings", href: "/collections/rings" },
      media: [
        { src: ringMedia.hero, alt: "Hand with stacked rings", span: "wide" },
        { src: ringMedia.mix1, alt: "Mixed metal ring stack" },
        { src: ringMedia.mix2, alt: "Gold and silver rings" },
      ],
    },
    {
      id: "work-in-texture",
      title: "Work in texture",
      copy: "Balance smooth bands with ridges, domes, gemstones, and beaded edges.",
      media: [
        { src: ringMedia.bold1, alt: "Bold stacked rings" },
        { src: ringMedia.bold2, alt: "Textured rings on hand" },
        { src: ringMedia.bold3, alt: "Ring stack detail" },
        { src: ringMedia.mix2, alt: "Delicate stacked rings" },
      ],
    },
    {
      id: "make-it-yours",
      title: "Make it yours",
      copy: "Choose one anchor ring, then add pieces that make the whole stack feel personal.",
      media: [
        { src: ringMedia.mix1, alt: "Personal ring stack" },
        { src: ringMedia.hero, alt: "Everyday rings" },
        { src: ringMedia.bold1, alt: "Statement ring stack" },
        { src: ringMedia.bold3, alt: "Rings styled together" },
      ],
    },
  ],
  exploreMore: {
    title: "Explore More",
    items: [
      { title: "The Lookbook", href: "/guided-shop/look-book", image: summerMedia.gifts2, alt: "Lookbook jewelry styling" },
      { title: "Lab Grown Gemstones Guide", href: "/edit/lab-grown-gemstones", image: labMedia.hero, alt: "Lab grown gemstone styling" },
    ],
  },
};

export const labGrownGemstonesPage: GuidedStoryPageData = {
  eyebrow: "Lab Grown Gemstones Guide",
  title: "Brilliant by design",
  copy: "Lab grown gemstones bring saturated color, lasting shine, and everyday wearability to modern jewelry.",
  navLinks: [
    { label: "Sapphire", href: "#sapphire" },
    { label: "Diamond", href: "#diamond" },
    { label: "Emerald", href: "#emerald" },
  ],
  sections: [
    {
      id: "sapphire",
      title: "Lab grown sapphire",
      copy: "Blue, white, and vibrant stones made for stacking, layering, and daily sparkle.",
      cta: { label: "Shop gemstones", href: "/collections/lab-grown-gemstones" },
      media: [
        { src: labMedia.hero, alt: "Lab grown gemstone necklace" },
        { src: labMedia.card1, alt: "Lab grown sapphire earrings" },
        { src: labMedia.card2, alt: "Gemstone ring styling" },
        { src: labMedia.sapphire, alt: "Sapphire jewelry detail" },
      ],
    },
    {
      id: "diamond",
      title: "Lab grown diamond",
      copy: "Refined shine for everyday pieces that still feel special.",
      media: [
        { src: labMedia.diamond, alt: "Lab grown diamond jewelry" },
        { src: labMedia.card3, alt: "Diamond huggies" },
        { src: labMedia.card1, alt: "Diamond necklace and earrings" },
        { src: labMedia.card2, alt: "Diamond ring closeup" },
      ],
    },
    {
      id: "emerald",
      title: "Lab grown emerald",
      copy: "A lush green accent that brings color into your everyday lineup.",
      media: [
        { src: labMedia.card2, alt: "Emerald jewelry styling" },
        { src: labMedia.hero, alt: "Green gemstone necklace" },
        { src: labMedia.card3, alt: "Gemstone studs" },
        { src: labMedia.sapphire, alt: "Gemstone stack" },
      ],
    },
  ],
  seo: {
    title: "Lab Grown Gemstones",
    paragraphs: [
      "Explore lab grown gemstones designed for color, clarity, and everyday styling. These stones offer the same visual beauty customers love in refined silhouettes made for daily wear.",
      "From sapphire to diamond and emerald, lab grown gemstone jewelry gives your stack a modern way to add brightness, meaning, and personal color.",
    ],
  },
};

export const mejuriPlayPage: GuidedStoryPageData = {
  eyebrow: "Mejuri Play Guide",
  title: "Play it your way",
  copy: "A charm-first edit of joyful pieces, lucky symbols, colorful stones, and stacks made to feel personal.",
  navLinks: [
    { label: "Charms", href: "#charms" },
    { label: "Color", href: "#color" },
    { label: "Lucky pieces", href: "#lucky-pieces" },
  ],
  sections: [
    {
      id: "charms",
      title: "Charms",
      copy: "Start with a chain, then add symbols that say something about you.",
      cta: { label: "Shop charms", href: "/collections/mejuri-play" },
      media: [
        { src: playMedia.hero, alt: "Mejuri Play charm necklace" },
        { src: playMedia.card1, alt: "Two of hearts necklace" },
        { src: playMedia.card2, alt: "Pinch me charm necklace" },
        { src: playMedia.card3, alt: "Star crossed charm" },
      ],
    },
    {
      id: "color",
      title: "Color",
      copy: "Gemstone details and playful shapes bring a little brightness into the stack.",
      media: [
        { src: playMedia.card5, alt: "Puzzle pendant necklace" },
        { src: labMedia.card2, alt: "Color gemstone ring" },
        { src: summerMedia.healing2, alt: "Colorful stone charm" },
        { src: playMedia.card4, alt: "Lady luck charm" },
      ],
    },
    {
      id: "lucky-pieces",
      title: "Lucky pieces",
      copy: "Wear a tiny talisman, a heart, a shell, or anything that feels like yours.",
      media: [
        { src: playMedia.card4, alt: "Lucky charm" },
        { src: playMedia.card3, alt: "Star charm" },
        { src: playMedia.card2, alt: "Nature charm necklace" },
        { src: playMedia.card1, alt: "Heart necklace" },
      ],
    },
  ],
  exploreMore: {
    title: "Explore More",
    items: [
      { title: "Summer Guide", href: "/guided-shop/summer", image: summerMedia.gifts1, alt: "Summer jewelry guide" },
      { title: "The Lookbook", href: "/guided-shop/look-book", image: ringMedia.mix2, alt: "Lookbook styling" },
    ],
  },
};

