import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updatePpdbStatus } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    const updated = await updatePpdbStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Data PPDB tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated, message: "Status pendaftaran berhasil diperbarui." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memperbarui status PPDB." }, { status: 500 });
  }
}
