"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { createCheckoutUrl } from "@/app/lib/checkoutUrl";

type PreCheckoutDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type CartItem = {
  productId: string;
  variantId: string;
  productType?: string;
  handle?: string;
  image?: string;
  title: string;
  price: number;
  variantTitle?: string;
  quantity: number;
};

type ProductVariant = {
  _id?: string;
  shopifyVariantId?: string | number;
  title?: string;
  price?: string | number;
};

type SuggestedProduct = {
  _id?: string;
  id?: string;
  handle?: string;
  title?: string;
  images?: Array<{ src?: string }>;
  variants?: ProductVariant[];
  isJewelryKit?: boolean;
};

const JEWELRY_CARE_KIT: SuggestedProduct = {
  _id: "jewelry-care-kit",
  title: "Jewelry Care Kit",
  images: [
    {
      src: "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/JewelryCareKit_ContentCard_1080x1296_73f42b30-d83c-42da-9973-ee6f475abb50.jpg?v=1760500143&width=1600&crop=center",
    },
  ],
  variants: [
    {
      _id: "kit-variant-1",
      title: "Size: 50ml",
      price: "28",
    },
  ],
  isJewelryKit: true,
};

const CART_UPDATED_EVENT = "mejuri-cart-updated";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const getSuggestionTerm = (items: CartItem[]) => {
  const description = items
    .map((item) => `${item.productType || ""} ${item.title}`)
    .join(" ")
    .toLowerCase();
  const keywords = ["necklace", "earring", "ring", "bracelet", "charm", "pendant", "hoop"];

  return keywords.find((keyword) => description.includes(keyword)) || "jewelry";
};

const getProductKey = (product: SuggestedProduct) =>
  String(product._id || product.id || product.handle || "");

export default function PreCheckoutDrawer({ open, onClose }: PreCheckoutDrawerProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [suggestions, setSuggestions] = useState<SuggestedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (items: CartItem[]) => {
    const term = getSuggestionTerm(items);
    const [relatedResponse, generalResponse] = await Promise.all([
      fetch(`/api/products?q=${encodeURIComponent(term)}&limit=8`),
      fetch("/api/products?limit=16"),
    ]);
    const [relatedData, generalData] = await Promise.all([
      relatedResponse.json(),
      generalResponse.json(),
    ]);
    const products: SuggestedProduct[] = [
      ...(Array.isArray(relatedData.products) ? relatedData.products : []),
      ...(Array.isArray(generalData.products) ? generalData.products : []),
    ];
    const cartProductIds = new Set(items.map((item) => String(item.productId)));
    const seen = new Set<string>();
    const unique = products.filter((product) => {
      const key = getProductKey(product);
      if (!key || seen.has(key) || cartProductIds.has(String(product._id || product.id))) return false;
      seen.add(key);
      return true;
    });

    setSuggestions(unique.slice(0, 4));
  }, []);

  const fetchCart = useCallback(async (refreshSuggestions = true) => {
    const response = await fetch("/api/cart", {
      headers: getAuthHeaders(),
    });
    const data = await response.json();

    if (!response.ok) return;

    const items: CartItem[] = Array.isArray(data.items) ? data.items : [];
    setCartItems(items);
    setSubtotal(Number(data.subtotal) || 0);
    if (refreshSuggestions) await fetchSuggestions(items);
  }, [fetchSuggestions]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      void fetchCart().finally(() => setLoading(false));
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
    };
  }, [fetchCart, open]);

  const mutateCartItem = async (item: CartItem, method: "PATCH" | "DELETE", quantity?: number) => {
    const itemKey = `${item.productId}-${item.variantId}`;
    setUpdatingItem(itemKey);

    try {
      const response = await fetch("/api/cart", {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId,
          quantity,
        }),
      });

      if (response.ok) {
        await fetchCart(method === "DELETE");
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
    } finally {
      setUpdatingItem(null);
    }
  };

  const moveToWishlist = async (item: CartItem) => {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ productId: item.productId, variantId: item.variantId }),
    });

    if (response.ok) await mutateCartItem(item, "DELETE");
  };

  const addSuggestion = async (product: SuggestedProduct) => {
    const variant = product.variants?.[0];
    const productId = product._id || product.id;
    const variantId = variant?.shopifyVariantId || variant?._id;
    const productKey = getProductKey(product);
    if (!productId || !variantId) return;

    setAddingProduct(productKey);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ productId, variantId, quantity: 1 }),
      });

      if (response.ok) {
        await fetchCart(true);
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
    } finally {
      setAddingProduct(null);
    }
  };

  const goToCheckout = () => {
    window.sessionStorage.setItem("mejuri-returning-from-checkout", "1");
    onClose();
    router.push(createCheckoutUrl());
  };

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-[9999] bg-black/30 transition-opacity duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-label="Close cart"
        tabIndex={open ? 0 : -1}
      />

      <div
        className={`fixed right-0 top-0 z-[10000] h-screen w-full bg-white font-sans text-black tracking-[-0.02em] shadow-2xl transition-transform duration-500 ease-in-out xl:w-[70vw] xl:max-w-[1350px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-20 cursor-pointer p-2 lg:right-8"
        aria-label="Close cart"
      >
        <X size={38} strokeWidth={1.2} />
      </button>

      <div className="grid h-full overflow-y-auto md:grid-cols-[58%_42%] lg:overflow-hidden">
        <section className="px-6 pb-14 pt-10 sm:px-10 lg:overflow-y-auto lg:px-12">
          <div className="mr-14 flex items-end justify-between border-b border-[#b7b2a6]">
            <div className="flex gap-8">
              <span className="border-b-2 border-black pb-4 text-[0.875rem]  uppercase leading-[28px] text-black">Bag</span>
              <button
                onClick={() => router.push("/wishlist")}
                className="cursor-pointer pb-4 text-[0.875rem] uppercase leading-[28px] text-[#6f6d66]"
              >
                Wishlist
              </button>
            </div>
            <span className="pb-4 text-[0.875rem] uppercase leading-[28px] text-[#6f6d66]">Style With</span>
          </div>

          <p className="mt-10 text-[0.875rem] leading-[1.4] text-black">Enjoy free standard shipping!</p>

          {loading ? (
            <p className="mt-16 text-[1rem] leading-[1.4] text-[#6f6d66]">Loading your bag...</p>
          ) : cartItems.length === 0 ? (
            <div className="mt-16">
              <h2 className="text-[1.25rem] font-bold uppercase leading-[28px] text-black">Your bag is empty</h2>
              <button onClick={onClose} className="mt-6 cursor-pointer border-b border-black pb-1 text-[14px] font-medium uppercase leading-none text-black">
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="mt-14 grid gap-16">
              {cartItems.map((item) => {
                const itemKey = `${item.productId}-${item.variantId}`;
                const isUpdating = updatingItem === itemKey;

                return (
                  <article key={itemKey} className="grid grid-cols-2 gap-6 sm:grid-cols-[48%_1fr]">
                    <div className="relative bg-[#f6f6f6] aspect-[61/71] ">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill  className="object-fill" />
                      ) : null}
                    </div>
                    <div className="py-1 text-black">
                      <h2 className="text-[0.775rem] uppercase leading-[28px] text-[#6f6d66] ">{item.title}</h2>
                      <p className="mt-0 text-[0.775rem] leading-[1.4] text-[#6f6d66]">{money(item.price)}</p>
                      <p className="mt-3 text-[0.775rem] leading-[1.4] text-[#6f6d66]">{item.variantTitle}</p>
                      <p className="mt-3 text-[0.775rem] leading-[1.4] text-[#6f6d66]">In Stock</p>

                      <div className="mt-7 flex items-center gap-4 text-[#6f6d66]">
                        <button
                          onClick={() => item.quantity > 1 && void mutateCartItem(item, "PATCH", item.quantity - 1)}
                          disabled={isUpdating || item.quantity === 1}
                          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`Decrease ${item.title} quantity`}
                        >
                          <Minus size={19} />
                        </button>
                        <span className="min-w-5 text-center text-[1.125rem] leading-[1.4]">{item.quantity}</span>
                        <button
                          onClick={() => void mutateCartItem(item, "PATCH", item.quantity + 1)}
                          disabled={isUpdating}
                          className="cursor-pointer disabled:opacity-35"
                          aria-label={`Increase ${item.title} quantity`}
                        >
                          <Plus size={19} />
                        </button>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-6 text-[14px] font-medium uppercase leading-none text-[#6f6d66]">
                        <button onClick={() => void moveToWishlist(item)} disabled={isUpdating} className="cursor-pointer border-b border-[#777] pb-1 disabled:cursor-not-allowed text-[#6f6d66] disabled:opacity-40">
                          Wishlist
                        </button>
                        <button onClick={() => void mutateCartItem(item, "DELETE")} disabled={isUpdating} className="cursor-pointer border-b border-[#777] pb-1 disabled:cursor-not-allowed text-[#6f6d66] disabled:opacity-40">
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className=" lg:overflow-y-auto sm:p-0 p-3 ">
          <div className="bg-[#f5f5f5] sm:px-8 sm:py-14 p-3">

         
          <h2 className="text-[1.25rem] uppercase leading-[28px] font-[450] text-black">Order Summary</h2>
          <div className="mt-16 grid gap-3 text-[1.125rem] leading-[1.4] text-[#6f6d66]">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-['SimonMono'] font-normal">{money(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span>Taxes</span><span>-</span></div>
            <div className="flex justify-between text-sm gap-5"><span>Estimated Shipping</span><span className="text-right">Calculated at checkout</span></div>
            <div className="flex justify-between text-sm text-black"><span className=" uppercase">Estimated Total</span><span className="font-['SimonMono'] font-normal">{money(subtotal)}</span></div>
          </div>

          <div className="mt-16">
            <h3 className="border-b border-[#b7b2a6] pb-4 text-[0.95rem] uppercase leading-[5px] text-black">You May Also Like</h3>
            <div className="mt-6 grid gap-8">
              {[ JEWELRY_CARE_KIT].map((product) => {
                const productKey = getProductKey(product);
                const variant = product.variants?.[0];
                const imageSrc = product.images?.[0]?.src;
                const isJewelryKit = product.isJewelryKit;

                return (
                  <article key={productKey} className="grid grid-cols-[38%_1fr] gap-5">
                    <div className="relative lg:min-h-[190px] min-h-[98px] bg-[#e9e9e7]">
                      {imageSrc ? <Image src={imageSrc} alt={product.title || "Suggested product"} fill sizes="190px" className="object-fill" /> : null}
                    </div>
                    <div>
                      <h4 className="text-[0.85rem] uppercase leading-[1.3] text-[#6f6d66]">{product.title}</h4>
                      <p className="mt-2 text-[0.85rem] leading-[1.4] text-[#6f6d66]">{variant?.price ? `$${variant.price}` : ""}</p>
                      <p className="mt-5 text-[0.85rem] leading-[1.4] text-[#6f6d66]">{variant?.title}</p>
                      <button
                        onClick={() => !isJewelryKit && void addSuggestion(product)}
                        disabled={!variant || (addingProduct === productKey && !isJewelryKit)}
                        className="mt-7 cursor-pointer text-[14px] font-medium uppercase leading-none text-[#6f6d66] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {addingProduct === productKey && !isJewelryKit ? "Adding..." : "Add +"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            onClick={goToCheckout}
            disabled={cartItems.length === 0}
            className="mt-10 h-[56px] w-full cursor-pointer bg-black px-[1.5rem] py-[0.75rem] text-[14px] font-normal uppercase leading-[1.25rem] tracking-[0.04em] text-white transition hover:bg-[#77766c] disabled:cursor-not-allowed disabled:bg-[#aaa]"
          >
            Checkout
          </button>
           </div>
        </aside>
      </div>
      </div>
    </>
  );
}
