import React from "react";
import Link from "next/link";
import { getNewsList, getGalleryList, getPpdbList, getSchoolSettings, getTeachersList } from "@/lib/db";
import { FileText, ImageIcon, Users, Settings, ArrowRight, CheckCircle, Bell, GraduationCap } from "@/components/Icons";

export default function AdminDashboardPage() {
  const news = getNewsList(true);
  const gallery = getGalleryList();
  const teachers = getTeachersList();
  const ppdb = getPpdbList();
  const settings = getSchoolSettings();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="bg-amber-400 text-emerald-950 text-xs font-black uppercase px-3 py-1 rounded-full">
            Panel Administrator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            Selamat Datang di Portal Manajemen MTs Al Falaahiyyah
          </h1>
          <p className="text-emerald-200 text-sm mt-1">
            Kelola konten website, guru &amp; staf, publikasi berita, galeri kegiatan, serta data pendaftaran santri baru secara mudah dan terpusat.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/guru"
            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-600 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>Kelola Guru &amp; GTK</span>
          </Link>
          <Link
            href="/admin/berita"
            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-600 transition-colors shadow-sm"
          >
            + Buat Berita
          </Link>
          <Link
            href="/admin/galeri"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            + Unggah Foto
          </Link>
        </div>
      </div>

      {/* Grid Statistik Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Total GTK</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{teachers.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Guru &amp; Tenaga Pendidik</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Total Berita</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{news.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Artikel aktif &amp; draft</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Foto Galeri</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{gallery.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Dokumentasi kegiatan</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Pendaftar PPDB</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{ppdb.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Calon santri terdaftar</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Status PPDB</p>
            <p className="text-lg sm:text-xl font-black text-emerald-800 mt-1">
              {settings.isPpdbActive ? "DIBUKA" : "DITUTUP"}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">T.A. {settings.ppdbAcademicYear}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pintasan Aksi & Pendaftar Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pendaftar PPDB Terbaru */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg">Pendaftaran Santri Terbaru</h3>
            <Link href="/admin/ppdb" className="text-xs font-bold text-emerald-800 hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          {ppdb.length === 0 ? (
            <p className="text-slate-400 text-sm py-6 text-center">Belum ada pendaftar baru.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {ppdb.slice(0, 4).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{p.fullName}</h4>
                    <p className="text-xs text-slate-500">{p.previousSchool} • {p.programChoice}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        p.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : p.status === "verified"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.registrationNo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informasi Status Pengaturan Cepat */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Status Identitas Madrasah
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Kepala Madrasah</p>
              <p className="font-semibold text-slate-800">{settings.headmasterName}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Akreditasi</p>
              <p className="font-semibold text-emerald-800">{settings.accreditation}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">NPSN / NSM</p>
              <p className="text-xs text-slate-600">{settings.npsn} / {settings.nsm}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Pengumuman Berjalan</p>
              <p className="text-xs text-slate-600 truncate">{settings.announcementText}</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/pengaturan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Buka Menu Pengaturan Informasi Sekolah &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
