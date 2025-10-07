import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Review } from "@/lib/db/models/Review";
import { Order } from "@/lib/db/models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID diperlukan" },
        { status: 400 }
      );
    }

       const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

        const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // 1 decimal
      },
    });
  } catch (err) {
    console.error("❌ Get reviews error:", err);
    return NextResponse.json(
      { error: "Gagal memuat reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, productId, rating, review } = body;

    if (!orderId || !productId || !rating || !review) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1-5" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah order sudah lunas
    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Order belum lunas" },
        { status: 400 }
      );
    }

    // ✅ Cek apakah orderId STRING ini sudah pernah review
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return NextResponse.json(
        { error: "Order ini sudah pernah di-review" },
        { status: 400 }
      );
    }

    // ✅ Extract variant name yang benar
    const variantName = typeof order.variant === "object" 
      ? order.variant.name 
      : order.variant;

      const newReview = await Review.create({
      orderId: order.orderId, // ✅ Gunakan orderId string (ORD-xxxx), bukan _id
      productId: productId, // ✅ Dari frontend
      customerName: order.customerName,
      email: order.email || "",
      rating,
      review,
      variantName,
    });

    return NextResponse.json(
      {
        message: "Review berhasil dikirim",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Submit review error:", err);
    return NextResponse.json(
      { error: "Gagal mengirim review" },
      { status: 500 }
    );
  }
}