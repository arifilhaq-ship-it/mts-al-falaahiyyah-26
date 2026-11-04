import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGalleryList, createGallery } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const items = await getGalleryList();
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
    const { title, description, category, imageUrl, date, sourceType, sourceUrl, embedUrl } = body;

    if (!title || (!imageUrl && !embedUrl)) {
      return NextResponse.json(
        { success: false, message: "Judul serta foto atau tautan sosial media wajib diisi." },
        { status: 400 }
      );
    }

    const newItem = await createGallery({
      title,
      description: description || "",
      category: category || "Kegiatan Belajar",
      imageUrl: imageUrl || "",
      date: date || new Date().toISOString().split("T")[0],
      sourceType: sourceType || "upload",
      sourceUrl: sourceUrl || "",
      embedUrl: embedUrl || "",
    });

    return NextResponse.json({ success: true, data: newItem, message: "Foto/media galeri berhasil ditambahkan." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menambahkan foto galeri." }, { status: 500 });
  }
}
