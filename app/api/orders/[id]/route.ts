// ========================================
// FILE 3: /app/api/orders/[id]/route.ts (FIXED)
// ========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { Types } from "mongoose";

// 🔍 Helper untuk cari order by _id, orderId, atau midtransOrderId
async function findOrderById(id: string) {
  // Coba sebagai MongoDB ObjectId
  if (Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id)
      .populate("productId", "name")
      .populate("userId", "username email");
    if (order) return order;
  }
  
  // Coba sebagai orderId (INV-XXXXXX)
  const orderByOrderId = await Order.findOne({ orderId: id })
    .populate("productId", "name")
    .populate("userId", "username email");
  if (orderByOrderId) return orderByOrderId;
  
  // Coba sebagai midtransOrderId (ORD-XXXXXX)
  const orderByMidtrans = await Order.findOne({ midtransOrderId: id })
    .populate("productId", "name")
    .populate("userId", "username email");
  if (orderByMidtrans) return orderByMidtrans;
  
  return null;
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

    // Coba hapus dengan berbagai cara
    let order;
    
    if (Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndDelete(id);
    }
    
    if (!order) {
      order = await Order.findOneAndDelete({ orderId: id });
    }
    
    if (!order) {
      order = await Order.findOneAndDelete({ midtransOrderId: id });
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
