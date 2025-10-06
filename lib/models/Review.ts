import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

export const Review = models.Review || model("Review", ReviewSchema);
