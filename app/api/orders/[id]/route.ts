// ✅ /app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Types } from "mongoose";

// 🔍 Helper untuk cari order by _id atau orderId
async function findOrderById(id: string) {
  if (Types.ObjectId.isValid(id)) {
    return await Order.findById(id)
      .populate("productId", "name")
      .populate("userId", "username email");
  } else {
    return await Order.findOne({ orderId: id })
      .populate("productId", "name")
      .populate("userId", "username email");
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await findOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("❌ Get order error:", err);
    return NextResponse.json({ error: "Gagal memuat order" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    let order;
    if (Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndDelete(id);
    } else {
      order = await Order.findOneAndDelete({ orderId: id });
    }

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error("❌ Delete order error:", err);
    return NextResponse.json({ error: "Gagal menghapus order" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    let order;
    if (Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndUpdate(id, { $set: body }, { new: true });
    } else {
      order = await Order.findOneAndUpdate({ orderId: id }, { $set: body }, { new: true });
    }

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("❌ Update order error:", err);
    return NextResponse.json({ error: "Gagal update order" }, { status: 500 });
  }
}
