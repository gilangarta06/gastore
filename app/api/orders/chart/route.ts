import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function GET() {
  await connectDB(); // ✅ ubah ke connectDB

  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("❌ Get chart error:", error);
    return NextResponse.json({ error: "Failed to fetch chart" }, { status: 500 });
  }
}
