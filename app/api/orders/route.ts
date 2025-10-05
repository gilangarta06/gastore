import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import { sendPaymentReminder } from "@/lib/whatsappPayment";

export async function GET() {
  try {
    await connectDB();
    
    await User.init();
    await Product.init();

    const orders = await Order.find()
      .populate("productId", "name")
      .populate("userId", "username email");

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.productId || !body.variant || !body.customerName || !body.phone || !body.qty) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    const product = await Product.findById(body.productId);
    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    const variant = product.variants.find((v: any) => v.name === body.variant);
    if (!variant) return NextResponse.json({ error: "Variant tidak ditemukan" }, { status: 404 });

    // ✅ Cek apakah stok akun tersedia
    if (!variant.accounts || variant.accounts.length === 0) {
      return NextResponse.json({ error: "Stok akun habis" }, { status: 400 });
    }

    // ✅ Ambil 1 akun pertama yang tersedia (FIFO)
    const selectedAccount = variant.accounts[0];

    // Debug log (opsional, bisa dihapus nanti)
    console.log("🔍 Selected Account:", selectedAccount);

    // ✅ Hapus akun yang sudah diambil dari variant
    variant.accounts.shift(); // Hapus akun pertama
    variant.quantity -= 1; // Kurangi stok

    // ✅ Update product di database
    await product.save();

    const orderId = "ORDER-" + Date.now();

    const snapRes = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
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

    if (!snapRes.ok) {
      const errorText = await snapRes.text();
      console.error("Midtrans error:", errorText);
      return NextResponse.json({ error: "Gagal membuat transaksi di Midtrans" }, { status: 502 });
    }

    const snapData = await snapRes.json();

    // ✅ Simpan order dengan akun yang dibeli
    const order = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      productId: product._id,
      variant: { name: variant.name, price: variant.price },
      account: selectedAccount, // ✅ Simpan akun yang dibeli
      qty: body.qty,
      total: variant.price * body.qty,
      status: "pending",
      midtransOrderId: orderId,
      paymentUrl: snapData.redirect_url,
      userId: body.userId || null,
    });

    // Debug log (opsional)
    console.log("✅ Order created:", order);
    console.log("🔐 Account in order:", order.account);

    // ✅ Kirim notifikasi WA dengan info akun
    await sendPaymentReminder({
      phone: body.phone,
      customerName: body.customerName,
      productName: product.name,
      variantName: variant.name,
      qty: body.qty,
      price: variant.price,
      paymentUrl: snapData.redirect_url,
      orderId,
      account: selectedAccount, // ✅ TAMBAHKAN INI
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID order tidak ditemukan" }, { status: 400 });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ message: "Order berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error("❌ Delete order error:", err);
    return NextResponse.json({ error: "Gagal menghapus order" }, { status: 500 });
  }
}