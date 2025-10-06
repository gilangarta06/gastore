// ✅ /app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

// ✅ GET order by orderId (ORD-...)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params wajib Promise
) {
  try {
    await connectDB();
    const { id } = await context.params; // 👈 pakai await

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await Order.findOne({ orderId: id })
      .populate("productId", "name")
      .populate("userId", "username email");

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("❌ Get order error:", err);
    return NextResponse.json({ error: "Gagal memuat order" }, { status: 500 });
  }
}

// ✅ DELETE order by orderId
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 sama di sini
) {
  try {
    await connectDB();
    const { id } = await context.params; // 👈 pakai await

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await Order.findOneAndDelete({ orderId: id });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error("❌ Delete order error:", err);
    return NextResponse.json({ error: "Gagal menghapus order" }, { status: 500 });
  }
}

// ✅ PATCH order by orderId
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 dan di sini juga
) {
  try {
    await connectDB();
    const { id } = await context.params; // 👈 pakai await
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate({ orderId: id }, { $set: body }, { new: true });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("❌ Update order error:", err);
    return NextResponse.json({ error: "Gagal update order" }, { status: 500 });
  }
}
