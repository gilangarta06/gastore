import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

// ✅ DELETE handler with async params
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ params sekarang Promise
) {
  try {
    await connectDB();

    // ✅ Await params sebelum mengakses propertinya
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID order tidak ditemukan" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order berhasil dihapus" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Delete order error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus order" },
      { status: 500 }
    );
  }
}

// ✅ GET handler (jika ada)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID order tidak ditemukan" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id)
      .populate("productId", "name")
      .populate("userId", "username email");

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("❌ Get order error:", err);
    return NextResponse.json(
      { error: "Gagal memuat order" },
      { status: 500 }
    );
  }
}

// ✅ PATCH/PUT handler (jika ada - untuk update status)
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID order tidak ditemukan" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("❌ Update order error:", err);
    return NextResponse.json(
      { error: "Gagal update order" },
      { status: 500 }
    );
  }
}