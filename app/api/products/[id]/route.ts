import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

// GET product by ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ await dulu
  await connectDB();
  const product = await Product.findById(id);
  return NextResponse.json(product);
}

// UPDATE product
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ await dulu
  await connectDB();
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE product
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ await dulu
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted" });
}
