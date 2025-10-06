import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  orderId: string; // ✅ Ubah ke string
  productId: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  rating: number; // 1-5
  review: string;
  variantName?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    orderId: {
      type: String, // ✅ bukan ObjectId lagi
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
    variantName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index untuk query cepat
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ orderId: 1 });

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
