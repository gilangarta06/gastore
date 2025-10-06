import { sendWhatsApp } from "./whatsapp";

export async function sendPaymentReminder({
  phone,
  customerName,
  productName,
  variantName,
  qty,
  price,
  paymentUrl,
  orderId,
}: {
  phone: string;
  customerName: string;
  productName: string;
  variantName: string;
  qty: number;
  price: number;
  paymentUrl?: string;
  orderId?: string;
}) {
  const total = price * qty;
  const date = new Date().toLocaleString("id-ID");

  const message = `
Halo *${customerName}*! 👋

Terima kasih telah melakukan pemesanan di GA Store.
Berikut detail pesanan Anda:

🧾 *Order ID:* ${orderId || "-"}
📦 *Produk:* ${productName}
📦 *Variant:* ${variantName}
💰 *Harga:* Rp${price.toLocaleString("id-ID")}
📦 *Qty:* ${qty}
💰 *Total:* Rp${total.toLocaleString("id-ID")}
📅 *Tanggal:* ${date}

⏰ *Silakan selesaikan pembayaran:*
${paymentUrl || "-"}

_Akun akan dikirim otomatis setelah pembayaran berhasil 💙_
`;

  await sendWhatsApp(phone, message);
}