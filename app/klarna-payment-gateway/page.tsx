"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { KlarnaPaymentGatewayPageContent } from "./KlarnaPaymentGatewayPageContent";
import { createCheckoutUrl } from "@/app/lib/checkoutUrl";

export default function KlarnaPaymentGatewayPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/klarna-payment-gateway") {
      router.replace(createCheckoutUrl("klarna"));
    }
  }, [pathname, router]);

  const continueToPayment = () => {
    window.sessionStorage.setItem("paypalWrapperSource", "Klarna");
    router.push("/klarna-payment-gateway/paypal");
  };

  return <KlarnaPaymentGatewayPageContent onContinue={continueToPayment} />;
}
