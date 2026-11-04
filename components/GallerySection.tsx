"use client";

import React, { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { GalleryItem } from "@/lib/types";
import { Eye, X, Calendar, ArrowRight } from "./Icons";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [showEmbedInModal, setShowEmbedInModal] = useState(false);
  const displayItems = gallery.slice(0, 6);

  const handleOpenItem = (item: GalleryItem) => {
    setSelectedPhoto(item);
    if (item.sourceType === "youtube" || (!item.imageUrl && item.embedUrl)) {
      setShowEmbedInModal(true);
    } else {
      setShowEmbedInModal(false);
    }
  };

  const renderPlatformBadge = (sourceType?: GalleryItem["sourceType"]) => {
    if (sourceType === "instagram") {
      return (
        <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
          Instagram
        </span>
      );
    }
    if (sourceType === "facebook") {
      return (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
          Facebook
        </span>
      );
    }
    if (sourceType === "youtube") {
      return (
        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
          ▶ YouTube
        </span>
      );
    }
    if (sourceType === "tiktok") {
      return (
        <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
          TikTok
        </span>
      );
    }
    if (sourceType === "social") {
      return (
        <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
          Sosmed
        </span>
      );
    }
    return null;
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Dokumentasi"
          title="Galeri Aktivitas Peserta Didik"
          subtitle="Potret suasana belajar, kegiatan keagamaan, dan prestasi peserta didik MTs Al Falaahiyyah."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative bg-slate-100 overflow-hidden flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto max-h-[460px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : item.embedUrl ? (
                  <div className="w-full aspect-[4/3]">
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      className="w-full h-full border-0 pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center bg-emerald-950 text-emerald-200 text-xs font-bold">
                    Dokumentasi MTs Al Falaahiyyah
                  </div>
                )}

                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="bg-black/65 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  {renderPlatformBadge(item.sourceType)}
                </div>

                {/* View Icon Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-6 py-3 rounded-xl border border-emerald-200 transition-colors shadow-sm"
          >
            <span>Buka Semua Galeri Kegiatan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
            <div className="relative bg-slate-900 shrink-0 flex items-center justify-center">
              {showEmbedInModal && selectedPhoto.embedUrl ? (
                <div className="w-full aspect-[16/10]">
                  <iframe
                    src={selectedPhoto.embedUrl}
                    title={selectedPhoto.title}
                    className="w-full h-full border-0 bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : selectedPhoto.imageUrl ? (
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              ) : selectedPhoto.embedUrl ? (
                <div className="w-full aspect-[16/10]">
                  <iframe
                    src={selectedPhoto.embedUrl}
                    title={selectedPhoto.title}
                    className="w-full h-full border-0 bg-white"
                    allowFullScreen
                  />
                </div>
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
    </section>
  );
}
