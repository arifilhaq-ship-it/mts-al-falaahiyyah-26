import React from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, ShieldCheck, Sparkles, Award, CheckCircle, Mosque } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Visi & Misi",
  description: "Visi, misi, tujuan, dan 7 pilar karakter santri MTs Al Falaahiyyah Cikoneng Kulon Ganeas Sumedang.",
};

export default function VisiMisiPage() {
  const missions = [
    "Menyelenggarakan pendidikan Islam terpadu yang memadukan kurikulum Kementerian Agama, kurikulum nasional, dan nilai-nilai luhur pesantren.",
    "Mengembangkan program tahsin dan tahfidzul Qur'an secara istiqomah guna mencetak generasi hafidz yang mengamalkan ajaran Al-Qur'an.",
    "Menanamkan aqidah yang lurus, ibadah yang benar, serta pembiasaan akhlakul karimah dalam kehidupan sehari-hari.",
    "Meningkatkan mutu proses belajar mengajar berbasis sains, teknologi informasi, dan literasi digital yang adaptif.",
    "Membina potensi, minat, dan bakat santri melalui ragam kegiatan ekstrakurikuler kepanduan, olahraga, dan seni Islami.",
    "Membangun lingkungan madrasah yang asri, bersih, aman, kekeluargaan, dan berbudaya Islami.",
    "Mendorong terwujudnya santri berwawasan global yang mampu berkomunikasi dalam bahasa Arab dan Inggris.",
  ];

  const pillars = [
    { title: "Religius (Taqwa)", desc: "Menjadikan syariat Islam sebagai pedoman hidup melalui pembiasaan shalat, tilawah, dan dzikir." },
    { title: "Jujur (Siddiq)", desc: "Menjunjung tinggi integritas, kebenaran dalam perkataan, kejujuran akademis, dan amanah." },
    { title: "Disiplin (Istiqomah)", desc: "Menghargai waktu, tertib aturan madrasah, dan konsisten dalam menjalankan kewajiban." },
    { title: "Santun (Akhlakul Karimah)", desc: "Membiasakan budaya 5S (Senyum, Salam, Sapa, Sopan, Santun) kepada orang tua, guru, dan sesama." },
    { title: "Mandiri (Himmah)", desc: "Mampu mengurus diri sendiri, bertanggung jawab atas tugas belajar, dan tidak mudah berputus asa." },
    { title: "Peduli (Mahabbah)", desc: "Peka terhadap kesusahan sesama, gemar berinfaq, serta menjaga kelestarian lingkungan madrasah." },
    { title: "Berprestasi (Fathonah)", desc: "Memiliki daya juang tinggi untuk meraih keunggulan di bidang akademik maupun non-akademik." },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Arah &amp; Cita-Cita Luhur
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Visi &amp; Misi Madrasah
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Pedoman utama dalam seluruh ikhtiar pendidikan di MTs Al Falaahiyyah Cikoneng Kulon Ganeas Sumedang.
          </p>
        </div>
      </div>

      {/* Bagian Visi Utama */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="relative z-10 space-y-4">
            <span className="bg-amber-400 text-emerald-950 font-black text-xs uppercase px-3 py-1 rounded-full">
              Visi MTs Al Falaahiyyah
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-300 leading-snug">
              &ldquo;Terwujudnya Generasi Qur&apos;ani, Berakhlakul Karimah, Unggul dalam Prestasi, dan Berwawasan Global&rdquo;
            </h2>
            <p className="text-emerald-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed pt-2">
              Visi ini menjadi komitmen luhur segenap pendidik dan tenaga kependidikan MTs Al Falaahiyyah dalam mendidik tunas-tunas bangsa di Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang.
            </p>
          </div>
        </div>
      </section>

      {/* Bagian Misi Madrasah */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Langkah Nyata"
            title="Misi MTs Al Falaahiyyah"
            subtitle="Agenda strategis yang kami tempuh untuk merealisasikan visi madrasah secara berkelanjutan."
          />

          <div className="max-w-4xl mx-auto space-y-4">
            {missions.map((mission, idx) => (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-slate-700 text-base leading-relaxed pt-1 font-medium">
                  {mission}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian 7 Karakter Santri */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Karakter Islami"
          title="7 Karakter Utama Santri Al Falaahiyyah"
          subtitle="Nilai-nilai kepribadian yang dibentuk melalui kurikulum pembiasaan harian di madrasah."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:bg-white hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{pillar.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                Nilai Santri Al Falaahiyyah
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
