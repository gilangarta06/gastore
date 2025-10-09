import { sendWhatsApp } from "./whatsapp";

export async function sendPaymentReminder(data: {
  phone: string;
  customerName: string;
  productName: string;
  variantName: string;
  qty: number;
  price: number;
  paymentUrl: string;
  orderId: string; // ✅ INV-XXXXXX
}) {
  const message = `
🛒 *PESANAN BARU*

Halo *${data.customerName}*!

Pesanan Anda telah dibuat:

━━━━━━━━━━━━━━━━━
🧾 *Order ID:* ${data.orderId}
📦 *Produk:* ${data.productName}
🔖 *Variant:* ${data.variantName}
📦 *Jumlah:* ${data.qty}
💰 *Total:* Rp${(data.price * data.qty).toLocaleString("id-ID")}
━━━━━━━━━━━━━━━━━

💳 *Selesaikan Pembayaran:*
${data.paymentUrl}

⏰ Mohon selesaikan dalam 24 jam.

_Terima kasih! - GA Store_
`;

  const { sendWhatsApp } = await import("./whatsapp");
  return sendWhatsApp(data.phone, message);
}