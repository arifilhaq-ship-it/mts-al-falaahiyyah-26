import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getDb,
  writeToGitHub,
  isPermanentStorageConfigured,
  setActiveGitHubToken,
  GH_TOKEN_COOKIE,
} from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = isPermanentStorageConfigured();
  return NextResponse.json({
    success: true,
    active: status.active,
    provider: status.provider,
  });
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Silakan login admin terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const token = (body.token || "").trim();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Kode Token GitHub wajib diisi." },
        { status: 400 }
      );
    }

    // Uji tulis langsung ke branch db-data di GitHub
    const db = await getDb();
    const result = await writeToGitHub(db, token);

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Gagal menghubungkan ke GitHub: ${result.error}. Pastikan token memiliki izin 'repo'.`,
        },
        { status: 400 }
      );
    }

    setActiveGitHubToken(token);

    const response = NextResponse.json({
      success: true,
      message:
        "Berhasil! Penyimpanan Permanen GitHub Cloud sekarang AKTIF. Semua tambah/hapus foto galeri tersimpan permanen.",
    });

    // Simpan token di cookie selama 10 tahun agar tidak perlu diisi ulang
    response.cookies.set({
      name: GH_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Gagal mengaktifkan penyimpanan permanen." },
      { status: 500 }
    );
  }
}
