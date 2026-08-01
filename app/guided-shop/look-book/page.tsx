import type { Metadata } from "next";
import { LookbookPage } from "@/components/LookbookPage";

export const metadata: Metadata = {
  title: "The Lookbook | Mejuri",
  description: "Jewelry you can live in, styled for every day and all night long.",
};

export default function Page() {
  return <LookbookPage />;
}
