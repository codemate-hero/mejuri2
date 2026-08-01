export interface CategoryRailTile {
  name: string;
  href: string;
  image: string;
}

export interface CategoryRailConfig {
  breadcrumbs: Array<{
    label: string;
    href: string;
  }>;
  tiles: CategoryRailTile[];
}

export const shopAllTiles: CategoryRailTile[] = [
  {
    name: "Shop All",
    href: "/collections/shop-all",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/collections/Rings_CategoryCards_01_2.jpg?v=1783972804&width=600&height=600&crop=center",
  },
  {
    name: "Earrings",
    href: "/collections/earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/collections/Stevie_1.jpg?v=1782825643&width=600&height=600&crop=center",
  },
  {
    name: "Rings",
    href: "/collections/rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/collections/Rings_ecomm.jpg?v=1783973119&width=600&height=600&crop=center",
  },
  {
    name: "Bracelets",
    href: "/collections/bracelets",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1782740481/2026/BAU/06_June/Bracelet%20Nav/sia.jpg",
  },
  {
    name: "Necklaces",
    href: "/collections/necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/collections/Necklaces_-_ecom.jpg?v=1783994757&width=600&height=600&crop=center",
  },
  {
    name: "Charms + Pendants",
    href: "/collections/charms",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1781748237/2026/BAU/06_June/Charms%20%2B%20Pendants%20Nav/Puzzle_Sliders.jpg",
  },
  {
    name: "Tennis Jewelry",
    href: "/collections/tennis-jewelry",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1781748267/2026/BAU/06_June/Tennis%20Jewelry%20Nav/Tennis_Jewelry.jpg",
  },
  {
    name: "Men's",
    href: "/collections/mens-jewelry",
    image: "https://res.cloudinary.com/mejuri-com/image/upload/q_auto,f_auto/v1782740484/2026/BAU/06_June/Bracelet%20Nav/Cord.jpg",
  },
];

export const earringTiles: CategoryRailTile[] = [
  {
    name: "Earrings",
    href: "/collections/earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Hoops",
    href: "/collections/hoop-earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-DomeHoops_earrings_v_alt1_1456.jpg?v=1765393975&width=500&crop=center",
  },
  {
    name: "Studs",
    href: "/collections/stud-earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Reshoot_SphereStuds_14K_OffFigureAngledView_PDP_new.png?v=1758740165&width=500&crop=center",
  },
  {
    name: "Drop Earrings",
    href: "/collections/drop-earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-SimoneDropEarringsOffFigureAngledView2160x2580.jpg?v=1774968762&width=500&crop=center",
  },
  {
    name: "Cartilage & Helix",
    href: "/collections/cartilage-helix",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/PaveDiamondCartilage_earrings_yg_hero_new.png?v=1757697582&width=500&crop=center",
  },
  {
    name: "Ear Cuffs",
    href: "/collections/ear-cuffs",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1_DailyEarCuff_V_Hero_Side_new.png?v=1757697394&width=500&crop=center",
  },
];

export const hoopTiles: CategoryRailTile[] = [
  {
    name: "Hoops",
    href: "/collections/hoop-earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-DomeHoops_earrings_v_alt1_1456.jpg?v=1765393975&width=500&crop=center",
  },
  {
    name: "Huggie Hoops",
    href: "/collections/huggie-earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0_DomeHuggies_earrings_yg_hero_Comp_new_77d09c2a-24b4-436c-b8c7-4bfc407d43aa.png?v=1763574531&width=500&crop=center",
  },
  {
    name: "Small Hoops",
    href: "/collections/small-hoops",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0_BoldSmallHoops_V_OffFigureAngledView_PDP_new.png?v=1757616935&width=500&crop=center",
  },
  {
    name: "Medium Hoops",
    href: "/collections/medium-hoops",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-NewHoopStandard_ChubbyHoopsMedium16mm_SS_ANGLED_025_new.png?v=1757697371&width=500&crop=center",
  },
  {
    name: "Large Hoops",
    href: "/collections/large-hoops",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-LargeHoops-14k-Angled_193_new.png?v=1757697369&width=500&crop=center",
  },
  {
    name: "Oversized Hoops",
    href: "/collections/oversized-hoops",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-NewHoopStandard_TubeHoopsXLarge40mm_SS_ANGLED_308_new.png?v=1757697370&width=500&crop=center",
  },
  {
    name: "Charm Compatible Hoops",
    href: "/collections/charm-compatible-hoops",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/3-THENEWHOOP-TheNewHoopVermeilHoopVermeilCharm-V-AngledFrontView_061_5162c7c4-5255-49aa-b73b-3a826408f833_new.png?v=1758073188&width=500&crop=center",
  },
  {
    name: "Hoop Charms",
    href: "/collections/hoop-charms",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0_Pearl_Hoop_Charm_FrontView_new.png?v=1757616933&width=500&crop=center",
  },
  {
    name: "Cartilage & Helix",
    href: "/collections/cartilage-helix",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/PaveDiamondCartilage_earrings_yg_hero_new.png?v=1757697582&width=500&crop=center",
  },
];

export const ringTiles: CategoryRailTile[] = [
  {
    name: "Rings",
    href: "/collections/rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Single_Colored_Mini_Hoop_Tsavorite_001_2_2160x2580_63363c42-2dfa-410a-ada2-2af9afa7e132.jpg?v=1763043733&width=500&crop=center",
  },
  {
    name: "Best Selling Rings",
    href: "/collections/best-selling-rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-CharlotteBold_Ring_V_Hero_new.png?v=1757697295&width=500&crop=center",
  },
  {
    name: "Stackable Rings",
    href: "/collections/stackable-rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-StackerRings_ThinDomeRing_V_OffFigure-PDP_new.png?v=1757697395&width=500&crop=center",
  },
  {
    name: "Statement Rings",
    href: "/collections/statement-rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-INFLATEDCHARLOTTE-InflatedCharlotteRing-SS-Angled_040_new.png?v=1757697376&width=500&crop=center",
  },
  {
    name: "Signet Rings",
    href: "/collections/signet-rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Relaunch-PaveDiamondSignetPinkyRing-YG-OffFigureAngledView-PDP_new.png?v=1757697399&width=500&crop=center",
  },
  {
    name: "Diamond Rings",
    href: "/collections/diamond-rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-DiamondsBand-14k-Front_196_new.png?v=1757697293&width=500&crop=center",
  },
  {
    name: "Wedding Bands",
    href: "/collections/wedding-bands",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/stacker_ring_OffFigureAngledView_PDP.jpg?v=1763561719&width=500&crop=center",
  },
  {
    name: "Puzzle",
    href: "/collections/puzzle",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-PuzzleStackingRings_Garnet_V_OffFigAngledView_PDP_new_17278758-ea44-4dfc-a8fa-7dca1b3ee2a2.png?v=1758736424&width=500&crop=center",
  },
];

export const necklaceTiles: CategoryRailTile[] = [
  {
    name: "Necklaces",
    href: "/collections/necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Best Selling Necklaces",
    href: "/collections/best-selling-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0_LayeredOpalNecklace_SS_Hero_new.png?v=1757704378&width=500&crop=center",
  },
  {
    name: "Chain Necklaces",
    href: "/collections/chain-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0_Curb_Chain_Necklace_Silver_High_Polish_new.png?v=1757704378&width=500&crop=center",
  },
  {
    name: "Pendant Necklaces",
    href: "/collections/pendant-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-DiamondLetterCharm-14K-Front_007_new.png?v=1757697290&width=500&crop=center",
  },
  {
    name: "Pearl Beaded Necklaces",
    href: "/collections/pearl-beaded-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-HIGHSUMMERSHELLSBEADS-PearlNecklacewithVermeilEnhancer-V-Front_018_new.png?v=1758073135&width=500&crop=center",
  },
  {
    name: "Diamond Necklaces",
    href: "/collections/diamond-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-DiamondNecklace_SoloDiamondNecklace_FrontView_WG_085_new.png?v=1757697295&width=500&crop=center",
  },
  {
    name: "Tennis Necklace Jewelry",
    href: "/collections/tennis-necklace-jewelry",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-LGS3mmNecklaceSilver-SS-Front_39020231103-8319-134y1sv_new.png?v=1757704407&width=500&crop=center",
  },
  {
    name: "Charm Necklaces",
    href: "/collections/charm-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Copy_of_05-Puzzle_Slider_Charm-May-001_2160x2580_ec4baa80-2e75-4450-8098-a72fd76beef2.jpg?v=1774453230&width=500&crop=center",
  },
];

export const braceletTiles: CategoryRailTile[] = [
  {
    name: "Bracelets",
    href: "/collections/bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-SiaBirthstoneBracelet_05_May_LabGrownEmerald_OffFigureTopDownView_PDP.jpg?v=1764254713&width=500&crop=center",
  },
  {
    name: "Best Selling Bracelets",
    href: "/collections/best-selling-bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-BoyfriendBoldBracelet-14K-TopDown_004_new_a2ea289e-73cb-435d-be39-c168ff8725db.png?v=1758047620&width=500&crop=center",
  },
  {
    name: "Chain Bracelets",
    href: "/collections/chain-bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-SILVERBESTSELLERLES-SerpentineChainBraceletSilver-SS-TopDown_450_new.png?v=1758073132&width=500&crop=center",
  },
  {
    name: "Cuffs And Bangles",
    href: "/collections/cuffs-and-bangles",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Reshoot_DomeCuffBracelet_V_OffFigureFrontViewDomeCuff_PDP_new_c320cabc-de13-467b-b6cb-6f8460f6902a.png?v=1758736682&width=500&crop=center",
  },
  {
    name: "Pearl Beaded Bracelets",
    href: "/collections/pearl-beaded-bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/PearlMultiStationBracelet_YG_OffFigure_TopDown-PDP_1.jpg?v=1780077460&width=500&crop=center",
  },
  {
    name: "Diamond Bracelets",
    href: "/collections/diamond-bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/DiamondLetter_Bracelet_YG_Overhead_new.png?v=1759165240&width=500&crop=center",
  },
  {
    name: "Tennis Bracelet Jewelry",
    href: "/collections/tennis-bracelet-jewelry",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-RESHOOT-LabGrownSapphireTennis_Bracelet-SS-Front_119_new.png?v=1758073135&width=500&crop=center",
  },
  {
    name: "Charm Bracelets",
    href: "/collections/charm-bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Heart_TwoOfHeartsBracelet_V_OffFigureTopDownView.jpg?v=1765913386&width=500&crop=center",
  },
];

export const charmTiles: CategoryRailTile[] = [
  {
    name: "Charms And Pendants",
    href: "/collections/charms-and-pendants",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Copy_of_05-Puzzle_Slider_Charm-May-001_2160x2580_ec4baa80-2e75-4450-8098-a72fd76beef2.jpg?v=1774453230&width=500&crop=center",
  },
  {
    name: "Charms",
    href: "/collections/charms",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-DiamondLetterCharm-14K-Front_007_new.png?v=1757697290&width=500&crop=center",
  },
  {
    name: "Pendants",
    href: "/collections/pendants",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-BIRTHSTONEPENDANTS-BirthstonePendantDecemberBlueTopaz-14K-Front_231_new.png?v=1757616936&width=500&crop=center",
  },
  {
    name: "Personalized",
    href: "/collections/personalized",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Cursive_14k_Letter_Pendants_FrontView_A_copy_new.png?v=1758073348&width=500&crop=center",
  },
  {
    name: "Birthstones",
    href: "/collections/birthstone-zodiac",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-BIRTHSTONEPENDANTS-BirthstonePendantDecemberBlueTopaz-14K-Front_231_new.png?v=1757616936&width=500&crop=center",
  },
];

export const newTiles: CategoryRailTile[] = [
  {
    name: "All New",
    href: "/collections/new",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-GoodLuckCharms_CarmenBeadedNecklace_LondonBlueTopaz_OffFigureFrontView_PDP.jpg?v=1777566568&width=500&crop=center",
  },
  {
    name: "New Earrings",
    href: "/collections/new-earrings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-SimoneDropEarringsOffFigureAngledView2160x2580.jpg?v=1774968762&width=500&crop=center",
  },
  {
    name: "New Rings",
    href: "/collections/new-rings",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-LACEYLABGROWNSAPPHIRERINGSilver_0012580x2160_68e3df80-8bb8-41d3-92da-2e9529092036.jpg?v=1769798021&width=500&crop=center",
  },
  {
    name: "New Necklaces",
    href: "/collections/new-necklaces",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-Cosmos_MiniFlowerStationBracelet_14K_OffFigureTopDownView_PDP.jpg?v=1774967878&width=500&crop=center",
  },
  {
    name: "New Bracelets",
    href: "/collections/new-bracelets",
    image: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-SiaBirthstoneBracelet_05_May_LabGrownEmerald_OffFigureTopDownView_PDP.jpg?v=1764254713&width=500&crop=center",
  },
];

export function getCollectionRailConfig(slug: string): CategoryRailConfig | null {
  if (slug === "shop-all") {
    return {
      breadcrumbs: [],
      tiles: shopAllTiles,
    };
  }

  if (slug === "earrings") {
    return {
      breadcrumbs: [{ label: "Shop All", href: "/collections/shop-all" }],
      tiles: earringTiles,
    };
  }

  const parentGroups = [
    { parentSlug: "rings", parentLabel: "Rings", tiles: ringTiles, slugs: ringTiles.map((tile) => tile.href.split("/").pop() || "") },
    { parentSlug: "necklaces", parentLabel: "Necklaces", tiles: necklaceTiles, slugs: necklaceTiles.map((tile) => tile.href.split("/").pop() || "") },
    { parentSlug: "bracelets", parentLabel: "Bracelets", tiles: braceletTiles, slugs: braceletTiles.map((tile) => tile.href.split("/").pop() || "") },
    { parentSlug: "charms-and-pendants", parentLabel: "Charms And Pendants", tiles: charmTiles, slugs: charmTiles.map((tile) => tile.href.split("/").pop() || "") },
    { parentSlug: "new", parentLabel: "New In", tiles: newTiles, slugs: newTiles.map((tile) => tile.href.split("/").pop() || "") },
  ];

  for (const group of parentGroups) {
    if (slug === group.parentSlug) {
      return {
        breadcrumbs: [{ label: "Shop All", href: "/collections/shop-all" }],
        tiles: group.tiles,
      };
    }

    if (group.slugs.includes(slug)) {
      return {
        breadcrumbs: [
          { label: "Shop All", href: "/collections/shop-all" },
          { label: group.parentLabel, href: `/collections/${group.parentSlug}` },
        ],
        tiles: group.tiles,
      };
    }
  }

  const hoopSlugs = new Set([
    "hoop-earrings",
    "huggie-earrings",
    "small-hoops",
    "medium-hoops",
    "large-hoops",
    "oversized-hoops",
    "charm-compatible-hoops",
    "hoop-charms",
    "cartilage-helix",
  ]);

  if (hoopSlugs.has(slug)) {
    return {
      breadcrumbs: [
        { label: "Shop All", href: "/collections/shop-all" },
        { label: "Earrings", href: "/collections/earrings" },
      ],
      tiles: hoopTiles,
    };
  }

  return null;
}
