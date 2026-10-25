import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTeachersList, createTeacher } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const teachers = await getTeachersList();
  return NextResponse.json(
    { success: true, data: teachers },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Sesi tidak valid." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, category, nip, subject, education, photo } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, message: "Nama lengkap dan jabatan wajib diisi." }, { status: 400 });
    }

    const defaultPhoto = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400";

    const newTeacher = await createTeacher({
      name,
      role,
      category: category || "umum",
      nip: nip || "",
      subject: subject || "",
      education: education || "",
      photo: photo || defaultPhoto,
    });

    return NextResponse.json({
      success: true,
      data: newTeacher,
      message: "Data guru/GTK berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Teacher POST Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan data guru." }, { status: 500 });
  }
}
