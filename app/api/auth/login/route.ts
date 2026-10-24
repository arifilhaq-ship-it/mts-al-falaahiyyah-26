import { NextResponse } from "next/server";
import { validateAdminUser } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Nama pengguna dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const isValid = await validateAdminUser(username.trim(), password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Nama pengguna atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    // Buat JWT Token
    const token = await createSessionToken({
      username: username.trim(),
      role: "admin",
      loginTime: new Date().toISOString(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Autentikasi berhasil. Selamat datang kembali.",
      user: { username: username.trim(), role: "admin" },
    });

    // Pasang cookie HTTP-Only yang aman
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 jam
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat login." },
      { status: 500 }
    );
  }
}
