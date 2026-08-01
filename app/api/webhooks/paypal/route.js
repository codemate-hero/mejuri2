import mongoose from "mongoose";
import { connectDB } from "@/app/lib/db";
import { verifyPayPalWebhook } from "@/app/lib/paypal";
import Order from "@/app/models/Order";
import { clearUserCart } from "@/app/lib/cart-cleanup";

const HANDLED_EVENTS = new Set([
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.PENDING",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.DECLINED",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
]);

const findWebhookOrder = async (resource) => {
  const customId = resource?.custom_id;
  const paypalOrderId = resource?.supplementary_data?.related_ids?.order_id;

  if (customId && mongoose.isValidObjectId(customId)) {
    const order = await Order.findById(customId);
    if (order) return order;
  }

  if (paypalOrderId) {
    return Order.findOne({ paypalOrderId });
  }

  return null;
};

export async function POST(req) {
  try {
    const rawBody = await req.text();
    let event;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return Response.json({ message: "Invalid webhook JSON" }, { status: 400 });
    }

    const isVerified = await verifyPayPalWebhook(req.headers, event);
    if (!isVerified) {
      return Response.json({ message: "Invalid PayPal signature" }, { status: 401 });
    }

    const eventType = event.event_type;
    if (!HANDLED_EVENTS.has(eventType)) {
      return Response.json({ success: true, ignored: true });
    }

    await connectDB();

    const resource = event.resource;
    const order = await findWebhookOrder(resource);
    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const capturedAmount = Number(resource?.amount?.value);
      const capturedCurrency = resource?.amount?.currency_code?.toLowerCase();
      const amountMatches =
        Number.isFinite(capturedAmount) &&
        capturedAmount.toFixed(2) === Number(order.totalAmount).toFixed(2);
      const currencyMatches = capturedCurrency === order.currency?.toLowerCase();

      if (!amountMatches || !currencyMatches) {
        return Response.json(
          { message: "Captured amount or currency does not match the order" },
          { status: 409 }
        );
      }

      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            paymentStatus: "paid",
            orderStatus: "processing",
            paypalCaptureId: resource.id,
            paidAt: new Date(),
          },
        }
      );

      await clearUserCart(order.userId, order.userIp);
    } else if (
      eventType === "PAYMENT.CAPTURE.DENIED" ||
      eventType === "PAYMENT.CAPTURE.DECLINED"
    ) {
      await Order.updateOne(
        { _id: order._id, paymentStatus: { $ne: "paid" } },
        { $set: { paymentStatus: "failed" } }
      );
    } else if (eventType === "PAYMENT.CAPTURE.PENDING") {
      await Order.updateOne(
        { _id: order._id, paymentStatus: { $ne: "paid" } },
        { $set: { paymentStatus: "pending" } }
      );
    } else {
      await Order.updateOne(
        { _id: order._id },
        { $set: { paymentStatus: "refunded" } }
      );
    }

    return Response.json({ success: true, eventType });
  } catch (error) {
    const status = error.status || 500;
    console.error("PayPal webhook failed:", error);

    return Response.json(
      { message: error.message || "PayPal webhook processing failed" },
      { status }
    );
  }
}
