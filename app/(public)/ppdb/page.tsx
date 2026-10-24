"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import { defaultSettings } from "@/lib/data-defaults";
import { SchoolSettings } from "@/lib/types";
import {
  CheckCircle,
  Calendar,
  FileText,
  ArrowRight,
  Phone,
  WhatsApp,
  User,
  BookOpen,
  Bell,
  ShieldCheck,
} from "@/components/Icons";

export default function PpdbPage() {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [formData, setFormData] = useState({
    fullName: "",
    nisn: "",
    gender: "L" as "L" | "P",
    birthPlace: "Sumedang",
    birthDate: "",
    previousSchool: "",
    parentName: "",
    parentPhone: "",
    address: "",
    programChoice: "Reguler" as "Reguler" | "Tahfidz" | "Sains & Riset",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ registrationNo: string; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Sinkronisasi informasi kontak PPDB secara dinamis dari database
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data);
        }
      } catch (err) {
        // Fallback defaultSettings
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ppdb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengirim formulir.");
      }

      setSuccessData({
        registrationNo: json.data.registrationNo,
        name: json.data.fullName,
      });

      // Reset form
      setFormData({
        fullName: "",
        nisn: "",
        gender: "L",
        birthPlace: "Sumedang",
        birthDate: "",
        previousSchool: "",
        parentName: "",
        parentPhone: "",
        address: "",
        programChoice: "Reguler",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: "01", title: "Isi Formulir Online", desc: "Lengkapi data diri calon santri dan kontak wali secara teliti melalui form di bawah ini." },
    { num: "02", title: "Konfirmasi WhatsApp", desc: "Kirim bukti konfirmasi pendaftaran kepada panitia PPDB untuk verifikasi berkas." },
    { num: "03", title: "Tes Pemetaan Minat & Baca Al-Qur'an", desc: "Observasi ramah santri meliputi baca Al-Qur'an, praktek shalat, dan wawancara singkat." },
    { num: "04", title: "Pengumuman Hasil", desc: "Hasil seleksi diumumkan melalui website dan pesan resmi WhatsApp panitia." },
    { num: "05", title: "Daftar Ulang & Matsama", desc: "Pengambilan atribut seragam dan mengikuti Masa Ta'aruf Santri Madrasah (Matsama)." },
  ];

  // Mengambil daftar syarat dari pengaturan admin
  const activeRequirements =
    settings.ppdbRequirements && settings.ppdbRequirements.length > 0
      ? settings.ppdbRequirements
      : [
          "Mengisi Formulir Pendaftaran (Online atau Cetak)",
          "Fotokopi Akta Kelahiran (2 Lembar)",
          "Fotokopi Kartu Keluarga / KK (2 Lembar)",
          "Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SD/MI yang telah dilegalisir",
          "Pas Foto 3x4 Calon Santri (3 Lembar, Latar Belakang Merah/Biru)",
          "Fotokopi Kartu KIP / PKH (Bagi pemegang kartu bantuan)",
        ];

  const contactWa = (settings.ppdbContactPhone || settings.whatsapp || settings.phone || "6289654542542").replace(/[^0-9]/g, "");

  return (
    <div className="bg-white">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Tahun Pelajaran {settings.ppdbAcademicYear || "2025/2026"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Penerimaan Peserta Didik Baru (PPDB)
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Mari bertumbuh menjadi generasi Qur&apos;ani dan berakhlakul karimah bersama {settings.schoolName}.
          </p>
        </div>
      </div>

      {/* Jadwal Gelombang Dinamis Sesuai Pengaturan Admin */}
      <section className="py-12 bg-emerald-50/70 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Gelombang 1 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-600 shadow-sm relative overflow-hidden">
              <span className="bg-emerald-700 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full inline-block mb-3">
                {settings.ppdbWave1Title || "Gelombang 1 (Prioritas)"}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {settings.ppdbWave1Date || "1 Januari – 31 Maret 2025"}
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {settings.ppdbWave1Desc || "Keuntungan: Bebas biaya formulir & kemudahan pemilihan program tahfidz."}
              </p>
            </div>

            {/* Gelombang 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="bg-slate-800 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full inline-block mb-3">
                {settings.ppdbWave2Title || "Gelombang 2 (Reguler)"}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {settings.ppdbWave2Date || "1 April – 30 Juni 2025"}
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {settings.ppdbWave2Desc || "Pendaftaran ditutup sewaktu-waktu apabila kuota rombongan belajar telah terpenuhi."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Tahapan Seleksi"
          title="Alur Pendaftaran 5 Langkah Mudah"
          subtitle="Proses pendaftaran santri baru dirancang mudah, ramah, dan transparan."
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-card transition-all"
            >
              <div>
                <span className="text-2xl font-black text-amber-500 block mb-2">{st.num}</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">{st.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Syarat Pendaftaran Dinamis */}
      <section className="py-14 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-800" />
              <span>Persyaratan &amp; Dokumen Calon Santri Baru</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeRequirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formulir Pendaftaran Online / Pesan Ditutup */}
      <section id="form-pendaftaran" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Formulir Online"
          title={`Pendaftaran Calon Santri ${settings.schoolName}`}
          subtitle="Data pendaftaran akan langsung tersimpan di sistem administrasi madrasah."
        />

        {/* Jika Status PPDB Ditutup oleh Admin */}
        {!settings.isPpdbActive ? (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm animate-fadeIn">
            <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Pendaftaran Online Sedang Ditutup
            </h3>
            <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
              {settings.ppdbClosedMessage ||
                "Pendaftaran Peserta Didik Baru (PPDB) saat ini telah ditutup atau belum dibuka. Silakan hubungi Panitia PPDB untuk informasi ketersediaan kuota susulan atau jadwal pembukaan berikutnya."}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${contactWa}?text=${encodeURIComponent(
                  `Assalamu'alaikum Panitia PPDB ${settings.schoolName}, saya ingin menanyakan informasi mengenai pendaftaran santri baru Tahun Ajaran ${settings.ppdbAcademicYear || "2025/2026"}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition-colors"
              >
                <WhatsApp className="w-5 h-5" />
                <span>Hubungi Panitia PPDB via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Sukses Pendaftaran */}
            {successData && (
              <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-600 rounded-2xl text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950">Pendaftaran Berhasil Dikirim!</h3>
                  <p className="text-slate-700 text-sm mt-1">
                    Selamat, pendaftaran atas nama <strong>{successData.name}</strong> telah kami terima dengan nomor:
                  </p>
                  <div className="text-2xl font-black text-emerald-800 bg-white py-2 px-4 rounded-xl border border-emerald-300 inline-block mt-2 font-mono">
                    {successData.registrationNo}
                  </div>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Silakan simpan nomor pendaftaran di atas dan konfirmasikan ke panitia melalui WhatsApp untuk melanjutkan proses observasi.
                </p>

                <a
                  href={`https://wa.me/${contactWa}?text=Assalamu%27alaikum%20Panitia%20PPDB%20${encodeURIComponent(
                    settings.schoolName
                  )},%20saya%20telah%20mendaftar%20online%20dengan%20Nomor:%20${successData.registrationNo}%20atas%20nama%20${encodeURIComponent(
                    successData.name
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition-colors"
                >
                  <WhatsApp className="w-5 h-5" />
                  <span>Konfirmasi via WhatsApp Panitia</span>
                </a>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nama Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Lengkap Calon Santri *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Contoh: Muhammad Fikri Ramadhan"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* NISN */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    NISN (10 Digit)
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    placeholder="Contoh: 0102938475"
                    value={formData.nisn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Jenis Kelamin *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>

                {/* Tempat Lahir */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    placeholder="Contoh: Sumedang"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* Asal Sekolah */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Sekolah Asal (SD / MI) *
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    required
                    placeholder="Contoh: SDN Cikoneng / MI Ganeas"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* Nama Orang Tua / Wali */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    required
                    placeholder="Contoh: H. Dadang Sulaeman"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* Nomor WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    name="parentPhone"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                {/* Pilihan Program */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pilihan Program Belajar
                  </label>
                  <select
                    name="programChoice"
                    value={formData.programChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  >
                    <option value="Reguler">Kelas Reguler (Kurikulum Kemenag &amp; Nasional Terpadu)</option>
                    <option value="Tahfidz">Kelas Peminatan Tahfidz Al-Qur&apos;an</option>
                    <option value="Sains & Riset">Kelas Peminatan Sains &amp; Riset Madrasah</option>
                  </select>
                </div>

                {/* Alamat Rumah */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Alamat Tempat Tinggal
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    placeholder="Contoh: Cikoneng Kulon RT 02 RW 01, Desa Cikoneng, Kec. Ganeas, Kab. Sumedang"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Memproses Data...</span>
                  ) : (
                    <>
                      <span>Kirim Formulir Pendaftaran Sekarang</span>
                      <ArrowRight className="w-5 h-5 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
