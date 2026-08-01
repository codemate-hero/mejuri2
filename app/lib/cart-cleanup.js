import Cart from "@/app/models/Cart";

export async function clearUserCart(userId, userIp) {
  if (!userId || !userIp) {
    return { deletedCount: 0 };
  }

  return Cart.deleteMany({ userId, userIp });
}
