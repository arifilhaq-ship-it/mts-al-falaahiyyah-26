import React from "react";
import { getTeachersList } from "@/lib/db";
import GuruStaffClient from "@/components/GuruStaffClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GuruStaffPage() {
  const teachers = await getTeachersList();

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
            Dewan asatidz dan pendidik berdedikasi membimbing peserta didik MTs Al Falaahiyyah Cikoneng Kulon Ganeas.
          </p>
        </div>
      </div>

      <GuruStaffClient initialTeachers={teachers} />
    </div>
  );
}
