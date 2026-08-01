import type { Metadata } from "next";
import { getCategoryName, normalizeCollectionSlug } from "@/data/categoryMapping";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeCollectionSlug(slug);

  if (normalizedSlug === "shop-all") {
    return {
      title: "Shop All Jewelry – Gold, Silver, Diamonds & More | Mejuri",
    };
  }

  return {
    title: `${getCategoryName(normalizedSlug)} | Mejuri`,
  };
}

export default function CollectionLayout({ children }: Props) {
  return children;
}
