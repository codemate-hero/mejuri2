import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: String,
    },
    variantId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userIp: {
      type: String,
    },
    items: [CartItemSchema],
    paymentIntentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);