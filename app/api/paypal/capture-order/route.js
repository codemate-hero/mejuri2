import { connectDB } from "@/app/lib/db";
import { capturePayPalOrder } from "@/app/lib/paypal";
import Order from "@/app/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const { paypalOrderId } = await req.json();

    if (!paypalOrderId) {
      return Response.json({ message: "PayPal order ID is required" }, { status: 400 });
    }

    // The PayPal order ID is returned by PayPal after buyer approval. Do not
    // depend on browser-local login state after the external redirect.
    const order = await Order.findOne({ paypalOrderId });
    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return Response.json({
        success: true,
        orderId: order._id,
        paymentStatus: "paid",
        webhookPending: false,
      });
    }

    // A previous request already captured the PayPal order. Only the webhook
    // is allowed to promote paymentStatus to paid.
    if (order.paypalCaptureId) {
      return Response.json({
        success: true,
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        webhookPending: order.paymentStatus !== "paid",
      });
    }

    const capture = await capturePayPalOrder(paypalOrderId);
    if (capture.status !== "COMPLETED") {
      return Response.json(
        { message: `PayPal payment status is ${capture.status || "unknown"}` },
        { status: 409 }
      );
    }

    const capturedPayment = capture.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capturedPayment?.id) {
      return Response.json(
        { message: "PayPal did not return a capture ID" },
        { status: 409 }
      );
    }

    // Save only the external capture reference. PAYMENT.CAPTURE.COMPLETED is
    // the sole authority that marks the order paid and clears the cart.
    await Order.updateOne(
      { _id: order._id },
      { $set: { paypalCaptureId: capturedPayment.id } }
    );

    const refreshedOrder = await Order.findById(order._id).select("paymentStatus");

    return Response.json({
      success: true,
      orderId: order._id,
      paymentStatus: refreshedOrder?.paymentStatus || "pending",
      webhookPending: refreshedOrder?.paymentStatus !== "paid",
    });
  } catch (error) {
    const status = error.status === 401 ? 401 : 500;
    return Response.json(
      {
        message: error.message || "Unable to capture PayPal payment",
        debugId: error.paypalDebugId || undefined,
      },
      { status }
    );
  }
}
