"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CART_UPDATED_EVENT = "mejuri-cart-updated";
const CHECKOUT_COMPLETED_FLAG = "mejuri-checkout-completed";

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasSuccessReference =
      Boolean(searchParams.get("order_id")) ||
      Boolean(searchParams.get("session_id")) ||
      window.sessionStorage.getItem(CHECKOUT_COMPLETED_FLAG) === "1";

    if (!hasSuccessReference) {
      return;
    }

    async function clearCompletedCheckoutCart() {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ clearCart: true }),
        });
      } catch (error) {
        console.log("Cart cleanup after checkout failed:", error);
      } finally {
        window.sessionStorage.removeItem(CHECKOUT_COMPLETED_FLAG);
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
    }

    void clearCompletedCheckoutCart();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Payment Successful</h1>
        <p className="mt-3 text-gray-600">Thank you for your order.</p>
        <Link href="/" className="mt-5 inline-block rounded bg-blue-600 px-4 py-2 text-white">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white text-black">
          <p>Loading payment status...</p>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
