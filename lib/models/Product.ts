import { Schema, model, models } from "mongoose";

// SubSchema untuk Account
const AccountSchema = new Schema({
  username: String,
  password: String,
  sold: { type: Boolean, default: false },
});

// SubSchema untuk Variant
const VariantSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
  accounts: [AccountSchema],
});

// Main Schema untuk Product
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // ✅ pastikan selalu ada
    price: Number,
    description: String,
    image: String,
    variants: [VariantSchema],
  },
  { timestamps: true }
);

// 🔥 Fix masalah schema cache
// Jika Product sudah pernah dibuat di `models`, hapus dulu biar schema terbaru kepake
if (models.Product) {
  delete models.Product;
}

export const Product = model("Product", ProductSchema);