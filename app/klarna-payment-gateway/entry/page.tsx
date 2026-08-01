"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CircleHelp, X } from "lucide-react";
import { createCheckoutUrl } from "@/app/lib/checkoutUrl";

const details = [
  {
    title: "Full name",
    description: "Enter it exactly as it appears on your ID",
  },
  {
    title: "Date of birth and SSN",
    description: "Fix any typos",
  },
  {
    title: "Legal address",
  },
];

export default function KlarnaPaymentGatewayEntryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathname === "/klarna-payment-gateway/entry") {
      router.replace(createCheckoutUrl("klarna/entry"));
    }
  }, [pathname, router]);

  const handleContinue = () => {
    if (loading) return;
    setLoading(true);
    window.sessionStorage.setItem("paypalWrapperSource", "Klarna");

    window.setTimeout(() => {
      router.push("/klarna-payment-gateway/paypal");
    }, 2000);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/checkout");
  };

  return (
    <main className="min-h-[100dvh] bg-[#f4f4f6] text-[#0b001d]">
      <section className="mx-auto flex min-h-[100dvh] w-full max-w-[750px] flex-col bg-white px-7 pb-2 pt-7 sm:px-[30px]">
        <header className="grid grid-cols-3 items-center">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f3f3f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b001d]"
          >
            <ArrowLeft aria-hidden="true" size={30} strokeWidth={2.25} />
          </button>

          <div
            aria-label="Klarna"
            className="mx-auto rounded-[9px] bg-[#ffb3d1] px-2.5 py-1 text-[19px] font-bold leading-6 tracking-[-0.04em]"
          >
            Klarna
          </div>

          <button
            type="button"
            onClick={() => router.push("/checkout")}
            aria-label="Close"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f3f3f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b001d]"
          >
            <X aria-hidden="true" size={31} strokeWidth={2.2} />
          </button>
        </header>

        <div className="mt-4 flex flex-1 flex-col">
          <h1 className="text-[29px] font-bold leading-[1.15] tracking-[-0.025em] sm:text-[34px]">
            Let&apos;s make sure your details are up to date
          </h1>
          <p className="mt-2 text-[17px] leading-6 text-[#4f4a57] sm:text-[20px]">
            We couldn&apos;t verify your details. It only takes a minute.
          </p>

          <div className="mt-10">
            <h2 className="text-[27px] font-bold leading-tight tracking-[-0.02em]">
              Check your details:
            </h2>

            <ol className="mt-5">
              {details.map((detail, index) => (
                <li
                  key={detail.title}
                  className="grid grid-cols-[28px_1fr] gap-x-3"
                >
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <span
                      className={`mt-1.5 h-4 w-4 shrink-0 rounded-full ${
                        index === 0 ? "bg-[#0b001d]" : "bg-[#a7a6ad]"
                      }`}
                    />
                    {index < details.length - 1 && (
                      <span className="my-1.5 h-11 w-[2px] bg-[#aaa8ad]" />
                    )}
                  </div>
                  <div className={index < details.length - 1 ? "pb-4" : ""}>
                    <h3 className="text-[18px] font-bold leading-7 sm:text-[20px]">
                      {detail.title}
                    </h3>
                    {detail.description && (
                      <p className="text-[16px] leading-6 text-[#34303b] sm:text-[18px]">
                        {detail.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-10">
          <aside className="flex min-h-17 items-center gap-3 rounded-[20px] bg-[#e6e1fa] px-5 py-4 text-[16px] leading-6 sm:text-[18px]">
            <CircleHelp
              aria-hidden="true"
              className="shrink-0 fill-[#44348b] text-[#44348b]"
              size={23}
              strokeWidth={1.8}
            />
            <p>Enter the details exactly as shown on your ID</p>
          </aside>

          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="mt-5 flex min-h-16 w-full items-center justify-center rounded-full bg-[#0b001d] px-6 py-4 text-[18px] font-bold text-white transition hover:bg-[#24143b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b001d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </section>
    </main>
  );
}
