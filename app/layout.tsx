import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VYNN5LPC4V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VYNN5LPC4V');
          `}
        </Script>
      </body>
    </html>
  );
}
