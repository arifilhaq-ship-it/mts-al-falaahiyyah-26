import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGalleryList, createGallery } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const items = getGalleryList();
  return NextResponse.json(
    { success: true, data: items },
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
    const { title, description, category, imageUrl, date } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: "Judul dan tautan gambar wajib diisi." }, { status: 400 });
    }

    const newItem = createGallery({
      title,
      description: description || "",
      category: category || "Kegiatan Belajar",
      imageUrl,
      date: date || new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({ success: true, data: newItem, message: "Foto galeri berhasil ditambahkan." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menambahkan foto galeri." }, { status: 500 });
  }
}
