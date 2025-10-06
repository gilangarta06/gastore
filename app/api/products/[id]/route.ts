import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";

// ✅ Helper: ambil ID dari params (karena kadang berupa Promise)
async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return id;
}

// =============================
// 📌 GET — Ambil 1 produk
// =============================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = await getId(context);

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    return NextResponse.json(
      { error: "Failed to get product" },
      { status: 500 }
    );
  }
}

// =============================
// ✏️ PUT — Update data produk
// =============================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = await getId(context);
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
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// =============================
// 🧩 PATCH — Variant & Stok & Delete Variant
// =============================
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

    // ✅ Tambah Variant
    if (body.action === "add_variant") {
      const { variant } = body;
      if (!variant.name || !variant.price || !variant.quantity) {
        return NextResponse.json(
          { error: "Variant data tidak lengkap" },
          { status: 400 }
        );
      }

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

    // ✅ Tambah Stok Variant + Akun
    if (body.action === "add_stock") {
      const { variantName, amount, accounts } = body;

      if (!variantName || !amount || !Array.isArray(accounts)) {
        return NextResponse.json(
          { error: "Data stok tidak lengkap" },
          { status: 400 }
        );
      }

      const variant = product.variants.find((v: any) => v.name === variantName);
      if (!variant) {
        return NextResponse.json(
          { error: "Variant tidak ditemukan" },
          { status: 404 }
        );
      }

      variant.quantity += Number(amount);

      if (accounts.length > 0) {
        variant.accounts.push(...accounts);
      }

      await product.save();
      return NextResponse.json({
        message: `Stok variant ${variantName} berhasil ditambahkan`,
        product,
      });
    }

    // ✅ Hapus Variant
    if (body.action === "delete_variant") {
      const { variantName } = body;

      if (!variantName) {
        return NextResponse.json(
          { error: "Nama variant wajib dikirim" },
          { status: 400 }
        );
      }

      const variantIndex = product.variants.findIndex(
        (v: any) => v.name === variantName
      );

      if (variantIndex === -1) {
        return NextResponse.json(
          { error: "Variant tidak ditemukan" },
          { status: 404 }
        );
      }

      product.variants.splice(variantIndex, 1);
      await product.save();

      return NextResponse.json({
        message: `Variant ${variantName} berhasil dihapus`,
        product,
      });
    }

    // ❌ Action tidak dikenali
    return NextResponse.json({ error: "Action tidak dikenali" }, { status: 400 });
  } catch (err) {
    console.error("Patch product error:", err);
    return NextResponse.json(
      { error: "Failed to patch product" },
      { status: 500 }
    );
  }
}

// =============================
// 🗑 DELETE — Hapus produk
// =============================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = await getId(context);

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
