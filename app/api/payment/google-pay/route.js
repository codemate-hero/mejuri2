import Stripe from "stripe";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { success: false, error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await req.json();

    const paymentData = body.paymentData ?? body;
    const subtotal = Number(body.subtotal ?? paymentData.transactionInfo?.totalPrice);
    const amount = Math.round(subtotal * 100);

    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { success: false, error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    // 1. Extract Stripe token from Google Pay
    const tokenString =
      paymentData.paymentMethodData?.tokenizationData?.token;

    if (!tokenString) {
      return Response.json(
        { success: false, error: "Google Pay token is missing." },
        { status: 400 }
      );
    }

    const tokenData = JSON.parse(tokenString);
    const token = tokenData.id;

    // 2. Create a PaymentMethod from token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: token,
      },
    });

    // 3. Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethod.id,
      // confirmation_method: "automatic",
      confirm: true,
      description: "Google Pay Payment",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return Response.json({
      success: true,
      paymentIntent,
    });
  } catch (err) {
    console.error("Stripe Payment Error:", err);

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
