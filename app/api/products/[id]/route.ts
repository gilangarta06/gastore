import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

// GET single product
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    return NextResponse.json({ error: "Failed to get product" }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        category: body.category,
        description: body.description,
        image: body.image,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// PATCH - untuk operasi khusus (add variant, dll)
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Handle add variant
    if (body.action === "add_variant") {
      const { variant } = body;

      // Validasi
      if (!variant.name || !variant.price || !variant.quantity) {
        return NextResponse.json(
          { error: "Variant data tidak lengkap" },
          { status: 400 }
        );
      }

      // Tambahkan variant baru
      product.variants.push({
        name: variant.name,
        price: variant.price,
        quantity: variant.quantity,
        accounts: variant.accounts || [],
      });

      await product.save();

      return NextResponse.json({
        message: "Variant berhasil ditambahkan",
        product,
      });
    }

    // Handle operasi lain di sini jika perlu
    return NextResponse.json({ error: "Action tidak dikenali" }, { status: 400 });
  } catch (err) {
    console.error("Patch product error:", err);
    return NextResponse.json({ error: "Failed to patch product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}