// app/api/orders/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product"; // kalau perlu update stok
import { sendWhatsApp } from "@/lib/whatsapp"; // Pastikan ini benar

export async function POST(req: Request) {
  try {
    // 1. Koneksi DB
    await connectDB();
    
    // 2. Ambil data dari request
    const body = await req.json();
    const { customerName, phone, productId, variant, qty, useMidtrans = true } = body;

    // 3. Cek produk
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const targetVariant = product.variants.find((v: any) => v.name === variant.name);
    if (!targetVariant) {
      return NextResponse.json({ error: "Varian tidak ditemukan" }, { status: 404 });
    }

    // 4. Cek stok
    if (targetVariant.quantity < qty) {
      return NextResponse.json(
        { error: `Stok tidak mencukupi. Tersedia: ${targetVariant.quantity}` },
        { status: 400 }
      );
    }

    // 5. Generate INV ID
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderId = `INV-${date}-${random}`;

    // 6. Kurangi stok
    targetVariant.quantity -= qty;
    await product.save();

    // 7. Handle Midtrans (jika diaktifkan)
    let paymentUrl = null;
    let midtransOrderId = null;

    if (useMidtrans) {
      const snapRes = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: orderId,
            gross_amount: targetVariant.price * qty,
          },
          customer_details: {
            first_name: customerName,
            phone: phone,
          },
        }),
      });

      const snapData = await snapRes.json();

      if (!snapRes.ok) {
        return NextResponse.json(
          { error: "Gagal menghubungi Midtrans", details: snapData },
          { status: 500 }
        );
      }

      paymentUrl = snapData.redirect_url;
      midtransOrderId = orderId;
    }

    // 8. Simpan order ke MongoDB
    const newOrder = await Order.create({
      orderId,
      customerName,
      phone,
      productId,
      variant: { name: variant.name, price: targetVariant.price },
      qty,
      status: "pending",
      midtransOrderId,
      paymentUrl,
    });

    // 9. Kirim WA otomatis
    const message = `
Halo *${customerName}*! 👋

Terima kasih telah melakukan pemesanan di Exlupay.
Berikut detail pesanan Anda:

🧾 *Order ID:* ${orderId}
📦 *Produk:* ${variant.name}
💰 *Harga:* Rp${targetVariant.price.toLocaleString("id-ID")}
📦 *Qty:* ${qty}
📅 *Tanggal:* ${new Date().toLocaleString("id-ID")}

${paymentUrl ? `Silakan selesaikan pembayaran di sini: ${paymentUrl}` : `Pesanan Anda sedang diproses.`}

_Terima kasih telah berbelanja di Exlupay 💙_`;

    await sendWhatsApp(phone, message);

    // 10. Kembalikan respons
    return NextResponse.json(newOrder, { status: 201 });

  } catch (err) {
    console.error("❌ Kesalahan saat membuat pesanan:", err);
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 }
    );
  }
}
