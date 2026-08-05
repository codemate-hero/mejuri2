"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { hasAuthenticatedUserToken } from "@/app/lib/clientAuth";

export default function AccountDrawer({
  open,
  onClose,
  onSigninClick,
  onCreateAccountClick,
}: {
  open: boolean;
  onClose: () => void;
  onSigninClick: () => void;
  onCreateAccountClick: () => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(hasAuthenticatedUserToken(localStorage.getItem("token")));
    };

      checkAuth();

    window.addEventListener("mejuri-auth-updated", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("mejuri-auth-updated", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, [open]);

  const handleSignOut = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("mejuri-auth-updated"));

    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[998] bg-black/50 transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[999] h-screen w-full max-w-[570px] bg-white px-12 py-10 text-black shadow-2xl transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-7 top-7 text-black"
          aria-label="Close account drawer"
        >
          <X size={34} strokeWidth={1.5} />
        </button>

        {isLoggedIn ? (
          <div className="mt-8">
            <div className="flex items-start gap-8">
              <h2 className="whitespace-nowrap font-sans text-[18px] font-bold uppercase leading-none tracking-tight text-black">
                My Account
              </h2>

              <span className="text-[22px] leading-none text-black">→</span>

              <nav className="flex flex-col gap-7 font-sans text-[15px] font-normal text-black">
                <Link href="/account/profile" onClick={onClose}>
                  My Profile
                </Link>

                <Link href="/account/store-credit" onClick={onClose}>
                  Store Credits
                </Link>

                <Link href="/account/orders" onClick={onClose}>
                  My Orders
                </Link>

                <Link href="/account/returns" onClick={onClose}>
                  Returns
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-4 text-left font-sans text-[12px] font-bold uppercase text-black cursor-pointer"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        ) : (
          <div className="mt-11">
            <h2 className="font-[SyndicatGrotesk,Arial,Helvetica,sans-serif] text-[18px] font-bold uppercase leading-[18px] tracking-tight text-black">
              Discover all things Mejuri and more
            </h2>

            <p className='mt-6 max-w-[440px] font-[SimonMono,"Courier_New",Courier,monospace] text-[12px] font-bold leading-[20px] text-black'>
              One account to shop personalized recommendations and exclusive
              products. Plus, get priority sale access, free shipping every
              Monday, and more.
            </p>

            <button
              onClick={onSigninClick}
              className="mt-5 bg-black px-9 py-3 text-[14px] font-bold uppercase text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#79786c]"
            >
              Sign In
            </button>

            <p className='mt-5 font-[SimonMono,"Courier_New",Courier,monospace] text-[12px] font-bold'>
              New to Mejuri?{" "}
              <button
                onClick={onCreateAccountClick}
                className="underline underline-offset-4"
              >
                Create Account
              </button>
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
