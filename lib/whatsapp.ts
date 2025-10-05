// lib/whatsapp.ts
console.log("✅ [DEBUG] whatsapp.ts berhasil dimuat");

export async function sendWhatsApp(to: string, message: string) {
  console.log("📥 Mencoba kirim ke:", to, "dengan pesan:", message);

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

    console.log("📊 Respons dari wapanels:", data); // ➡️ Ini kunci!

    // Karena status_code: 200 tapi status false → kita cek secara manual
    if (res.status !== 200) {
      console.error("❌ Error HTTP:", res.status, data);
      throw new Error(`Kesalahan HTTP: ${res.status}`);
    }

    if (!data.status) {
      // Ini adalah kasus kritis: wapanels bilang "gagal", tapi HTTP 200
      console.error("❌ Pesan gagal dikirim menurut wapanels:", data.message || "Tidak ada pesan error");
      throw new Error(data.message || "Gagal mengirim pesan melalui panel");
    }

    console.log(`✅ Pesan WA terkirim ke ${normalized}`);
    return data;
  } catch (err: any) {
    console.error("❌ sendWhatsApp error:", err.message || err);
    return null;
  }
}
