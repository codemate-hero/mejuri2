"use client";

import Image from "next/image";
import Script from "next/script";
import {
  ChevronDown,
  HelpCircle,
  Info,
  Search,
  ShoppingBag,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCheckoutForm, useGoogleAddressAutocomplete } from "./checkout-hooks";
import GooglePay from "@/components/GooglePay";
import { createCheckoutUrl } from "@/app/lib/checkoutUrl";
import type {
  AddressSuggestion,
  CheckoutField,
  ContactSuggestion,
} from "./checkout-utils";

const googlePlacesApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

type PayPalCardField = {
  render: (selector: string) => Promise<void>;
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

const countries = [
  "Bulgaria",
  "Canada",
  "Czechia",
  "Denmark",
  "Hong Kong SAR",
  "Hungary",
  "Indonesia",
  "Japan",
  "Malaysia",
  "Mexico",
  "New Zealand",
  "Norway",
  "Philippines",
  "Poland",
  "Qatar",
  "Romania",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Sweden",
  "Taiwan",
  "Thailand",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
];

const usCities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "Jacksonville",
  "Austin",
  "Fort Worth",
  "San Jose",
  "Columbus",
  "Charlotte",
  "Indianapolis",
  "San Francisco",
  "Seattle",
  "Denver",
  "Oklahoma City",
  "Nashville",
  "Washington",
  "El Paso",
  "Las Vegas",
  "Boston",
  "Detroit",
  "Portland",
  "Louisville",
  "Memphis",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Atlanta",
  "Miami",
  "Raleigh",
  "Omaha",
  "Minneapolis",
  "Cleveland",
  "New Orleans",
  "Tampa",
  "Honolulu",
];

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

const recommendations = [
  {
    title: "Jewelry Care Kit",
    desc: "50ml",
    price: "$30.00",
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/JewelryCareKit_ContentCard_1080x1296_73f42b30-d83c-42da-9973-ee6f475abb50.jpg?v=1760500143&width=200&crop=center",
  },
  {
    title: "Single Mini Hoop",
    desc: "10k Yellow Gold",
    price: "$98.00",
    image:
      "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/0-SingleMiniHoop-WG-OffFigureAngledView-PDP_new.png?v=1757697388&width=200&crop=center",
  },
  {
    title: "Travel Case",
    desc: "Black Grain Leather, Anti-tarnish Microsuede",
    price: "$128.00",
    image: "/gift.webp",
  },
];

type CartItem = {
  productId: string;
  title: string;
  handle: string;
  image: string | null;
  variantId: string | number;
  variantTitle: string | null;
  price: number;
  quantity: number;
  total: number;
};

type CartResponse = {
  items: CartItem[];
  subtotal: number;
};

function money(value: number, currency = "$") {
  return `${currency}${value.toFixed(2)}`;
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  if (!children && !value) {
    return (
      <div className="relative h-[61px] rounded-[5px] border border-[#d9d9d9] bg-white px-3">
        <input
          placeholder=" "
          className="peer h-full w-full bg-transparent pt-5 text-[14px] leading-none outline-none"
        />
        <label className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] leading-none text-[#666] transition-all peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[12px]">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="relative h-[61px] rounded-[5px] border border-[#d9d9d9] bg-white px-3 pt-2">
      <label className="block text-[12px] leading-[16px] text-[#666]">
        {label}
      </label>
      {children || (
        <input
          defaultValue={value}
          className="mt-1 w-full bg-transparent text-[14px] leading-none outline-none"
        />
      )}
    </div>
  );
}

function InlineError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-1 text-[12px] leading-[16px] text-red-600">
      {message}
    </p>
  );
}

function CheckoutTextField({
  field,
  label,
  value,
  error,
  onChange,
  inputMode,
  autoComplete,
  hasRightIcon = false,
}: {
  field: CheckoutField;
  label: string;
  value: string;
  error?: string;
  onChange: (field: CheckoutField, value: string) => void;
  inputMode?: "email" | "numeric" | "text";
  autoComplete?: string;
  hasRightIcon?: boolean;
}) {
  const errorId = `${field}-error`;

  return (
    <div>
      <div
        className={`relative h-[61px] rounded-[5px] border bg-white px-3 ${error ? "border-red-600" : "border-[#d9d9d9]"
          }`}
      >
        <input
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
          placeholder=" "
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`peer h-full w-full bg-transparent pt-5 text-[14px] leading-none outline-none ${hasRightIcon ? "pr-10" : ""
            }`}
        />
        <label
          className={`pointer-events-none absolute left-3 text-[14px] leading-none text-[#666] transition-all ${value
            ? "top-3 translate-y-0 text-[12px]"
            : "top-1/2 -translate-y-1/2 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[12px]"
            }`}
        >
          {label}
        </label>
      </div>
      <InlineError id={errorId} message={error} />
    </div>
  );
}

function ContactSuggestionField({
  field,
  suggestionField,
  label,
  value,
  error,
  onChange,
  getSuggestions,
  applySuggestion,
  inputMode,
  autoComplete,
  hasRightIcon = false,
}: {
  field: CheckoutField;
  suggestionField: keyof ContactSuggestion;
  label: string;
  value: string;
  error?: string;
  onChange: (field: CheckoutField, value: string) => void;
  getSuggestions: (
    field: keyof ContactSuggestion,
    value: string
  ) => ContactSuggestion[];
  applySuggestion: (contact: ContactSuggestion) => void;
  inputMode?: "email" | "numeric" | "text";
  autoComplete?: string;
  hasRightIcon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = `${field}-error`;
  const listId = `${field}-suggestions`;
  const suggestions = open ? getSuggestions(suggestionField, value).slice(0, 4) : [];

  const chooseSuggestion = (contact: ContactSuggestion) => {
    applySuggestion(contact);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div
        className={`relative h-[61px] rounded-[5px] border bg-white px-3 ${error ? "border-red-600" : "border-[#d9d9d9]"
          }`}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            onChange(field, event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(event) => {
            if (!suggestions.length) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % suggestions.length);
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex(
                (index) => (index - 1 + suggestions.length) % suggestions.length
              );
            }

            if (event.key === "Enter" && open) {
              event.preventDefault();
              chooseSuggestion(suggestions[activeIndex]);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder=" "
          inputMode={inputMode}
          autoComplete={autoComplete}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-activedescendant={
            open && suggestions[activeIndex]
              ? `${field}-suggestion-${activeIndex}`
              : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`peer h-full w-full bg-transparent pt-5 text-[14px] leading-none outline-none ${hasRightIcon ? "pr-10" : ""
            }`}
        />
        <label
          className={`pointer-events-none absolute left-3 text-[14px] leading-none text-[#666] transition-all ${value
            ? "top-3 translate-y-0 text-[12px]"
            : "top-1/2 -translate-y-1/2 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[12px]"
            }`}
        >
          {label}
        </label>
      </div>

      {open && suggestions.length ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[65px] z-30 overflow-hidden rounded-[5px] border border-[#d9d9d9] bg-white shadow-lg"
        >
          {suggestions.map((contact, index) => (
            <button
              key={`${contact.email}-${field}`}
              id={`${field}-suggestion-${index}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseSuggestion(contact)}
              className={`block w-full cursor-pointer px-3 py-3 text-left text-[14px] ${activeIndex === index ? "bg-[#f4f4f4]" : "bg-white"
                }`}
            >
              <span className="block font-bold">
                {contact.firstName} {contact.lastName}
              </span>
              <span className="block text-[12px] text-[#666]">
                {contact.email} · {contact.phone}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <InlineError id={errorId} message={error} />
    </div>
  );
}

function AddressAutocompleteField({
  value,
  error,
  onChange,
  onSelect,
}: {
  value: string;
  error?: string;
  onChange: (field: CheckoutField, value: string) => void;
  onSelect: (address: AddressSuggestion) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { options, resolveGoogleAddress } = useGoogleAddressAutocomplete(value);
  const errorId = "address-error";
  const listId = "address-suggestions";
  const visibleOptions = open ? options.slice(0, 5) : [];

  const chooseAddress = async (index: number) => {
    const option = visibleOptions[index];

    if (!option) {
      return;
    }

    const resolvedAddress = await resolveGoogleAddress(option);
    onSelect(resolvedAddress);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div
        className={`relative h-[61px] rounded-[5px] border bg-white px-3 ${error ? "border-red-600" : "border-[#d9d9d9]"
          }`}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            onChange("address", event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(event) => {
            if (!visibleOptions.length) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % visibleOptions.length);
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex(
                (index) =>
                  (index - 1 + visibleOptions.length) % visibleOptions.length
              );
            }

            if (event.key === "Enter" && open) {
              event.preventDefault();
              void chooseAddress(activeIndex);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder=" "
          autoComplete="street-address"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && visibleOptions.length > 0}
          aria-controls={listId}
          aria-activedescendant={
            open && visibleOptions[activeIndex]
              ? `address-suggestion-${activeIndex}`
              : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="peer h-full w-full bg-transparent pr-9 pt-5 text-[14px] leading-none outline-none"
        />
        <label
          className={`pointer-events-none absolute left-3 text-[14px] leading-none text-[#666] transition-all ${value
            ? "top-3 translate-y-0 text-[12px]"
            : "top-1/2 -translate-y-1/2 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[12px]"
            }`}
        >
          Address
        </label>
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666]" />
      </div>

      {open && visibleOptions.length ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[65px] z-30 overflow-hidden rounded-[5px] border border-[#d9d9d9] bg-white shadow-lg"
        >
          {visibleOptions.map((option, index) => (
            <button
              key={`${option.label}-${"placeId" in option && option.placeId ? option.placeId : index
                }`}
              id={`address-suggestion-${index}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void chooseAddress(index)}
              className={`block w-full cursor-pointer px-3 py-3 text-left text-[14px] ${activeIndex === index ? "bg-[#f4f4f4]" : "bg-white"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <InlineError id={errorId} message={error} />
    </div>
  );
}

export default function CheckoutPage() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/checkout") return;

    router.replace(createCheckoutUrl());
  }, [pathname, router]);

  if (pathname === "/checkout") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <span
          aria-label="Loading checkout"
          className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black"
        />
      </main>
    );
  }

  return <CheckoutForm />;
}

function CheckoutForm() {
  const router = useRouter();
  const checkoutForm = useCheckoutForm();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paypalConfig, setPayPalConfig] = useState<{
    clientId: string;
    currency: string;
  } | null>(null);
  const [paypalSdkReady, setPayPalSdkReady] = useState(false);
  const [paypalCardFields, setPayPalCardFields] = useState<PayPalCardFields | null>(null);

  useEffect(() => {
    return () => {
      window.sessionStorage.setItem("mejuri-returning-from-checkout", "1");
    };
  }, []);

  useEffect(() => {
    async function loadCartAndPayPalConfig() {
      try {
        const [cartRes, configRes] = await Promise.all([
          fetch("/api/cart", { headers: getAuthHeaders() }),
          fetch("/api/paypal/config"),
        ]);
        const [cartData, configData] = await Promise.all([
          cartRes.json(),
          configRes.json(),
        ]);

        if (cartRes.ok) {
          setCart({
            items: cartData.items || [],
            subtotal: Number(cartData.subtotal || 0),
          });
        }

        if (configRes.ok && configData.clientId) {
          setPayPalConfig(configData);
        } else {
          setCheckoutError(configData.message || "PayPal is not configured.");
        }
      } catch (error) {
        console.log("Checkout cart error:", error);
        setCheckoutError(
          error instanceof Error ? error.message : "Unable to initialize payment form."
        );
      }
    }

    loadCartAndPayPalConfig();
  }, []);

  const paypalScriptUrl = useMemo(() => {
    if (!paypalConfig) return null;

    const params = new URLSearchParams({
      "client-id": paypalConfig.clientId,
      components: "card-fields,googlepay",
      currency: paypalConfig.currency,
      intent: "capture",
    });

    return `https://www.paypal.com/sdk/js?${params.toString()}`;
  }, [paypalConfig]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  const shippingAddress = () => ({
    fullName: `${checkoutForm.values.firstName} ${checkoutForm.values.lastName}`.trim(),
    phone: checkoutForm.values.phone,
    addressLine1: checkoutForm.values.address,
    city: checkoutForm.values.city,
    state: checkoutForm.values.emirate,
    postalCode: checkoutForm.values.postalCode,
  });

  const createPayPalCardOrder = async () => {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        currency: "USD",
        paymentSource: "card",
        shippingAddress: shippingAddress(),
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.paypalOrderId) {
      throw new Error(data.message || "Unable to create PayPal card payment.");
    }

    return data.paypalOrderId as string;
  };

  const capturePayPalCardOrder = async (paypalOrderId: string) => {
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalOrderId }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "PayPal card payment could not be completed.");
    }

    router.push(`/payment-success?order_id=${data.orderId}`);
  };

  const payNow = async () => {
    if (checkoutLoading || paymentProcessing) return;

    if (!checkoutForm.validate()) {
      setPaymentError("Please fix the highlighted checkout details.");
      return;
    }

    if (paymentMethod !== "paypal") {
      setCheckoutLoading(true);
      setPaymentError(null);
      await new Promise((resolve) => window.setTimeout(resolve, 2500));
    }

    if (paymentMethod === "afterpay") {
      window.sessionStorage.setItem(
        "afterpayCheckoutData",
        JSON.stringify({
          firstName: checkoutForm.values.firstName,
          lastName: checkoutForm.values.lastName,
          email: checkoutForm.values.email,
          phone: checkoutForm.values.phone,
          address: checkoutForm.values.address,
          city: checkoutForm.values.city,
          emirate: checkoutForm.values.emirate,
          postalCode: checkoutForm.values.postalCode,
          subtotal,
        })
      );

      router.push("/afterpay");
      return;
    }

    if (paymentMethod === "klarna") {
      const klarnaCheckoutData = {
        firstName: checkoutForm.values.firstName,
        lastName: checkoutForm.values.lastName,
        email: checkoutForm.values.email,
        phone: checkoutForm.values.phone,
        address: checkoutForm.values.address,
        city: checkoutForm.values.city,
        emirate: checkoutForm.values.emirate,
        postalCode: checkoutForm.values.postalCode,
      };

      window.sessionStorage.setItem(
        "klarnaCheckoutData",
        JSON.stringify(klarnaCheckoutData)
      );

      router.push("/klarna-payment-gateway/entry");
      return;
    }

    if (paymentMethod === "paypal") {
      setPaymentProcessing(true);
      setPaymentError(null);

      try {
        const response = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            currency: "USD",
            shippingAddress: shippingAddress(),
          }),
        });
        const data = await response.json();

        if (!response.ok || !data.approvalUrl) {
          throw new Error(data.message || "Unable to start PayPal checkout.");
        }

        window.location.assign(data.approvalUrl);
      } catch (error) {
        setPaymentProcessing(false);
        setPaymentError(
          error instanceof Error ? error.message : "Unable to start PayPal checkout."
        );
      }
      return;
    }

    if (paymentMethod === "card") {
      if (!paypalCardFields) {
        setCheckoutLoading(false);
        setPaymentError("PayPal secure card form is not ready. Please refresh the page.");
        return;
      }

      setPaymentProcessing(true);
      setPaymentError(null);

      try {
        await paypalCardFields.submit();
      } catch (error) {
        setPaymentProcessing(false);
        setCheckoutLoading(false);
        setPaymentError(
          error instanceof Error ? error.message : "PayPal card payment failed."
        );
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {googlePlacesApiKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googlePlacesApiKey}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => window.dispatchEvent(new Event("google-places-ready"))}
        />
      ) : null}
      {paypalScriptUrl ? (
        <Script
          src={paypalScriptUrl}
          strategy="afterInteractive"
          onLoad={() => setPayPalSdkReady(true)}
          onError={() => setCheckoutError("Unable to load PayPal secure card form.")}
        />
      ) : null}

      {/* <header className="border-b border-[#dedede] bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-11">
          <h1 className="text-[36px] font-black tracking-[-0.04em]">MEJURI</h1>
          <ShoppingBag className="h-6 w-6" strokeWidth={2.2} />
        </div>
      </header> */}

      <header className="border-b border-[#dedede] bg-white">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between lg:py-5 py-3 px-4 ">
          <Link href="/" aria-label="Go to home page">
            <h1 className="cursor-pointer text-[36px] font-black tracking-[-0.04em]">
              MEJURI
            </h1>
          </Link>

          <ShoppingBag className="h-6 w-6" strokeWidth={2.2} />
        </div>
      </header>

      <section className="mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* px-6 py-20 lg:pr-[50px] */}
        <div className='w-full h-full md:p-[40px] p-[20px]'>
          <div className=" lg:max-w-[500px] max-w-[560px] w-full lg:ml-auto mx-auto">
            <div className="w-full">
              <p className="mb-5 text-center text-[14px] text-[#606060]">
                Express checkout
              </p>

              <div className="mx-auto grid w-[589px] max-w-full grid-cols-[repeat(3,minmax(0,187px))] justify-center gap-3">
                <button className="relative flex h-[46px] w-full cursor-pointer items-center justify-center border border-transparent bg-[#592ff4] font-['SF_Pro_Text',sans-serif] text-[16px] font-bold not-italic leading-[16px] tracking-[0.15px] text-white no-underline [container-type:inline-size]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 47 20"
                    aria-label="Shop"
                    role="img"
                    className="h-[18px] w-[42px] fill-white"
                  >
                    <path d="m9.095 6.766-2.33 1.186C6.233 7.035 5.5 6.565 4.48 6.565q-1.665 0-1.665 1.007c0 .716.821.873 2.663 1.275 1.842.403 3.931.985 3.931 3.29 0 2.238-1.73 3.58-4.593 3.58-2.308 0-4.02-.984-4.816-2.73l2.33-1.163c.488 1.077 1.331 1.633 2.486 1.633 1.198 0 1.797-.335 1.797-1.052 0-.716-.823-.872-2.668-1.275C2.101 10.727.02 10.145.02 7.84c0-2.17 1.709-3.536 4.46-3.536 2.153 0 3.773.873 4.615 2.462M11.05.5h2.884v5.102c.754-.828 1.842-1.298 3.085-1.298 2.485 0 4.26 1.925 4.26 4.655v6.646h-2.884V8.959c0-1.275-.932-2.216-2.22-2.216-1.287 0-2.24.962-2.24 2.216v6.646h-2.886zm12.116 4.61c.954-.671 2.33-1.14 3.795-1.14 3.906 0 6.746 2.663 6.746 6.311 0 3.401-2.441 5.774-5.837 5.774-2.907 0-4.992-1.97-4.992-4.61 0-1.79 1.067-3.111 2.574-3.626l1.22 2.082c-.82.38-1.13.94-1.13 1.633 0 1.14.955 1.947 2.33 1.947 1.687 0 3.018-1.343 3.018-3.155 0-2.127-1.664-3.737-3.927-3.737a4.5 4.5 0 0 0-2.508.738zm15.024 9.22v5.17h-2.885V4.417h2.818V5.78c.866-.94 2.086-1.477 3.462-1.477 3.04 0 5.415 2.484 5.415 5.707s-2.375 5.707-5.415 5.707c-1.354 0-2.53-.515-3.395-1.388m5.947-4.341c0-1.858-1.287-3.223-3.04-3.223-1.731 0-3.04 1.388-3.04 3.223s1.309 3.223 3.04 3.223c1.753 0 3.042-1.366 3.042-3.223z" />
                  </svg>
                </button>
                <button className="relative box-border inline-flex h-[46px] w-full cursor-pointer items-center justify-center overflow-hidden  border border-[#ffc439] bg-[#ffc439] px-[0.7em] py-[0.45em] font-[Helvetica,Arial,'Liberation_Sans',sans-serif] text-[0] font-medium leading-none text-[#2c2e2f]">
                  <svg
                    className="h-[28px] w-[70px]"
                    viewBox="0 0 101 32"
                    width="75.75"
                    height="24"
                    aria-label="PayPal"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#003087"
                      d="M12.24 2.8h-7.8c-.5 0-1 .4-1.1.9l-3.1 20c-.1.4.2.7.6.7h3.7c.5 0 1-.4 1.1-.9l.8-5.4c.1-.5.5-.9 1.1-.9h2.5c5.1 0 8.1-2.5 8.9-7.4.3-2.1 0-3.8-1-5-1.1-1.3-3.1-2-5.7-2Zm.9 7.3c-.4 2.8-2.6 2.8-4.6 2.8h-1.2l.8-5.2c0-.3.3-.5.6-.5h.5c1.4 0 2.7 0 3.4.8.5.4.7 1.1.5 2.1Zm22.3-.1h-3.7c-.3 0-.6.2-.6.5l-.2 1-.3-.4c-.8-1.2-2.6-1.6-4.4-1.6-4.1 0-7.6 3.1-8.3 7.5-.4 2.2.1 4.3 1.4 5.7 1.1 1.3 2.8 1.9 4.7 1.9 3.3 0 5.2-2.1 5.2-2.1l-.2 1c-.1.4.2.8.6.8h3.4c.5 0 1-.4 1.1-.9l2-12.8c.1-.2-.3-.6-.7-.6Zm-5.1 7.2c-.4 2.1-2 3.6-4.2 3.6-1.1 0-1.9-.3-2.5-1-.6-.7-.8-1.6-.6-2.6a4.2 4.2 0 0 1 4.2-3.6c1.1 0 1.9.4 2.5 1 .5.7.7 1.6.6 2.6Zm25-7.2h-3.7c-.4 0-.7.2-.9.5l-5.2 7.6-2.2-7.3c-.1-.5-.6-.8-1-.8h-3.7c-.4 0-.8.4-.6.9l4.1 12.1-3.9 5.4c-.3.4 0 1 .5 1h3.7c.4 0 .7-.2.9-.5l12.5-18c.3-.3 0-.9-.5-.9Z"
                    />
                    <path
                      fill="#009cde"
                      d="M67.74 2.8h-7.8c-.5 0-1 .4-1.1.9l-3.1 19.9c-.1.4.2.7.6.7h4c.4 0 .7-.3.7-.6l.9-5.7c.1-.5.5-.9 1.1-.9h2.5c5.1 0 8.1-2.5 8.9-7.4.3-2.1 0-3.8-1-5-1.2-1.2-3.1-1.9-5.7-1.9Zm.9 7.3c-.4 2.8-2.6 2.8-4.6 2.8h-1.2l.8-5.2c0-.3.3-.5.6-.5h.5c1.4 0 2.7 0 3.4.8.5.4.6 1.1.5 2.1Zm22.3-.1h-3.7c-.3 0-.6.2-.6.5l-.2 1-.3-.4c-.8-1.2-2.6-1.6-4.4-1.6-4.1 0-7.6 3.1-8.3 7.5-.4 2.2.1 4.3 1.4 5.7 1.1 1.3 2.8 1.9 4.7 1.9 3.3 0 5.2-2.1 5.2-2.1l-.2 1c-.1.4.2.8.6.8h3.4c.5 0 1-.4 1.1-.9l2-12.8c0-.2-.3-.6-.7-.6Zm-5.2 7.2c-.4 2.1-2 3.6-4.2 3.6-1.1 0-1.9-.3-2.5-1-.6-.7-.8-1.6-.6-2.6a4.2 4.2 0 0 1 4.2-3.6c1.1 0 1.9.4 2.5 1 .6.7.8 1.6.6 2.6Zm9.6-13.9-3.2 20.3c-.1.4.2.7.6.7h3.2c.5 0 1-.4 1.1-.9l3.2-19.9c.1-.4-.2-.7-.6-.7h-3.6c-.4 0-.6.2-.7.5Z"
                    />
                  </svg>
                </button>
                <div className="h-[46px] w-full overflow-hidden">
                  <GooglePay subtotal={subtotal} paypalSdkReady={paypalSdkReady} />
                </div>
              </div>

              <div className="my-5 flex items-center gap-5">
                <div className="h-px flex-1 bg-[#ddd]" />
                <span className="text-[14px] text-[#777]">OR</span>
                <div className="h-px flex-1 bg-[#ddd]" />
              </div>

              <section className="flex flex-col gap-[1rem] font-display mb-[25px]">
                <h2 className="text-[22px] font-display font-semibold uppercase">
                  Create a Mejuri+ Account
                </h2>
                <p className="max-w-[585px] text-[15px] leading-[24px]">
                  Become a Mejuri+ member to get FREE shipping every Monday,
                  priority sale access, a surprise birthday treat, and more. Learn
                  More.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button className="py-[12px] px-[16px] cursor-pointer border border-[#d9d9d9] text-[16px] font-display font-medium uppercase tracking-[0.16em]">
                    Sign In
                  </button>
                  <button className="py-[12px] px-[16px] cursor-pointer bg-black text-[16px] font-display font-medium uppercase tracking-[0.16em] text-white">
                    Create Account
                  </button>
                </div>
                <div className="flex items-center gap-5">
                  <div className="h-px flex-1 bg-[#ddd]" />
                  <span className="text-[14px]">or checkout as a guest</span>
                  <div className="h-px flex-1 bg-[#ddd]" />
                </div>
              </section>



              <section>
                <h2 className="mb-5 text-[24px] font-display font-semibold">Contact</h2>
                <ContactSuggestionField
                  field="email"
                  suggestionField="email"
                  label="Email"
                  value={checkoutForm.values.email}
                  error={checkoutForm.errors.email}
                  onChange={checkoutForm.setValue}
                  getSuggestions={checkoutForm.contactSuggestions}
                  applySuggestion={checkoutForm.applyContactSuggestion}
                  inputMode="email"
                  autoComplete="email"
                />

                <label className="mt-5 flex cursor-pointer items-center gap-3 text-[14px]">
                  <input className="h-[23px] w-[23px] cursor-pointer" type="checkbox" />
                  Email me with news and offers
                </label>
              </section>

              <section className="mt-10">
                <h2 className="mb-5 text-[24px] font-display font-semibold uppercase">Delivery</h2>

                <div className="space-y-4">
                  <Field label="Country/Region">
                    <select
                      defaultValue="United States"
                      className="mt-1 w-full cursor-pointer appearance-none bg-transparent text-[14px] outline-none"
                    >
                      {countries.map((country) => (
                        <option key={country}>{country}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666]" />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <ContactSuggestionField
                      field="firstName"
                      suggestionField="firstName"
                      label="First name"
                      value={checkoutForm.values.firstName}
                      error={checkoutForm.errors.firstName}
                      onChange={checkoutForm.setValue}
                      getSuggestions={checkoutForm.contactSuggestions}
                      applySuggestion={checkoutForm.applyContactSuggestion}
                      autoComplete="given-name"
                    />
                    <ContactSuggestionField
                      field="lastName"
                      suggestionField="lastName"
                      label="Last name"
                      value={checkoutForm.values.lastName}
                      error={checkoutForm.errors.lastName}
                      onChange={checkoutForm.setValue}
                      getSuggestions={checkoutForm.contactSuggestions}
                      applySuggestion={checkoutForm.applyContactSuggestion}
                      autoComplete="family-name"
                    />
                  </div>

                  <AddressAutocompleteField
                    value={checkoutForm.values.address}
                    error={checkoutForm.errors.address}
                    onChange={checkoutForm.setValue}
                    onSelect={checkoutForm.applyAddressSuggestion}
                  />

                  <Field label="Apartment, suite, etc. (optional)" />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City">
                      <select
                        value={checkoutForm.values.city}
                        onChange={(event) =>
                          checkoutForm.setValue("city", event.target.value)
                        }
                        aria-invalid={Boolean(checkoutForm.errors.city)}
                        aria-describedby={
                          checkoutForm.errors.city ? "city-error" : undefined
                        }
                        autoComplete="address-level2"
                        className="mt-1 w-full cursor-pointer appearance-none bg-transparent text-[14px] outline-none"
                      >
                        <option value="" disabled>
                          Select a city
                        </option>
                        {checkoutForm.values.city &&
                          !usCities.includes(checkoutForm.values.city) && (
                            <option value={checkoutForm.values.city}>
                              {checkoutForm.values.city}
                            </option>
                          )}
                        {usCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666]" />
                    </Field>
                    <Field label="State">
                      <select
                        value={checkoutForm.values.emirate}
                        onChange={(event) =>
                          checkoutForm.setValue("emirate", event.target.value)
                        }
                        aria-invalid={Boolean(checkoutForm.errors.emirate)}
                        aria-describedby={
                          checkoutForm.errors.emirate ? "emirate-error" : undefined
                        }
                        autoComplete="address-level1"
                        className="mt-1 w-full cursor-pointer appearance-none bg-transparent text-[14px] outline-none"
                      >
                        <option value="" disabled>
                          Select a state
                        </option>
                        {checkoutForm.values.emirate &&
                          !usStates.includes(checkoutForm.values.emirate) && (
                            <option value={checkoutForm.values.emirate}>
                              {checkoutForm.values.emirate}
                            </option>
                          )}
                        {usStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666]" />
                    </Field>
                  </div>
                  <InlineError
                    id="city-error"
                    message={checkoutForm.errors.city}
                  />
                  <InlineError
                    id="emirate-error"
                    message={checkoutForm.errors.emirate}
                  />

                  <CheckoutTextField
                    field="postalCode"
                    label="Postal code (optional)"
                    value={checkoutForm.values.postalCode}
                    error={checkoutForm.errors.postalCode}
                    onChange={checkoutForm.setValue}
                    autoComplete="postal-code"
                  />

                  <div className="relative">
                    <ContactSuggestionField
                      field="phone"
                      suggestionField="phone"
                      label="Phone"
                      value={checkoutForm.values.phone}
                      error={checkoutForm.errors.phone}
                      onChange={checkoutForm.setValue}
                      getSuggestions={checkoutForm.contactSuggestions}
                      applySuggestion={checkoutForm.applyContactSuggestion}
                      inputMode="numeric"
                      autoComplete="tel"
                      hasRightIcon
                    />
                    <HelpCircle className="pointer-events-none absolute right-4 top-[30px] h-5 w-5 -translate-y-1/2 text-[#666]" />
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-3 text-[14px]">
                  <input className="h-[23px] w-[23px] cursor-pointer" type="checkbox" />
                  Text me with news and offers
                </label>
              </section>

              <section className="mt-8">
                <h2 className="mb-5 text-[24px] font-display font-semibold">
                  Shipping Method
                </h2>
                <div className="flex min-h-[89px] items-center justify-between rounded-[5px] border border-[#d9d9d9] px-5">
                  <div>
                    <h3 className="text-[14px] font-bold">Standard</h3>
                    <p className="mt-2 text-[14px]">
                      Delivers in 3-7 business days once shipped
                    </p>
                  </div>
                  <span className="text-[14px] font-bold">FREE</span>
                </div>
              </section>

              <section className="mt-5">
                <h2 className="mb-5 text-[24px] font-display font-semibold uppercase">
                  Packaging Options
                </h2>

                <div className="overflow-hidden rounded-[5px] border border-[#d9d9d9]">
                  <label className="sm:grid flex cursor-pointer grid-cols-[1fr_135px] lg:gap-5 gap-1 border-b border-[#d9d9d9] p-[18px]">
                    <input
                      className="peer sr-only cursor-pointer"
                      type="radio"
                      name="packaging"
                      defaultChecked
                    />
                    <div className="flex gap-4">
                      <span className="mt-[3px] flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-black peer-checked:bg-black">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                      <div>
                        <h3 className="text-[14px] font-bold">
                          Signature Mejuri Packaging
                        </h3>
                        <p className="mt-4 text-[14px] leading-[22px] text-[#666]">
                          Our ideal product experience. Includes a reusable,
                          jewelry-safe velvet pouch and a branded jewelry storage
                          box.
                        </p>
                      </div>
                    </div>
                    <div className="relative sm:h-[135px] sm:w-full h-[70px] w-[70px] shrink-0 bg-[#f4f4f4]">
                      <Image
                        src="/NormalPackaging.jpg"
                        alt="Signature Mejuri Packaging"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </label>

                  <label className="sm:grid flex cursor-pointer grid-cols-[1fr_135px] sm:gap-5 gap-1 p-[18px]">
                    <input className="peer sr-only cursor-pointer" type="radio" name="packaging" />
                    <div className="flex gap-4">
                      <span className="mt-[3px] h-[22px] w-[22px] shrink-0 cursor-pointer rounded-full border border-[#d9d9d9] peer-checked:border-black peer-checked:bg-black" />
                      <div>
                        <h3 className="text-[14px] font-bold">
                          Reduced Packaging
                        </h3>
                        <p className="mt-4 text-[14px] leading-[22px] text-[#666]">
                          Excludes our branded white box to minimize environmental
                          impact. Includes our reusable, jewelry-safe velvet pouch
                          for safekeeping. Some products are excluded from this
                          option.
                        </p>
                      </div>
                    </div>
                    <div className="relative sm:h-[135px] sm:w-full h-[70px] w-[70px] shrink-0 bg-[#f4f4f4]">
                      <Image
                        src="/ReducedPackaging.jpg"
                        alt="Reduced Packaging"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </label>
                </div>
              </section>

              <section className="mt-5">
                <h2 className="mb-5 text-[24px] font-display font-semibold uppercase">
                  Gift Orders
                </h2>

                <div className="sm:grid flex grid-cols-[1fr_135px] sm:gap-5 gap-1  rounded-[5px] border border-[#d9d9d9] p-[18px]">
                  <div className="flex gap-4">
                    <input className="mt-[2px] h-[23px] w-[23px] cursor-pointer" type="checkbox" />
                    <div>
                      <h3 className="text-[14px] font-bold">
                        This order is a gift
                      </h3>
                      <p className="mt-4 text-[14px] leading-[22px] text-[#666]">
                        Each piece will be packaged on its own, based on the
                        option you selected above, ready for gifting. You can also
                        add a personalized note, and we&apos;ll print it on a Mejuri
                        card to include with the order.
                      </p>
                    </div>
                  </div>
                  <div className="relative sm:h-[135px] sm:w-full h-[70px] w-[70px] shrink-0 bg-[#f4f4f4]">
                    <Image src="/gifts.png" alt="Gift order" fill className="object-cover" />
                  </div>
                </div>
              </section>

              <section className="mt-9">
                <h2 className="text-[24px] font-display font-semibold uppercase">Payment</h2>
                <p className="mt-2 text-[14px] text-[#555]">
                  All transactions are secure and encrypted.
                </p>

                <div className="mt-5 rounded-[5px] border border-[#d9d9d9]">
                  <PaymentRow
                    active={paymentMethod === "card"}
                    label="Credit card"
                    onClick={() => setPaymentMethod("card")}
                    right={
                      <div className="flex items-center gap-1">
                        <PaymentLogo src="/visa.svg" alt="Visa" />
                        <PaymentLogo src="/mastercard.svg" alt="Mastercard" />
                        <PaymentLogo src="/amex.svg" alt="American Express" />
                        <ExtraCardsTooltip />
                      </div>
                    }
                  />

                  {paymentMethod === "card" && (
                    <CardPaymentPanel
                      sdkReady={paypalSdkReady}
                      createOrder={createPayPalCardOrder}
                      captureOrder={capturePayPalCardOrder}
                      onReady={setPayPalCardFields}
                      onError={setPaymentError}
                      paymentError={paymentError}
                      paymentProcessing={paymentProcessing}
                    />
                  )}

                  <PaymentRow
                    active={paymentMethod === "paypal"}
                    label="PayPal"
                    onClick={() => setPaymentMethod("paypal")}
                    right={
                      <Image
                        src="/paypal-logo.svg"
                        alt="PayPal"
                        width={70}
                        height={22}
                        className="h-auto w-[70px]"
                      />
                    }
                  />

                  {paymentMethod === "paypal" && (
                    <RedirectPanel>
                      You&apos;ll be redirected to PayPal to complete your purchase
                    </RedirectPanel>
                  )}

                  <PaymentRow
                    active={paymentMethod === "afterpay"}
                    label="Afterpay"
                    onClick={() => setPaymentMethod("afterpay")}
                    right={
                      <Image
                        src="/afterpay.svg"
                        alt="Afterpay"
                        width={48}
                        height={30}
                        className="h-auto w-[48px]"
                      />
                    }
                  />

                  {paymentMethod === "afterpay" && (
                    <RedirectPanel>
                      <p>You&apos;ll be redirected to Afterpay to complete your purchase.</p>
                      <div className="mx-auto mt-7 h-4 w-[203px] rounded-full bg-[#e2e2e2]" />
                    </RedirectPanel>
                  )}

                  <PaymentRow
                    active={paymentMethod === "klarna"}
                    label="Klarna - Pay flexibly"
                    onClick={() => setPaymentMethod("klarna")}
                    right={
                      <Image
                        src="/klarna.svg"
                        alt="Klarna"
                        width={48}
                        height={30}
                        className="h-auto w-[48px]"
                      />
                    }
                  />

                  {paymentMethod === "klarna" && (
                    <RedirectPanel>
                      <p>
                        You&apos;ll be redirected to Klarna - Pay flexibly to complete
                        your purchase.
                      </p>
                      <p className="mt-6">
                        Note: you will be charged{" "}
                        <strong>{money(subtotal)} USD.</strong>
                      </p>
                    </RedirectPanel>
                  )}
                </div>
              </section>

              <section className="mt-5">
                <h2 className="mb-5 text-[24px] font-display font-semibold uppercase">
                  Billing Address
                </h2>
                <div className="overflow-hidden rounded-[5px] border border-[#d9d9d9]">
                  <label className="flex h-[62px] cursor-pointer items-center gap-4 border-b border-[#d9d9d9] px-[18px] text-[14px] font-bold">
                    <input className="cursor-pointer" defaultChecked name="billing" type="radio" />
                    Same as shipping address
                  </label>
                  <label className="flex h-[62px] cursor-pointer items-center gap-4 px-[18px] text-[14px] font-bold">
                    <input className="cursor-pointer" name="billing" type="radio" />
                    Use a different billing address
                  </label>
                </div>
              </section>

              <div className="mt-12 flex items-center justify-between gap-6 text-[14px]">
                <div>
                  <p className="font-bold">Save my information for a faster checkout</p>
                  <p className="mt-1 max-w-[520px] text-[14px] leading-[22px] text-[#555]">
                    By paying, you agree to create a Shop account subject to
                    Shop&apos;s <span className="cursor-pointer underline">Terms</span> and{" "}
                    <span className="cursor-pointer underline">Privacy Policy</span>
                  </p>
                </div>
                <button className="shrink-0 cursor-pointer font-bold">Not now</button>
              </div>

              {paymentMethod === "paypal" ? (
                <button
                  onClick={payNow}
                  disabled={paymentProcessing}
                  className="mt-16 h-[62px] w-full cursor-pointer bg-[#0070ba] text-[22px] font-normal text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paymentProcessing ? (
                    "Redirecting…"
                  ) : (
                    <>Pay with <span className="font-bold italic">PayPal</span></>
                  )}
                </button>
              ) : (
                <button
                  onClick={payNow}
                  disabled={checkoutLoading || paymentProcessing}
                  className="mt-16 h-[46px] w-full cursor-pointer rounded-none bg-black text-[16px] font-display font-medium uppercase tracking-[0.04em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      Loading…
                    </span>
                  ) : paymentMethod === "card"
                    ? paymentProcessing
                      ? "Processing…"
                      : "Pay Now"
                    : checkoutLoading
                      ? "Redirecting…"
                      : "Pay Now"}
                </button>
              )}
              {checkoutError ? (
                <p className="mt-4 text-sm text-red-600">{checkoutError}</p>
              ) : null}
              {paymentError ? (
                <p className="mt-4 text-sm text-red-600">{paymentError}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* px-8 py-12 */}
        <aside className="border-l border-[#dedede] bg-[#f5f5f5] md:p-[40px] p-[20px] w-full h-auto">
          <div className="sticky top-8 lg:max-w-[500px] max-w-[560px] lg:mx-0 mx-auto w-full">
            <div className="space-y-5">
              {items.length ? (
                items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-5">
                    <ProductThumb src={item.image} alt={item.title} quantity={item.quantity} />
                    <div className="flex-1 ">
                      <h3 className="text-[14px] font-bold">{item.title}</h3>
                      <p className=" text-[12px] text-[#666]">
                        {item.variantTitle || "Sterling Silver / 7.5-10\""}
                      </p>
                    </div>
                    <p className=" text-[14px] font-bold">
                      {money(item.total)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[5px] border border-[#d9d9d9] bg-white p-4 text-[14px] text-[#666]">
                  Your cart is empty.
                </div>
              )}
            </div>

            <div className="mt-7 flex gap-4">
              <input
                placeholder="Discount code or gift card"
                className="h-[61px] flex-1 rounded-[5px] border border-[#d9d9d9] bg-white px-4 text-[15px] outline-none"
              />
              <button className="h-[61px] w-[114px] cursor-pointer border border-[#e0e0e0] bg-[#eee] text-[15px] font-semibold tracking-[0.08em] text-[#777]">
                APPLY
              </button>
            </div>

            <div className="mt-10 space-y-4 text-[14px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Shipping <Info className="h-4 w-4 text-[#666]" />
                </span>
                <span>FREE</span>
              </div>
              <div className="flex items-baseline justify-between pt-3 text-[22px] font-bold">
                <span>Total</span>
                <span>
                  <span className="mr-2 text-[14px] font-normal text-[#666]">
                    USD
                  </span>
                  {money(subtotal)}
                </span>
              </div>
              <p className="text-right text-[14px] text-[#666]">
                Charged as {money(subtotal)} USD
              </p>
            </div>

            <div className="mt-8">
              <h3 className='font-[SimonMono,"Courier_New",Courier,monospace] text-[18px]'>
                You May Also Like
              </h3>

              <div className="mt-4 space-y-4">
                {recommendations.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-[6px] border border-[#d9d9d9]  p-[14px]"
                  >
                    <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[5px] border border-[#e3e3e3] bg-[#f7f7f7]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-fill p-1"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold">{item.title}</h4>
                      <p className="mt-1 text-[12px] leading-[18px] text-[#666]">
                        {item.desc}
                      </p>
                      <p className="mt-1 text-[14px]">{item.price}</p>
                    </div>

                    <button className="h-[51px] w-[92px] cursor-pointer border border-[#d9d9d9] text-[15px] font-semibold tracking-[0.08em]">
                      ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function PaymentRow({
  active,
  label,
  right,
  onClick,
}: {
  active: boolean;
  label: string;
  right: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[63px] w-full cursor-pointer items-center justify-between border-b border-[#d9d9d9] px-[18px] text-left last:border-b-0"
    >
      <span className="flex items-center gap-4 text-[15px] font-bold">
        <span
          className={`flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border ${active ? "border-black bg-black" : "border-[#d9d9d9] bg-white"
            }`}
        >
          {active && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        {label}
      </span>
      {right}
    </button>
  );
}

function PaymentLogo({
  src,
  alt,
  wide = false,
}: {
  src: string;
  alt: string;
  wide?: boolean;
}) {
  return (
    <span
      className={`flex h-[30px] items-center justify-center rounded-[4px] border border-[#e2e2e2] bg-white px-1 ${wide ? "w-[48px]" : "w-[45px]"
        }`}
    >
      <Image
        src={src}
        alt={alt}
        width={wide ? 42 : 34}
        height={20}
        className="max-h-[20px] w-auto object-contain"
      />
    </span>
  );
}

function ExtraCardsTooltip() {
  return (
    <span className="group relative cursor-pointer">
      <span className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[4px] border border-[#e2e2e2] bg-white text-[13px]">
        +4
      </span>
      <span className="pointer-events-none absolute right-[-18px] top-[-92px] z-20 hidden w-[194px] rounded-[5px] bg-[#1f1f1f] p-3 shadow-lg group-hover:block">
        <span className="grid grid-cols-3 gap-3">
          <TooltipLogo src="/discover.svg" alt="Discover" />
          <TooltipLogo src="/diners_club.svg" alt="Diners Club" />
          <TooltipLogo src="/jcb.svg" alt="JCB" />
          <TooltipLogo src="/unionpay.svg" alt="UnionPay" />
        </span>
        <span className="absolute bottom-[-8px] left-1/2 h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#1f1f1f]" />
      </span>
    </span>
  );
}

function TooltipLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={28}
      className="h-auto max-h-[28px] w-[48px] object-contain"
    />
  );
}

function CardPaymentPanel({
  sdkReady,
  createOrder,
  captureOrder,
  onReady,
  onError,
  paymentError,
  paymentProcessing,
}: {
  sdkReady: boolean;
  createOrder: () => Promise<string>;
  captureOrder: (paypalOrderId: string) => Promise<void>;
  onReady: (fields: PayPalCardFields | null) => void;
  onError: (message: string | null) => void;
  paymentError: string | null;
  paymentProcessing: boolean;
}) {
  const createOrderRef = useRef(createOrder);
  const captureOrderRef = useRef(captureOrder);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    createOrderRef.current = createOrder;
    captureOrderRef.current = captureOrder;
    onErrorRef.current = onError;
  }, [captureOrder, createOrder, onError]);

  useEffect(() => {
    const paypal = (window as PayPalWindow).paypal;
    if (!sdkReady || !paypal?.CardFields) return;

    let active = true;
    const cardFields = paypal.CardFields({
      style: {
        input: {
          "font-size": "15px",
          color: "#111111",
          "font-family": "Inter, sans-serif",
          height: "50px",
          "line-height": "50px",
          padding: "0",
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
        const message =
          error instanceof Error ? error.message : "PayPal card payment failed.";
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
      cardFields.NameField().render("#paypal-card-name"),
      cardFields.NumberField().render("#paypal-card-number"),
      cardFields.ExpiryField().render("#paypal-card-expiry"),
      cardFields.CVVField().render("#paypal-card-cvv"),
    ])
      .then(() => {
        if (active) onReady(cardFields);
      })
      .catch((error) => {
        onErrorRef.current(
          error instanceof Error ? error.message : "Unable to load PayPal card fields."
        );
      });

    return () => {
      active = false;
      onReady(null);
      cardFields.close?.();
    };
  }, [onReady, sdkReady]);

  const fieldClass =
    "h-[52px] w-full overflow-hidden rounded-[5px] border border-[#d9d9d9] bg-white px-4 [&>iframe]:h-full [&>iframe]:w-full";

  return (
    <div className="border-b border-[#d9d9d9] bg-[#f4f4f4] p-[18px]">
      <div className="relative rounded-[5px] border border-[#d9d9d9] bg-white p-4">
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#666]">
          Name on card
        </label>
        <div id="paypal-card-name" className={`${fieldClass} mb-4`} />

        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#666]">
          Card details
        </label>
        <div id="paypal-card-number" className={fieldClass} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div id="paypal-card-expiry" className={fieldClass} />
          <div id="paypal-card-cvv" className={fieldClass} />
        </div>

        {!sdkReady ? (
          <p className="mt-4 text-sm text-[#555]">Loading secure payment form…</p>
        ) : null}

        {paymentError ? (
          <p className="mt-4 text-sm text-red-600">{paymentError}</p>
        ) : null}

        {paymentProcessing ? (
          <p className="mt-4 text-sm text-[#555]">Processing payment…</p>
        ) : null}
      </div>
    </div>
  );
}

function RedirectPanel({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-[#d9d9d9] bg-[#f4f4f4] px-5 py-5 text-center text-[14px] leading-[24px]">
      {children}
    </div>
  );
}

function ProductThumb({
  src,
  alt,
  quantity,
}: {
  src: string | null;
  alt: string;
  quantity: number;
}) {
  return (
    <div className="relative h-[64px] w-[64px] shrink-0 rounded-[8px] border border-[#d9d9d9] bg-white">
      {src ? (
        <Image src={src} alt={alt} fill className="object-fill p-1" />
      ) : (
        <div className="flex h-full items-center justify-center text-[12px] text-[#777]">
          No image
        </div>
      )}
      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-[6px] bg-black text-[14px] font-bold text-white">
        {quantity}
      </span>
    </div>
  );
}
