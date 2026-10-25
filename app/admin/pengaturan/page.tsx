"use client";

import React, { useState, useEffect } from "react";
import { SchoolSettings } from "@/lib/types";
import { Settings, CheckCircle, ShieldCheck } from "@/components/Icons";

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // State pengaturan Akun Login Admin (Username & Password)
  const [adminUsername, setAdminUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAdminUsername, setShowAdminUsername] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [savingCreds, setSavingCreds] = useState(false);
  const [credMessage, setCredMessage] = useState("");
  const [credError, setCredError] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [resSettings, resCreds] = await Promise.all([
        fetch("/api/settings", { cache: "no-store" }),
        fetch("/api/auth/credentials", { cache: "no-store" }),
      ]);
      const data = await resSettings.json();
      if (data.success) {
        setSettings(data.data);
      }
      if (resCreds.ok) {
        const credJson = await resCreds.json();
        if (credJson.success && credJson.data?.username) {
          setAdminUsername(credJson.data.username);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!settings) return;
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  // Fungsi unggah foto & logo langsung dari perangkat/HP (dengan kompresi otomatis)
  const handleImageUpload = (
    field: "headmasterPhoto" | "heroImage" | "profileImage" | "logoUrl",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran file foto maksimal 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH =
          field === "logoUrl" ? 400 : field === "headmasterPhoto" ? 800 : 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Gunakan PNG untuk logo agar background transparan tetap terjaga
          const isPng = file.type === "image/png" || field === "logoUrl";
          const compressedDataUrl = isPng
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.82);
          setSettings((prev) => (prev ? { ...prev, [field]: compressedDataUrl } : prev));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCredentials = async () => {
    setCredError("");
    setCredMessage("");

    if (!adminUsername || adminUsername.trim().length < 3) {
      setCredError("Username Admin minimal harus 3 karakter.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredError("Password baru minimal harus 6 karakter.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSavingCreds(true);
    try {
      const res = await fetch("/api/auth/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setCredMessage(data.message || "Akun login admin berhasil diperbarui!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setCredError(err.message || "Gagal memperbarui akun admin.");
    } finally {
      setSavingCreds(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Informasi pengaturan madrasah berhasil diperbarui.");
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setMessage(err.message || "Gagal memperbarui pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-slate-400">
        Memuat pengaturan informasi madrasah...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Pengaturan Informasi Madrasah</h1>
        <p className="text-slate-600 text-sm mt-0.5">
          Kelola profil sekolah, nomor kontak, legalitas resmi Kemenag, dan banner pengumuman.
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Seksi 1: Identitas & Kontak */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Identitas Utama &amp; Kontak Resmi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Nama Madrasah
              </label>
              <input
                type="text"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Yayasan Penyelenggara
              </label>
              <input
                type="text"
                name="foundationName"
                value={settings.foundationName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Motto / Tagline Madrasah
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Alamat Lengkap
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Nomor Telepon Kantor
              </label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Hotline WhatsApp (Awali 62)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Email Resmi Madrasah
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Seksi 2: Legalitas Resmi (NPSN, NSM, Akreditasi) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Legalitas &amp; Perizinan Madrasah</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi sesuai dokumen SK izin operasional Kementerian Agama dan BAN-SM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                NPSN (Nomor Pokok Sekolah)
              </label>
              <input
                type="text"
                name="npsn"
                value={settings.npsn}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                NSM (Nomor Statistik Madrasah)
              </label>
              <input
                type="text"
                name="nsm"
                value={settings.nsm}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Status Akreditasi
              </label>
              <input
                type="text"
                name="accreditation"
                value={settings.accreditation}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Seksi 3: Logo Madrasah, Foto Utama Beranda & Halaman Profil */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Logo Madrasah, Foto Beranda, Profil &amp; Kartu Program Khusus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unggah logo dan foto langsung dari komputer/HP Anda atau masukkan tautan URL gambar.
            </p>
          </div>

          {/* Pengaturan Logo Resmi Madrasah */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-amber-300 shadow-sm flex items-center justify-center p-2 shrink-0 overflow-hidden">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Preview Logo Madrasah"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[11px] font-bold text-slate-400 text-center leading-tight">
                  Logo Default Aktif
                </span>
              )}
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase text-amber-950">
                  Logo Resmi Madrasah (Tampil di Navbar, Footer &amp; Portal Admin)
                </label>
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logoUrl: "" })}
                    className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                  >
                    Kembalikan ke Logo Bawaan
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Unggah File Logo (Disarankan PNG Transparan):
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("logoUrl", e)}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Atau Tautan URL Logo:
                  </span>
                  <input
                    type="text"
                    name="logoUrl"
                    value={settings.logoUrl || ""}
                    onChange={handleChange}
                    placeholder="https://... atau unggah file di samping"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Foto Banner Utama Beranda */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <label className="block text-xs font-bold uppercase text-emerald-950">
                1. Foto Banner Utama di Beranda (Hero Banner)
              </label>

              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-200 border border-emerald-600/40 shadow-sm">
                <img
                  src={
                    settings.heroImage ||
                    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000"
                  }
                  alt="Preview Foto Beranda"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilih File Foto dari Komputer / HP:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("heroImage", e)}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Atau Tautan URL Foto Beranda:
                </span>
                <input
                  type="text"
                  name="heroImage"
                  value={settings.heroImage || ""}
                  onChange={handleChange}
                  placeholder="https://... atau pilih file di atas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Foto Gedung / Lingkungan di Halaman Profil */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <label className="block text-xs font-bold uppercase text-emerald-950">
                2. Foto Gedung / Lingkungan di Halaman Profil
              </label>

              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-200 border border-emerald-600/40 shadow-sm">
                <img
                  src={
                    settings.profileImage ||
                    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000"
                  }
                  alt="Preview Foto Halaman Profil"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilih File Foto dari Komputer / HP:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("profileImage", e)}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Atau Tautan URL Foto Halaman Profil:
                </span>
                <input
                  type="text"
                  name="profileImage"
                  value={settings.profileImage || ""}
                  onChange={handleChange}
                  placeholder="https://... atau pilih file di atas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pengaturan Teks Kartu Animasi Program Khusus & Keterangan Foto Beranda */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Pengaturan Kartu Animasi &ldquo;Program Khusus&rdquo; (Di Bawah Foto Beranda)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Label Kecil Program
                </label>
                <input
                  type="text"
                  name="specialProgramLabel"
                  value={settings.specialProgramLabel ?? "Program Khusus"}
                  onChange={handleChange}
                  placeholder="Contoh: Program Khusus"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nama Program Unggulan
                </label>
                <input
                  type="text"
                  name="specialProgramTitle"
                  value={settings.specialProgramTitle ?? "Tahfidz & Kitab Kuning"}
                  onChange={handleChange}
                  placeholder="Contoh: Tahfidz & Kitab Kuning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Keterangan Singkat Foto Beranda
                </label>
                <input
                  type="text"
                  name="heroPhotoCaption"
                  value={
                    settings.heroPhotoCaption ??
                    "Kampus Cikoneng Kulon, Kec. Ganeas, Kab. Sumedang"
                  }
                  onChange={handleChange}
                  placeholder="Contoh: Kampus Cikoneng Kulon, Kec. Ganeas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seksi 4: Kepala Madrasah */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pimpinan Madrasah &amp; Sambutan (Tampil di Beranda)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar Kepala Madrasah
                </label>
                <input
                  type="text"
                  name="headmasterName"
                  value={settings.headmasterName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Teks Sambutan Kepala Madrasah
                </label>
                <textarea
                  name="headmasterSpeech"
                  rows={6}
                  value={settings.headmasterSpeech}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <label className="block text-xs font-bold uppercase text-emerald-950">
                3. Foto Kepala Madrasah (Sambutan Beranda)
              </label>

              {settings.headmasterPhoto && (
                <div className="w-36 h-44 mx-auto rounded-xl overflow-hidden bg-slate-200 border border-emerald-600/40 shadow-sm">
                  <img
                    src={settings.headmasterPhoto}
                    alt="Preview Kepala Madrasah"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilih File Foto Kepala Madrasah:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("headmasterPhoto", e)}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Atau Tautan URL Foto Kepala Madrasah:
                </span>
                <input
                  type="text"
                  name="headmasterPhoto"
                  value={settings.headmasterPhoto}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seksi 4: Banner Pengumuman & PPDB */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Banner Pengumuman &amp; PPDB
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Teks Banner Berjalan di Bagian Atas
              </label>
              <input
                type="text"
                name="announcementText"
                value={settings.announcementText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="isAnnouncementActive"
                  checked={settings.isAnnouncementActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                />
                <span>Tampilkan Banner Pengumuman di Atas Website</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="isPpdbActive"
                  checked={settings.isPpdbActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                />
                <span>Buka Status Pendaftaran Santri Baru (PPDB)</span>
              </label>
            </div>

            <div className="pt-2">
              <a
                href="/admin/ppdb"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
              >
                <span>Atur Jadwal Gelombang, Syarat Berkas &amp; No WA Panitia PPDB di Menu PPDB &rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
          >
            {saving ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}
          </button>
        </div>
      </form>

      {/* Seksi 6: Pengaturan Keamanan Akun Login Admin (Username & Password) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-800/30 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <span>Keamanan Akun Login Admin (Username &amp; Password)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah Username dan Kata Sandi untuk masuk ke Portal Admin. Username disembunyikan secara otomatis demi keamanan.
            </p>
          </div>
        </div>

        {credMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{credMessage}</span>
          </div>
        )}

        {credError && (
          <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs sm:text-sm font-semibold">
            ⚠️ {credError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Username Admin Baru / Aktif
              </label>
              <button
                type="button"
                onClick={() => setShowAdminUsername(!showAdminUsername)}
                className="text-[11px] font-bold text-emerald-800 hover:underline"
              >
                {showAdminUsername ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
            <input
              type={showAdminUsername ? "text" : "password"}
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Username Admin"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Password Baru (Opsional)
              </label>
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="text-[11px] font-bold text-emerald-800 hover:underline"
              >
                {showAdminPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
            <input
              type={showAdminPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ganti sandi"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Ulangi Password Baru
            </label>
            <input
              type={showAdminPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password baru"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSaveCredentials}
            disabled={savingCreds}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3 px-6 rounded-xl shadow-md transition-all text-xs sm:text-sm disabled:opacity-50"
          >
            {savingCreds ? "Menyimpan Akun..." : "Simpan Username & Password Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
