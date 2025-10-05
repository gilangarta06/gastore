// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { sendPaymentReminder } from "@/lib/whatsappPayment";

interface OrderRequest {
  customerName: string;
  phone: string;
  productId: string;
  variant: { name: string; price: number };
  qty: number;
}

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { params } = context;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await Order.findById(id).populate("productId");
    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json({ error: "Gagal mengambil order" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { params } = context;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const body: OrderRequest = await req.json();
    const { customerName, phone, productId, variant, qty } = body;

    if (!customerName || !phone || !productId || !variant?.name || !variant?.price || !qty) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const targetVariant = product.variants.find(v => v.name === variant.name);
    if (!targetVariant) {
      return NextResponse.json({ error: "Variant tidak ditemukan" }, { status: 404 });
    }

    if (targetVariant.quantity < qty) {
      return NextResponse.json({ error: "Stok tidak cukup" }, { status: 400 });
    }

    // Kurangi stok
    targetVariant.quantity -= qty;
    await product.save();

    // Generate order ID custom
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderId = `INV-${date}-${random}`;

    const newOrder = await Order.create({
      orderId,
      customerName,
      phone,
      productId,
      variant,
      qty,
      status: "pending",
      createdAt: new Date(),
    });

    await sendPaymentReminder({
      phone,
      customerName,
      productName: product.name,
      variantName: variant.name,
      qty,
      price: variant.price,
      paymentUrl: newOrder.paymentUrl || "",
      orderId,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    return NextResponse.json({ error: "Gagal membuat order" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { params } = context;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error("❌ Delete order error:", err);
    return NextResponse.json({ error: "Gagal menghapus order" }, { status: 500 });
  }
}
