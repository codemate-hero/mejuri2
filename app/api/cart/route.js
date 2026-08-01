// import { connectDB } from "@/app/lib/db";
// import Cart from "@/app/models/Cart";
// import Product from "@/app/models/Product";

// export async function POST(req) {
//   await connectDB();

//   const { userId, productId, variantId, quantity = 1 } = await req.json();

//   if (!userId || !productId || !variantId) {
//     return Response.json(
//       { message: "userId, productId and variantId are required" },
//       { status: 400 }
//     );
//   }

//   const product = await Product.findById(productId);

//   if (!product) {
//     return Response.json(
//       { message: "Product not found" },
//       { status: 404 }
//     );
//   }

//   const variantsWithIds = (product.variants || []).filter(
//     (variant) => variant.shopifyVariantId
//   );
//   const variantExists = variantsWithIds.length
//     ? variantsWithIds.some(
//         (variant) => Number(variant.shopifyVariantId) === Number(variantId)
//       )
//     : Number(product.shopifyProductId) === Number(variantId);

//   if (!variantExists) {
//     return Response.json(
//       { message: "Variant not found" },
//       { status: 404 }
//     );
//   }

//   let cart = await Cart.findOne({ userId });

//   if (!cart) {
//     cart = await Cart.create({
//       userId,
//       paymentIntentId: null,
//       items: [
//         {
//           productId,
//           variantId,
//           quantity,
//         },
//       ],
//     });
//   } else {
//     const existingItem = cart.items.find(
//       (item) =>
//         item.productId.toString() === productId &&
//         Number(item.variantId) === Number(variantId)
//     );

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({
//         productId,
//         variantId,
//         quantity,
//       });
//     }

//     // cart change hua, old payment intent clear
//     cart.paymentIntentId = null;

//     await cart.save();
//   }

//   return Response.json({
//     message: "Product added to cart",
//     cart,
//   });
// }

// export async function GET(req) {
//   await connectDB();

//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");

//   if (!userId) {
//     return Response.json(
//       { message: "userId is required" },
//       { status: 400 }
//     );
//   }

//   const cart = await Cart.findOne({ userId }).populate("items.productId");

//   if (!cart) {
//     return Response.json({
//       message: "Cart is empty",
//       items: [],
//       subtotal: 0,
//     });
//   }

//   let removedMissingProducts = false;
//   const validCartItems = cart.items.filter((item) => {
//     if (item.productId) return true;
//     removedMissingProducts = true;
//     return false;
//   });

//   if (removedMissingProducts) {
//     cart.items = validCartItems;
//     cart.paymentIntentId = null;
//     await cart.save();
//   }

//   const items = validCartItems.map((item) => {
//     const product = item.productId;

//     const variant = (product.variants || []).find((variant) =>
//       variant.shopifyVariantId
//         ? Number(variant.shopifyVariantId) === Number(item.variantId)
//         : Number(product.shopifyProductId) === Number(item.variantId)
//     );

//     const price = variant?.price || 0;

//     return {
//       productId: product._id,
//       title: product.title,
//       handle: product.handle,
//       image: product.images?.[0]?.src || null,
//       variantId: item.variantId,
//       variantTitle: variant?.title || null,
//       price,
//       quantity: item.quantity,
//       total: price * item.quantity,
//     };
//   });

//   const subtotal = items.reduce((sum, item) => sum + item.total, 0);

//   return Response.json({
//     message: "Cart fetched successfully",
//     items,
//     subtotal,
//   });
// }





import { connectDB } from "@/app/lib/db";
import { findProductVariant } from "@/app/lib/utils";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Product";
import { getUserIdFromRequest } from "@/app/lib/auth";
import { getUserIpFromRequest } from "@/app/lib/getUserIp";
import { clearUserCart } from "@/app/lib/cart-cleanup";
// export async function POST(req) {
//   try {
//     await connectDB();

//     const { productId, variantId, quantity = 1 } = await req.json();
//     const userId = getUserIdFromRequest(req);
//     console.log("Adding to cart for userId:", userId);
//     if (!userId || !productId || variantId === undefined || variantId === null) {
//       return Response.json(
//         { message: "userId, productId and variantId are required" },
//         { status: 400 }
//       );
//     }

//     const parsedQuantity = Number(quantity);

//     if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
//       return Response.json(
//         { message: "Quantity must be a valid number greater than 0" },
//         { status: 400 }
//       );
//     }

//     const product = await Product.findById(productId);

//     if (!product) {
//       return Response.json(
//         { message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     const variant = findProductVariant(product, variantId);

//     if (!variant) {
//       return Response.json(
//         { message: "Variant not found" },
//         { status: 404 }
//       );
//     }

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = await Cart.create({
//         userId,
//         paymentIntentId: null,
//         items: [
//           {
//             productId,
//             variantId: String(variantId),
//             quantity: parsedQuantity,
//           },
//         ],
//       });
//     } else {
//       const existingItem = cart.items.find(
//         (item) =>
//           item.productId.toString() === productId &&
//           String(item.variantId) === String(variantId)
//       );

//       if (existingItem) {
//         existingItem.quantity += parsedQuantity;
//       } else {
//         cart.items.push({
//           productId,
//           variantId: String(variantId),
//           quantity: parsedQuantity,
//         });
//       }

      
//       cart.paymentIntentId = null;
//       await cart.save();
//     }

//     return Response.json({
//       message: "Product added to cart",
//       cart,
//     });
//   } catch (error) {
//     return Response.json(
//       {
//         message: "Failed to add product to cart",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  try {
    await connectDB();

    const { productId, variantId, quantity = 1 } = await req.json();

    const userId = getUserIdFromRequest(req);
    const userIp = getUserIpFromRequest(req);

    console.log("Adding to cart for userId:", userId);
    console.log("User IP:", userIp);

    if (!userId || !productId || variantId === undefined || variantId === null) {
      return Response.json(
        { message: "userId, productId and variantId are required" },
        { status: 400 }
      );
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      return Response.json(
        { message: "Quantity must be a valid number greater than 0" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const variant = findProductVariant(product, variantId);

    if (!variant) {
      return Response.json(
        { message: "Variant not found" },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userId ,userIp});

    if (!cart) {
      cart = await Cart.create({
        userId,
        userIp,
        paymentIntentId: null,
        items: [
          {
            productId,
            variantId: String(variantId),
            quantity: parsedQuantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          String(item.variantId) === String(variantId)
      );

      if (existingItem) {
        existingItem.quantity += parsedQuantity;
      } else {
        cart.items.push({
          productId,
          variantId: String(variantId),
          quantity: parsedQuantity,
        });
      }

      // Store latest IP address
      cart.userIp = userIp;

      // Reset payment intent because cart changed
      cart.paymentIntentId = null;

      await cart.save();
    }

    return Response.json({
      message: "Product added to cart",
      userIp,
      cart,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to add product to cart",
        error: error.message,
      },
      { status: 500 }
    );
  }
}



export async function PATCH(req) {
  try {
    await connectDB();

    const { productId, variantId, quantity } = await req.json();
    const userId = getUserIdFromRequest(req);
    const parsedQuantity = Number(quantity);

    if (!userId || !productId || variantId === undefined || variantId === null) {
      return Response.json(
        { message: "userId, productId and variantId are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return Response.json(
        { message: "Quantity must be a whole number greater than 0" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });
    const item = cart?.items.find(
      (candidate) =>
        candidate.productId.toString() === String(productId) &&
        String(candidate.variantId) === String(variantId)
    );

    if (!cart || !item) {
      return Response.json({ message: "Cart item not found" }, { status: 404 });
    }

    item.quantity = parsedQuantity;
    cart.paymentIntentId = null;
    await cart.save();

    return Response.json({ message: "Cart quantity updated", cart });
  } catch (error) {
    return Response.json(
      { message: "Failed to update cart", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({}));
    const { productId, variantId, clearCart = false } = body;
    const userId = getUserIdFromRequest(req);
    const userIp = getUserIpFromRequest(req);

    if (clearCart) {
      const result = await clearUserCart(userId, userIp);
      return Response.json({
        message: "Cart cleared",
        deletedCount: result.deletedCount || 0,
      });
    }

    if (!userId || !productId || variantId === undefined || variantId === null) {
      return Response.json(
        { message: "userId, productId and variantId are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId,userIp });

    if (!cart) {
      return Response.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (candidate) =>
        candidate.productId.toString() === String(productId) &&
        String(candidate.variantId) === String(variantId)
    );

    if (itemIndex === -1) {
      return Response.json({ message: "Cart item not found" }, { status: 404 });
    }

    cart.items.splice(itemIndex, 1);
    cart.paymentIntentId = null;
    await cart.save();

    return Response.json({ message: "Product removed from cart", cart });
  } catch (error) {
    return Response.json(
      { message: "Failed to remove cart item", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req);
        const userIp = getUserIpFromRequest(req);

    console.log("GET cart for URL:", userId);

    if (!userId) {
      return Response.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId,userIp }).populate("items.productId");

    if (!cart) {
      return Response.json({
        message: "Cart is empty",
        items: [],
        subtotal: 0,
      });
    }

    let removedMissingProducts = false;

    const validCartItems = cart.items.filter((item) => {
      if (item.productId) return true;

      removedMissingProducts = true;
      return false;
    });

    if (removedMissingProducts) {
      cart.items = validCartItems;
      await cart.save();
    }

    const items = validCartItems
      .map((item) => {
        const product = item.productId;

        const variant = findProductVariant(product, item.variantId);

        if (!variant) {
          return null;
        }

        const price = Number(variant.price || 0);
        const quantity = Number(item.quantity || 1);

        return {
          productId: product._id,
          title: product.title,
          handle: product.handle,
          productType: product.productType || null,
          image: product.images?.[0]?.src || null,
          variantId: item.variantId,
          variantTitle: variant.title || null,
          price,
          quantity,
          total: price * quantity,
        };
      })
      .filter(Boolean);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    return Response.json({
      message: "Cart fetched successfully",
      items,
      subtotal,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Failed to fetch cart",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
