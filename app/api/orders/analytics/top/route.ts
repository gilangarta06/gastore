// api/products/top/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";

export async function GET() {
  try {
    await connectDB();

    const data = await Order.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: "$productId", totalSales: { $sum: "$qty" } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // Populate product name
    const topProducts = await Promise.all(
      data.map(async (d) => {
        return {
          name: String(d._id),
          value: d.totalSales,
        };
      })
    );

    return NextResponse.json(topProducts);
  } catch (err) {
    console.error("❌ Top products error:", err);
    return NextResponse.json({ error: "Failed to get top products" }, { status: 500 });
  }
}
