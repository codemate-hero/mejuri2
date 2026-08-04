import Stripe from "stripe";
import { connectDB } from "@/app/lib/db";
import { findProductVariant } from "@/app/lib/utils";
import { getUserIpFromRequest } from "@/app/lib/getUserIp";

import Cart from "@/app/models/Cart";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { message: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await connectDB();
    const userIp = getUserIpFromRequest(req);
    const userId = userIp || "guest";
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return Response.json({ message: "Cart is empty" }, { status: 400 });
    }

    let subtotal = 0;

    let removedMissingProducts = false;
    const validCartItems = cart.items.filter((item) => {
      if (item.productId) return true;
      removedMissingProducts = true;
      return false;
    });

    if (removedMissingProducts) {
      cart.items = validCartItems;
      cart.paymentIntentId = null;
      await cart.save();
    }

    if (validCartItems.length === 0) {
      return Response.json({ message: "Cart is empty" }, { status: 400 });
    }

    validCartItems.forEach((item) => {
      const product = item.productId;

      const variant = findProductVariant(product, item.variantId);

      const price = Number(variant?.price || 0);
      subtotal += price * item.quantity;
    });

    const amount = Math.round(subtotal * 100);

    if (amount <= 0) {
      return Response.json({ message: "Invalid cart amount" }, { status: 400 });
    }

    let paymentIntent;

    if (cart.paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.update(cart.paymentIntentId, {
        amount,
      });
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId,
          cartId: cart._id.toString(),
        },
      });

      cart.paymentIntentId = paymentIntent.id;
      await cart.save();
    }




    return Response.json({
      message: cart.paymentIntentId
        ? "Payment intent ready"
        : "Payment intent created",
      amount,
      subtotal,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("Stripe error:", error);

    return Response.json({ message: "Payment intent failed" }, { status: 500 });
  }
}
