"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Award,
  Calendar,
  ImageIcon,
  ChevronRight,
} from "./Icons";
import { GalleryItem, NewsItem } from "@/lib/types";

interface HeroBannerProps {
  heroImage?: string;
  specialProgramLabel?: string;
  specialProgramTitle?: string;
  heroPhotoCaption?: string;
  schoolName?: string;
  gallery?: GalleryItem[];
  news?: NewsItem[];
}

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  date?: string;
}

export default function HeroBanner({
  heroImage,
  specialProgramLabel,
  specialProgramTitle,
  heroPhotoCaption,
  schoolName,
  gallery = [],
  news = [],
}: HeroBannerProps) {
  const bannerPhoto =
    heroImage ||
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000";

  const programLabel = specialProgramLabel || "Program Khusus";
  const programTitle = specialProgramTitle || "Tahfidz & Kitab Kuning";
  const photoCaption =
    heroPhotoCaption || "Kampus Cikoneng Kulon, Kec. Ganeas, Kab. Sumedang";
  const activeSchoolName = schoolName || "MTs Al Falaahiyyah";

  // Susun daftar slide dari Galeri Kegiatan Peserta Didik (+ foto utama beranda & berita jika galeri sedikit)
  const slides: CarouselSlide[] = React.useMemo(() => {
    const list: CarouselSlide[] = [];

    // 1. Masukkan semua item dari Galeri Kegiatan
    for (const item of gallery) {
      if (item.imageUrl && item.imageUrl.trim() !== "") {
        list.push({
          id: `gal-${item.id}`,
          title: item.title || `Kegiatan Peserta Didik ${activeSchoolName}`,
          description:
            item.description ||
            `Dokumentasi kegiatan peserta didik di ${activeSchoolName} Cikoneng Kulon, Ganeas, Sumedang.`,
          category: item.category || "Kegiatan Peserta Didik",
          imageUrl: item.imageUrl,
          date: item.date,
        });
      }
    }

    // 2. Jika foto heroImage belum ada di dalam list, tambahkan sebagai salah satu slide dokumentasi utama
    if (
      bannerPhoto &&
      !list.some((s) => s.imageUrl === bannerPhoto)
    ) {
      list.push({
        id: "hero-main",
        title: `Lingkungan & Aktivitas ${activeSchoolName}`,
        description: photoCaption,
        category: "Profil & Kampus",
        imageUrl: bannerPhoto,
      });
    }

    // 3. Jika total slide masih kurang dari 2, tambahkan dari berita yang memiliki gambar
    if (list.length < 2 && news.length > 0) {
      for (const n of news) {
        if (
          n.coverImage &&
          n.coverImage.trim() !== "" &&
          !list.some((s) => s.imageUrl === n.coverImage)
        ) {
          list.push({
            id: `news-${n.id}`,
            title: n.title,
            description: n.excerpt || n.title,
            category: n.category || "Berita & Kegiatan",
            imageUrl: n.coverImage,
            date: n.date,
          });
        }
      }
    }

    return list;
  }, [gallery, news, bannerPhoto, activeSchoolName, photoCaption]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = slides.length;
  const safeIndex = totalSlides > 0 ? currentIndex % totalSlides : 0;
  const activeSlide = slides[safeIndex] || {
    id: "fallback",
    title: `Kegiatan Peserta Didik ${activeSchoolName}`,
    description: photoCaption,
    category: "Kegiatan Madrasah",
    imageUrl: bannerPhoto,
  };

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, nextSlide]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white py-8 sm:py-12 lg:py-16">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* ===================================================================== */}
        {/* BAGIAN ATAS: GALERI CAROUSEL KEGIATAN PESERTA DIDIK & KETERANGAN ELEGAN */}
        {/* ===================================================================== */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-700/70 bg-emerald-950/90 backdrop-blur-md group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Bingkai Utama Gambar Carousel (Menyesuaikan Proporsi Foto Asli Tanpa Terpotong) */}
          <div className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] lg:h-[540px] flex items-center justify-center overflow-hidden bg-emerald-950">
            {/* Ambient Blur Background dari Foto Aktif agar Bingkai Terlihat Penuh & Mewah */}
            <img
              src={activeSlide.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-35 transition-all duration-700 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-950/40 pointer-events-none" />

            {/* Gambar Utama Utuh Tanpa Terpotong */}
            <img
              key={activeSlide.id}
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain transition-all duration-700 shadow-2xl"
            />

            {/* Badge Atas Kiri: Label Galeri & Kategori */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/85 backdrop-blur-md border border-emerald-600/60 text-amber-300 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Galeri Kegiatan Peserta Didik</span>
              </span>
              {activeSlide.category && (
                <span className="bg-amber-500 text-emerald-950 text-[11px] sm:text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
                  {activeSlide.category}
                </span>
              )}
            </div>

            {/* Badge Atas Kanan: Nomor Slide & Pintasan Lihat Semua Galeri */}
            <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 flex items-center gap-2">
              {totalSlides > 1 && (
                <span className="bg-emerald-950/85 backdrop-blur-md border border-emerald-700/70 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full shadow">
                  {safeIndex + 1} / {totalSlides}
                </span>
              )}
              <Link
                href="/galeri"
                className="hidden sm:inline-flex items-center gap-1 bg-emerald-900/85 hover:bg-amber-500 hover:text-emerald-950 text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-600/60 transition-all shadow"
              >
                <span>Semua Galeri</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tombol Navigasi Kiri & Kanan */}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Foto Sebelumnya"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-950/75 hover:bg-amber-500 text-white hover:text-emerald-950 border border-emerald-600/60 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Foto Selanjutnya"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-950/75 hover:bg-amber-500 text-white hover:text-emerald-950 border border-emerald-600/60 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Panel Keterangan Kegiatan yang Elegan di Bawah Gambar Carousel */}
          <div className="relative z-20 bg-gradient-to-r from-emerald-950 via-emerald-900/95 to-emerald-950 border-t border-amber-500/30 px-5 sm:px-8 py-5 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-amber-300 font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeSchoolName}</span>
                  </span>
                  {activeSlide.date && (
                    <>
                      <span className="text-emerald-500">•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatDate(activeSlide.date)}</span>
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {activeSlide.title}
                </h2>

                {activeSlide.description && (
                  <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {activeSlide.description}
                  </p>
                )}
              </div>

              {/* Indikator Titik Slide & Tombol Galeri */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800/60">
                {totalSlides > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {slides.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Pilih slide ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          idx === safeIndex
                            ? "w-8 bg-amber-400 shadow-sm shadow-amber-400/50"
                            : "w-2.5 bg-emerald-700 hover:bg-emerald-500"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <Link
                  href="/galeri"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <span>Lihat Dokumentasi Lainnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* BAGIAN BAWAH (DI BAWAH GAMBAR CAROUSEL):                              */}
        {/* TEXT MADRASAH UNGGUL BERKARAKTER ISLAMI & MENDIDIK GENERASI QUR'ANI   */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2">
          {/* Kolom Utama: Badge, Judul Besar, Deskripsi, dan Tombol PPDB */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            {/* Badge Kementerian & Lokasi */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-emerald-800/80 border border-emerald-600/50 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-100 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Madrasah Unggul Berkarakter Islami</span>
              <span className="text-emerald-400">•</span>
              <span className="text-amber-300">Ganeas, Sumedang</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Mendidik Generasi <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                Qur&apos;ani &amp; Berprestasi
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Selamat datang di website resmi{" "}
              <strong className="text-white">{activeSchoolName} Cikoneng Kulon</strong>, Kecamatan Ganeas, Kabupaten Sumedang. Memadukan kurikulum nasional, nilai pesantren salaf, dan penguasaan sains teknologi.
            </p>

            {/* Tombol Tindakan */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/ppdb"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                <span>Daftar Peserta Didik Baru (PPDB)</span>
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
          </div>

          {/* Kolom Pendamping: Kartu Program Khusus Elegan & Poin Keunggulan */}
          <div className="lg:col-span-5 space-y-5">
            {/* Kartu Program Khusus dengan Animasi Elegan */}
            <div className="animate-float-elegant p-[2px] rounded-2xl shimmer-border shadow-xl">
              <div className="bg-gradient-to-r from-emerald-950/95 via-emerald-900/95 to-emerald-950/95 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center justify-between gap-4 border border-emerald-700/40">
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
                    <div className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
                      {programTitle}
                    </div>
                  </div>
                </div>

                <Link
                  href="/akademik"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 bg-emerald-800/70 hover:bg-emerald-800 px-3.5 py-2 rounded-xl border border-emerald-600/50 transition-all shrink-0"
                >
                  <span>Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Poin Keunggulan Cepat */}
            <div className="bg-emerald-900/50 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-800/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white font-bold">Bimbingan Akhlak</div>
                  <div className="text-[11px] text-emerald-300">Pembiasaan adab &amp; karakter Islami</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-800/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white font-bold">Tahfidzul Qur&apos;an</div>
                  <div className="text-[11px] text-emerald-300">Target hafalan terarah &amp; bersanad</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-800/80 border border-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white font-bold">Prestasi &amp; Ekstrakurikuler</div>
                  <div className="text-[11px] text-emerald-300">Pengembangan bakat akademik &amp; seni</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

