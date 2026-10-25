"use client";

import React, { useState, useEffect } from "react";
import { GalleryItem } from "@/lib/types";
import { Plus, Trash2, X, CheckCircle, ImageIcon, Calendar } from "@/components/Icons";

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
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
  }, []);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setIsModalOpen(false);
      setMessage("Foto galeri berhasil ditambahkan.");
      setFormData({
        title: "",
        description: "",
        category: "Kegiatan Belajar",
        imageUrl: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchGallery();
    } catch (err: any) {
      setMessage(err.message || "Gagal menambahkan foto galeri.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus foto "${title}" dari galeri?`)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage("Foto galeri berhasil dihapus.");
        fetchGallery();
      }
    } catch (err) {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Manajemen Galeri Foto</h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Unggah dan kelola dokumentasi foto kegiatan santri dan sarana madrasah.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Grid Foto Galeri */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Memuat galeri...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          Belum ada foto yang tersimpan di galeri.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </p>
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

      {/* Modal Tambah Foto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-5">Tambah Foto ke Galeri</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Judul Foto / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Upacara Peringatan Hari Santri"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

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

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Foto Dokumentasi Kegiatan *
                </label>

                {formData.imageUrl && (
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-200 border border-emerald-600 shadow-sm">
                    <img
                      src={formData.imageUrl}
                      alt="Preview Galeri"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    1. Unggah Langsung dari Perangkat / HP (JPG, PNG, WebP)
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
                    2. Atau Masukkan Tautan URL Foto Eksternal
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-... atau unggah dari atas"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
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

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat foto kegiatan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
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
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
