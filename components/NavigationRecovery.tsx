"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function NavigationRecovery() {
  const pathname = usePathname();

  useEffect(() => {
    const recoveryKey = "mejuri-navigation-recovering-url";
    const initialNavigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (initialNavigationEntry?.type === "reload") {
      window.sessionStorage.removeItem(recoveryKey);
      window.sessionStorage.removeItem("mejuri-returning-from-checkout");
    }

    const clearLockedUi = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.pointerEvents = "";
      document.documentElement.style.pointerEvents = "";
    };

    const shouldRecoverRoute = () => {
      const path = window.location.pathname;
      return (
        path.startsWith("/products") ||
        path.startsWith("/collections") ||
        path.startsWith("/shop") ||
        path.startsWith("/shop-all") ||
        path.startsWith("/stores") ||
        path.startsWith("/wishlist") ||
        path.startsWith("/search")
      );
    };

    const recoverBackNavigation = () => {
      if (window.location.pathname.startsWith("/checkout") || !shouldRecoverRoute()) {
        return false;
      }

      const url = `${window.location.pathname}${window.location.search}`;
      const recoveringUrl = window.sessionStorage.getItem(recoveryKey);

      if (recoveringUrl === url) {
        return false;
      }

      window.sessionStorage.setItem(recoveryKey, url);
      window.sessionStorage.removeItem("mejuri-returning-from-checkout");
      window.location.reload();
      return true;
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      clearLockedUi();
      window.requestAnimationFrame(clearLockedUi);

      const isCheckoutRoute = window.location.pathname.startsWith("/checkout");
      const returningFromCheckout =
        window.sessionStorage.getItem("mejuri-returning-from-checkout") === "1";
      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const isBackForward =
        event.persisted || navigationEntry?.type === "back_forward";

      if (!isCheckoutRoute && (returningFromCheckout || isBackForward)) {
        recoverBackNavigation();
        return;
      }

      if (!isBackForward) {
        window.sessionStorage.removeItem(recoveryKey);
      }
    };

    const handlePageHide = () => {
      clearLockedUi();
    };

    const handlePopState = () => {
      clearLockedUi();
      window.setTimeout(() => {
        recoverBackNavigation();
      }, 0);
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  return null;
}
