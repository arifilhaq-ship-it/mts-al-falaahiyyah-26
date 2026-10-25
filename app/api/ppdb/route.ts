import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPpdbList, createPpdbRegistration } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  const list = await getPpdbList();
  return NextResponse.json({ success: true, data: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, nisn, gender, birthPlace, birthDate, previousSchool, parentName, parentPhone, address, programChoice } = body;

    if (!fullName || !parentPhone || !previousSchool) {
      return NextResponse.json({ success: false, message: "Nama lengkap, sekolah asal, dan nomor WhatsApp orang tua wajib diisi." }, { status: 400 });
    }

    const newRecord = await createPpdbRegistration({
      fullName,
      nisn: nisn || "-",
      gender: gender || "L",
      birthPlace: birthPlace || "Sumedang",
      birthDate: birthDate || "2012-01-01",
      previousSchool,
      parentName: parentName || "-",
      parentPhone,
      address: address || "-",
      programChoice: programChoice || "Reguler",
    });

    return NextResponse.json({
      success: true,
      data: newRecord,
      message: `Pendaftaran berhasil disimpan dengan nomor ${newRecord.registrationNo}.`,
    });
  } catch (error) {
    console.error("PPDB Register Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat menyimpan formulir PPDB." }, { status: 500 });
  }
}
