// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db/mongodb';
import Admin from '@/lib/db/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Cari admin berdasarkan email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    console.log('✓ Admin found:', admin.email);
    console.log('✓ Password hash exists:', !!admin.password);
    console.log('✓ Password hash length:', admin.password?.length);

    // Cek apakah admin aktif
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Akun Anda tidak aktif. Hubungi administrator.' },
        { status: 403 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Buat JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response sukses
    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}