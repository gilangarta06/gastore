import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const review = await Review.create({
      orderId: body.order_id,
      rating: body.rating,
      review: body.review,
    });

    return NextResponse.json({
      success: true,
      message: "Ulasan berhasil dikirim",
      review,
    });
  } catch (err) {
    console.error("Review error:", err);
    return NextResponse.json({ error: "Gagal kirim ulasan" }, { status: 500 });
  }
}
