// api/products/categories/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();

    const data = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const colors = ["#137fec", "#137fec80", "#137fec33"];

    const result = data.map((d, i) => ({
      name: d._id || "Lainnya",
      value: d.count,
      color: colors[i % colors.length],
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Categories error:", err);
    return NextResponse.json({ error: "Failed to get categories" }, { status: 500 });
  }
}
