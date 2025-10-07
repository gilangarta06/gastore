// /app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Review } from "@/lib/db/models/Review";
import { Order } from "@/lib/db/models/Order";
import { Product } from "@/lib/db/models/Product";

// GET /api/reviews?productId=xxx
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

    // Initialize models to prevent OverwriteModelError
    await Review.init();

    // Get all reviews for this product
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
    }, { status: 200 });

  } catch (err: any) {
    console.error("❌ Get reviews error:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal memuat reviews",
        details: process.env.NODE_ENV === "development" ? err.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, productId, rating, review } = body;

    // Validasi input
    if (!orderId || !productId || !rating || !review) {
      return NextResponse.json(
        { 
          success: false,
          error: "Data tidak lengkap" 
        },
        { status: 400 }
      );
    }

    // Validasi rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { 
          success: false,
          error: "Rating harus antara 1-5" 
        },
        { status: 400 }
      );
    }

    // Validasi panjang review
    if (review.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false,
          error: "Review minimal 10 karakter" 
        },
        { status: 400 }
      );
    }

    if (review.length > 500) {
      return NextResponse.json(
        { 
          success: false,
          error: "Review maksimal 500 karakter" 
        },
        { status: 400 }
      );
    }

    // Initialize models
    await Order.init();
    await Review.init();

    // Cari order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { 
          success: false,
          error: "Order tidak ditemukan" 
        },
        { status: 404 }
      );
    }

    // Cek apakah order sudah lunas
    if (order.status !== "paid") {
      return NextResponse.json(
        { 
          success: false,
          error: "Order belum lunas. Silakan selesaikan pembayaran terlebih dahulu." 
        },
        { status: 400 }
      );
    }

    // Cek apakah sudah pernah review
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return NextResponse.json(
        { 
          success: false,
          error: "Order ini sudah pernah di-review" 
        },
        { status: 400 }
      );
    }

    // Validasi apakah productId sesuai dengan order
    const orderProductId = order.productId.toString();
    if (orderProductId !== productId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Product ID tidak sesuai dengan order" 
        },
        { status: 400 }
      );
    }

    // Pastikan customer name ada
    if (!order.customerName) {
      return NextResponse.json(
        { 
          success: false,
          error: "Nama customer tidak ditemukan di order" 
        },
        { status: 400 }
      );
    }

    // Extract variant name
    const variantName =
      typeof order.variant === "object" && order.variant.name
        ? order.variant.name
        : String(order.variant || "");

    // Buat review baru
    const newReview = await Review.create({
      orderId: order.orderId,
      productId: productId,
      customerName: order.customerName,
      email: order.email,
      rating,
      review: review.trim(),
      variantName,
      isApproved: true,
    });

    console.log("✅ Review created:", newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Review berhasil dikirim! Review akan ditampilkan setelah disetujui admin.",
        review: newReview,
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("❌ Submit review error:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal mengirim review",
        details: process.env.NODE_ENV === "development" ? err.message : undefined
      },
      { status: 500 }
    );
  }
}