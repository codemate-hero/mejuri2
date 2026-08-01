"use client";

import { ArrowLeft, Info } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

export type KlarnaPaymentGatewayPageContentProps = {
  onContinue?: () => void;
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

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function KlarnaPaymentGatewayPageContent({ onContinue }: KlarnaPaymentGatewayPageContentProps) {
  const [formValues, setFormValues] = useState<KlarnaCheckoutData>(getSavedCheckoutData);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [continueLoading, setContinueLoading] = useState(false);

  const updateField = (field: keyof KlarnaCheckoutData, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleContinue = () => {
    if (continueLoading) return;

    const email = (formValues.email ?? "").trim();
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError(null);
    window.sessionStorage.setItem("klarnaCheckoutData", JSON.stringify(formValues));
    setContinueLoading(true);
    if (onContinue) {
      onContinue();
    }
  };

  const accent = "#ffb3d1";
  const accentStrong = "#ff5ca8";

  const displayName = [formValues.firstName, formValues.lastName]
    .filter(Boolean)
    .join(" ") || "Arbab Memon";
  const displayEmail = formValues.email ?? "arbabmemonddev@gmail.com";

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-4 py-6 text-black">
      <div className="mx-auto max-w-[470px]">
        <header className="mb-7">
          <div className="flex items-center justify-between border-b border-[#d6d6d6] pb-8">
            <h1 className="text-[18px] font-bold tracking-[-0.01em]">
              Klarna - Pay flexibly
            </h1>

            <div className="rounded-[4px] bg-[#ffb3d1] px-3 py-2 text-[12px] font-bold">
              Klarna
            </div>
          </div>
        </header>

        <button className="mb-8 mt-5 flex items-center gap-1 text-[15px] font-semibold">
          <ArrowLeft size={18} />
          Login
        </button>

        <h2
          className="mb-7 text-[24px] font-bold tracking-[-0.03em]"
          style={{ fontFamily: "Italianplate, Helvetica, Arial, sans-serif" }}
        >
          Create an account
        </h2>

        <div className="rounded-[22px] border border-[#ffb3d1] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffb3d1] text-[22px] font-bold">
                K
              </div>

              <div>
                <h3 className="text-[18px] font-bold leading-none text-black">
                  {displayName}
                </h3>

                <p className="mt-2 text-[15px] text-[#777]">
                  {displayEmail}
                </p>
              </div>
            </div>

            <button className="text-[14px] font-bold underline">Edit</button>
          </div>

          <p className="mt-8 text-[15px] text-black">
            Enter your details to create an account.
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex gap-3">
              <div
                className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:ring-1"
                style={{ "--tw-ring-color": accentStrong } as CSSProperties}
              >
                <label className="block text-[14px] leading-none text-[#6d6d6d]">
                  First name
                </label>
                <input
                  type="text"
                  value={formValues.firstName ?? ""}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
                />
              </div>

              <div className="flex-1 rounded-[18px] border border-[#ff5ca8] bg-white px-5 py-3 ring-1 ring-[#ff5ca8]">
                <label className="block text-[14px] leading-none text-[#6d6d6d]">
                  Last name
                </label>
                <input
                  type="text"
                  value={formValues.lastName ?? ""}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div
                className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:ring-1"
                style={{ "--tw-ring-color": accentStrong } as CSSProperties}
              >
                <label className="block text-[14px] leading-none text-[#6d6d6d]">
                  Email address
                </label>
                <input
                  type="email"
                  value={formValues.email ?? ""}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
                />
                {emailError ? (
                  <p className="mt-2 text-[12px] text-red-600">{emailError}</p>
                ) : null}
              </div>

              <div
                className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:ring-1"
                style={{ "--tw-ring-color": accentStrong } as CSSProperties}
              >
                <label className="block text-[14px] leading-none text-[#6d6d6d]">
                  Mobile number
                </label>
                <input
                  type="tel"
                  value={formValues.phone ?? ""}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div
                className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:ring-1"
                style={{ "--tw-ring-color": accentStrong } as CSSProperties}
              >
                <label className="block text-[14px] leading-none text-[#6d6d6d]">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={formValues.dob ?? ""}
                  onChange={(event) => updateField("dob", event.target.value)}
                  className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
                />
              </div>

              <div
                className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:ring-1"
                style={{ "--tw-ring-color": accentStrong } as CSSProperties}
              >
                <label className="block text-[14px] leading-none text-[#6d6d6d]">
                  Residential address
                </label>
                <input
                  type="text"
                  value={formValues.address ?? ""}
                  onChange={(event) => updateField("address", event.target.value)}
                  className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
                />
              </div>
            </div>
          </div>

          <button className="mt-4 flex items-center gap-2 text-[13px] font-bold underline">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
              <Info size={12} />
            </span>
            Mobile terms and conditions
          </button>

          <p className="mt-7 text-[12px] leading-[20px] text-[#777]">
            By continuing, I agree to the {" "}
            <span className="font-bold text-[#2863c9] underline">Terms of Use</span>
            {" "}and{" "}
            <span className="font-bold text-[#2863c9] underline">Privacy Policy</span>
            {" "}including consent to electronic communications.
          </p>

          <button
            type="button"
            onClick={handleContinue}
            disabled={continueLoading}
            className="mt-6 w-full rounded-[16px] border-2 border-transparent py-5 text-[18px] font-bold text-black transition-colors hover:border-[#ff5ca8] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent }}
          >
            {continueLoading ? "Loading..." : "Continue"}
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-6 text-[14px] font-semibold">
          <span>� 2026 Klarna</span>
          <button className="underline">Terms</button>
          <button className="underline">Privacy policy</button>
        </div>
      </div>
    </main>
  );
}
