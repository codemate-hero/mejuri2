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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W56MJPLG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NavigationRecovery />
        {children}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W56MJPLG');
          `}
        </Script>
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
