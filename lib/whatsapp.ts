export async function sendWhatsApp(to: string, message: string) {
  try {
    let normalized = to.replace(/\D/g, "");
    if (normalized.startsWith("0")) normalized = "62" + normalized.slice(1);
    if (!normalized.startsWith("62")) normalized = "62" + normalized;

    const res = await fetch("https://app.wapanels.com/api/create-message", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        appkey: process.env.WA_APPKEY as string,
        authkey: process.env.WA_AUTHKEY as string,
        to: normalized,
        message,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== true) {
      console.error("❌ Gagal kirim WA:", data);
      throw new Error(data.message || "Gagal kirim pesan WhatsApp");
    }

    console.log(`✅ Pesan WA terkirim ke ${normalized}`);
    return data;
  } catch (err) {
    console.error("❌ sendWhatsApp error:", err);
    return null;
  }
}
