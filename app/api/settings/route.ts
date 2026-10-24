import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSchoolSettings, updateSchoolSettings } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = getSchoolSettings();
  return NextResponse.json(
    { success: true, data: settings },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

export async function PUT(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Sesi tidak valid." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updateSchoolSettings(body);
    return NextResponse.json(
      { success: true, data: updated, message: "Informasi madrasah berhasil diperbarui." },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memperbarui informasi madrasah." }, { status: 500 });
  }
}
