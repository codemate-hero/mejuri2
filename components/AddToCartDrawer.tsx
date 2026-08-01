"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import PreCheckoutDrawer from "./PreCheckoutDrawer";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  product?: unknown;
};

type ProductVariant = {
  _id?: string;
  id?: string;
  shopifyVariantId?: string | number;
  title?: string;
  price?: string | number;
};

type SuggestedProduct = {
  _id?: string;
  id?: string;
  shopifyProductId?: string | number;
  variantId?: string;
  handle?: string;
  image?: string;
  images?: Array<{ src?: string }>;
  title?: string;
  name?: string;
  price?: string | number;
  variantTitle?: string;
  variants?: ProductVariant[];
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

const getSuggestionTerm = (items: CartItem[]) => {
  const lower = items
    .map((item) => `${item.productType || ""} ${item.title || ""}`)
    .join(" ")
    .toLowerCase();

  const keywords = ["necklace", "earring", "ring", "bracelet", "charm", "pendant", "hoop"];
  return keywords.find((keyword) => lower.includes(keyword)) || "jewelry";
};

const getSuggestionVariantId = (product: SuggestedProduct) => {
  const candidate = product.variants?.[0] || {};
  return (
    candidate.shopifyVariantId ||
    candidate._id ||
    candidate.id ||
    product.variantId ||
    null
  );
};

const getProductKey = (product: SuggestedProduct) =>
  String(product._id || product.id || product.shopifyProductId || product.handle || "");

const CART_UPDATED_EVENT = "mejuri-cart-updated";

const getUniqueProducts = (products: SuggestedProduct[]) => {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = getProductKey(product);
    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export default function AddToCartDrawer({ open, onClose }: DrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [activeTab, setActiveTab] = useState("ADD ON");
  const [addOnSuggestions, setAddOnSuggestions] = useState<SuggestedProduct[]>([]);
  const [styleWithSuggestions, setStyleWithSuggestions] = useState<SuggestedProduct[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [preCheckoutOpen, setPreCheckoutOpen] = useState(false);

  const fetchSuggestions = useCallback(async (items: CartItem[]) => {
    const term = getSuggestionTerm(items);
    setLoadingSuggestions(true);

    try {
      const [relatedRes, generalRes] = await Promise.all([
        fetch(`/api/products?q=${encodeURIComponent(term)}&limit=10`),
        fetch("/api/products?limit=20"),
      ]);
      const [relatedData, generalData] = await Promise.all([
        relatedRes.json(),
        generalRes.json(),
      ]);

      const relatedProducts: SuggestedProduct[] = relatedRes.ok && Array.isArray(relatedData.products)
        ? relatedData.products
        : [];
      const generalProducts: SuggestedProduct[] = generalRes.ok && Array.isArray(generalData.products)
        ? generalData.products
        : [];
      const allProducts = getUniqueProducts([...relatedProducts, ...generalProducts]);
      const addOns = allProducts.slice(0, 5);
      const addOnKeys = new Set(addOns.map(getProductKey));
      const styleWith = allProducts
        .filter((product) => !addOnKeys.has(getProductKey(product)))
        .slice(0, 5);

      setAddOnSuggestions(addOns);
      setStyleWithSuggestions(styleWith);
    } catch (error) {
      console.log("Get suggestions error:", error);
      setAddOnSuggestions([]);
      setStyleWithSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const fetchCart = useCallback(async (refreshSuggestions = true) => {
    try {
      const res = await fetch("/api/cart", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (res.ok) {
        const items: CartItem[] = Array.isArray(data.items) ? data.items : [];
        setCartItems(items);
        setSubtotal(Number(data.subtotal) || 0);
        if (refreshSuggestions) {
          await fetchSuggestions(items);
        }
      }
    } catch (error) {
      console.log("Get cart error:", error);
    }
  }, [fetchSuggestions]);

  const handleAddSuggestion = async (product: SuggestedProduct) => {
    const variantId = getSuggestionVariantId(product);
    if (!variantId) return;

    const productIdToUse = product._id || product.id;
    const productKey = getProductKey(product);
    if (!productIdToUse) return;

    setAddingProductId(productKey);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productId: productIdToUse,
          variantId,
          quantity: 1,
        }),
      });

      if (res.ok) {
        await fetchCart(false);
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
    } catch (error) {
      console.log("Add suggestion error:", error);
    } finally {
      setAddingProductId(null);
    }
  };

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      void fetchCart();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCart, open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[9998] bg-black/35 transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[9999] h-screen w-full max-w-[500px] overflow-y-auto bg-white text-black shadow-2xl transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={onClose} className="absolute right-6 top-5 z-20 cursor-pointer">
          <X size={34} strokeWidth={1.3} />
        </button>

        <div className="p-8">
          <h2 className="text-[23px] font-bold uppercase tracking-[0.04em]">
            Added To Your Cart
          </h2>

          {cartItems.length === 0 ? (
            <p className="mt-10 text-[16px]">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="mt-10 flex flex-row gap-6"
              >
                <div className="relative w-full aspect-[61/71] bg-[#f7f7f7]">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover p-8"
                  />
                </div>

                <div className="w-[55%]">
                  <h3 className="text-[15px] uppercase text-[#5f5f5f]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[13px]">${item.price}</p>

                  <p className="mt-5 text-[14px] text-[#5f5f5f]">
                    {item.variantTitle}
                  </p>

                  <p className="mt-4 text-[14px] text-[#5f5f5f]">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => {
              onClose();
              setPreCheckoutOpen(true);
            }}
            className="mt-12 h-[60px] font-display font-medium w-full cursor-pointer bg-black text-[15px] uppercase tracking-[0.06em] text-white transition hover:bg-[#79786c]"
          >
            View All Items In Cart ({cartItems.length})
          </button>

          <div className="mt-8 flex justify-between text-[18px] font-bold">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          {/* Tabs: ADD ON / STYLE WITH */}
          <div className="mt-8 border-t pt-6">
            <div className="flex gap-6 px-2">
              {["ADD ON", "STYLE WITH"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[15px] font-semibold uppercase tracking-[0.04em] ${
                    activeTab === tab
                      ? "border-b-2 border-black"
                      : "text-[#8b8b8b]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6 px-2">
              <div className="grid gap-6">
                {loadingSuggestions ? (
                  <p className="text-[14px] text-[#7a7a7a]">Loading suggestions...</p>
                ) : (activeTab === "ADD ON" ? addOnSuggestions : styleWithSuggestions).length === 0 ? (
                  <p className="text-[14px] text-[#7a7a7a]">No suggestions available right now.</p>
                ) : (
                  (activeTab === "ADD ON" ? addOnSuggestions : styleWithSuggestions).map((p) => {
                    const productKey = getProductKey(p);
                    const imageSrc = p.image || p.images?.[0]?.src;
                    const variantIdAvailable = !!getSuggestionVariantId(p);
                    const productIdAvailable = !!(p._id || p.id);
                    const disabled = !variantIdAvailable || !productIdAvailable || addingProductId === productKey;

                    return (
                    <div key={productKey} className="grid grid-cols-[90px_1fr] items-center gap-4">
                      <div className="relative h-[90px] w-[90px] bg-[#f7f7f7]">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={p.title || p.name || "Suggestion"}
                            fill
                            sizes="90px"
                            className="object-contain p-3"
                          />
                        ) : null}
                      </div>

                      <div>
                        <h4 className="text-[14px] uppercase text-[#5f5f5f]">{p.title || p.name}</h4>
                        <p className="mt-1 text-[14px]">${p.price || p.variants?.[0]?.price || "--"}</p>
                        <p className="mt-2 text-[13px] text-[#7a7a7a]">{p.variantTitle || p.variants?.[0]?.title || ""}</p>

                        <div className="mt-3">
                          <button
                            onClick={() => handleAddSuggestion(p)}
                            className="inline-flex items-center gap-2 rounded border border-[#e6e6e6] bg-[#f3f3f3] px-3 py-1 text-[13px] text-[#6b6b6b] disabled:opacity-60"
                            disabled={disabled}
                          >
                            {addingProductId === productKey ? "Adding..." : "ADD +"}
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <PreCheckoutDrawer
        open={preCheckoutOpen}
        onClose={() => setPreCheckoutOpen(false)}
      />
    </>
  );
}
