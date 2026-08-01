// app/api/wishlist/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserIdFromRequest } from "@/app/lib/auth";
import Wishlist from "@/app/models/Wishlist";

// GET wishlist
export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req);

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "products.productId",
    );

    if (wishlist) {
      wishlist.products = wishlist.products.filter((item) => item.productId);
    }

    return NextResponse.json({
      success: true,
      data: wishlist || { userId, products: [] },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// ADD product to wishlist
export async function POST(req) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req);
    const { productId, variantId } = await req.json();

    if (!productId || !variantId) {
      return NextResponse.json(
        { success: false, message: "productId and variantId are required" },
        { status: 400 },
      );
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [{ productId, variantId }],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (item) =>
          item.productId?.toString() === productId &&
          String(item.variantId) === String(variantId),
      );

      if (!alreadyExists) {
        wishlist.products.push({ productId, variantId });
        await wishlist.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// REMOVE product from wishlist
export async function DELETE(req) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req);
    const { productId, variantId } = await req.json();

    if (!productId || !variantId) {
      return NextResponse.json(
        { success: false, message: "productId and variantId are required" },
        { status: 400 },
      );
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $pull: {
          products: {
            productId,
            variantId: String(variantId),
          },
        },
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
