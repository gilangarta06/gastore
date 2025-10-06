import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📩 Midtrans notification received:", body);

    const { order_id, transaction_status } = body;

    // 🔍 Cari order berdasarkan ID Midtrans
    const order = await Order.findOne({ midtransOrderId: order_id }).populate("productId");
    if (!order) {
      console.warn(`⚠️ Order ${order_id} tidak ditemukan`);
      return NextResponse.json({ message: "Order not found" }, { status: 200 });
    }

    const product = await Product.findById(order.productId?._id);
    if (!product) {
      console.warn(`⚠️ Produk ${order.productId?._id} tidak ditemukan`);
      return NextResponse.json({ message: "Product not found" }, { status: 200 });
    }

    // 🎯 Handle status Midtrans
    if (["settlement", "capture"].includes(transaction_status)) {
      order.status = "paid";
      await order.save();

      // ✅ Ambil akun dari order (sudah disimpan saat order dibuat)
      const account = order.account;

      if (account && account.username && account.password) {
        // 💬 Link invoice (public page)
        const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${order._id}`;

        // 💬 Pesan WhatsApp KONFIRMASI + AKUN
        const message = `
🎉 *PEMBAYARAN BERHASIL!* 🎉

Halo *${order.customerName}*! 

Terima kasih atas pembayaran Anda.
Berikut detail pesanan dan akun Anda:

━━━━━━━━━━━━━━━━━
🧾 *Order ID:* ${order.midtransOrderId}
📦 *Produk:* ${product.name}
🔖 *Variant:* ${order.variant.name}
💰 *Total Dibayar:* Rp${order.total?.toLocaleString("id-ID")}
📅 *Tanggal:* ${new Date().toLocaleString("id-ID")}

━━━━━━━━━━━━━━━━━
🔐 *DETAIL AKUN ANDA*
━━━━━━━━━━━━━━━━━

👤 *Username:* \`${account.username}\`
🔑 *Password:* \`${account.password}\`

━━━━━━━━━━━━━━━━━

🧾 *Lihat Invoice Anda:*
${invoiceUrl}

⚠️ *PENTING:*
- Simpan baik-baik data akun ini
- Jangan share ke orang lain
- Segera ganti password setelah login

_Terima kasih telah berbelanja di GA Store! 💙_
_Butuh bantuan? Hubungi admin kami._
`;

        await sendWhatsApp(order.phone, message);
        console.log(`✅ Order ${order_id} sukses — akun & invoice dikirim ke ${order.phone}`);
      } else {
        console.warn(`⚠️ Akun tidak tersedia di order ${order_id}`);
      }
    } 
    else if (transaction_status === "pending") {
      order.status = "pending";
      await order.save();
      console.log(`⏳ Order ${order_id} masih pending`);
    } 
    else if (["expire", "cancel", "deny"].includes(transaction_status)) {
      order.status = "cancelled";
      await order.save();
      
      // ⚠️ Kembalikan akun ke stok jika pembayaran gagal
      const variant = product.variants.find((v: any) => v.name === order.variant.name);
      if (variant && order.account) {
        variant.accounts.unshift(order.account); // Kembalikan akun ke depan array
        variant.quantity += 1;
        await product.save();
        console.log(`♻️ Akun dikembalikan ke stok untuk order ${order_id}`);
      }
      
      console.log(`❌ Order ${order_id} dibatalkan`);
    }

    return NextResponse.json({ message: "Notification handled" }, { status: 200 });
  } catch (err) {
    console.error("❌ Midtrans callback error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}