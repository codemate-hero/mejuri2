import { connectDB } from "@/app/lib/db";
import { getUserIdFromRequest } from "@/app/lib/auth";
import { getUserIpFromRequest } from "@/app/lib/getUserIp";

import Order from "@/app/models/Order";

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

export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req);
    const userIp = getUserIpFromRequest(req);
    const { searchParams } = new URL(req.url);
    const filters = getShippingFilters(searchParams);
    const query = { userId, userIp };

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

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

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
