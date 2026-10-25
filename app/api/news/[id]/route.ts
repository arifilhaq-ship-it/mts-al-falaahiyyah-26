import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateNews, deleteNews, getNewsById } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Sesi tidak valid." }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();

    const updated = await updateNews(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Berita tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated, message: "Berita berhasil diperbarui." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memperbarui berita." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Sesi tidak valid." }, { status: 401 });
  }

  const { id } = params;
  const success = await deleteNews(id);

  if (!success) {
    return NextResponse.json({ success: false, message: "Berita tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
}
