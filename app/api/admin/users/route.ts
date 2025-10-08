import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import Admin from "@/lib/db/models/Admin";
import { verifyToken } from "@/lib/middleware/verifyToken";

// ✅ GET → Ambil semua user (khusus superadmin)
export async function GET(req: Request) {
  try {
    await connectDB();
    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Only superadmin can view users" },
        { status: 403 }
      );
    }

    const users = await Admin.find().select("-password");
    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("GET /users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST → Tambah sub-user baru (superadmin only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Only superadmin can create users" },
        { status: 403 }
      );
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const newUser = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "admin", // default untuk sub-user
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Sub-user created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (err) {
    console.error("POST /users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
