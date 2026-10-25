import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateTeacher, deleteTeacher, getTeacherById } from "@/lib/db";
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

    const updated = await updateTeacher(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Data guru tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data guru dan foto berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Teacher PUT Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui data guru." }, { status: 500 });
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
  const success = await deleteTeacher(id);

  if (!success) {
    return NextResponse.json({ success: false, message: "Data guru tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Data guru berhasil dihapus." });
}
