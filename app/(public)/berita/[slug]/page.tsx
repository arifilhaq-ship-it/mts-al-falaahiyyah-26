import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsList } from "@/lib/db";
import { Calendar, User, WhatsApp, Sparkles } from "@/components/Icons";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: "Berita Tidak Ditemukan" };
  return {
    title: item.title,
    description: item.excerpt,
  };
}

export default async function DetailBeritaPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const allNews = await getNewsList(false);
  const relatedNews = allNews.filter((n) => n.id !== article.id).slice(0, 3);

  // Pecah konten berdasarkan paragraf
  const paragraphs = article.content.split("\n\n");

  const platformName =
    article.sourceType === "instagram"
      ? "Instagram"
      : article.sourceType === "facebook"
      ? "Facebook"
      : article.sourceType === "youtube"
      ? "YouTube"
      : article.sourceType === "tiktok"
      ? "TikTok"
      : article.sourceType === "social"
      ? "Media Sosial"
      : null;

  return (
    <div className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-emerald-800">Beranda</Link>
          <span>/</span>
          <Link href="/berita" className="hover:text-emerald-800">Berita</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Konten Utama Berita */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            {/* Kategori Badge & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  {article.category}
                </span>
                {platformName && (
                  <span className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
                    Sumber: {platformName}
                  </span>
                )}
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{article.date}</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{article.author}</span>
                </span>
              </div>

              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 rounded-xl transition-colors shadow-sm"
                >
                  <span>Buka Postingan {platformName || "Asli"}</span>
                  <span>&rarr;</span>
                </a>
              )}
            </div>

            {/* Judul Artikel */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Gambar Sampul Besar atau Video YouTube - Menyesuaikan Ukuran Asli Tanpa Terpotong */}
            {article.sourceType === "youtube" && article.embedUrl ? (
              <div className="rounded-2xl overflow-hidden aspect-video bg-slate-900 mb-8 border border-slate-200 shadow-sm">
                <iframe
                  src={article.embedUrl}
                  title={article.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : article.coverImage ? (
              <div className="rounded-2xl overflow-hidden bg-slate-100 mb-8 border border-slate-200 flex items-center justify-center">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-auto max-h-[780px] object-contain"
                />
              </div>
            ) : null}

            {/* Teks Isi Paragraf */}
            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "font-serif text-lg text-slate-900 font-medium leading-relaxed"
                      : ""
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Embed Postingan Interaktif Instagram / Facebook / TikTok jika tersedia */}
            {article.embedUrl && article.sourceType !== "youtube" && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tayangan Asli dari {platformName || "Media Sosial"}
                  </span>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Lihat di {platformName || "Aplikasi"} &rarr;
                    </a>
                  )}
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-w-xl mx-auto">
                  <iframe
                    src={article.embedUrl}
                    title={article.title}
                    className="w-full h-[540px] border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Tags jika ada */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400 block mb-2">Tag Terkait:</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bagikan Artikel */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-700">Bagikan Informasi Ini:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    article.title + " - MTs Al Falaahiyyah Cikoneng Kulon Ganeas Sumedang"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <WhatsApp className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar Berita Lainnya */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Kabar Terkait Lainnya
              </h3>

              <div className="space-y-4">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA PPDB Widget */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="font-extrabold text-lg text-white">PPDB MTs Al Falaahiyyah</h4>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Pendaftaran peserta didik baru telah dibuka. Daftarkan putra-putri Anda sekarang secara online.
              </p>
              <Link
                href="/ppdb"
                className="inline-block w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow transition-colors"
              >
                Daftar Online &rarr;
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
