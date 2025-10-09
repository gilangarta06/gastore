// ========================================
// FILE 2: /app/api/midtrans/notification/route.ts (FIXED)
// ========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { Product } from "@/lib/db/models/Product";
import { sendWhatsApp } from "@/lib/services/whatsapp";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📩 Midtrans notification received:", JSON.stringify(body, null, 2));

    const { order_id, transaction_status, fraud_status } = body;

    // 🔍 Cari order berdasarkan midtransOrderId (ORD-XXXXXX)
    const order = await Order.findOne({ midtransOrderId: order_id }).populate("productId");
    
    if (!order) {
      console.warn(`⚠️ Order dengan midtransOrderId ${order_id} tidak ditemukan`);
      return NextResponse.json({ message: "Order not found" }, { status: 200 });
    }

    console.log(`✅ Order ditemukan: ${order.orderId} (Midtrans: ${order.midtransOrderId})`);

    const product = await Product.findById(order.productId?._id);
    if (!product) {
      console.warn(`⚠️ Produk tidak ditemukan`);
      return NextResponse.json({ message: "Product not found" }, { status: 200 });
    }

    // 🎯 INVOICE URL - pakai orderId (INV-XXXXXX) untuk user
    const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${order.orderId}`;

    console.log(`📝 Status: ${transaction_status}, Fraud: ${fraud_status || 'N/A'}`);

    // Handle status transaksi
    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        order.status = "paid";
        await order.save();
        console.log(`✅ Order ${order.orderId} paid (capture + accept)`);
        await sendNotifications(order, product, invoiceUrl);
      } else {
        order.status = "pending";
        await order.save();
        console.log(`⏳ Order ${order.orderId} pending (fraud: ${fraud_status})`);
      }
    } 
    else if (transaction_status === "settlement") {
      order.status = "paid";
      await order.save();
      console.log(`✅ Order ${order.orderId} paid (settlement)`);
      await sendNotifications(order, product, invoiceUrl);
    } 
    else if (transaction_status === "pending") {
      order.status = "pending";
      await order.save();
      console.log(`⏳ Order ${order.orderId} pending`);
    } 
    else if (["expire", "cancel", "deny"].includes(transaction_status)) {
      order.status = "cancelled";
      await order.save();
      
      await returnAccountToStock(order, product);

      if (process.env.ADMIN_PHONE) {
        await sendWhatsApp(
          process.env.ADMIN_PHONE,
          `❌ *ORDER DIBATALKAN*\n🧾 ${order.orderId}\n👤 ${order.customerName}\nProduk: ${product.name} (${order.variant.name})`
        );
      }

      console.log(`❌ Order ${order.orderId} dibatalkan`);
    }

    return NextResponse.json({ message: "Notification handled" }, { status: 200 });
    
  } catch (err) {
    console.error("❌ Midtrans callback error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 📤 Helper: Kirim notifikasi
async function sendNotifications(order: any, product: any, invoiceUrl: string) {
  const account = order.account;

  if (account && account.username && account.password) {
    // 💬 Pesan ke PEMBELI (pakai orderId INV-XXXXXX)
    const messageCustomer = `
🎉 *PEMBAYARAN BERHASIL!* 🎉

Halo *${order.customerName}*! 

Terima kasih atas pembayaran Anda.
Berikut detail pesanan dan akun Anda:

━━━━━━━━━━━━━━━━━
🧾 *Order ID:* ${order.orderId}
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

🧾 *Order ID:* ${order.orderId}
🆔 *Midtrans ID:* ${order.midtransOrderId}
👤 *Nama:* ${order.customerName}
📞 *Nomor:* ${order.phone}
📦 *Produk:* ${product.name} (${order.variant.name})
💰 *Total:* Rp${order.total?.toLocaleString("id-ID")}
📅 *Tanggal:* ${new Date().toLocaleString("id-ID")}

🔗 *Invoice:* ${invoiceUrl}

✅ Order berhasil dibayar dan akun sudah terkirim ke pembeli.
`;

    try {
      await sendWhatsApp(order.phone, messageCustomer);
      console.log(`✅ WA ke pembeli ${order.phone} berhasil`);
      
      if (process.env.ADMIN_PHONE) {
        await sendWhatsApp(process.env.ADMIN_PHONE, messageAdmin);
        console.log(`✅ WA ke admin berhasil`);
      }
    } catch (err) {
      console.error("❌ Error sending WA:", err);
    }

  } else {
    console.warn(`⚠️ Akun tidak tersedia di order ${order.orderId}`);
  }
}

// ♻️ Helper: Kembalikan akun ke stok
async function returnAccountToStock(order: any, product: any) {
  const variant = product.variants.find((v: any) => v.name === order.variant.name);
  if (variant && order.account) {
    variant.accounts.unshift(order.account);
    variant.quantity += 1;
    await product.save();
    console.log(`♻️ Akun dikembalikan ke stok untuk order ${order.orderId}`);
  }
}
