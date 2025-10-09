// ========================================
// FILE 1: /app/api/orders/route.ts (FIXED)
// ========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { Product } from "@/lib/db/models/Product";
import { User } from "@/lib/db/models/User";
import { sendPaymentReminder } from "@/lib/services/whatsappPayment";

export async function GET() {
  try {
    await connectDB();
    await User.init();
    await Product.init();

    const orders = await Order.find()
      .populate("productId", "name")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.productId || !body.variant || !body.customerName || !body.phone || !body.qty) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    const product = await Product.findById(body.productId);
    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    const variant = product.variants.find((v: any) => v.name === body.variant);
    if (!variant) return NextResponse.json({ error: "Variant tidak ditemukan" }, { status: 404 });

    if (!variant.accounts || variant.accounts.length === 0) {
      return NextResponse.json({ error: "Stok akun habis" }, { status: 400 });
    }

    // 🎯 GENERATE 2 ID BERBEDA
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    
    // ✅ ID untuk USER (INV-XXXXXX) - dipakai di invoice, review, WA
    const orderId = `INV-${timestamp.toString().slice(-6)}${random.toString().padStart(4, '0')}`;
    
    // ✅ ID untuk MIDTRANS (ORD-XXXXXX) - dipakai untuk transaksi Midtrans
    const midtransOrderId = `ORD-${timestamp}-${random}`;

    console.log("📝 Generated IDs:");
    console.log("   - Order ID (user):", orderId);
    console.log("   - Midtrans ID:", midtransOrderId);

    // Ambil akun FIFO
    const selectedAccount = variant.accounts.shift();
    variant.quantity = (variant.quantity || 0) - 1;
    await product.save();

    // Request Midtrans (kirim midtransOrderId)
    const snapRes = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: midtransOrderId, // ⚠️ KIRIM midtransOrderId ke Midtrans
          gross_amount: variant.price * body.qty,
        },
        customer_details: {
          first_name: body.customerName,
          phone: body.phone,
          email: body.email || undefined,
        },
      }),
    });

    if (!snapRes.ok) {
      const errorText = await snapRes.text();
      console.error("Midtrans error:", errorText);
      
      // Kembalikan akun ke stok
      variant.accounts.unshift(selectedAccount);
      variant.quantity += 1;
      await product.save();
      
      return NextResponse.json({ error: "Gagal membuat transaksi di Midtrans" }, { status: 502 });
    }

    const snapData = await snapRes.json();

    // Simpan order dengan KEDUA ID
    const order = await Order.create({
      orderId,              // ✅ INV-XXXXXX (untuk user)
      midtransOrderId,      // ✅ ORD-XXXXXX (untuk Midtrans)
      customerName: body.customerName,
      phone: body.phone,
      email: body.email || undefined,
      productId: product._id,
      variant: { name: variant.name, price: variant.price },
      account: selectedAccount,
      qty: body.qty,
      total: variant.price * body.qty,
      status: "pending",
      paymentUrl: snapData.redirect_url,
      userId: body.userId || null,
    });

    console.log("✅ Order created with IDs:", {
      orderId: order.orderId,
      midtransOrderId: order.midtransOrderId
    });

    // Kirim WA reminder (pakai orderId untuk user)
    await sendPaymentReminder({
      phone: body.phone,
      customerName: body.customerName,
      productName: product.name,
      variantName: variant.name,
      qty: body.qty,
      price: variant.price,
      paymentUrl: snapData.redirect_url,
      orderId: order.orderId, // ✅ Kirim INV-XXXXXX ke user
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,           // ✅ Return orderId (INV-XXXXXX)
      paymentUrl: snapData.redirect_url,
    }, { status: 201 });
    
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}