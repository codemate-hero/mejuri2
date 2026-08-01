import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Jewelry – Gold, Silver, Diamonds & More | Mejuri",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
