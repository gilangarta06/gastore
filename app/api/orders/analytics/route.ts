// api/orders/analytics/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";

export async function GET() {
  try {
    await connectDB();

    const since = new Date();
    since.setHours(since.getHours() - 24);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          sales: { $sum: "$total" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = data.map((d) => ({
      time: String(d._id).padStart(2, "0"),
      sales: d.sales,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Analytics error:", err);
    return NextResponse.json({ error: "Failed to get analytics" }, { status: 500 });
  }
}
