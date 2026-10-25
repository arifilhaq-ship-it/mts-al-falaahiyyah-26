import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminUsername, updateAdminCredentials } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Sesi tidak valid." },
      { status: 401 }
    );
  }

  const username = await getAdminUsername();
  return NextResponse.json(
    { success: true, data: { username } },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function PUT(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Sesi tidak valid." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const newUsername = String(body.username || "").trim();
    const newPassword = String(body.password || "").trim();

    if (!newUsername || newUsername.length < 3) {
      return NextResponse.json(
        { success: false, message: "Username minimal harus 3 karakter." },
        { status: 400 }
      );
    }

    if (newPassword && newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password baru minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    await updateAdminCredentials(newUsername, newPassword || undefined);

    return NextResponse.json({
      success: true,
      message: newPassword
        ? "Username dan Password Admin berhasil diperbarui!"
        : "Username Admin berhasil diperbarui!",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Gagal memperbarui akun admin.",
      },
      { status: 500 }
    );
  }
}
