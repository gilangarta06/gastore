import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true }, // 🆕 ID internal sistem
    midtransOrderId: { type: String, required: true, unique: true }, // 🛡️ ID ke Midtrans
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    variant: {
      name: String,
      price: Number,
    },
    account: {
      username: { type: String, default: null },
      password: { type: String, default: null },
    },
    qty: Number,
    total: Number,
    status: { type: String, default: "pending" },
    paymentUrl: String,
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
