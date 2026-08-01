import type { Metadata } from "next";
import { NavigationRecovery } from "@/components/NavigationRecovery";
import { inter } from "@/app/fonts/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fine Jewelry For Every Day | Mejuri",
  description: "Discover thoughtfully designed fine jewelry for everyday moments. Shop engagement rings, earrings, necklaces, and more.",
};




  export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <NavigationRecovery />
        {children}
      </body>
    </html>
  );
}
