import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Sparkles, Award } from "./Icons";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 sm:py-24 lg:py-28">
      {/* Background Islamic Pattern Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Sisi Kiri: Headline & Call To Action */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Badge Kementerian & Lokasi */}
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-100 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Madrasah Unggul Berkarakter Islami</span>
              <span className="hidden sm:inline text-emerald-400">•</span>
              <span className="hidden sm:inline text-amber-300">Ganeas, Sumedang</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Mendidik Generasi <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                Qur&apos;ani &amp; Berprestasi
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
              Selamat datang di website resmi <strong className="text-white">MTs Al Falaahiyyah Cikoneng Kulon</strong>, Kecamatan Ganeas, Kabupaten Sumedang. Memadukan kurikulum nasional, nilai pesantren salaf, dan penguasaan sains teknologi.
            </p>

            {/* Tombol Tindakan */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/ppdb"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                <span>Daftar Santri Baru (PPDB)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/profil"
                className="inline-flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700/80 font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-base hover:border-emerald-500"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Profil Madrasah</span>
              </Link>
            </div>

            {/* Poin Keunggulan Cepat */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-emerald-200 font-medium">Bimbingan Akhlak</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-emerald-200 font-medium">Tahfidzul Qur&apos;an</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-emerald-200 font-medium">Prestasi &amp; Ekstrakurikuler</span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Foto Kampus & Kartu Stat Madrasah */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Bingkai foto utama */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-700/50 bg-emerald-900">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000"
                  alt="Aktivitas Madrasah MTs Al Falaahiyyah"
                  className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
                
                {/* Overlay teks pada foto */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-amber-500 text-emerald-950 text-xs font-black uppercase px-2.5 py-1 rounded-md">
                    MTs Al Falaahiyyah
                  </span>
                  <p className="font-bold text-sm sm:text-base mt-1.5 text-white drop-shadow">
                    Kampus Cikoneng Kulon, Kec. Ganeas, Kab. Sumedang
                  </p>
                </div>
              </div>

              {/* Floating Card: Program Tahfidz */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[240px]">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-700">Program Khusus</div>
                  <div className="text-sm font-extrabold text-slate-900">Tahfidz &amp; Kitab Kuning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
