// /lib/db/models/Review.ts
import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    orderId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: true,
      index: true 
    },
    customerName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    review: { 
      type: String, 
      required: true, 
      maxlength: 500 
    },
    variantName: { 
      type: String 
    },
    isApproved: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Compound index untuk query yang efisien
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ isApproved: 1, productId: 1 });

export const Review = models.Review || model("Review", ReviewSchema);