import React from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { ArrowRight, BookOpen } from "./Icons";

interface HeadmasterGreetingProps {
  name?: string;
  speech?: string;
  photo?: string;
}

export default function HeadmasterGreeting({
  name = "Drs. H. Ahmad Fathoni, M.Pd.I",
  speech = "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di portal resmi MTs Al Falaahiyyah Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang. Di era keterbukaan informasi ini, kami berikhtiar menyajikan pendidikan madrasah yang mengakar pada aqidah Islamiyyah yang kokoh, berwawasan luas, dan berakhlak mulia. Kami mengajak seluruh elemen masyarakat untuk bersinergi membangun peradaban generasi Qur'ani yang berdaya saing.",
  photo = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
}: HeadmasterGreetingProps) {
  // Ambil 2 paragraf pertama untuk preview di beranda
  const speechParagraphs = speech.split("\n\n").slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Foto Kepala Madrasah */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm w-full">
              {/* Decorative Accent Background Box */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-emerald-800 to-amber-500 opacity-20 blur-lg" />

              <div className="relative bg-white p-3 rounded-2xl shadow-xl border border-slate-200">
                <div className="overflow-hidden rounded-xl bg-slate-100 aspect-[4/5]">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="mt-4 text-center pb-2">
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">{name}</h3>
                  <p className="text-emerald-800 text-sm font-semibold mt-0.5">
                    Kepala MTs Al Falaahiyyah
                  </p>
                  <p className="text-slate-500 text-xs">Cikoneng Kulon, Ganeas, Sumedang</p>
                </div>
              </div>
            </div>
          </div>

          {/* Teks Sambutan */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-block bg-emerald-100/80 text-emerald-900 font-bold text-xs uppercase px-3 py-1 rounded-full">
              Sambutan Pimpinan
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Mewujudkan Madrasah Mandiri, Berprestasi, dan Beradab
            </h2>

            <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
              {speechParagraphs.map((para, idx) => (
                <p key={idx} className={idx === 0 ? "font-serif italic text-emerald-950 font-medium" : ""}>
                  {para}
                </p>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm group"
              >
                <span>Baca Profil &amp; Sejarah Selengkapnya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
