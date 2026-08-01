import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import User from "@/app/models/User";

const FILTER_LIMITS = {
  city: 100,
  state: 100,
  address: 200,
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getShippingFilters(searchParams) {
  const filters = {};

  for (const [name, maxLength] of Object.entries(FILTER_LIMITS)) {
    const value = searchParams.get(name)?.trim();

    if (value && value.length > maxLength) {
      const error = new Error(
        `${name} must be ${maxLength} characters or fewer`
      );
      error.status = 400;
      throw error;
    }

    if (value) filters[name] = value;
  }

  return filters;
}

async function requireAdmin(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(
      authHeader.slice("Bearer ".length),
      process.env.JWT_SECRET
    );
  } catch {
    const error = new Error("Your session is invalid or expired");
    error.status = 401;
    throw error;
  }

  const userId = decoded.userId || decoded.id;
  const user = await User.findById(userId).select("role").lean();

  if (!user || user.role !== "admin") {
    const error = new Error("Admin access required");
    error.status = 403;
    throw error;
  }
}

export async function GET(req) {
  try {
    await connectDB();
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const filters = getShippingFilters(searchParams);
    const query = {};

    if (filters.city) {
      query["shippingAddress.city"] = {
        $regex: escapeRegex(filters.city),
        $options: "i",
      };
    }

    if (filters.state) {
      query["shippingAddress.state"] = {
        $regex: escapeRegex(filters.state),
        $options: "i",
      };
    }

    if (filters.address) {
      const addressRegex = {
        $regex: escapeRegex(filters.address),
        $options: "i",
      };
      query.$or = [
        { "shippingAddress.addressLine1": addressRegex },
        { "shippingAddress.addressLine2": addressRegex },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return Response.json({
      message: "Orders fetched successfully",
      count: orders.length,
      filters,
      orders,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to fetch orders",
        error: error.message,
      },
      { status: error.status || 500 }
    );
  }
}
