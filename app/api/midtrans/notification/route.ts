import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { sendWhatsApp } from "@/lib/whatsapp"; // ✅ huruf A besar

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📩 Midtrans notification received:", body);

    const { order_id, transaction_status } = body;

    // 🔎 Cari order berdasarkan ID Midtrans
    const order = await Order.findOne({ midtransOrderId: order_id }).populate("productId");
    if (!order) {
      console.warn(`⚠️ Order ${order_id} tidak ditemukan`);
      return NextResponse.json({ message: "Order not found" }, { status: 200 });
    }

    // 🔎 Pastikan produk tersedia
    if (!order.productId) {
      console.warn(`⚠️ Produk tidak ditemukan di order ${order_id}`);
      return NextResponse.json({ message: "Product missing in order" }, { status: 200 });
    }

    const product = await Product.findById(order.productId._id);
    if (!product) {
      console.warn(`⚠️ Produk ${order.productId._id} tidak ditemukan`);
      return NextResponse.json({ message: "Product not found" }, { status: 200 });
    }

    // 🎯 Handle status Midtrans
    if (transaction_status === "settlement") {
      order.status = "completed";
      await order.save();

      // Cari variant yang sesuai
      const variant = product.variants.find(
        (v: any) => v.name === order.variant.name
      );

      if (variant) {
        // Kurangi stok
        if (typeof variant.quantity === "number" && variant.quantity >= order.qty) {
          variant.quantity -= order.qty;
        }

        // Cari akun yang belum terjual
        const account = variant.accounts?.find((a: any) => a.sold === false);

        if (account) {
          account.sold = true;
          await product.save();

          // 💬 Kirim pesan WhatsApp berisi akun
          const message = `
✅ *Pembayaran Berhasil!*
━━━━━━━━━━━━━━━
🧾 *Order ID:* ${order.midtransOrderId || "-"}
📦 *Produk:* ${product.name}
🔖 *Varian:* ${variant.name}
💰 *Total:* Rp${order.total?.toLocaleString("id-ID") || "0"}
📅 *Tanggal:* ${new Date().toLocaleString("id-ID")}

🔐 *Akun Anda:*
• Username: ${account.username}
• Password: ${account.password}

Terima kasih sudah berbelanja di Exlupay 💙
`;

          await sendWhatsApp(order.phone, message);
          console.log(`✅ Order ${order_id} sukses: akun dikirim ke ${order.phone}`);
        } else {
          console.warn(`⚠️ Tidak ada akun tersedia untuk ${product.name} - ${variant.name}`);
        }
      } else {
        console.warn(`⚠️ Variant ${order.variant.name} tidak ditemukan`);
      }
    } 
    else if (transaction_status === "pending") {
      order.status = "pending";
      await order.save();
      console.log(`⏳ Order ${order_id} masih pending`);
    } 
    else {
      order.status = "cancelled";
      await order.save();
      console.log(`❌ Order ${order_id} dibatalkan`);
    }

    return NextResponse.json({ message: "Notification handled" }, { status: 200 });
  } catch (err) {
    console.error("❌ Midtrans notif error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
