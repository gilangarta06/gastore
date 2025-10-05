import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product"; // kalau perlu update stok
import { sendWhatsApp } from "@/lib/whatsapp"; // fungsi helper WA kamu

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { customerName, phone, productId, variant, qty } = body;

    // ✅ Generate custom INV ID
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderId = `INV-${date}-${random}`;

    // ✅ Kurangi stok varian (kalau ada)
    const product = await Product.findById(productId);
    if (product) {
      const targetVariant = product.variants.find(
        (v: any) => v.name === variant.name
      );
      if (targetVariant && targetVariant.quantity >= qty) {
        targetVariant.quantity -= qty;
        await product.save();
      }
    }

    // ✅ Simpan order ke DB
    const newOrder = await Order.create({
      orderId, // <== simpan order ID
      customerName,
      phone,
      productId,
      variant,
      qty,
      status: "pending",
    });

    // ✅ Kirim pesan WhatsApp
    const message = `
Halo *${customerName}*! 👋

Terima kasih telah melakukan pemesanan di Exlupay.
Berikut detail pesanan Anda:

🧾 *Order ID:* ${orderId}
📦 *Produk:* ${variant.name}
💰 *Harga:* Rp${variant.price.toLocaleString("id-ID")}
📦 *Qty:* ${qty}
📅 *Tanggal:* ${new Date().toLocaleString("id-ID")}

Silakan selesaikan pembayaran melalui tautan berikut (jika ada):
${newOrder.paymentUrl || "-"}

_Terima kasih telah berbelanja di Exlupay 💙_
`;

    await sendWhatsApp(phone, message);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    return NextResponse.json(
      { error: "Gagal membuat order" },
      { status: 500 }
    );
  }
}
