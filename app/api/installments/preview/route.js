import { connectDB } from "@/app/lib/db";
import Cart from "@/app/models/Cart";
import { calculateInstallments } from "@/app/lib/installmentCalculator";

export async function POST(req) {
  await connectDB();

  const { userId, installments = 4 } = await req.json();

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    return Response.json({ message: "Cart empty" }, { status: 400 });
  }

  let total = 0;

  const items = cart.items.map((item) => {
    const product = item.productId;

    const variant = product.variants.find(
      (v) => Number(v.shopifyVariantId) === Number(item.variantId)
    );

    const price = Number(variant.price);
    const subtotal = price * item.quantity;

    total += subtotal;

    return {
      productId: product._id,
      title: product.title,
      price,
      quantity: item.quantity,
      subtotal,
    };
  });

  const installmentPlan = calculateInstallments({
    totalAmount: total,
    installments,
  });

  return Response.json({
    subtotal: total,
    items,
    installmentPlan,
  });
}