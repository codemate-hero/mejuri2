"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
type PaymentData = { paymentMethodData: unknown };
type GooglePayConfig = {
  allowedPaymentMethods: unknown[];
  merchantInfo: Record<string, unknown>;
};
type PaymentAuthorizationResult = {
  transactionState: "SUCCESS" | "ERROR";
  error?: { intent: string; reason: string; message: string };
};
type PaymentsClient = {
  isReadyToPay: (request: unknown) => Promise<{ result?: boolean }>;
  loadPaymentData: (request: unknown) => Promise<unknown>;
};

type GooglePayWindow = Window & {
  google?: {
    payments?: {
      api: {
        PaymentsClient: new (options: {
          environment: string;
          paymentDataCallbacks?: {
            onPaymentAuthorized: (paymentData: PaymentData) => Promise<PaymentAuthorizationResult>;
          };
        }) => PaymentsClient;
      };
    };
  };
  paypal?: {
    Googlepay?: () => {
      config: () => Promise<GooglePayConfig>;
      confirmOrder: (data: { orderId: string; paymentMethodData: unknown }) => Promise<{ status: string }>;
      initiatePayerAction: (data: { orderId: string }) => Promise<unknown>;
    };
  };
};

interface GooglePayProps {
  subtotal: number;
  paypalSdkReady: boolean;
}


export default function GooglePay({
  subtotal,
  paypalSdkReady,
}: GooglePayProps) {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const configRef = useRef<GooglePayConfig | null>(null);
  const paymentsClientRef = useRef<PaymentsClient | null>(null);
  const router = useRouter();
  const totalPrice = Math.max(subtotal, 0).toFixed(2);

  useEffect(() => {
    let mounted = true;

    const loadGooglePay = async () => {
      if (typeof window === "undefined") return;

      const googleWindow = window as GooglePayWindow;

      if (!googleWindow.google?.payments) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://pay.google.com/gp/p/js/pay.js";
          script.async = true;
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      if (!mounted) return;

      try {
        const paypalGooglePay = googleWindow.paypal?.Googlepay?.();
        if (!paypalGooglePay) {
          throw new Error("PayPal Google Pay is not available for this merchant.");
        }

        const googlePayConfig = await paypalGooglePay.config();
        configRef.current = googlePayConfig;

        const paymentsClient = new googleWindow.google!.payments!.api.PaymentsClient({
          environment: process.env.NEXT_PUBLIC_GOOGLE_PAY_ENV || "TEST",
          paymentDataCallbacks: {
            onPaymentAuthorized: async (paymentData) => {
              try {
                const orderResponse = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                  },
                  body: JSON.stringify({ paymentSource: "googlepay" }),
                });
                const order = await orderResponse.json();

                if (!orderResponse.ok || !order.paypalOrderId) {
                  throw new Error(order.message || "Unable to create a PayPal Google Pay order.");
                }

                const confirmation = await paypalGooglePay.confirmOrder({
                  orderId: order.paypalOrderId,
                  paymentMethodData: paymentData.paymentMethodData,
                });

                if (confirmation.status === "PAYER_ACTION_REQUIRED") {
                  await paypalGooglePay.initiatePayerAction({ orderId: order.paypalOrderId });
                } else if (confirmation.status !== "APPROVED") {
                  throw new Error(`Google Pay authorization returned ${confirmation.status}.`);
                }

                const captureResponse = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ paypalOrderId: order.paypalOrderId }),
                });
                const capture = await captureResponse.json();

                if (!captureResponse.ok) {
                  throw new Error(capture.message || "Unable to capture the Google Pay order.");
                }

                window.sessionStorage.setItem("mejuri-checkout-completed", "1");
                router.push(`/payment-success?order_id=${capture.orderId}`);
                return { transactionState: "SUCCESS" };
              } catch (authorizationError) {
                const message = authorizationError instanceof Error ? authorizationError.message : "Google Pay payment failed.";
                setError(message);
                return {
                  transactionState: "ERROR",
                  error: {
                    intent: "PAYMENT_AUTHORIZATION",
                    reason: "PAYMENT_DATA_INVALID",
                    message,
                  },
                };
              }
            },
          },
        });
        paymentsClientRef.current = paymentsClient;

        const readyToPayRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
        };

        const response = await paymentsClient.isReadyToPay(readyToPayRequest);
        if (!mounted) return;
        setIsReady(Boolean(response && response.result));
      } catch (error) {
        console.error("Google Pay readiness check failed", error);
        setError(error instanceof Error ? error.message : "Google Pay is unavailable.");
        setIsReady(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadGooglePay();

    return () => {
      mounted = false;
    };
  }, [paypalSdkReady, router]);

  const handleGooglePay = async () => {
    if (typeof window === "undefined") return;

    try {
      setError(null);
      const paymentsClient = paymentsClientRef.current;
      const googlePayConfig = configRef.current;
      if (!paymentsClient || !googlePayConfig) {
        throw new Error("PayPal Google Pay is not ready.");
      }

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
        merchantInfo: googlePayConfig.merchantInfo,
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice,
          currencyCode: "USD",
        },
        callbackIntents: ["PAYMENT_AUTHORIZATION"],
      };

      await paymentsClient.loadPaymentData(paymentDataRequest);
    } catch (error) {
      console.error("Google Pay failed", error);
      setError(error instanceof Error ? error.message : "Google Pay payment failed.");
    }
  };

  if (loading) {
    return (
      <button
        type="button"
        title={error || undefined}
        className={`flex h-[46px] w-full items-center justify-center gap-[10px] bg-black px-6 transition ${isReady ? "hover:bg-[#111]" : "cursor-not-allowed opacity-50"
          }`}
      >
        <svg className="w-[60px]" xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="xMidYMid" viewBox="0 0 126 50" focusable="false"><g fill-rule="evenodd" clip-path="url(#a)" clip-rule="evenodd"><path fill="#fff" d="M59.62 7.342v12.636h7.793q2.785 0 4.605-1.872c1.247-1.244 1.872-2.73 1.872-4.447q0-2.525-1.872-4.401-1.82-1.918-4.605-1.919H59.62zm0 17.083v14.657h-4.654V2.895h12.348q4.7 0 7.99 3.132 3.343 3.133 3.343 7.632c0 3.066-1.115 5.629-3.343 7.68-2.157 2.059-4.824 3.083-7.993 3.083h-7.69zm23.73 7.078q0 1.818 1.545 3.033c1.027.804 2.234 1.21 3.615 1.21 1.959 0 3.7-.724 5.236-2.17 1.538-1.451 2.302-3.153 2.302-5.106q-2.176-1.718-6.072-1.718c-1.887 0-3.466.458-4.728 1.368-1.266.91-1.897 2.034-1.897 3.383Zm6.023-17.996q5.16.002 8.148 2.754 2.982 2.758 2.984 7.558v15.263h-4.454v-3.435h-.2q-2.887 4.244-7.694 4.246-4.096-.002-6.855-2.427-2.757-2.427-2.758-6.065 0-3.843 2.91-6.116 2.909-2.274 7.767-2.274c2.76 0 5.042.504 6.827 1.516v-1.064q0-2.426-1.922-4.116a6.6 6.6 0 0 0-4.502-1.693c-2.6 0-4.655 1.092-6.174 3.287l-4.098-2.581q3.392-4.852 10.02-4.853m36.683.81L110.519 50h-4.806l5.769-12.484-10.219-23.198h5.06l7.387 17.791h.099l7.186-17.794z"></path><path fill="#4285F4" d="M40.81 21.267c0-1.464-.123-2.878-.359-4.228H20.818v8.01h11.247a9.62 9.62 0 0 1-4.16 6.319v5.199h6.713c3.93-3.62 6.192-8.975 6.192-15.3"></path><path fill="#34A853" d="M20.819 41.585c5.62 0 10.348-1.841 13.799-5.016l-6.713-5.203c-1.866 1.257-4.27 1.99-7.087 1.99-5.428 0-10.039-3.658-11.685-8.584H2.219v5.357a20.82 20.82 0 0 0 18.6 11.46"></path><path fill="#FABB05" d="M9.133 24.771a12.5 12.5 0 0 1 0-7.96v-5.356H2.219A20.7 20.7 0 0 0 0 20.788c0 3.358.805 6.53 2.219 9.337l6.914-5.357z"></path><path fill="#E94235" d="M20.818 8.229c3.07 0 5.818 1.052 7.985 3.12v.002l5.942-5.935C31.142 2.06 26.438 0 20.82 0A20.82 20.82 0 0 0 2.222 11.457l6.914 5.357c1.646-4.927 6.257-8.585 11.685-8.585"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h126v50H0z"></path></clipPath></defs></svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      title={error || undefined}
      onClick={handleGooglePay}
      disabled={!isReady}
      className={`flex h-[46px] w-full items-center justify-center gap-[10px] bg-black px-6 transition ${isReady ? "hover:bg-[#111]" : "cursor-not-allowed opacity-50"
        }`}
    >
      {/* Google G */}
      <svg className="w-[60px]" xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="xMidYMid" viewBox="0 0 126 50" focusable="false"><g fill-rule="evenodd" clip-path="url(#a)" clip-rule="evenodd"><path fill="#fff" d="M59.62 7.342v12.636h7.793q2.785 0 4.605-1.872c1.247-1.244 1.872-2.73 1.872-4.447q0-2.525-1.872-4.401-1.82-1.918-4.605-1.919H59.62zm0 17.083v14.657h-4.654V2.895h12.348q4.7 0 7.99 3.132 3.343 3.133 3.343 7.632c0 3.066-1.115 5.629-3.343 7.68-2.157 2.059-4.824 3.083-7.993 3.083h-7.69zm23.73 7.078q0 1.818 1.545 3.033c1.027.804 2.234 1.21 3.615 1.21 1.959 0 3.7-.724 5.236-2.17 1.538-1.451 2.302-3.153 2.302-5.106q-2.176-1.718-6.072-1.718c-1.887 0-3.466.458-4.728 1.368-1.266.91-1.897 2.034-1.897 3.383Zm6.023-17.996q5.16.002 8.148 2.754 2.982 2.758 2.984 7.558v15.263h-4.454v-3.435h-.2q-2.887 4.244-7.694 4.246-4.096-.002-6.855-2.427-2.757-2.427-2.758-6.065 0-3.843 2.91-6.116 2.909-2.274 7.767-2.274c2.76 0 5.042.504 6.827 1.516v-1.064q0-2.426-1.922-4.116a6.6 6.6 0 0 0-4.502-1.693c-2.6 0-4.655 1.092-6.174 3.287l-4.098-2.581q3.392-4.852 10.02-4.853m36.683.81L110.519 50h-4.806l5.769-12.484-10.219-23.198h5.06l7.387 17.791h.099l7.186-17.794z"></path><path fill="#4285F4" d="M40.81 21.267c0-1.464-.123-2.878-.359-4.228H20.818v8.01h11.247a9.62 9.62 0 0 1-4.16 6.319v5.199h6.713c3.93-3.62 6.192-8.975 6.192-15.3"></path><path fill="#34A853" d="M20.819 41.585c5.62 0 10.348-1.841 13.799-5.016l-6.713-5.203c-1.866 1.257-4.27 1.99-7.087 1.99-5.428 0-10.039-3.658-11.685-8.584H2.219v5.357a20.82 20.82 0 0 0 18.6 11.46"></path><path fill="#FABB05" d="M9.133 24.771a12.5 12.5 0 0 1 0-7.96v-5.356H2.219A20.7 20.7 0 0 0 0 20.788c0 3.358.805 6.53 2.219 9.337l6.914-5.357z"></path><path fill="#E94235" d="M20.818 8.229c3.07 0 5.818 1.052 7.985 3.12v.002l5.942-5.935C31.142 2.06 26.438 0 20.82 0A20.82 20.82 0 0 0 2.222 11.457l6.914 5.357c1.646-4.927 6.257-8.585 11.685-8.585"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h126v50H0z"></path></clipPath></defs></svg>
    </button>
  );
}
