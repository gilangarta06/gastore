//lib/db/models/Accounts.ts
import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: String, required: true }, // nama variant, misal "Small", "Medium"
    username: { type: String, required: true },
    password: { type: String, required: true },
    sold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (models.Account) {
  delete models.Account;
}

export const Account = model("Account", AccountSchema);
