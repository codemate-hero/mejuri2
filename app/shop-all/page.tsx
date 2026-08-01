import type { Metadata } from "next";
import { ShopLayout } from "@/components/ShopLayout";
import { shopAllConfig } from "@/data/shopConfigs";

export const metadata: Metadata = {
  title: "Shop All Jewelry – Gold, Silver, Diamonds & More | Mejuri",
};

export default function ShopAllPage() {
  return <ShopLayout config={shopAllConfig} />;
}
