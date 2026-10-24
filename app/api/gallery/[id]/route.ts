import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteGallery } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Sesi tidak valid." }, { status: 401 });
  }

  const { id } = params;
  const success = deleteGallery(id);

  if (!success) {
    return NextResponse.json({ success: false, message: "Foto galeri tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Foto galeri berhasil dihapus." });
}
