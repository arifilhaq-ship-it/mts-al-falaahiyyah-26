"use client";

import React, { useState, useEffect } from "react";
import { NewsItem, SocialSourceType } from "@/lib/types";
import { Plus, Edit3, Trash2, X, CheckCircle } from "@/components/Icons";

export default function AdminBeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Keagamaan" as NewsItem["category"],
    coverImage: "",
    isPublished: true,
    sourceType: "upload" as SocialSourceType,
    sourceUrl: "",
    embedUrl: "",
  });

  // Social media import states
  const [socialUrlInput, setSocialUrlInput] = useState("");
  const [fetchingSocial, setFetchingSocial] = useState(false);
  const [socialNotice, setSocialNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news?all=true", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Fungsi ambil otomatis dari link Instagram, Facebook, YouTube, TikTok, dan Sosmed lainnya
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
      const fullContent: string = meta.description || meta.title || "";
      const autoExcerpt =
        fullContent.length > 160
          ? fullContent.replace(/\s+/g, " ").slice(0, 157).trim() + "..."
          : fullContent.replace(/\s+/g, " ");

      setFormData((prev) => ({
        ...prev,
        title: meta.title || prev.title || "Kegiatan Peserta Didik MTs Al Falaahiyyah",
        excerpt: autoExcerpt || prev.excerpt,
        content: fullContent || prev.content,
        coverImage: meta.imageUrl || prev.coverImage,
        sourceType: (meta.sourceType as SocialSourceType) || "social",
        sourceUrl: meta.sourceUrl || trimmed,
        embedUrl: meta.embedUrl || "",
      }));

      const platformLabel =
        meta.sourceType === "instagram"
          ? "Instagram"
          : meta.sourceType === "facebook"
          ? "Facebook"
          : meta.sourceType === "youtube"
          ? "YouTube"
          : meta.sourceType === "tiktok"
          ? "TikTok"
          : "Media Sosial";

      setSocialNotice(
        fullContent
          ? `✓ Berhasil mengambil judul, foto sampul, dan isi berita otomatis dari ${platformLabel}!`
          : `✓ Tautan ${platformLabel} berhasil dihubungkan! Silakan lengkapi judul/isi berita di bawah.`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengambil informasi dari link media sosial.");
    } finally {
      setFetchingSocial(false);
    }
  };

  // Handler saat link ditempel (paste) langsung otomatis ambil data
  const handleSocialPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText && (pastedText.startsWith("http://") || pastedText.startsWith("https://"))) {
      setSocialUrlInput(pastedText);
      fetchFromSocialUrl(pastedText);
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            coverImage: compressedDataUrl,
          }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setSocialUrlInput("");
    setSocialNotice("");
    setErrorMsg("");
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Keagamaan",
      coverImage: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1200",
      isPublished: true,
      sourceType: "upload",
      sourceUrl: "",
      embedUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setSocialUrlInput(item.sourceUrl || "");
    setSocialNotice("");
    setErrorMsg("");
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      coverImage: item.coverImage,
      isPublished: item.isPublished,
      sourceType: item.sourceType || "upload",
      sourceUrl: item.sourceUrl || "",
      embedUrl: item.embedUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMsg("");

    try {
      if (editingItem) {
        const res = await fetch(`/api/news/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
      }

      setIsModalOpen(false);
      setMessage("Data berita & kegiatan berhasil disimpan.");
      fetchNews();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus berita: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage("Berita berhasil dihapus.");
        fetchNews();
      }
    } catch (err) {
      alert("Gagal menghapus berita.");
    }
  };

  const renderSourceBadge = (sourceType?: SocialSourceType) => {
    if (!sourceType || sourceType === "upload") return null;
    if (sourceType === "instagram") {
      return (
        <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Instagram
        </span>
      );
    }
    if (sourceType === "facebook") {
      return (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Facebook
        </span>
      );
    }
    if (sourceType === "youtube") {
      return (
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          YouTube
        </span>
      );
    }
    if (sourceType === "tiktok") {
      return (
        <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          TikTok
        </span>
      );
    }
    return (
      <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        Sosmed
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Manajemen Berita &amp; Kegiatan Madrasah
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Publikasikan artikel, kegiatan peserta didik, atau impor otomatis dari link Instagram, Facebook, YouTube &amp; TikTok.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita / Link Sosmed</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabel Berita */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat data berita...</div>
        ) : news.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Belum ada berita yang tersimpan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Cover &amp; Judul</th>
                  <th className="p-4">Kategori &amp; Sumber</th>
                  <th className="p-4">Penulis &amp; Tanggal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-14 h-11 object-cover rounded-lg bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                        {renderSourceBadge(item.sourceType)}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-600">
                      <div>{item.author}</div>
                      <div className="text-slate-400">{item.date}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          item.isPublished
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.isPublished ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit Berita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingItem ? "Edit Berita & Kegiatan" : "Tambah Berita & Kegiatan Baru"}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Tempel link dari Instagram, Facebook, YouTube, atau TikTok untuk mengisi berita otomatis, atau ketik secara manual.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Kotak Import Otomatis dari Instagram / Facebook / YouTube / TikTok */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border border-purple-200 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-purple-950">
                  🔗 Impor Otomatis dari Link Instagram / Facebook / YouTube / TikTok
                </label>
                <span className="text-[10px] font-bold bg-white text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Otomatis Ambil Foto &amp; Keterangan
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={socialUrlInput}
                  onChange={(e) => setSocialUrlInput(e.target.value)}
                  onPaste={handleSocialPaste}
                  placeholder="Tempel link postingan Instagram, Facebook, YouTube, atau TikTok di sini..."
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
                  ⏳ Sedang mengambil judul, gambar sampul, dan keterangan dari sosial media...
                </p>
              )}

              {socialNotice && (
                <p className="text-xs text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1.5 rounded-lg font-semibold">
                  {socialNotice}
                </p>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Judul Berita / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Otomatis terisi dari link sosmed atau ketik judul berita..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Kategori Berita
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                    <option value="Akademik">Akademik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.isPublished ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === "true" })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="true">Publikasikan (Terbit)</option>
                    <option value="false">Simpan sebagai Draft</option>
                  </select>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-emerald-950">
                    Gambar Sampul Berita (Cover Image)
                  </label>
                  {renderSourceBadge(formData.sourceType)}
                </div>

                {formData.coverImage && (
                  <div className="w-full rounded-xl overflow-hidden bg-slate-900/5 border border-emerald-600 shadow-sm flex items-center justify-center">
                    <img
                      src={formData.coverImage}
                      alt="Preview Sampul Berita"
                      className="w-full h-auto max-h-[340px] object-contain"
                    />
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    1. Unggah Foto dari Perangkat / HP (Atau Ganti Thumbnail Sosmed):
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    2. Atau Masukkan Tautan URL Gambar:
                  </span>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="Otomatis terisi dari sosmed atau masukkan URL gambar..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Ringkasan Singkat (Otomatis dari Sosmed / Bisa Diedit)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Isi Lengkap Berita / Keterangan Kegiatan *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Otomatis terisi dari caption Instagram / Facebook / YouTube / TikTok atau tuliskan berita lengkap di sini..."
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
                  disabled={saving || fetchingSocial}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
