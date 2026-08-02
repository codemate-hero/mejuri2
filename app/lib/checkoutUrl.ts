const randomUrlToken = (length: number) => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

type CheckoutPaymentPath =
  | "afterpay"
  | "afterpay/payment-gateway"
  | "klarna"
  | "klarna/entry"
  | "klarna/paypal";

export const createCheckoutUrl = (paymentMethod?: CheckoutPaymentPath) => {
  const checkoutToken = randomUrlToken(24);
  const query = new URLSearchParams({
    _r: randomUrlToken(48),
    _s: crypto.randomUUID(),
    _y: crypto.randomUUID(),
    auto_redirect: "false",
    edge_redirect: "true",
    skip_shop_pay: "true",
  });
  const paymentPath = paymentMethod ? `/${paymentMethod}` : "";

  return `/checkouts/cn/${checkoutToken}/en-us${paymentPath}?${query.toString()}`;
};
