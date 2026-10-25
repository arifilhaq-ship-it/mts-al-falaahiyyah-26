import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Sparkles, Award } from "./Icons";

interface HeroBannerProps {
  heroImage?: string;
  specialProgramLabel?: string;
  specialProgramTitle?: string;
  heroPhotoCaption?: string;
  schoolName?: string;
}

export default function HeroBanner({
  heroImage,
  specialProgramLabel,
  specialProgramTitle,
  heroPhotoCaption,
  schoolName,
}: HeroBannerProps) {
  const bannerPhoto =
    heroImage ||
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000";

  const programLabel = specialProgramLabel || "Program Khusus";
  const programTitle = specialProgramTitle || "Tahfidz & Kitab Kuning";
  const photoCaption =
    heroPhotoCaption || "Kampus Cikoneng Kulon, Kec. Ganeas, Kab. Sumedang";
  const activeSchoolName = schoolName || "MTs Al Falaahiyyah";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20 lg:py-24">
      {/* Animasi Keyframes Elegan */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes floatSlow {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes shimmerGlow {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .animate-float-elegant {
              animation: floatSlow 4.5s ease-in-out infinite;
            }
            .shimmer-border {
              background: linear-gradient(90deg, rgba(245,158,11,0.25) 0%, rgba(251,191,36,0.85) 50%, rgba(245,158,11,0.25) 100%);
              background-size: 200% 100%;
              animation: shimmerGlow 5s linear infinite;
            }
          `,
        }}
      />

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
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
              Selamat datang di website resmi <strong className="text-white">{activeSchoolName} Cikoneng Kulon</strong>, Kecamatan Ganeas, Kabupaten Sumedang. Memadukan kurikulum nasional, nilai pesantren salaf, dan penguasaan sains teknologi.
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

          {/* Sisi Kanan: Foto Kampus Bersih (Tanpa Tertutup Kotak) + Banner Animasi Elegan di Bawah Foto */}
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-md lg:max-w-none space-y-4">
              {/* 1. Bingkai Foto Utama (100% Bersih Tidak Terhalang) */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-700/60 bg-emerald-900 group">
                <img
                  src={bannerPhoto}
                  alt={`Aktivitas Madrasah ${activeSchoolName}`}
                  className="w-full h-72 sm:h-80 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Baris Keterangan Tipis di Bawah Foto */}
                <div className="bg-emerald-950/95 border-t border-emerald-800/80 px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="bg-amber-500 text-emerald-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded shrink-0">
                    {activeSchoolName}
                  </span>
                  <p className="font-semibold text-xs text-emerald-100 truncate">
                    {photoCaption}
                  </p>
                </div>
              </div>

              {/* 2. Kartu Program Khusus dengan Animasi Elegan (Berada di Bawah Foto, Tidak Menghalangi Foto) */}
              <div className="animate-float-elegant p-[2px] rounded-2xl shimmer-border shadow-xl">
                <div className="bg-gradient-to-r from-emerald-950/95 via-emerald-900/95 to-emerald-950/95 backdrop-blur-md rounded-2xl px-4 py-3.5 flex items-center justify-between gap-4 border border-emerald-700/40">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-emerald-950 shrink-0 shadow-md">
                      <span className="absolute -inset-0.5 rounded-xl bg-amber-400/40 animate-ping opacity-30" />
                      <GraduationCap className="w-6 h-6 relative z-10" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{programLabel}</span>
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-white tracking-tight mt-0.5">
                        {programTitle}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/akademik"
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 bg-emerald-800/70 hover:bg-emerald-800 px-3 py-2 rounded-xl border border-emerald-600/50 transition-all shrink-0"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
