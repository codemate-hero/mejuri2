"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

type PayPalCardField = {
  render: (container: string | HTMLElement) => Promise<void>;
};

type PayPalCardFields = {
  isEligible: () => boolean;
  NameField: () => PayPalCardField;
  NumberField: () => PayPalCardField;
  ExpiryField: () => PayPalCardField;
  CVVField: () => PayPalCardField;
  submit: () => Promise<void>;
  close?: () => void;
};

type PayPalWindow = Window & {
  paypal?: {
    CardFields: (options: {
      style?: Record<string, Record<string, string>>;
      createOrder: () => Promise<string>;
      onApprove: (data: { orderID: string }) => Promise<void>;
      onError: (error: unknown) => void;
    }) => PayPalCardFields;
  };
};

type KlarnaCheckoutData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  emirate?: string;
  postalCode?: string;
  dob?: string;
};

const getSavedCheckoutData = (): KlarnaCheckoutData => {
  if (typeof window === "undefined") return {};

  const raw = window.sessionStorage.getItem("klarnaCheckoutData");
  if (!raw) return {};

  try {
    return JSON.parse(raw) as KlarnaCheckoutData;
  } catch {
    return {};
  }
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`,
});

export default function KlarnaPayPalPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<KlarnaCheckoutData>({});
  const [wrapperSource, setWrapperSource] = useState("Klarna");
  const [paypalConfig, setPayPalConfig] = useState<{ clientId: string; currency: string } | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [paypalCardFields, setPaypalCardFields] = useState<PayPalCardFields | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const createOrderRef = useRef<() => Promise<string>>(async () => "");
  const captureOrderRef = useRef<(orderId: string) => Promise<void>>(async () => {});
  const onErrorRef = useRef<(message: string | null) => void>(() => {});
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const numberFieldRef = useRef<HTMLDivElement>(null);
  const expiryFieldRef = useRef<HTMLDivElement>(null);
  const cvvFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      setCheckoutData(getSavedCheckoutData());
      setWrapperSource(
        window.sessionStorage.getItem("paypalWrapperSource") || "Klarna"
      );
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/paypal/config");
        const data = await res.json();
        if (res.ok && data.clientId) {
          setPayPalConfig(data);
          return;
        }
        setCheckoutError(data.message || "PayPal is not configured.");
      } catch (error) {
        setCheckoutError(error instanceof Error ? error.message : "Unable to load PayPal config.");
      }
    }

    loadConfig();
  }, []);

  const paypalScriptUrl = useMemo(() => {
    if (!paypalConfig) return null;
    const params = new URLSearchParams({
      "client-id": paypalConfig.clientId,
      components: "card-fields",
      currency: paypalConfig.currency,
      intent: "capture",
    });
    return `https://www.paypal.com/sdk/js?${params.toString()}`;
  }, [paypalConfig]);

  useEffect(() => {
    if (!paypalScriptUrl) return;

    let attempts = 0;
    const detectPayPalSdk = () => {
      attempts += 1;

      if ((window as PayPalWindow).paypal?.CardFields) {
        setSdkReady(true);
        setCheckoutError(null);
        return true;
      }

      if (attempts >= 50) {
        setCheckoutError(
          "PayPal secure fields did not load. Please check your connection and try again."
        );
        return true;
      }

      return false;
    };

    if (detectPayPalSdk()) return;

    const intervalId = window.setInterval(() => {
      if (detectPayPalSdk()) {
        window.clearInterval(intervalId);
      }
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [paypalScriptUrl]);

  const shippingAddress = useCallback(() => ({
    fullName: `${checkoutData.firstName ?? ""} ${checkoutData.lastName ?? ""}`.trim(),
    phone: checkoutData.phone,
    addressLine1: checkoutData.address,
    city: checkoutData.city,
    state: checkoutData.emirate,
    postalCode: checkoutData.postalCode,
  }), [checkoutData]);

  const createOrder = useCallback(async () => {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        currency: paypalConfig?.currency || "USD",
        paymentSource: "card",
        shippingAddress: shippingAddress(),
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.paypalOrderId) {
      throw new Error(data.message || "Unable to create PayPal card payment.");
    }
    return data.paypalOrderId as string;
  }, [paypalConfig?.currency, shippingAddress]);

  const captureOrder = useCallback(async (orderId: string) => {
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalOrderId: orderId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "PayPal card payment could not be completed.");
    }
    window.location.assign(`/payment-success?order_id=${data.orderId}`);
  }, []);

  useEffect(() => {
    createOrderRef.current = createOrder;
    captureOrderRef.current = captureOrder;
    onErrorRef.current = setPaymentError;
  }, [createOrder, captureOrder]);

  useEffect(() => {
    const paypal = (window as PayPalWindow).paypal;
    const fieldContainers = [
      nameFieldRef.current,
      numberFieldRef.current,
      expiryFieldRef.current,
      cvvFieldRef.current,
    ];

    if (
      !sdkReady ||
      !paypal?.CardFields ||
      fieldContainers.some((container) => !container)
    ) {
      return;
    }

    let active = true;
    const cardFields = paypal.CardFields({
      style: {
        input: {
          "font-size": "15px",
          color: "#111111",
          "font-family": "Inter, sans-serif",
          height: "54px",
          "line-height": "54px",
          padding: "0 14px",
          border: "none",
          "border-radius": "0",
          background: "transparent",
          outline: "none",
          "box-shadow": "none",
        },
        ":focus": {
          border: "none",
          outline: "none",
          "box-shadow": "none",
        },
        ".valid": {
          border: "none",
          outline: "none",
          "box-shadow": "none",
        },
        ".invalid": {
          color: "#d23f4f",
          border: "none",
          outline: "none",
          "box-shadow": "none",
        },
      },
      createOrder: () => createOrderRef.current(),
      onApprove: ({ orderID }) => captureOrderRef.current(orderID),
      onError: (error) => {
        const message = error instanceof Error ? error.message : "PayPal card payment failed.";
        onErrorRef.current(message);
      },
    });

    if (!cardFields.isEligible()) {
      onErrorRef.current(
        "This PayPal sandbox app is not eligible for Advanced Card Payments. Enable it in the app's Accept payments settings."
      );
      return;
    }

    Promise.all([
      cardFields.NameField().render(nameFieldRef.current!),
      cardFields.NumberField().render(numberFieldRef.current!),
      cardFields.ExpiryField().render(expiryFieldRef.current!),
      cardFields.CVVField().render(cvvFieldRef.current!),
    ])
      .then(() => {
        if (active) setPaypalCardFields(cardFields);
      })
      .catch((error) => {
        onErrorRef.current(
          error instanceof Error ? error.message : "Unable to load PayPal card fields."
        );
      });

    return () => {
      active = false;
      setPaypalCardFields(null);
      cardFields.close?.();
    };
  }, [sdkReady]);

  const fieldClass =
    "relative h-[56px] w-full overflow-hidden rounded-[7px] border border-[#b7b7b7] bg-white focus-within:border-[#0070ba] focus-within:ring-2 focus-within:ring-[#0070ba]/20 [&>iframe]:pointer-events-auto [&>iframe]:relative [&>iframe]:z-10 [&>iframe]:block [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0";

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-4 py-6 text-black">
      <div className="mx-auto max-w-[470px]">
        <div className="rounded-[24px] border border-[#d6d6d6] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold">PayPal Checkout</h1>
              <p className="mt-2 text-[15px] text-[#555]">
                Complete payment using your saved {wrapperSource} checkout details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-[14px] font-semibold underline"
            >
              Back
            </button>
          </div>

          <div className="mb-6 space-y-3 rounded-[16px] border border-[#e0e0e0] bg-[#fafafa] p-4">
            <p className="text-sm text-[#555]">Shipping details</p>
            <p className="font-semibold">{checkoutData.firstName} {checkoutData.lastName}</p>
            <p className="text-sm text-[#555]">{checkoutData.email}</p>
            <p className="text-sm text-[#555]">{checkoutData.phone}</p>
            <p className="text-sm text-[#555]">{checkoutData.address}</p>
          </div>

          {paypalScriptUrl ? (
            <Script
              id="paypal-wrapper-sdk"
              src={paypalScriptUrl}
              onLoad={() => setSdkReady(true)}
              onReady={() => setSdkReady(true)}
              onError={() => setCheckoutError("Unable to load PayPal SDK.")}
            />
          ) : null}

          <div className="border-b border-[#d9d9d9] bg-[#f4f4f4] p-[18px]">
            <div className="relative rounded-[5px] border border-[#d9d9d9] bg-white p-4">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#666]">
                Name on card
              </label>
              <div
                ref={nameFieldRef}
                id="paypal-card-name"
                className={`${fieldClass} mb-4`}
              />

              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#666]">
                Card details
              </label>
              <div
                ref={numberFieldRef}
                id="paypal-card-number"
                className={fieldClass}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div
                  ref={expiryFieldRef}
                  id="paypal-card-expiry"
                  className={fieldClass}
                />
                <div
                  ref={cvvFieldRef}
                  id="paypal-card-cvv"
                  className={fieldClass}
                />
              </div>

              {!paypalCardFields && !paymentError ? (
                <p className="mt-4 text-sm text-[#555]">Loading secure payment form…</p>
              ) : null}

              {paymentError ? (
                <p className="mt-4 text-sm text-red-600">{paymentError}</p>
              ) : null}
            </div>
          </div>

          {checkoutError ? (
            <p className="mt-4 text-sm text-red-600">{checkoutError}</p>
          ) : null}

          <button
            type="button"
            onClick={async () => {
              if (!paypalCardFields) {
                setPaymentError("PayPal secure card form is not ready. Please refresh the page.");
                return;
              }
              setPaymentProcessing(true);
              setPaymentError(null);
              try {
                await paypalCardFields.submit();
              } catch (error) {
                setPaymentError(error instanceof Error ? error.message : "PayPal card payment failed.");
              } finally {
                setPaymentProcessing(false);
              }
            }}
            disabled={!paypalCardFields || paymentProcessing}
            className="mt-6 w-full rounded-[16px] bg-[#0070ba] py-4 text-[16px] font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {paymentProcessing ? "Processing…" : "Pay with PayPal"}
          </button>
        </div>
      </div>
    </main>
  );
}
