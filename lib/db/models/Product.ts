//lib/db/models/Product.ts
import { Schema, model, models, Document } from "mongoose";

// =========================
// 🧩 SubSchema Account
// =========================
const AccountSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  sold: { type: Boolean, default: false },
});

// =========================
// 🧩 SubSchema Variant
// =========================
const VariantSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  accounts: { type: [AccountSchema], default: [] },
});

// =========================
// 🏪 Main Schema Product
// =========================
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
);

// =========================
// 🧠 TypeScript Interface
// =========================
export interface IAccount {
  username: string;
  password: string;
  sold: boolean;
}

export interface IVariant {
  name: string;
  price: number;
  quantity: number;
  accounts: IAccount[];
}

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  variants: IVariant[];
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// 🔥 Fix schema cache
// =========================
if (models.Product) {
  delete models.Product;
}

export const Product = model<IProduct>("Product", ProductSchema);
