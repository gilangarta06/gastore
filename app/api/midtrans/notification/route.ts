import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { Product } from "@/lib/db/models/Product";
import { sendWhatsApp } from "@/lib/services/whatsapp";

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

    const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${order._id}`;

    // 🎯 Handle status Midtrans
    if (["settlement", "capture"].includes(transaction_status)) {
      order.status = "paid";
      await order.save();

      const account = order.account;

      if (account && account.username && account.password) {
        // 💬 Pesan ke PEMBELI
        const messageCustomer = `
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
👤 *Username:* \`${account.username}\`
🔑 *Password:* \`${account.password}\`

🧾 *Lihat Invoice Anda:*
${invoiceUrl}

_Terima kasih telah berbelanja di GA Store 💙_
`;

        // 💬 Pesan ke ADMIN
        const messageAdmin = `
📢 *ORDER BARU LUNAS!*

🧾 *Order ID:* ${order.midtransOrderId}
👤 *Nama:* ${order.customerName}
📞 *Nomor:* ${order.phone}
📦 *Produk:* ${product.name} (${order.variant.name})
💰 *Total:* Rp${order.total?.toLocaleString("id-ID")}
📅 *Tanggal:* ${new Date().toLocaleString("id-ID")}

🔗 *Invoice:* ${invoiceUrl}

✅ Order berhasil dibayar dan akun sudah terkirim ke pembeli.
`;

        await sendWhatsApp(order.phone, messageCustomer); // ke pembeli
        if (process.env.ADMIN_PHONE) {
          await sendWhatsApp(process.env.ADMIN_PHONE, messageAdmin); // ke admin
        }

        console.log(`✅ Order ${order_id} sukses — notifikasi dikirim ke pembeli & admin`);
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
        variant.accounts.unshift(order.account);
        variant.quantity += 1;
        await product.save();
        console.log(`♻️ Akun dikembalikan ke stok untuk order ${order_id}`);
      }

      // 💬 Kirim info pembatalan ke admin
      if (process.env.ADMIN_PHONE) {
        await sendWhatsApp(
          process.env.ADMIN_PHONE,
          `❌ *ORDER DIBATALKAN*\n🧾 ${order.midtransOrderId}\n👤 ${order.customerName}\nProduk: ${product.name} (${order.variant.name})`
        );
      }

      console.log(`❌ Order ${order_id} dibatalkan`);
    }

    return NextResponse.json({ message: "Notification handled" }, { status: 200 });
  } catch (err) {
    console.error("❌ Midtrans callback error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
