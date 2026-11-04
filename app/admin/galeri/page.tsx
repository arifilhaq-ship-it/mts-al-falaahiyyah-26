"use client";

import React, { useState, useEffect } from "react";
import { GalleryItem } from "@/lib/types";
import { Plus, Trash2, X, CheckCircle, Calendar } from "@/components/Icons";

export default function AdminGaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Kegiatan Belajar" as GalleryItem["category"],
    imageUrl: "",
    date: new Date().toISOString().split("T")[0],
    sourceType: "upload" as NonNullable<GalleryItem["sourceType"]>,
    sourceUrl: "",
    embedUrl: "",
  });

  // Social link state
  const [socialUrlInput, setSocialUrlInput] = useState("");
  const [fetchingSocial, setFetchingSocial] = useState(false);
  const [socialNotice, setSocialNotice] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Cloud storage token status (untuk Vercel)
  const [storageStatus, setStorageStatus] = useState<{
    checked: boolean;
    active: boolean;
    mode: string;
  }>({ checked: false, active: true, mode: "local" });
  const [ghTokenInput, setGhTokenInput] = useState("");
  const [activatingToken, setActivatingToken] = useState(false);

  const checkStorageStatus = async () => {
    try {
      const res = await fetch("/api/storage-token", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStorageStatus({
          checked: true,
          active: data.active,
          mode: data.mode,
        });
      }
    } catch {
      // Abaikan jika gagal mengecek status
    }
  };

  const handleActivateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivatingToken(true);
    setErrorMsg("");
    setMessage("");
    try {
      const res = await fetch("/api/storage-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: ghTokenInput }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setMessage(data.message);
      setGhTokenInput("");
      setStorageStatus({ checked: true, active: true, mode: "github-cloud" });
      fetchGallery();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengaktifkan penyimpanan permanen.");
    } finally {
      setActivatingToken(false);
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    checkStorageStatus();
  }, []);

  // Fungsi ambil otomatis dari link Instagram / Facebook / YouTube
  const fetchFromSocialUrl = async (targetUrl: string) => {
    const trimmed = targetUrl.trim();
    if (!trimmed) return;

    setFetchingSocial(true);
    setErrorMsg("");
    setSocialNotice("");

    try {
      const res = await fetch("/api/social-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Gagal mengambil data dari tautan tersebut.");
      }

      const meta = result.data;
      setFormData((prev) => ({
        ...prev,
        title: meta.title || prev.title || `Dokumentasi ${meta.sourceType}`,
        description: meta.description || prev.description,
        imageUrl: meta.imageUrl || prev.imageUrl,
        sourceType: meta.sourceType || "upload",
        sourceUrl: meta.sourceUrl || trimmed,
        embedUrl: meta.embedUrl || "",
      }));

      const platformLabel =
        meta.sourceType === "instagram"
          ? "Instagram"
          : meta.sourceType === "facebook"
          ? "Facebook"
          : "YouTube";

      setSocialNotice(
        meta.description
          ? `✓ Berhasil mengambil media & keterangan otomatis dari ${platformLabel}!`
          : `✓ Tautan ${platformLabel} berhasil dihubungkan! Silakan sesuaikan judul/keterangan jika diperlukan.`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengambil informasi dari link sosial media.");
    } finally {
      setFetchingSocial(false);
    }
  };

  // Handler saat link ditempel (paste) langsung otomatis ambil data
  const handleSocialPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (
      pastedText &&
      (pastedText.includes("instagram.com") ||
        pastedText.includes("instagr.am") ||
        pastedText.includes("facebook.com") ||
        pastedText.includes("fb.watch") ||
        pastedText.includes("fb.com") ||
        pastedText.includes("youtube.com") ||
        pastedText.includes("youtu.be"))
    ) {
      setSocialUrlInput(pastedText);
      fetchFromSocialUrl(pastedText);
    }
  };

  // Handler unggah foto lokal dari komputer / HP dengan kompresi otomatis
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file foto maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
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
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setFormData((prev) => ({
            ...prev,
            imageUrl: compressedDataUrl,
          }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetModalForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Kegiatan Belajar",
      imageUrl: "",
      date: new Date().toISOString().split("T")[0],
      sourceType: "upload",
      sourceUrl: "",
      embedUrl: "",
    });
    setSocialUrlInput("");
    setSocialNotice("");
    setErrorMsg("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setIsModalOpen(false);
      setMessage("Dokumentasi galeri berhasil ditambahkan secara permanen.");
      resetModalForm();
      fetchGallery();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menambahkan dokumentasi galeri.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus "${title}" dari galeri?`)) return;
    setErrorMsg("");
    setMessage("");

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Gagal menghapus item galeri.");
      setMessage("Item galeri berhasil dihapus secara permanen.");
      fetchGallery();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus foto.");
    }
  };

  const renderSourceBadge = (sourceType?: GalleryItem["sourceType"]) => {
    if (sourceType === "instagram") {
      return (
        <span className="absolute top-2 right-2 bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
          Instagram
        </span>
      );
    }
    if (sourceType === "facebook") {
      return (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
          Facebook
        </span>
      );
    }
    if (sourceType === "youtube") {
      return (
        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
          YouTube
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Manajemen Galeri &amp; Media Sosial</h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Unggah foto langsung atau tempel link dari Instagram, Facebook, dan YouTube (keterangan diambil otomatis).
          </p>
        </div>

        <button
          onClick={() => {
            resetModalForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto / Link Sosmed</span>
        </button>
      </div>

      {/* Kotak Aktivasi 1-Klik Penyimpanan Permanen di Vercel */}
      {storageStatus.checked && !storageStatus.active && (
        <div className="p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                ⚡ Aktifkan Penyimpanan Cloud Permanen (Khusus Server Online Vercel)
              </h3>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                Agar tambah &amp; hapus foto tersimpan permanen langsung dari website Vercel, masukkan{" "}
                <strong>GitHub Token (Classic)</strong> Anda di bawah ini cukup 1 kali saja:
              </p>
            </div>
            <a
              href="https://github.com/settings/tokens/new?description=Database-MTs-Al-Falaahiyyah&scopes=repo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center shrink-0 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
            >
              1. Ambil Kode Token GitHub &rarr;
            </a>
          </div>

          <form onSubmit={handleActivateToken} className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              required
              value={ghTokenInput}
              onChange={(e) => setGhTokenInput(e.target.value)}
              placeholder="2. Tempel kode token ghp_xxxxxxxxxxxxxxxxxxxx di sini..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-amber-400 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={activatingToken}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {activatingToken ? "Menghubungkan..." : "3. Aktifkan Permanen"}
            </button>
          </form>
        </div>
      )}

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 animate-fadeIn">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-red-600 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Foto Galeri */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Memuat galeri...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          Belum ada foto atau media yang tersimpan di galeri.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : item.embedUrl ? (
                  <iframe
                    src={item.embedUrl}
                    title={item.title}
                    className="w-full h-full border-0 pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    Media Sosial
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>
                {renderSourceBadge(item.sourceType)}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </p>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Lihat Sumber &rarr;
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Foto / Sosial Media */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Tambah Dokumentasi Galeri
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Tempel link dari Instagram / Facebook / YouTube untuk mengambil keterangan otomatis, atau unggah foto dari perangkat.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Kotak Import Otomatis dari Instagram / Facebook / YouTube */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border border-purple-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-purple-950">
                  🔗 Tempel Link Instagram / Facebook / YouTube
                </label>
                <span className="text-[10px] font-bold bg-white text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                  Otomatis Ambil Keterangan
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={socialUrlInput}
                  onChange={(e) => setSocialUrlInput(e.target.value)}
                  onPaste={handleSocialPaste}
                  placeholder="https://www.instagram.com/p/... atau Facebook / YouTube"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-purple-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  disabled={fetchingSocial || !socialUrlInput.trim()}
                  onClick={() => fetchFromSocialUrl(socialUrlInput)}
                  className="bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0"
                >
                  {fetchingSocial ? "Mengambil Data..." : "Ambil Otomatis"}
                </button>
              </div>

              {fetchingSocial && (
                <p className="text-xs text-purple-800 font-semibold animate-pulse">
                  ⏳ Sedang mengambil foto dan keterangan dari tautan sosial media...
                </p>
              )}

              {socialNotice && (
                <p className="text-xs text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1.5 rounded-lg font-semibold">
                  {socialNotice}
                </p>
              )}
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Judul Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Otomatis terisi dari link sosmed atau ketik judul kegiatan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Keterangan / Caption (Otomatis dari Instagram / Facebook)
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan otomatis diambil saat Anda menempelkan link Instagram / Facebook / YouTube, atau tulis manual di sini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Kegiatan Belajar">Kegiatan Belajar</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    <option value="PHBI & Keagamaan">PHBI &amp; Keagamaan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Fasilitas">Fasilitas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Pratinjau Media / Unggah Foto Sampul Manual
                </label>

                {formData.imageUrl ? (
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-200 border border-emerald-600 shadow-sm relative">
                    <img
                      src={formData.imageUrl}
                      alt="Preview Galeri"
                      className="w-full h-full object-cover"
                    />
                    {renderSourceBadge(formData.sourceType)}
                  </div>
                ) : formData.embedUrl ? (
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-emerald-600 shadow-sm relative">
                    <iframe
                      src={formData.embedUrl}
                      title="Preview Embed Sosial Media"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                ) : null}

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    1. Unggah Foto dari Perangkat / HP (Atau Ganti Thumbnail Sosmed)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    2. Atau Tautan URL Gambar Langsung (Opsional jika sudah pakai Link Sosmed)
                  </span>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Otomatis terisi dari sosmed / unggah foto dari atas..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || fetchingSocial}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan ke Galeri"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
