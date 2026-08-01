"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function PayPalReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams.get("token");
  const [error, setError] = useState<string | null>(() =>
    paypalOrderId ? null : "PayPal did not return an order ID."
  );

  useEffect(() => {
    if (!paypalOrderId) {
      return;
    }

    async function capturePayment() {
      try {
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paypalOrderId }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "PayPal payment could not be completed.");
        }

        router.replace(`/payment-success?order_id=${data.orderId}`);
      } catch (captureError) {
        setError(
          captureError instanceof Error
            ? captureError.message
            : "PayPal payment could not be completed."
        );
      }
    }

    void capturePayment();
  }, [paypalOrderId, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
      <div>
        <h1 className="text-3xl font-bold">
          {error ? "Payment could not be completed" : "Completing your PayPal payment…"}
        </h1>
        {error ? (
          <>
            <p className="mt-4 text-red-600">{error}</p>
            <Link className="mt-6 inline-block underline" href="/checkout">
              Return to checkout
            </Link>
          </>
        ) : (
          <p className="mt-4 text-[#555]">Please do not close this page.</p>
        )}
      </div>
    </main>
  );
}

export default function PayPalReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
          <p>Loading PayPal payment…</p>
        </main>
      }
    >
      <PayPalReturnContent />
    </Suspense>
  );
}
