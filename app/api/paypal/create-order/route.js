import { connectDB } from "@/app/lib/db";
import Cart from "@/app/models/Cart";
import Order from "@/app/models/Order";
import { createPayPalOrder } from "@/app/lib/paypal";
import { getUserIdFromRequest } from "@/app/lib/auth";
import { getUserIpFromRequest } from "@/app/lib/getUserIp";
import { findProductVariant } from "@/app/lib/utils";

export async function POST(req) {
  try {
    await connectDB();

    const {
      shippingAddress = {},
      paymentSource = "paypal",
    } = await req.json();
    const currency = "USD";
    const userId = getUserIdFromRequest(req);
    const userIp = getUserIpFromRequest(req);

    const cart = await Cart.findOne({ userId, userIp }).populate("items.productId");

    if (!cart || !cart.items.length) {
      return Response.json({ message: "Cart is empty" }, { status: 400 });
    }

    const items = [];

    for (const item of cart.items) {
      const product = item.productId;
      if (!product) continue;

      const variant = findProductVariant(product, item.variantId);
      if (!variant) continue;

      const price = Number(variant.price || 0);
      const quantity = Number(item.quantity || 1);

      if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(quantity) || quantity < 1) {
        return Response.json(
          { message: `Invalid cart item: ${product.title}` },
          { status: 400 }
        );
      }

      items.push({
        productId: product._id,
        name: product.title,
        image: product.images?.[0]?.src || null,
        variantTitle: variant.title || null,
        variantId: String(item.variantId),
        price,
        quantity,
        subtotal: price * quantity,
      });
    }

    if (!items.length) {
      return Response.json({ message: "No valid items found in cart" }, { status: 400 });
    }

    const subtotalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const order = await Order.create({
      userId,
      userIp,
      items,
      shippingAddress,
      subtotalAmount,
      totalAmount: subtotalAmount,
      currency,
      paymentMethod: "paypal",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;

    try {
      const paypalOrder = await createPayPalOrder({
        amount: subtotalAmount,
        currency,
        orderId: order._id.toString(),
        returnUrl: `${baseUrl}/paypal/return`,
        cancelUrl: `${baseUrl}/checkout?paypal=cancelled`,
        paymentSource,
      });
      const approvalUrl =
        paypalOrder.links?.find((link) => link.rel === "payer-action")?.href ||
        paypalOrder.links?.find((link) => link.rel === "approve")?.href;

      if (!paypalOrder.id || (paymentSource === "paypal" && !approvalUrl)) {
        throw new Error(
          paymentSource === "paypal"
            ? "PayPal did not return an approval URL"
            : "PayPal did not return an order ID"
        );
      }

      order.paypalOrderId = paypalOrder.id;
      await order.save();

      return Response.json({
        orderId: order._id,
        paypalOrderId: paypalOrder.id,
        approvalUrl: approvalUrl || null,
      });
    } catch (error) {
      order.paymentStatus = "failed";
      await order.save();
      throw error;
    }
  } catch (error) {
    const status = error.status === 401 ? 401 : 500;
    return Response.json(
      {
        message: error.message || "Unable to start PayPal checkout",
        debugId: error.paypalDebugId || undefined,
      },
      { status }
    );
  }
}
