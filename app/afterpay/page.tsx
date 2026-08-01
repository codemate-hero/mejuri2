"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createCheckoutUrl } from "@/app/lib/checkoutUrl";

type AfterpayCheckoutData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  emirate?: string;
  postalCode?: string;
  subtotal?: number;
};

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

type FieldErrors = Partial<
  Record<"firstName" | "lastName" | "email" | "phone", string>
>;

export default function AfterpayEntryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<number | null>(null);
  const [checkoutData, setCheckoutData] = useState<AfterpayCheckoutData>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pathname === "/afterpay") {
      router.replace(createCheckoutUrl("afterpay"));
    }
  }, [pathname, router]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      const savedData = window.sessionStorage.getItem("afterpayCheckoutData");
      if (!savedData) return;

      try {
        const parsedData = JSON.parse(savedData) as AfterpayCheckoutData;
        setCheckoutData(parsedData);
        setFirstName(parsedData.firstName || "");
        setLastName(parsedData.lastName || "");
        setEmail(parsedData.email || "");
        setPhone(parsedData.phone || "");
      } catch {
        setLoadError("We could not load your checkout details. Please return to checkout.");
      }
    });

    return () => {
      active = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();
    const nextErrors: FieldErrors = {};

    if (normalizedFirstName.length < 2) {
      nextErrors.firstName = "Enter your first name.";
    }

    if (normalizedLastName.length < 2) {
      nextErrors.lastName = "Enter your last name.";
    }

    if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!phonePattern.test(normalizedPhone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const validatedData = {
      ...checkoutData,
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      phone: normalizedPhone,
    };

    setErrors({});
    setIsLoading(true);
    window.sessionStorage.setItem(
      "afterpayCheckoutData",
      JSON.stringify(validatedData)
    );
    window.sessionStorage.setItem("klarnaCheckoutData", JSON.stringify(validatedData));
    window.sessionStorage.setItem("paypalWrapperSource", "Afterpay");

    timerRef.current = window.setTimeout(() => {
      router.push(createCheckoutUrl("afterpay/payment-gateway"));
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#111]">
      <section className="mx-auto min-h-screen w-full max-w-[532px] bg-white px-[30px] pb-12 pt-5 sm:px-[31px]">
        <header className="flex h-[52px] items-start justify-between border-b border-[#e4e4e4]">
          <div className="flex items-center gap-2">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] bg-[#00c943] text-[22px] font-black leading-none text-white">
              $
            </span>
            <span className="text-[23px] font-bold tracking-[-0.03em]">Afterpay</span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            aria-label="Close Afterpay"
            className="-mt-1 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f2f2f2]"
          >
            <X size={30} strokeWidth={2.1} />
          </button>
        </header>

        <div className="pt-6">
          <h1 className="text-[35px] font-bold leading-[1.1] tracking-[-0.035em]">
            Let&apos;s get started
          </h1>

          <form onSubmit={handleContinue} className="mt-9" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="afterpay-first-name" className="block text-[16px] font-bold">
                  First name
                </label>
                <input
                  id="afterpay-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setErrors((current) => ({ ...current, firstName: undefined }));
                  }}
                  aria-invalid={Boolean(errors.firstName)}
                  className="mt-2 h-[58px] w-full rounded-[11px] border border-[#929292] px-4 text-[17px] outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.firstName ? (
                  <p className="mt-1 text-sm text-[#c62828]">{errors.firstName}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="afterpay-last-name" className="block text-[16px] font-bold">
                  Last name
                </label>
                <input
                  id="afterpay-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                    setErrors((current) => ({ ...current, lastName: undefined }));
                  }}
                  aria-invalid={Boolean(errors.lastName)}
                  className="mt-2 h-[58px] w-full rounded-[11px] border border-[#929292] px-4 text-[17px] outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.lastName ? (
                  <p className="mt-1 text-sm text-[#c62828]">{errors.lastName}</p>
                ) : null}
              </div>
            </div>

            <label
              htmlFor="afterpay-email"
              className="mt-5 block text-[16px] font-bold leading-6"
            >
              Email address
            </label>
            <input
              id="afterpay-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "afterpay-email-error" : undefined}
              className="mt-2 h-[58px] w-full rounded-[11px] border border-[#929292] bg-white px-4 text-[17px] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            {errors.email ? (
              <p
                id="afterpay-email-error"
                role="alert"
                className="mt-2 text-sm text-[#c62828]"
              >
                {errors.email}
              </p>
            ) : null}

            <label htmlFor="afterpay-phone" className="mt-5 block text-[16px] font-bold">
              Phone number
            </label>
            <input
              id="afterpay-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setErrors((current) => ({ ...current, phone: undefined }));
              }}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "afterpay-phone-error" : undefined}
              className="mt-2 h-[58px] w-full rounded-[11px] border border-[#929292] bg-white px-4 text-[17px] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
            {errors.phone ? (
              <p id="afterpay-phone-error" role="alert" className="mt-2 text-sm text-[#c62828]">
                {errors.phone}
              </p>
            ) : null}

            {loadError ? (
              <p role="alert" className="mt-4 text-sm text-[#c62828]">
                {loadError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-7 flex h-[67px] w-full items-center justify-center rounded-full bg-black px-6 text-[18px] font-bold text-white transition hover:bg-[#222] disabled:cursor-wait disabled:opacity-80"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                  Loading…
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
