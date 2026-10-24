"use client";

import React, { useState, useEffect } from "react";
import { PpdbRegistration, SchoolSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/data-defaults";
import {
  Users,
  WhatsApp,
  CheckCircle,
  Search,
  Settings,
  Calendar,
  FileText,
  Phone,
  ShieldCheck,
  Download,
} from "@/components/Icons";

export default function AdminPpdbPage() {
  const [activeTab, setActiveTab] = useState<"pendaftar" | "pengaturan">("pendaftar");

  // Data Pendaftar
  const [list, setList] = useState<PpdbRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Data Pengaturan PPDB
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [requirementsText, setRequirementsText] = useState("");

  const fetchPpdb = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ppdb");
      const data = await res.json();
      if (data.success) {
        setList(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        const s: SchoolSettings = data.data;
        setSettings(s);

        const reqs = s.ppdbRequirements && s.ppdbRequirements.length > 0
          ? s.ppdbRequirements.join("\n")
          : [
              "Mengisi Formulir Pendaftaran (Online atau Cetak)",
              "Fotokopi Akta Kelahiran (2 Lembar)",
              "Fotokopi Kartu Keluarga / KK (2 Lembar)",
              "Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SD/MI yang telah dilegalisir",
              "Pas Foto 3x4 Calon Santri (3 Lembar, Latar Belakang Merah/Biru)",
              "Fotokopi Kartu KIP / PKH (Bagi pemegang kartu bantuan)",
            ].join("\n");
        setRequirementsText(reqs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPpdb();
    fetchSettings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: PpdbRegistration["status"]) => {
    try {
      const res = await fetch(`/api/ppdb/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Status pendaftaran berhasil diubah menjadi: ${newStatus}`);
        fetchPpdb();
      }
    } catch (err) {
      alert("Gagal mengubah status pendaftar.");
    }
  };

  const handleSavePpdbSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage("");

    try {
      // Pecah requirementsText menjadi array string (tiap baris)
      const parsedReqs = requirementsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const updatedPayload: Partial<SchoolSettings> = {
        isPpdbActive: settings.isPpdbActive,
        ppdbAcademicYear: settings.ppdbAcademicYear,
        ppdbClosedMessage: settings.ppdbClosedMessage,
        ppdbWave1Title: settings.ppdbWave1Title,
        ppdbWave1Date: settings.ppdbWave1Date,
        ppdbWave1Desc: settings.ppdbWave1Desc,
        ppdbWave2Title: settings.ppdbWave2Title,
        ppdbWave2Date: settings.ppdbWave2Date,
        ppdbWave2Desc: settings.ppdbWave2Desc,
        ppdbRequirements: parsedReqs,
        ppdbContactName: settings.ppdbContactName,
        ppdbContactPhone: settings.ppdbContactPhone,
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMessage("Pengaturan jadwal, gelombang, dan formulir PPDB berhasil diperbarui.");
      fetchSettings();
    } catch (err: any) {
      setMessage(err.message || "Gagal menyimpan pengaturan PPDB.");
    } finally {
      setSavingSettings(false);
    }
  };

  const exportCSV = () => {
    if (list.length === 0) {
      alert("Belum ada data pendaftar untuk diekspor.");
      return;
    }

    const headers = ["No Registrasi", "Nama Calon Santri", "NISN", "Gender", "Tempat Lahir", "Tgl Lahir", "Asal Sekolah", "Nama Wali", "No WA Wali", "Program", "Status", "Tgl Daftar"];
    const rows = list.map((item) => [
      item.registrationNo,
      `"${item.fullName}"`,
      `"${item.nisn}"`,
      item.gender,
      `"${item.birthPlace}"`,
      item.birthDate,
      `"${item.previousSchool}"`,
      `"${item.parentName}"`,
      `"${item.parentPhone}"`,
      item.programChoice,
      item.status,
      item.createdAt ? item.createdAt.split("T")[0] : "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data-PPDB-MTs-Al-Falaahiyyah-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredList = list.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      item.previousSchool.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Pusat Pengelolaan PPDB
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Kelola pendaftar calon santri baru serta atur jadwal gelombang, syarat, status buka/tutup pendaftaran.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("pendaftar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "pendaftar"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Pendaftar ({list.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pengaturan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "pengaturan"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan &amp; Jadwal PPDB</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: DATA PENDAFTAR SANTRI BARU */}
      {/* ============================================================== */}
      {activeTab === "pendaftar" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama santri, nomor pendaftaran, atau asal sekolah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Verifikasi (Pending)</option>
                  <option value="verified">Terverifikasi (Verified)</option>
                  <option value="accepted">Diterima (Accepted)</option>
                  <option value="rejected">Ditolak (Rejected)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-sm"
                title="Ekspor data pendaftar ke file Excel/CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>

          {/* Tabel Data Pendaftar */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Memuat data pendaftar...</div>
            ) : filteredList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">Tidak ada pendaftar yang cocok.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">No. Registrasi</th>
                      <th className="p-4">Nama Calon Santri</th>
                      <th className="p-4">Asal Sekolah</th>
                      <th className="p-4">Pilihan Program</th>
                      <th className="p-4">Kontak Wali</th>
                      <th className="p-4">Status &amp; Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-emerald-900 text-xs whitespace-nowrap">
                          {item.registrationNo}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 leading-snug">{item.fullName}</div>
                          <div className="text-xs text-slate-400">
                            {item.gender === "L" ? "Laki-laki" : "Perempuan"} • NISN: {item.nisn}
                          </div>
                        </td>
                        <td className="p-4 text-xs text-slate-700">
                          {item.previousSchool}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {item.programChoice}
                          </span>
                        </td>
                        <td className="p-4 text-xs">
                          <div className="font-semibold text-slate-800">{item.parentName}</div>
                          <a
                            href={`https://wa.me/${item.parentPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Assalamu'alaikum Bpk/Ibu ${item.parentName}, kami dari Panitia PPDB ${settings.schoolName} terkait pendaftaran santri baru an. ${item.fullName} (${item.registrationNo}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold mt-0.5"
                          >
                            <WhatsApp className="w-3.5 h-3.5" />
                            <span>{item.parentPhone}</span>
                          </a>
                        </td>
                        <td className="p-4">
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none ${
                              item.status === "accepted"
                                ? "bg-green-50 text-green-800 border-green-300"
                                : item.status === "verified"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : item.status === "rejected"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            <option value="pending">Pending (Menunggu)</option>
                            <option value="verified">Terverifikasi (Berkas Ada)</option>
                            <option value="accepted">Diterima Lulus</option>
                            <option value="rejected">Ditolak</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PENGATURAN & JADWAL PPDB */}
      {/* ============================================================== */}
      {activeTab === "pengaturan" && (
        <form onSubmit={handleSavePpdbSettings} className="space-y-6 animate-fadeIn">
          {/* Card 1: Status Buka / Tutup PPDB & Tahun Pelajaran */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Status Pendaftaran &amp; Tahun Ajaran</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.isPpdbActive}
                    onChange={(e) => setSettings({ ...settings, isPpdbActive: e.target.checked })}
                    className="w-5 h-5 text-emerald-800 rounded focus:ring-emerald-700 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      Buka Pendaftaran Calon Santri Baru (PPDB Online)
                    </span>
                    <span className="text-xs text-slate-600 block">
                      Jika dinonaktifkan, formulir pendaftaran online akan ditutup dan menampilkan pesan pemberitahuan ramah bagi orang tua calon santri.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tahun Ajaran PPDB *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2025/2026 atau 2026/2027"
                  value={settings.ppdbAcademicYear || ""}
                  onChange={(e) => setSettings({ ...settings, ppdbAcademicYear: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor WhatsApp Khusus Panitia PPDB *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0896-5454-2542 atau 6289654542542"
                  value={settings.ppdbContactPhone || ""}
                  onChange={(e) => setSettings({ ...settings, ppdbContactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pesan Pemberitahuan Saat Pendaftaran Ditutup
                </label>
                <textarea
                  rows={2}
                  placeholder="Pesan yang ditampilkan di halaman pendaftaran ketika status pendaftaran dimatikan..."
                  value={settings.ppdbClosedMessage || ""}
                  onChange={(e) => setSettings({ ...settings, ppdbClosedMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Jadwal Gelombang 1 & 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Jadwal &amp; Keterangan Gelombang Pendaftaran</span>
            </h2>

            {/* Gelombang 1 */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="bg-emerald-700 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full inline-block">
                Pengaturan Gelombang 1
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Judul Gelombang 1
                  </label>
                  <input
                    type="text"
                    value={settings.ppdbWave1Title || ""}
                    onChange={(e) => setSettings({ ...settings, ppdbWave1Title: e.target.value })}
                    placeholder="Contoh: Gelombang 1 (Prioritas)"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Rentang Waktu / Tanggal
                  </label>
                  <input
                    type="text"
                    value={settings.ppdbWave1Date || ""}
                    onChange={(e) => setSettings({ ...settings, ppdbWave1Date: e.target.value })}
                    placeholder="Contoh: 1 Januari – 31 Maret 2025"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Keuntungan / Keterangan Gelombang 1
                  </label>
                  <input
                    type="text"
                    value={settings.ppdbWave1Desc || ""}
                    onChange={(e) => setSettings({ ...settings, ppdbWave1Desc: e.target.value })}
                    placeholder="Contoh: Bebas biaya formulir & kemudahan pemilihan program tahfidz."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Gelombang 2 */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="bg-slate-800 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full inline-block">
                Pengaturan Gelombang 2
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Judul Gelombang 2
                  </label>
                  <input
                    type="text"
                    value={settings.ppdbWave2Title || ""}
                    onChange={(e) => setSettings({ ...settings, ppdbWave2Title: e.target.value })}
                    placeholder="Contoh: Gelombang 2 (Reguler)"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Rentang Waktu / Tanggal
                  </label>
                  <input
                    type="text"
                    value={settings.ppdbWave2Date || ""}
                    onChange={(e) => setSettings({ ...settings, ppdbWave2Date: e.target.value })}
                    placeholder="Contoh: 1 April – 30 Juni 2025"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Keterangan Gelombang 2
                  </label>
                  <input
                    type="text"
                    value={settings.ppdbWave2Desc || ""}
                    onChange={(e) => setSettings({ ...settings, ppdbWave2Desc: e.target.value })}
                    placeholder="Contoh: Pendaftaran ditutup sewaktu-waktu apabila kuota terpenuhi."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Persyaratan Berkas Pendaftaran */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Daftar Persyaratan &amp; Dokumen Calon Santri</span>
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Tulis Satu Persyaratan per Baris (Tekan Enter untuk baris baru)
              </label>
              <textarea
                rows={6}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="Mengisi Formulir Pendaftaran&#10;Fotokopi Kartu Keluarga&#10;Fotokopi Akta Kelahiran..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-sans focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
              />
              <p className="text-xs text-slate-500 mt-1">
                *Daftar ini akan otomatis diformat menjadi poin centang rapi di halaman publik PPDB.
              </p>
            </div>
          </div>

          {/* Tombol Simpan Pengaturan PPDB */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {savingSettings ? (
                <span>Menyimpan Pengaturan...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>Simpan Semua Pengaturan PPDB</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
