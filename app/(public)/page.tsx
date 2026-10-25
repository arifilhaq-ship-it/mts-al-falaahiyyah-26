import React from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import HeadmasterGreeting from "@/components/HeadmasterGreeting";
import ProgramsSection from "@/components/ProgramsSection";
import RecentNewsSection from "@/components/RecentNewsSection";
import GallerySection from "@/components/GallerySection";
import MapSection from "@/components/MapSection";
import { getSchoolSettings, getNewsList, getGalleryList } from "@/lib/db";
import { BookOpen, GraduationCap, Users, Award, ArrowRight, ShieldCheck } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSchoolSettings();
  const news = await getNewsList(false);
  const gallery = await getGalleryList();

  return (
    <>
      {/* 1. Hero Banner dengan Foto Kampus & CTA PPDB */}
      <HeroBanner />

      {/* 2. Quick Highlight Stats */}
      <section className="bg-emerald-900 text-white py-8 border-b-4 border-amber-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium">Lulusan Melanjutkan ke MA/SMA Favorit</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">3-5 Juz</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium">Target Hafalan Tahfidz Al-Qur&apos;an</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">18+</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium">Dewan Asatidz &amp; Guru Berkualifikasi</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">8+</div>
              <div className="text-xs sm:text-sm text-emerald-100 font-medium">Pilihan Ekstrakurikuler Santri</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sambutan Kepala Madrasah */}
      <HeadmasterGreeting
        name={settings.headmasterName}
        speech={settings.headmasterSpeech}
        photo={settings.headmasterPhoto}
      />

      {/* 4. Program Unggulan */}
      <ProgramsSection />

      {/* 5. Islamic Values / Karakter Pembiasaan Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Motto &amp; Komitmen Kami
          </span>
          <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed text-emerald-50">
            &ldquo;{settings.tagline}&rdquo;
          </blockquote>
          <p className="mt-4 text-emerald-300 text-sm font-semibold">
            MTs Al Falaahiyyah • Cikoneng Kulon, Ganeas, Sumedang
          </p>
        </div>
      </section>

      {/* 6. Berita Terbaru */}
      <RecentNewsSection news={news} />

      {/* 7. Galeri Foto Kegiatan */}
      <GallerySection gallery={gallery} />

      {/* 8. Call To Action PPDB Banner */}
      <section className="py-14 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="bg-amber-400 text-emerald-950 font-black text-xs uppercase px-3 py-1 rounded-full">
                Tahun Ajaran {settings.ppdbAcademicYear}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Penerimaan Peserta Didik Baru (PPDB) Telah Dibuka
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                Bergabunglah bersama keluarga besar MTs Al Falaahiyyah Cikoneng Kulon Ganeas. Fasilitas lengkap, beasiswa tahfidz, dan lingkungan belajar Islami yang nyaman.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/ppdb"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm sm:text-base"
              >
                <span>Daftar Sekarang Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-900 text-white font-bold px-5 py-3.5 rounded-xl border border-emerald-600 transition-all text-sm sm:text-base"
              >
                <span>Tanya Panitia</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Peta Lokasi & Kontak Lengkap */}
      <MapSection initialSettings={settings} />
    </>
  );
}
