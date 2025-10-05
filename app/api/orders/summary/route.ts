// api/orders/summary/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();

    // Total order hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    // Pendapatan (hanya yang sudah dibayar/success)
    const revenueAgg = await Order.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    // Order dibatalkan
    const cancelled = await Order.countDocuments({ status: "cancelled" });

    // Produk diantar (anggap status = delivered)
    const delivered = await Order.countDocuments({ status: "delivered" });

    // Permintaan bantuan (sementara static / atau pakai collection lain kalau ada)
    const helpRequest = 2;

    // Stok akan habis (<10)
    const products = await Product.find();
    const lowStock = products.reduce((acc, p: any) => {
      return acc + p.variants.filter((v: any) => v.quantity < 10).length;
    }, 0);

    return NextResponse.json({
      todayOrders,
      revenue,
      cancelled,
      delivered,
      helpRequest,
      lowStock,
    });
  } catch (err) {
    console.error("❌ Summary error:", err);
    return NextResponse.json({ error: "Failed to get summary" }, { status: 500 });
  }
}
