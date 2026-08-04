import Stripe from "stripe";
import { connectDB } from "@/app/lib/db";
import { findProductVariant } from "@/app/lib/utils";
import Cart from "@/app/models/Cart";
import Order from "@/app/models/Order";
import { getUserIpFromRequest } from "@/app/lib/getUserIp";

function getCartProductVariant(product, variantId) {
  return findProductVariant(product, variantId);
}

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ message: "Stripe is not configured" }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await connectDB();
    console.log("Connected to DB in checkout route");
    const body = await req.json();

    const {
      shippingAddress = {},
      shippingAmount = 0,
      taxAmount = 0,
      discountAmount = 0,
    } = body;
    const currency = "usd";
    const userIp = getUserIpFromRequest(req);
    const userId = userIp || "guest";
    console.log("Checkout visitor IP:", userIp);

    // Derive a base URL for redirect targets. Prefer env var, otherwise build
    // from request headers so Stripe always gets an absolute URL with scheme.
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;

    const cart = await Cart.findOne({ userId, userIp }).populate("items.productId");

    if (!cart || !cart.items.length) {
      return Response.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.productId;

      if (!product) {
        continue;
      }

      const variant = getCartProductVariant(product, cartItem.variantId);

      if (!variant) {
        continue;
      }

      const price = Number(variant.price || 0);
      const quantity = Number(cartItem.quantity || 1);

      if (!Number.isFinite(price) || price <= 0) {
        return Response.json(
          {
            message: `Invalid price for product: ${product.title}`,
          },
          { status: 400 }
        );
      }

      if (!Number.isFinite(quantity) || quantity < 1) {
        return Response.json(
          {
            message: `Invalid quantity for product: ${product.title}`,
          },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product._id,
        variantId: Number(cartItem.variantId),
        name: product.title,
        image: product.images?.[0]?.src || null,
        variantTitle: variant.title || null,
        price,
        quantity,
        subtotal: price * quantity,
      });
    }

    if (!orderItems.length) {
      return Response.json(
        { message: "No valid items found in cart" },
        { status: 400 }
      );
    }

    const subtotalAmount = orderItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const parsedShippingAmount = Number(shippingAmount || 0);
    const parsedTaxAmount = Number(taxAmount || 0);
    const parsedDiscountAmount = Number(discountAmount || 0);

    const totalAmount =
      subtotalAmount +
      parsedShippingAmount +
      parsedTaxAmount -
      parsedDiscountAmount;

    if (totalAmount <= 0) {
      return Response.json(
        { message: "Total amount must be greater than 0" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      shippingAddress,
      userIp,
      subtotalAmount,
      shippingAmount: parsedShippingAmount,
      taxAmount: parsedTaxAmount,
      discountAmount: parsedDiscountAmount,
      totalAmount,
      currency,
      paymentMethod: "stripe",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    const lineItems = orderItems.map((item) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.variantTitle
            ? `${item.name} - ${item.variantTitle}`
            : item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (parsedShippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(parsedShippingAmount * 100),
        },
        quantity: 1,
      });
    }

    if (parsedTaxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(parsedTaxAmount * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    if (!session || !session.url) {
      return Response.json(
        { message: "Stripe did not return a checkout URL", error: JSON.stringify(session) },
        { status: 500 }
      );
    }

    order.stripeSessionId = session.id;
    await order.save();





    return Response.json({
      message: "Checkout session created successfully",
      orderId: order._id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to create checkout session",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
