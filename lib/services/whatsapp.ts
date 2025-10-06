// lib/whatsapp.ts
console.log("✅ [DEBUG] whatsapp.ts berhasil dimuat");

export async function sendWhatsApp(to: string, message: string) {
  console.log("📥 Mencoba kirim ke:", to);

  try {
    let normalized = to.replace(/\D/g, "");
    if (normalized.startsWith("0")) normalized = "62" + normalized.slice(1);
    if (!normalized.startsWith("62")) normalized = "62" + normalized;

    console.log("📞 Nomor setelah normalisasi:", normalized);

    const res = await fetch("https://app.wapanels.com/api/create-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        appkey: process.env.WA_APPKEY as string,
        authkey: process.env.WA_AUTHKEY as string,
        to: normalized,
        message,
      }),
    });

    const data = await res.json();
    console.log("📊 Respons dari wapanels:", data);

    // ✅ CEK SESUAI FORMAT RESPONSE WAPANELS
    if (data.message_status === "Success" && data.data?.status_code === 200) {
      console.log(`✅ Pesan WA berhasil terkirim ke ${normalized}`);
      return data;
    }

    // Jika gagal
    console.error("❌ Pesan gagal:", data);
    throw new Error(data.message || "Gagal mengirim pesan");

  } catch (err: any) {
    console.error("❌ sendWhatsApp error:", err.message || err);
    throw err;
  }
}