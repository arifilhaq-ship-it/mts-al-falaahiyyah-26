import React from "react";
import SectionHeading from "./SectionHeading";
import { BookOpen, GraduationCap, Award, Mosque, Sparkles, Users } from "./Icons";

const programs = [
  {
    title: "Tahfidzul Qur'an & Tahsin",
    badge: "Program Utama",
    desc: "Bimbingan hafalan Al-Qur'an terstruktur dengan target mutqin 3 hingga 5 juz, dilengkapi tajwid aplikatif dan perbaikan makharijul huruf.",
    icon: BookOpen,
    color: "from-emerald-600 to-emerald-800",
  },
  {
    title: "Pendalaman Kitab Kuning",
    badge: "Khas Madrasah",
    desc: "Kajian dasar literatur pesantren salaf seperti Safinatun Najah, Matan Al-Jurumiyyah, dan Akhlakul Banin guna memperkuat aqidah & fiqih ibadah.",
    icon: Mosque,
    color: "from-amber-600 to-amber-800",
  },
  {
    title: "Madrasah Sains & Riset Digital",
    badge: "Akademik",
    desc: "Integrasi kurikulum Kemenag dan Kurikulum Nasional didukung laboratorium komputer dan pembinaan olimpiade sains madrasah (KSM).",
    icon: GraduationCap,
    color: "from-emerald-700 to-teal-900",
  },
  {
    title: "Bahasa Asing (Arab & Inggris)",
    badge: "Bilingual",
    desc: "Latihan muhadatsah yaumiyyah, vocabulary building, dan pidato (muhadharah 3 bahasa) untuk menumbuhkan rasa percaya diri santri di kancah global.",
    icon: Sparkles,
    color: "from-teal-600 to-emerald-900",
  },
  {
    title: "Pembiasaan Shalat & Dhuha",
    badge: "Karakter Santri",
    desc: "Rutinitas shalat Dhuha berjamaah setiap pagi, tadarus Al-Qur'an, dan shalat Dzuhur berjamaah mendidik kedisiplinan serta ketenangan batin.",
    icon: Award,
    color: "from-emerald-800 to-emerald-950",
  },
  {
    title: "Pramuka & Kesenian Hadroh",
    badge: "Pengembangan Diri",
    desc: "Ekstrakurikuler kepanduan pramuka gugus depan, kesenian hadroh rebana, bela diri pencak silat, dan palang merah remaja (PMR).",
    icon: Users,
    color: "from-amber-700 to-amber-950",
  },
];

export default function ProgramsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pendidikan Terpadu"
          title="Program Unggulan MTs Al Falaahiyyah"
          subtitle="Menggabungkan kurikulum pendidikan madrasah, nilai pesantren, dan pengembangan potensi minat bakat santri."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-emerald-700">
                  <span>MTs Al Falaahiyyah Cikoneng Kulon</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
