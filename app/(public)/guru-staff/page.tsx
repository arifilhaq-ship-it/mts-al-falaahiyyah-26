"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import { defaultTeachers } from "@/lib/data-defaults";
import { Teacher } from "@/lib/types";
import { GraduationCap, Award, BookOpen, User } from "@/components/Icons";

const categories = [
  { id: "semua", label: "Semua GTK" },
  { id: "pimpinan", label: "Pimpinan Madrasah" },
  { id: "pai", label: "Guru PAI & Keagamaan" },
  { id: "umum", label: "Guru Mapel Umum" },
  { id: "staf", label: "Tenaga Kependidikan / TU" },
];

export default function GuruStaffPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);
  const [activeCategory, setActiveCategory] = useState("semua");

  useEffect(() => {
    // Sinkronisasi data dinamis dari database (agar foto / nama yang diedit admin langsung muncul)
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/teachers");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setTeachers(json.data);
        }
      } catch (err) {
        // Fallback ke defaultTeachers yang sudah dimuat
      }
    };
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((item) => {
    if (activeCategory === "semua") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="bg-white">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Pendidik &amp; Tenaga Kependidikan
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Guru &amp; Tenaga Kependidikan
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Dewan asatidz dan pendidik berdedikasi membimbing santri MTs Al Falaahiyyah Cikoneng Kulon Ganeas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Filter Kategori */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-emerald-800 text-white shadow-md scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Kartu GTK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col group"
            >
              <div className="aspect-[4/4.5] overflow-hidden bg-slate-100 relative">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-950/80 backdrop-blur-sm text-amber-300 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {teacher.category === "pimpinan"
                      ? "Pimpinan"
                      : teacher.category === "pai"
                      ? "PAI & Kitab"
                      : teacher.category === "umum"
                      ? "Mapel Umum"
                      : "Staf Tata Usaha"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-emerald-800 transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-emerald-800 text-xs font-bold mt-1">{teacher.role}</p>

                  {teacher.subject && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{teacher.subject}</span>
                    </div>
                  )}

                  {teacher.education && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{teacher.education}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  MTs Al Falaahiyyah Cikoneng Kulon
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
