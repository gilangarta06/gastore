import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    customerName: String,
    phone: String,
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    variant: {
      name: String,
      price: Number,
    },
    // ✅ Tambahkan field untuk menyimpan akun yang dibeli
    account: {
      username: { type: String, default: null },
      password: { type: String, default: null },
    },
    qty: Number,
    total: Number,
    status: { type: String, default: "pending" },
    midtransOrderId: String,
    paymentUrl: String,
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);