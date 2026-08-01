import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    variantTitle: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    addressLine1: {
      type: String,
      default: "",
    },

    addressLine2: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    postalCode: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userIp: {
      type: String
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: "Order must have at least one item",
      },
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      default: {},
    },

    subtotalAmount: {
      type: Number,
      required: true,
    },

    shippingAmount: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "usd",
      lowercase: true,
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "cash_on_delivery", "paypal"],
      default: "stripe",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },


    paypalOrderId: {
      type: String,
      default: null,
    },

    paypalCaptureId: {
      type: String,
      default: null,
    },


    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);