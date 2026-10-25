import React from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { getSchoolSettings } from "@/lib/db";
import { BookOpen, ShieldCheck, Award, MapPin, CheckCircle, Users } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Profil Madrasah",
  description: "Profil, sejarah, struktur organisasi, dan fasilitas MTs Al Falaahiyyah Cikoneng Kulon, Ganeas, Sumedang.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilPage() {
  const settings = await getSchoolSettings();

  const facilities = [
    { title: "Ruang Kelas Representatif", desc: "Dilengkapi ventilasi memadai, pencahayaan optimal, dan sarana multimedia pembelajaran." },
    { title: "Laboratorium Komputer & TIK", desc: "Sarana komputasi untuk pelaksanaan asesmen nasional (ANBK) dan pembelajaran digital." },
    { title: "Masjid / Musholla Al Falaahiyyah", desc: "Pusat kegiatan shalat berjamaah, dhuha bersama, kajian kitab, dan halaqah tahfidz." },
    { title: "Perpustakaan & Pojok Literasi", desc: "Koleksi buku keagamaan, kitab rujukan, buku teks pelajaran, dan ensiklopedia Islam." },
    { title: "Lapangan Olahraga & Upacara", desc: "Fasilitas kegiatan apel bendera, senam sehat, futsal, voli, dan latihan pramuka." },
    { title: "Ruang UKS & Konseling", desc: "Pelayanan kesehatan pertama santri dan bimbingan konseling untuk pembinaan karakter." },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Mengenal Lebih Dekat
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Profil MTs Al Falaahiyyah
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang, Jawa Barat
          </p>
        </div>
      </div>

      {/* Bagian Sejarah & Latar Belakang */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Sejarah &amp; Fondasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Tumbuh dari Semangat Dakwah &amp; Pendidikan di Ganeas Sumedang
            </h2>
            <div className="text-slate-600 space-y-4 text-base leading-relaxed">
              <p>
                <strong>Madrasah Tsanawiyah (MTs) Al Falaahiyyah</strong> didirikan atas prakarsa para tokoh agama, alim ulama, dan masyarakat di Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang yang menginginkan hadirnya lembaga pendidikan Islam berkualitas setingkat SMP yang mengakar kuat pada nilai-nilai keislaman dan akhlakul karimah.
              </p>
              <p>
                Berada di wilayah yang asri dan kondusif untuk menuntut ilmu, madrasah ini terus bertransformasi mengimbangi dinamika zaman tanpa meninggalkan jati diri ketawadhuan pesantren salaf. Kurikulum yang diterapkan secara harmonis mengintegrasikan standar nasional pendidikan Kementerian Agama Republik Indonesia dengan penguatan tahfidz Al-Qur&apos;an dan kajian kitab kuning.
              </p>
              <p>
                Hingga kini, MTs Al Falaahiyyah terus dipercaya oleh para orang tua santri dari berbagai pelosok Sumedang dan sekitarnya sebagai kawah candradimuka tempat putra-putri mereka dibina menjadi generasi yang cerdas pikirannya dan mulia pekertinya.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-100 aspect-[4/3] bg-slate-100">
              <img
                src={
                  settings.profileImage ||
                  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000"
                }
                alt="Kampus MTs Al Falaahiyyah Cikoneng Kulon Ganeas"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Lingkungan Belajar</div>
                  <div className="font-extrabold text-lg">Asri, Bersahaja, dan Religius</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Identitas & Legalitas Sekolah */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Informasi Kelembagaan"
            title="Identitas Resmi Madrasah"
            subtitle="Data legalitas dan perizinan resmi MTs Al Falaahiyyah di bawah naungan Kementerian Agama."
          />

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Nama Madrasah</span>
                <span className="sm:col-span-2 font-semibold text-emerald-900">{settings.schoolName}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Yayasan Penyelenggara</span>
                <span className="sm:col-span-2 text-slate-800">{settings.foundationName}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Nomor Statistik Madrasah (NSM)</span>
                <span className="sm:col-span-2 text-slate-800">{settings.nsm}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">NPSN</span>
                <span className="sm:col-span-2 text-slate-800">{settings.npsn}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Status Akreditasi</span>
                <span className="sm:col-span-2 font-semibold text-emerald-800">{settings.accreditation}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Alamat Lengkap</span>
                <span className="sm:col-span-2 text-slate-800">{settings.address}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Wilayah Administratif</span>
                <span className="sm:col-span-2 text-slate-800">
                  Desa {settings.village}, Kecamatan {settings.district}, Kabupaten {settings.regency}, Provinsi {settings.province} {settings.postalCode}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/70">
                <span className="font-bold text-slate-700">Kepala Madrasah</span>
                <span className="sm:col-span-2 font-semibold text-slate-900">{settings.headmasterName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Fasilitas Madrasah */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Sarana Prasarana"
          title="Fasilitas Penunjang Pembelajaran"
          subtitle="Sarana yang memadai disiapkan untuk kenyamanan proses belajar mengajar dan pembinaan ibadah santri."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-cardHover transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{fac.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
