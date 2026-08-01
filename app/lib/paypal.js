const PAYPAL_API_URLS = new Set([
  "https://api-m.sandbox.paypal.com",
  "https://api-m.paypal.com",
]);

function normalizePayPalBaseUrl(value) {
  if (!value) return null;

  const trimmedValue = String(value).trim().replace(/\/+$/, "");
  if (!trimmedValue) return null;

  return /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;
}

function getPayPalBaseUrl() {
  const explicitEnvironment = process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase();

  if (explicitEnvironment === "live") {
    return "https://api-m.paypal.com";
  }

  if (explicitEnvironment === "sandbox") {
    return "https://api-m.sandbox.paypal.com";
  }

  const configuredBaseUrl = normalizePayPalBaseUrl(process.env.PAYPAL_BASE_URL);

  if (configuredBaseUrl) {
    if (!PAYPAL_API_URLS.has(configuredBaseUrl)) {
      throw new Error(
        "PAYPAL_BASE_URL must be https://api-m.sandbox.paypal.com or https://api-m.paypal.com"
      );
    }

    return configuredBaseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://api-m.paypal.com";
  }

  return "https://api-m.sandbox.paypal.com";
}

async function readPayPalResponse(res, action) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const details = data.details?.map((detail) => detail.description).join(" ");
    const baseUrl = getPayPalBaseUrl();
    const defaultMessage = details || data.message || `PayPal ${action} failed (${res.status})`;
    const errorMessage =
      res.status === 401
        ? `${defaultMessage}. Check that PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL, and PAYPAL_ENVIRONMENT match the same environment (sandbox or live). Current PayPal endpoint: ${baseUrl}`
        : defaultMessage;
    const error = new Error(errorMessage);
    error.status = res.status;
    error.paypalDebugId = res.headers.get("paypal-debug-id");
    throw error;
  }

  return data;
}

// 1. Get Access Token
export async function getPayPalToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must both be configured"
    );
  }

  const auth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const res = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await readPayPalResponse(res, "authentication");

  if (!data.access_token) {
    throw new Error("PayPal did not return an access token");
  }

  return data.access_token;
}

// 2. Create Order
export async function createPayPalOrder({
  amount,
  currency,
  orderId,
  returnUrl,
  cancelUrl,
  paymentSource = "paypal",
}) {
  const token = await getPayPalToken();

  const res = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `create-${orderId}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      ...(paymentSource === "paypal"
        ? {
            payment_source: {
              paypal: {
                experience_context: {
                  user_action: "PAY_NOW",
                  return_url: returnUrl,
                  cancel_url: cancelUrl,
                },
              },
            },
          }
        : {}),
      purchase_units: [
        {
          reference_id: orderId,
          custom_id: orderId, // IMPORTANT (used in webhook)
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2),
          },
        },
      ],
    }),
  });

  return readPayPalResponse(res, "order creation");
}

export async function capturePayPalOrder(paypalOrderId) {
  const token = await getPayPalToken();
  const requestId = `capture-${paypalOrderId}`;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(
        `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "PayPal-Request-Id": requestId,
          },
        }
      );

      return await readPayPalResponse(res, "order capture");
    } catch (error) {
      const isRetryable =
        !error.status || error.status === 500 || error.status === 503;

      if (attempt === 1 || !isRetryable) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
}

export async function verifyPayPalWebhook(headers, webhookEvent) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not configured");
  }

  const verificationPayload = {
    auth_algo: headers.get("paypal-auth-algo"),
    cert_url: headers.get("paypal-cert-url"),
    transmission_id: headers.get("paypal-transmission-id"),
    transmission_sig: headers.get("paypal-transmission-sig"),
    transmission_time: headers.get("paypal-transmission-time"),
    webhook_id: webhookId,
    webhook_event: webhookEvent,
  };

  const missingHeader = Object.entries(verificationPayload).find(
    ([key, value]) => key !== "webhook_id" && key !== "webhook_event" && !value
  );

  if (missingHeader) {
    const error = new Error(`Missing PayPal webhook header: ${missingHeader[0]}`);
    error.status = 400;
    throw error;
  }

  const token = await getPayPalToken();
  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationPayload),
    }
  );
  const verification = await readPayPalResponse(
    response,
    "webhook signature verification"
  );

  return verification.verification_status === "SUCCESS";
}
