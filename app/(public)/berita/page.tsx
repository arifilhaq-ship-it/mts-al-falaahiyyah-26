"use client";

import React, { useState } from "react";
import Link from "next/link";
import { defaultNews } from "@/lib/data-defaults";
import { Search, Calendar, User, ArrowRight } from "@/components/Icons";

const categories = ["Semua", "Keagamaan", "Prestasi", "Pengumuman", "Kegiatan Siswa"];

export default function BeritaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredNews = defaultNews.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Informasi Terkini
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Berita &amp; Kegiatan Madrasah
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Dokumentasi kabar terbaru, agenda, dan prestasi santri MTs Al Falaahiyyah Cikoneng Kulon Ganeas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Pencarian */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berita atau kegiatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Kartu Berita */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium">Tidak ada berita yang cocok dengan kriteria pencarian.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Semua");
              }}
              className="mt-3 text-xs font-bold text-emerald-800 underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-950/90 backdrop-blur-sm text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow">
                      {item.category}
                    </span>
                  </div>
                </div>

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

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2 leading-snug">
                      <Link href={`/berita/${item.slug}`}>{item.title}</Link>
                    </h2>

                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/berita/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 text-xs font-bold group-hover:underline"
                    >
                      <span>Baca Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
