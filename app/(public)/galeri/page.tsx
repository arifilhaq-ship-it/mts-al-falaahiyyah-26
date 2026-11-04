"use client";

import React, { useState, useEffect } from "react";
import { defaultGallery } from "@/lib/data-defaults";
import { Eye, X, Calendar } from "@/components/Icons";
import { GalleryItem } from "@/lib/types";

const categories = ["Semua", "Kegiatan Belajar", "Ekstrakurikuler", "PHBI & Keagamaan", "Prestasi", "Fasilitas"];

export default function GaleriPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(defaultGallery);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [showEmbedInModal, setShowEmbedInModal] = useState(false);

  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGalleryItems(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === "Semua") return true;
    return item.category === selectedCategory;
  });

  const handleOpenItem = (item: GalleryItem) => {
    setSelectedPhoto(item);
    // Jika YouTube atau tidak ada imageUrl tapi ada embedUrl, langsung tampilkan embed
    if (item.sourceType === "youtube" || (!item.imageUrl && item.embedUrl)) {
      setShowEmbedInModal(true);
    } else {
      setShowEmbedInModal(false);
    }
  };

  const renderPlatformBadge = (sourceType?: GalleryItem["sourceType"]) => {
    if (sourceType === "instagram") {
      return (
        <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          Instagram
        </span>
      );
    }
    if (sourceType === "facebook") {
      return (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          Facebook
        </span>
      );
    }
    if (sourceType === "youtube") {
      return (
        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          ▶ YouTube
        </span>
      );
    }
    if (sourceType === "tiktok") {
      return (
        <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          TikTok
        </span>
      );
    }
    if (sourceType === "social") {
      return (
        <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
          Sosmed
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Dokumentasi &amp; Memori
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Galeri Madrasah
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Kumpulan potret momen berharga, pembelajaran, dan prestasi peserta didik di MTs Al Falaahiyyah Cikoneng Kulon Ganeas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Filter Kategori */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-800 text-white shadow-md scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Galeri Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : item.embedUrl ? (
                  <iframe
                    src={item.embedUrl}
                    title={item.title}
                    className="w-full h-full border-0 pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-200 text-xs font-bold">
                    Dokumentasi MTs Al Falaahiyyah
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-black/65 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  {renderPlatformBadge(item.sourceType)}
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Lihat Detail &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox Popup */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-slate-900 shrink-0">
              {showEmbedInModal && selectedPhoto.embedUrl ? (
                <iframe
                  src={selectedPhoto.embedUrl}
                  title={selectedPhoto.title}
                  className="w-full h-full border-0 bg-white"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedPhoto.imageUrl ? (
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              ) : selectedPhoto.embedUrl ? (
                <iframe
                  src={selectedPhoto.embedUrl}
                  title={selectedPhoto.title}
                  className="w-full h-full border-0 bg-white"
                  allowFullScreen
                />
              ) : null}

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors z-10"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    {selectedPhoto.category}
                  </span>
                  {renderPlatformBadge(selectedPhoto.sourceType)}
                  <span>•</span>
                  <span>{selectedPhoto.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPhoto.embedUrl && selectedPhoto.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setShowEmbedInModal(!showEmbedInModal)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                    >
                      {showEmbedInModal ? "Tampilkan Foto" : "Tampilkan Postingan Interaktif"}
                    </button>
                  )}

                  {selectedPhoto.sourceUrl && (
                    <a
                      href={selectedPhoto.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white transition-colors"
                    >
                      Buka di{" "}
                      {selectedPhoto.sourceType === "instagram"
                        ? "Instagram"
                        : selectedPhoto.sourceType === "facebook"
                        ? "Facebook"
                        : selectedPhoto.sourceType === "youtube"
                        ? "YouTube"
                        : "Sumber"}{" "}
                      &rarr;
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
