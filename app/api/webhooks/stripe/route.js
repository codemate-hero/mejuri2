import Stripe from "stripe";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { clearUserCart } from "@/app/lib/cart-cleanup";

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ message: "Stripe webhook is not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return Response.json(
      {
        message: `Webhook signature verification failed: ${error.message}`,
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (!orderId) {
        return Response.json(
          { message: "orderId missing in Stripe metadata" },
          { status: 400 }
        );
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return Response.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      if (order.paymentStatus === "paid") {
        await clearUserCart(order.userId || userId, order.userIp);
        return Response.json({ received: true });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      order.stripeSessionId = session.id;
      order.stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null;
      order.paidAt = new Date();

      await order.save();

      await clearUserCart(order.userId || userId, order.userIp);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "failed",
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json(
      {
        message: "Webhook handling failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
