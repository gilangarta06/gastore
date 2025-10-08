import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Admin from "@/lib/db/models/Admin";
import { verifyToken } from "@/lib/middleware/verifyToken";
import bcrypt from "bcryptjs";

// ✅ DELETE - hanya superadmin boleh hapus
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (decoded.role !== "superadmin")
      return NextResponse.json({ error: "Forbidden: Only superadmin can delete users" }, { status: 403 });

    const { id } = await context.params;
    const user = await Admin.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.role === "superadmin")
      return NextResponse.json({ error: "Cannot delete a superadmin" }, { status: 403 });

    await Admin.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/admin/users/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PUT - update name/email/role/status
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    const allowedFields = ["name", "email", "role", "isActive"];
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    const updatedUser = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("PUT /api/admin/users/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH - reset password
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await Admin.findByIdAndUpdate(id, { password: hashed });

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("PATCH /api/admin/users/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
