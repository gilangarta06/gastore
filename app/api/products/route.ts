import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";

// ✅ GET semua product
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ POST buat tambah product baru
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST product error:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
