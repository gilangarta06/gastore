import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { sendWhatsapp } from "@/lib/whatsapp";

export async function GET() {
  await connectDB();
  const orders = await Order.find().populate("productId");
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.findById(body.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const variant = product.variants.find((v: any) => v.name === body.variant);
    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    // Generate orderId unik
    const orderId = "ORDER-" + Date.now();

    // Panggil Midtrans Snap API
    const snapRes = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: variant.price * body.qty,
        },
        customer_details: {
          first_name: body.customerName,
          phone: body.phone,
        },
      }),
    });

    const snapData = await snapRes.json();

    // Simpan order
    const order = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      productId: product._id,
      variant: { name: variant.name, price: variant.price },
      qty: body.qty,
      status: "pending",
      midtransOrderId: orderId,
      paymentUrl: snapData.redirect_url,
    });

    // Kirim WA link pembayaran
    await sendWhatsapp(
      body.phone,
      `Halo ${body.customerName},\nPesanan ${product.name} (${variant.name}) x${body.qty}\nTotal: Rp${(
        variant.price * body.qty
      ).toLocaleString()}\nSilakan bayar via: ${snapData.redirect_url}`
    );

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
