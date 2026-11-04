"use client";

import React, { useState } from "react";
import { Teacher } from "@/lib/types";
import { GraduationCap, BookOpen, X } from "@/components/Icons";

const categories = [
  { id: "semua", label: "Semua GTK" },
  { id: "pimpinan", label: "Pimpinan Madrasah" },
  { id: "pai", label: "Guru PAI & Keagamaan" },
  { id: "umum", label: "Guru Mapel Umum" },
  { id: "staf", label: "Tenaga Kependidikan / TU" },
];

interface GuruStaffClientProps {
  initialTeachers: Teacher[];
}

export default function GuruStaffClient({ initialTeachers }: GuruStaffClientProps) {
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter((item) => {
    if (activeCategory === "semua") return true;
    return item.category === activeCategory;
  });

  const getCategoryLabel = (cat: Teacher["category"]) => {
    if (cat === "pimpinan") return "Pimpinan";
    if (cat === "pai") return "PAI & Kitab";
    if (cat === "umum") return "Mapel Umum";
    return "Staf Tata Usaha";
  };

  return (
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
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-14 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
          Belum ada data Guru &amp; Tenaga Kependidikan pada kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => setSelectedTeacher(teacher)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="aspect-[4/4.5] overflow-hidden bg-slate-100 relative">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-950/80 backdrop-blur-sm text-amber-300 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {getCategoryLabel(teacher.category)}
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
      )}

      {/* Modal Preview Foto GTK */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[4/4.5] bg-slate-900 relative">
              <img
                src={selectedTeacher.photo}
                alt={selectedTeacher.name}
                className="w-full h-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-white">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                {getCategoryLabel(selectedTeacher.category)}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">{selectedTeacher.name}</h3>
              <p className="text-emerald-800 text-sm font-bold mt-0.5">{selectedTeacher.role}</p>
              {selectedTeacher.subject && (
                <p className="text-xs text-slate-600 mt-2">
                  <strong>Bidang Studi / Tugas:</strong> {selectedTeacher.subject}
                </p>
              )}
              {selectedTeacher.education && (
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Pendidikan:</strong> {selectedTeacher.education}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
