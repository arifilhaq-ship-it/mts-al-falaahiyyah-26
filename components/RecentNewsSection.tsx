import React from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { NewsItem } from "@/lib/types";
import { Calendar, User, ArrowRight } from "./Icons";

interface RecentNewsSectionProps {
  news: NewsItem[];
}

export default function RecentNewsSection({ news }: RecentNewsSectionProps) {
  const displayNews = news.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Kabar Madrasah
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
              Berita &amp; Kegiatan Terkini
            </h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Ikuti perkembangan informasi, prestasi, dan agenda MTs Al Falaahiyyah Cikoneng Kulon.
            </p>
          </div>

          <Link
            href="/berita"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-white hover:bg-emerald-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <span>Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {displayNews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col group"
              >
                {/* Gambar Sampul */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-900/90 backdrop-blur-sm text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Konten Berita */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.author}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2 leading-snug">
                      <Link href={`/berita/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/berita/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 text-xs font-bold group-hover:underline"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
