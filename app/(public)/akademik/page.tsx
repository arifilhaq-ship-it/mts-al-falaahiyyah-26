import React from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, Award, GraduationCap, Sparkles, CheckCircle, Mosque } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Akademik & Kesiswaan",
  description: "Struktur kurikulum madrasah, ekstrakurikuler, dan kalender pendidikan MTs Al Falaahiyyah Cikoneng Kulon Ganeas Sumedang.",
};

export default function AkademikPage() {
  const religiousSubjects = [
    { name: "Al-Qur'an Hadist", desc: "Mempelajari tafsir ayat-ayat pilihan, tajwid, hadist keutamaan menuntut ilmu & akhlak." },
    { name: "Aqidah Akhlak", desc: "Penanaman rukun iman, ketauhidan, adab pergaulan, serta pembersihan jiwa (tazkiyatun nafs)." },
    { name: "Fiqih & Ibadah", desc: "Pendalaman thaharah, shalat, zakat, puasa, muamalah Islam, dan manasik ibadah praktis." },
    { name: "Sejarah Kebudayaan Islam (SKI)", desc: "Meneladani sirah Nabawiyah, masa Khulafaur Rasyidin, dan sejarah masuknya Islam di Nusantara." },
    { name: "Bahasa Arab", desc: "Penguasaan kosa kata (mufrodat), tata bahasa (nahwu sharaf dasar), percakapan, dan qira'ah." },
  ];

  const nationalSubjects = [
    { name: "Matematika", desc: "Penalaran logis, aljabar, geometri, dan pemecahan masalah numerik terapan." },
    { name: "Ilmu Pengetahuan Alam (IPA)", desc: "Eksplorasi biologi, fisika, dan kimia terapan didukung laboratorium IPA." },
    { name: "Bahasa Indonesia", desc: "Keterampilan membaca kritis, menulis karya sastra, esai, dan retorika pidato." },
    { name: "Bahasa Inggris", desc: "Penguasaan listening, speaking, reading, dan writing untuk komunikasi global." },
    { name: "Ilmu Pengetahuan Sosial (IPS)", desc: "Wawasan kebangsaan, geografi, ekonomi, dan interaksi sosial kemasyarakatan." },
    { name: "Informatika & TIK", desc: "Literasi komputer, pengolahan data digital, dan pengenalan logika pemrograman dasar." },
  ];

  const extracurriculars = [
    { name: "Pramuka Gugus Depan", desc: "Kepanduan wajib membentuk kedisiplinan, kemandirian, dan kepemimpinan santri." },
    { name: "Hadroh & Rebana", desc: "Seni musik Islami dan shalawat nabi untuk berbagai peringatan hari besar Islam." },
    { name: "Tahfidz Club", desc: "Bimbingan hafalan Al-Qur'an intensif ba'da ashar bagi santri peminatan khusus." },
    { name: "Pencak Silat Al-Hikmah", desc: "Olahraga bela diri tradisional mengasah ketangkasan fisik, mental, dan spiritual." },
    { name: "Palang Merah Remaja (PMR)", desc: "Kecakapan pertolongan pertama pada kecelakaan (P3K) dan jiwa kerelawanan sosial." },
    { name: "English & Arabic Club", desc: "Klub bahasa asing untuk melatih percakapan santai, pidato, dan debat siswa." },
  ];

  return (
    <div className="bg-white">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Pendidikan Holistik
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Akademik &amp; Kesiswaan
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Integrasi harmonis antara kurikulum Kementerian Agama, kurikulum nasional, dan ekstrakurikuler minat bakat.
          </p>
        </div>
      </div>

      {/* Bagian Kurikulum PAI */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Ciri Khas Keagamaan"
          title="Mata Pelajaran Pendidikan Agama Islam (PAI)"
          subtitle="Pondasi utama dalam membentuk aqidah yang lurus dan pemahaman syariat Islam yang komprehensif."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {religiousSubjects.map((sub, idx) => (
            <div
              key={idx}
              className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200/80 hover:bg-emerald-50 hover:shadow-card transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center mb-4">
                <Mosque className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">{sub.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{sub.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian Kurikulum Umum & Sains */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Kurikulum Nasional"
            title="Mata Pelajaran Umum &amp; Sains"
            subtitle="Mempersiapkan santri dengan kemampuan nalar logis, literasi, numerasi, dan sains teknologi."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalSubjects.map((sub, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:shadow-cardHover transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">{sub.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian Ekstrakurikuler */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pengembangan Bakat"
          title="Ekstrakurikuler Santri"
          subtitle="Wadah penyaluran bakat, kepemimpinan, kepedulian sosial, dan kebugaran jasmani."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extracurriculars.map((ekskul, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:bg-white hover:shadow-cardHover transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-bold text-slate-900 text-lg">{ekskul.name}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{ekskul.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
