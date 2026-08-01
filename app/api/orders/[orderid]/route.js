import { connectDB } from "@/app/lib/db";
import { getUserIdFromRequest } from "@/app/lib/auth";
import Order from "@/app/models/Order";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;

    const userId = getUserIdFromRequest(req);

    if (!orderId) {
      return Response.json(
        { message: "orderId is required" },
        { status: 400 }
      );
    }

    const query = { _id: orderId, userId };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to fetch order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
