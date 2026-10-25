"use client";

import React, { useState, useEffect } from "react";
import { Teacher } from "@/lib/types";
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  CheckCircle,
  BookOpen,
  User,
  ImageIcon,
} from "@/components/Icons";

export default function AdminGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("semua");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    category: "umum" as Teacher["category"],
    nip: "",
    subject: "",
    education: "",
    photo: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat guru:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const openAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      role: "",
      category: "umum",
      nip: "",
      subject: "",
      education: "",
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      role: teacher.role,
      category: teacher.category,
      nip: teacher.nip || "",
      subject: teacher.subject || "",
      education: teacher.education || "",
      photo: teacher.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    });
    setIsModalOpen(true);
  };

  // Handler unggah foto lokal dari komputer / perangkat
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batasi ukuran maksimal 3MB
    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran file foto maksimal 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          photo: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (editingTeacher) {
        // Mode Update
        const res = await fetch(`/api/teachers/${editingTeacher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setMessage("Data guru dan foto berhasil diperbarui.");
      } else {
        // Mode Create
        const res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setMessage("Guru/GTK baru berhasil ditambahkan.");
      }

      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan saat menyimpan data guru.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus guru: "${name}"?`)) return;

    try {
      const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage(`Data guru "${name}" berhasil dihapus.`);
        fetchTeachers();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus data guru.");
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesCategory = categoryFilter === "semua" || t.category === categoryFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Manajemen Guru &amp; Tenaga Kependidikan
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Kelola profil pendidik, foto resmi guru, mata pelajaran yang diampu, dan staf madrasah.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama guru, jabatan, atau mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto"
          >
            <option value="semua">Semua Kategori ({teachers.length})</option>
            <option value="pimpinan">Pimpinan Madrasah</option>
            <option value="pai">Guru PAI &amp; Kitab</option>
            <option value="umum">Guru Mapel Umum</option>
            <option value="staf">Tenaga Kependidikan / TU</option>
          </select>
        </div>
      </div>

      {/* Tabel Guru & GTK */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat data guru...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Tidak ada data guru yang cocok.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Foto &amp; Nama Guru</th>
                  <th className="p-4">Jabatan / Peran</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Mata Pelajaran</th>
                  <th className="p-4">Pendidikan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar Foto Guru */}
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                          {item.nip ? (
                            <p className="text-[11px] text-slate-500">NIP: {item.nip}</p>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">NIP belum diisi</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-emerald-900 text-xs">{item.role}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          item.category === "pimpinan"
                            ? "bg-purple-100 text-purple-800"
                            : item.category === "pai"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.category === "umum"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.category === "pimpinan"
                          ? "Pimpinan"
                          : item.category === "pai"
                          ? "PAI & Kitab"
                          : item.category === "umum"
                          ? "Mapel Umum"
                          : "Tata Usaha"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-700">
                      {item.subject ? (
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item.subject}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-600">
                      {item.education ? (
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item.education}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Edit Guru & Foto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Guru"
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

      {/* Modal Form Tambah / Edit Guru & Foto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingTeacher ? `Edit Data Guru: ${editingTeacher.name}` : "Tambah Guru & Tenaga Kependidikan"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lengkapi informasi biodata guru dan unggah foto profil resmi madrasah.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Seksi Preview & Edit Foto Guru */}
              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3">
                  Foto Resmi Guru / GTK *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Kotak Preview Foto */}
                  <div className="relative w-28 h-36 rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-600 shadow-md shrink-0">
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Preview Foto Guru"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center text-xs">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span>Belum Ada Foto</span>
                      </div>
                    )}
                  </div>

                  {/* Pilihan Sumber Foto */}
                  <div className="flex-1 space-y-3 w-full">
                    {/* Opsi A: Unggah Berkas Foto dari Komputer/HP */}
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1">
                        1. Unggah Langsung dari Perangkat (JPG, PNG, WebP)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileUpload}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                      />
                    </div>

                    {/* Opsi B: Tautan URL Foto Eksternal */}
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1">
                        2. Atau Masukkan Tautan URL Foto
                      </span>
                      <input
                        type="text"
                        value={formData.photo}
                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <p className="text-[11px] text-slate-500">
                      *Disarankan foto berpakaian rapi dengan rasio pas foto 3:4 atau 4:5.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seksi Data Informasi Guru */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nama Lengkap &amp; Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Drs. H. Ahmad Fathoni, M.Pd.I"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Jabatan / Tugas Tambahan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Contoh: Waka Kurikulum & Pengajar Fiqih"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Kategori Guru / GTK *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="pimpinan">Pimpinan Madrasah</option>
                    <option value="pai">Guru PAI &amp; Kitab Kuning</option>
                    <option value="umum">Guru Mata Pelajaran Umum</option>
                    <option value="staf">Tenaga Kependidikan / Tata Usaha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Mata Pelajaran yang Diampu
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Fiqih / Matematika / Bahasa Arab"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Contoh: S1 Pendidikan Agama Islam"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    NIP / NUPTK / PegID (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 19800101 200501 1 002"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan Perubahan..." : "Simpan Data Guru & Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
