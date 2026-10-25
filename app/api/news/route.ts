import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getNewsList, createNews } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const category = searchParams.get("category");
  const all = searchParams.get("all") === "true";

  let items = getNewsList(all);

  if (category && category !== "Semua") {
    items = items.filter((item) => item.category === category);
  }

  if (search) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.excerpt.toLowerCase().includes(search) ||
        item.content.toLowerCase().includes(search)
    );
  }

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
    const { title, excerpt, content, category, coverImage, isPublished, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Judul dan konten berita wajib diisi." }, { status: 400 });
    }

    // Buat slug dari judul
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const newItem = createNews({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160) + "...",
      content,
      category: category || "Keagamaan",
      author: session.username || "Admin Madrasah",
      date: new Date().toISOString().split("T")[0],
      coverImage: coverImage || "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1200",
      isPublished: isPublished !== undefined ? isPublished : true,
      tags: tags || ["MTs Al Falaahiyyah", "Cikoneng Kulon", "Sumedang"],
    });

    return NextResponse.json({ success: true, data: newItem, message: "Berita berhasil diterbitkan." });
  } catch (error) {
    console.error("News POST Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan berita." }, { status: 500 });
  }
}
